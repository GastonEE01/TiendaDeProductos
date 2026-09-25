using AutoMapper;
using MercadoExpress.Application.DTO.Orden;
using MercadoExpress.Application.Interface;
using MercadoExpress.Application.Mapper;
using MercadoExpress.Domain.Entities;
using MercadoPago.Client;
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
        private readonly IMercadoPagoAuthRepository _mpAuthRepo;

        public AddOrdenUseCase(IOrdenRepository ordenRepository, IProductoRepository productRepository, INotificacionRepository notificacionRepository, IMercadoPagoAuthRepository mpAuthRepo, IMapper mapper)
        {
            _ordenRepository = ordenRepository;
            _productRepository = productRepository;
            _notificacionRepository = notificacionRepository;
            _mapper = mapper;
            _mpAuthRepo = mpAuthRepo;
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
                // FASE 3: Mercado pago
                // Crear una preferencia de pago por cada producto del mismo vendedor
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

                var vendedorAuth = await _mpAuthRepo.GetByUsuarioId(vendedorId);
                if (vendedorAuth == null || string.IsNullOrEmpty(vendedorAuth.AccessToken))
                {
                    throw new InvalidOperationException($"El vendedor dueño de estos productos no tiene su cuenta de Mercado Pago vinculada.");
                }

                var request = new PreferenceRequest
                {
                    Items = mpItems,
                    MarketplaceFee = commissionAmount,
                    BackUrls = new PreferenceBackUrlsRequest
                    {
                        Success = "https://tienda-de-productos-ivory.vercel.app/client",
                        Failure = "https://tienda-de-productos-ivory.vercel.app/client",
                        Pending = "https://tienda-de-productos-ivory.vercel.app/client"
                    },
                    AutoReturn = "approved"
                };

                var client = new PreferenceClient();

                // Firmamos la preferencia con las credenciales del vendedor
                Preference preferenceMp = await client.CreateAsync(request, new RequestOptions
                {
                    AccessToken = vendedorAuth.AccessToken
                });

                // 🎯 RECTIFICADO: Dejamos SOLAMENTE la regla inteligente basada en el Token del Vendedor. El if del environment SE BORRA.
                /*  if (vendedorAuth.AccessToken.StartsWith("TEST-") || vendedorAuth.AccessToken.Contains("test") || vendedorAuth.AccessToken.Contains("TEST"))
                  {
                      // 🧪 Entorno Seguro de Simulación (Sandbox)
                      ordenIndividual.PaymentUrl = preferenceMp.SandboxInitPoint;
                  }
                  else
                  {
                      // 🌍 Entorno Real con dinero verdadero (Producción)
                      ordenIndividual.PaymentUrl = preferenceMp.InitPoint;
                  }*/
                ordenIndividual.PaymentUrl = preferenceMp.InitPoint;

                ordenIndividual.MercadoPagoPreferenceId = preferenceMp.Id;

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

                string mensageNotificacion = $"¡Nueva venta registrada! El cliente {ordenIndividual.CustomerName} ordenó productos de tu tienda por un total de ${ordenIndividual.Total}.";

                // Creamos la notificación para el usuario vendedor
                var notificacion = new Notificacion
                {
                    Id = Guid.NewGuid(),
                    OrdenId = ordenIndividual.Id,
                    UsuarioId = vendedorId,
                    Message = mensageNotificacion,
                    State = "Unread",
                    CreationDate = DateTime.UtcNow
                };
                await _notificacionRepository.Add(notificacion);
            } // Fin del foreach tiendas

            var response = new OrdenDtoResponse
            {
                Message = $"Pedido completado. Se generaron {ordenesCreadas.Count} órdenes de pago.",
                Pagos = pagos
            };

            return response;

        }
    }


}

