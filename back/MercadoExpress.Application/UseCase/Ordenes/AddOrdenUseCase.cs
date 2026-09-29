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
            // 🛡️ PASO 0: REGLA DE NEGOCIO (Bloquear Multi-Vendedor)
            var detallesDeLaOrden = new List<DetalleOrden>();
            var listaDeVendedores = new List<Guid>();
            Guid ordenIdDeLaCompra = Guid.NewGuid();

            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            string frontendBaseUrl = env == "Development"
                ? "https://ngrok-free.dev"
                : "https://tienda-de-productos-ivory.vercel.app";

            foreach (var itemDto in dto.Items)
            {
                var productoEnBase = await _productRepository.GetProductoById(itemDto.ProductoId);
                if (productoEnBase == null) throw new KeyNotFoundException($"El producto con ID {itemDto.ProductoId} ya no existe.");

                listaDeVendedores.Add(productoEnBase.UsuarioId);

                detallesDeLaOrden.Add(new DetalleOrden
                {
                    Id = Guid.NewGuid(),
                    OrdenId = ordenIdDeLaCompra,
                    ProductoId = itemDto.ProductoId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = productoEnBase.Price
                });
            }

            var vendedoresUnicos = listaDeVendedores.Distinct().ToList();
            if (vendedoresUnicos.Count > 1)
            {
                throw new ArgumentException("Solo puedes comprar productos de un mismo vendedor a la vez en cada pedido.");
            }

            var vendedorId = vendedoresUnicos.First();

            // 1: Buscar los token OAUTH del vendedor
            var vendedorAuth = await _mpAuthRepo.GetByUsuarioId(vendedorId);
            if (vendedorAuth == null || string.IsNullOrEmpty(vendedorAuth.AccessToken))
            {
                throw new InvalidOperationException("La tienda de este vendedor no tiene su cuenta de Mercado Pago asociada.");
            }

            // 2: Calculos para su comision
            decimal totalCarrito = detallesDeLaOrden.Sum(d => d.UnitPrice * d.Quantity);
            decimal commissionAmount = Math.Round(totalCarrito * 0.03m, 2);
            decimal sellerAmount = totalCarrito - commissionAmount;

            // 3: Crear y obtener la cantidad de producto(items) del cliente
            var mpItems = new List<PreferenceItemRequest>();

            // Recorremos los detalles ya validados de forma asincrónica real para evitar Deadlocks
            foreach (var detalle in detallesDeLaOrden)
            {
                var productoInfo = await _productRepository.GetProductoById(detalle.ProductoId);

                mpItems.Add(new PreferenceItemRequest
                {
                    Title = productoInfo != null ? productoInfo.Name : "Producto MercadoExpress",
                    Quantity = detalle.Quantity,
                    UnitPrice = detalle.UnitPrice,
                    CurrencyId = "ARS"
                });
            }

            // 4: Crear el objeto/preferencia checkout PRO de MP
            var client = new PreferenceClient();
            var request = new PreferenceRequest
            {
                Items = mpItems, 
                MarketplaceFee = commissionAmount,
                ExternalReference = ordenIdDeLaCompra.ToString(),

                BackUrls = new PreferenceBackUrlsRequest
                {
                    Success = $"{frontendBaseUrl}/client",
                    Failure = $"{frontendBaseUrl}/client",
                    Pending = $"{frontendBaseUrl}/client"
                },
                AutoReturn = "approved"
            };
   
            // Firma OAUTH
            Preference preferenceMp = await client.CreateAsync(request, new RequestOptions
            {
                AccessToken = vendedorAuth.AccessToken
            });

            // 5: Crear la orden en la bdd 
            var nuevaOrden = new Orden
            {
                Id = ordenIdDeLaCompra,
                Total = totalCarrito,
                State = "Pending",
                PaymentUrl = preferenceMp.InitPoint,
                MercadoPagoPreferenceId = preferenceMp.Id,
                CreationDate = DateTime.UtcNow,

                CustomerName = dto.CustomerName ?? "",
                CustomerEmail = dto.CustomerEmail ?? "",
                CustomerAddress = dto.CustomerAddress ?? "",
                CustomerPhone = dto.CustomerPhone ?? "",
                DeliveryMethod = dto.DeliveryMethod ?? "Pickup",
                City = dto.City ?? "",
                PostalCode = dto.PostalCode ?? "",
                CommissionPercentage = 3,
                CommissionAmount = commissionAmount,
                SellerAmount = sellerAmount,
                Detalles = detallesDeLaOrden
            };
            await _ordenRepository.Add(nuevaOrden);

            // 6: crear notificacion
            string mensajeNotificacion = $"¡Nueva venta! El cliente {nuevaOrden.CustomerName} realizó un pedido por un total de ${totalCarrito}.";

            var notificacion = new Notificacion
            {
                Id = Guid.NewGuid(),
                OrdenId = nuevaOrden.Id,
                UsuarioId = vendedorId,
                Message = mensajeNotificacion,
                State = "Unread",
                CreationDate = DateTime.UtcNow
            };
            await _notificacionRepository.Add(notificacion);

            // 7: respuesta
            return new OrdenDtoResponse
            {
                Message = "Preferencia de pago generada con éxito.",
                Pagos = new List<PagoPorVendedorDto>
                {
                    new PagoPorVendedorDto
                    {
                        OrdenId = nuevaOrden.Id,
                        VendedorId = vendedorId,
                        PreferenceId = preferenceMp.Id,
                        PaymentUrl = nuevaOrden.PaymentUrl,
                        Total = totalCarrito
                    }
                }
            };
        }
    }
}

