using AutoMapper;
using MercadoExpress.Application.DTO.Orden;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using MercadoPago.Client.Preference;
using MercadoPago.Resource.Preference;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Ordenes
{
    public class AddOrdenUseCase
    {
        private readonly IOrdenRepository _ordenRepository;
        private readonly IProductoRepository _productRepository;
        private readonly IMapper _mapper;
        private INotificacionRepository _notificacionRepository;

        public AddOrdenUseCase(IOrdenRepository ordenRepository, IProductoRepository productRepository, INotificacionRepository notificacionRepository, IMapper mapper)
        {
            _ordenRepository = ordenRepository;
            _productRepository = productRepository;
            _notificacionRepository = notificacionRepository;
            _mapper = mapper;
        }

        public async Task<OrdenDtoResponse> AddOrden(OrdenDtoRequest dto)
        {
            if (string.IsNullOrEmpty(dto.CustomerName)) throw new ArgumentException("El nombre es obligatorio");
            if (string.IsNullOrEmpty(dto.CustomerEmail)) throw new ArgumentException("El email es obligatorio");
            if (dto.CustomerPhone.ToString().Length < 10) throw new ArgumentException("Ingrese su telefono completo");
            if (string.IsNullOrEmpty(dto.CustomerAddress)) throw new ArgumentException("La direcion es obligatorio");
            if ((dto.DeliveryMethod != "presencial") && dto.DeliveryMethod != "domicilio") throw new ArgumentException("Elija una opcion");
            if (string.IsNullOrEmpty(dto.City)) throw new ArgumentException("La ciudad es obligatorio");
            if (string.IsNullOrEmpty(dto.PostalCode)) throw new ArgumentException("El codigo postal es obligatorio");

            // FASE 1: VALIDACIÓN ATÓMICA DE TODO EL CARRITO

            decimal totalGeneral = 0;
            var detallesDeLaOrden = new List<DetalleOrden>();
            foreach (var item in dto.Items)
            {
                Producto searchProduct = await _productRepository.GetProductoById(item.ProductId);
                if (searchProduct == null) throw new KeyNotFoundException("No se encontro el producto");
                if (searchProduct.Stock < item.Quantity) throw new InvalidOperationException("No hay sufiente stock para hacer la operacion");

                // Descontamos stock directamente en la base de datos (Compra segura)
                searchProduct.Stock -= item.Quantity;
                await _productRepository.Update(searchProduct);


                totalGeneral += item.Quantity * searchProduct.Price;

                // Creamos el detalle huérfano (sin OrdenId todavía) pero con la info del producto
                var detalleOrden = new DetalleOrden
                {
                    Id = Guid.NewGuid(),
                    ProductoId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = searchProduct.Price,
                    Producto = searchProduct,

                };
                detallesDeLaOrden.Add(detalleOrden);
            }

            // FASE 2: SPLIT DE CARRITO (MÚLTIPLES TIENDAS)

            // Agrupamos todos los detalles en "paquetes" según el ID del vendedor dueño del producto
            var detallesAgrupadoPorVendedor = detallesDeLaOrden
                 .GroupBy(d => d.Producto.UsuarioId);
            var ordenesCreadas = new List<Orden>();

            // Procesamos cada tienda de forma independiente
            // Creamos una preferencia de MP para devolverla en el front 
            var pagos = new List<PagoPorVendedorDto>();

            Preference preference = new Preference();
            foreach (var item in detallesAgrupadoPorVendedor)
            {
                Guid vendedorId = item.Key;
                List<DetalleOrden> detalleOrdenPorVendedor = item.ToList();

                // Cálculo de finanzas histórico exclusivo de este vendedor
                decimal totalVendedor = detalleOrdenPorVendedor.Sum(d => d.Quantity * d.UnitPrice);

                decimal commissionAmount = (totalVendedor * 3) / 100; // 3% comisión plataforma
                decimal dineroAdmin = totalVendedor - commissionAmount; // Neto para el vendedor

                // Creamos la Orden principal para este vendedor
                var ordenIndividual = _mapper.Map<Orden>(dto);
                ordenIndividual.Id = Guid.NewGuid();
                ordenIndividual.Total = totalVendedor;
                ordenIndividual.CommissionPercentage = 3;
                ordenIndividual.CommissionAmount = commissionAmount;
                ordenIndividual.SellerAmount = dineroAdmin;
                ordenIndividual.State = "Pending";
                ordenIndividual.CreationDate = DateTime.UtcNow;

                // VINCULACIÓN: Casamos los detalles huérfanos con su nueva Orden correspondiente
                foreach (var detalle in detalleOrdenPorVendedor)
                {
                    detalle.OrdenId = ordenIndividual.Id;
                    detalle.Orden = ordenIndividual;
                }
                ordenIndividual.Detalles = detalleOrdenPorVendedor;

                // FASE 3: Mercado pago
                // Crear un preferencia de pago por cada producto de mismo vendedor

                // Crea el objeto de request de la preference
                // 1. Armamos la lista de items reales con lo que compró de ESTE vendedor
                var mpItems = new List<PreferenceItemRequest>();

                foreach (var det in detalleOrdenPorVendedor)
                {
                    mpItems.Add(new PreferenceItemRequest
                    {
                        Title = det.Producto.Name,
                        Quantity = det.Quantity,
                        CurrencyId = "ARS",
                        UnitPrice = Convert.ToDecimal(det.UnitPrice),
                    });
                }

                  var request = new PreferenceRequest
                  {
                      Items = mpItems,
                      // ⚡ El Split Automático: MP te deposita a vos el 3% en este instante
                     // MarketplaceFee = commissionAmount,
                      BackUrls = new PreferenceBackUrlsRequest
                      {
                          // Apuntan a las rutas que vas a crear en tu React local (Vite)
                          Success = "https://tienda-de-productos-ivory.vercel.app/client",
                          Failure = "https://tienda-de-productos-ivory.vercel.app/client",
                          Pending = "https://tienda-de-productos-ivory.vercel.app/client"
                      },
                      AutoReturn = "approved" // Si el pago se aprueba, MP redirige solo a los 3 segundos

                  };
                var client = new PreferenceClient();
                // TODO: En el futuro usarás el Token guardado en Neon: 
                // string sellerToken = detalleOrdenPorVendedor.First().Producto.Usuario.MercadoPagoAccessToken;
                // Preference preferenceMp = await client.CreateAsync(request, new RequestOptions { AccessToken = sellerToken });

                Preference preferenceMp = await client.CreateAsync(request); // Tu línea actual de pruebas

                // Guardamos los datos de Mercado Pago en la entidad antes de persistir
                ordenIndividual.MercadoPagoPreferenceId = preferenceMp.Id;
                //ordenIndividual.PaymentUrl = preferenceMp.SandboxInitPoint;

                ordenIndividual.PaymentUrl = preferenceMp.InitPoint; // 💡 InitPoint es el link real de cobro
                // la respuesta de esta preferencia genera un id que ese id se usa en el front 

                // PERSISTENCIA: Al guardar la orden, EF Core guarda automáticamente todos sus detalles vinculados
                await _ordenRepository.Add(ordenIndividual);
                ordenesCreadas.Add(ordenIndividual);

                pagos.Add(new PagoPorVendedorDto
                {
                    VendedorId = vendedorId,
                    OrdenId = ordenIndividual.Id,
                    PreferenceId = ordenIndividual.MercadoPagoPreferenceId,
                    PaymentUrl = ordenIndividual.PaymentUrl,
                    Total = ordenIndividual.Total
                });

                string menssageNotificacion = $"¡Nueva venta registrada! El cliente {ordenIndividual.CustomerName} ordenó productos de tu tienda por un total de ${ordenIndividual.Total}.";

                // Creamos la notificacion para el usuario vendedor
                var notificacion = new Notificacion
                {
                   Id = Guid.NewGuid(),
                   OrdenId = ordenIndividual.Id,
                   UsuarioId = vendedorId,
                   Message = menssageNotificacion,
                   State = "Unread",
                   CreationDate = DateTime.UtcNow
                };
               
                await _notificacionRepository.Add(notificacion);


            }

            var response = new OrdenDtoResponse
            {
                Message = $"Pedido completado. Se generaron {ordenesCreadas.Count} órdenes de pago.",
                Pagos = pagos
            };

            return response;
            /*var response = new OrdenDtoResponse
            {
                Message = $"Pedido completado. Se generaron {ordenesCreadas.Count} órdenes de pago.",
                // Pasamos el InitPoint de la primera orden para que React pueda redirigir en tus pruebas actuales
                PaymentUrl = ordenesCreadas.First().PaymentUrl,
                PreferenceId = ordenesCreadas.First().MercadoPagoPreferenceId

            };
            return response;*/
        }
    }


}

