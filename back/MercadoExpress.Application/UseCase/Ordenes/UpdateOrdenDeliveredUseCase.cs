using MercadoExpress.Application.DTO.Orden;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Ordenes
{
    public class UpdateOrdenDeliveredUseCase
    {
        private readonly IOrdenRepository _ordenRepository;
        private readonly IEmailService _emailService;
        private readonly IUsuarioRepository _usuarioRepository;


        public UpdateOrdenDeliveredUseCase(IOrdenRepository ordenRepository, IEmailService emailService, IUsuarioRepository usuarioRepository)
        {
            _ordenRepository = ordenRepository;
            _emailService = emailService;
            _usuarioRepository = usuarioRepository;
        }

        public async Task<UpdateOrdenDeliveredDtoResponse> UpdateOrdenDelivered(Guid ordenId, string email)
        {
            Orden searchOrden = await _ordenRepository.GetOrdenById(ordenId);

            if (searchOrden == null ) throw new KeyNotFoundException("No se encontro la orden para enviar");
            if (searchOrden.CustomerEmail != email) throw new UnauthorizedAccessException("No tienes permisos para confirmar");

            if (searchOrden.State != "Shipped") throw new InvalidOperationException("No puedes marcar como recibida una orden que no esta en camino");

            searchOrden.State = "Delivered";

            await _ordenRepository.SaveChangesAsync();

            // Gmail de pedido completado para el cliente
            try
            {
                if (!string.IsNullOrEmpty(searchOrden.CustomerEmail))
                {
                    string asuntoCompletado = $"🎉 ¡Disfruta tu compra! Pedido completado - MercadoExpress";
                    string htmlCompletado = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                            <h2 style='color: #10b981; text-align: center;'>🎉 ¡Pedido Completado Exitosamente!</h2>
                            <p style='color: #334155; font-size: 16px;'>
                                ¡Hola <strong>{searchOrden.CustomerName}</strong>! Queremos confirmarte que registramos tu aviso de recepción para el pedido <strong>N° {searchOrden.Id.ToString().Substring(0, 8).ToUpper()}</strong>.
                            </p>
                            <hr style='border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;' />
                            <p style='color: #475569; font-size: 15px; text-align: center; font-weight: bold;'>
                                🎁 ¡Disfruta tu producto! Gracias por formar parte de nuestra comunidad.
                            </p>
                            <p style='color: #64748b; font-size: 12px; text-align: center; margin-top: 30px;'>
                                Si tuviste una buena experiencia, recordá dejarle una calificación positiva al vendedor en nuestro Marketplace MercadoExpress.
                            </p>
                        </div>";

                    await _emailService.SendEmailAsync(searchOrden.CustomerEmail, asuntoCompletado, htmlCompletado);
                    Console.WriteLine($"===> MAILKIT LOGÍSTICA: Mail de entrega confirmada enviado a {searchOrden.CustomerEmail}");
                }
                // gmail para vendedor de la Entrega Exitosa
                var primerDetalle = searchOrden.Detalles.FirstOrDefault();
                if (primerDetalle != null)
                {
                    Guid vendedorId = primerDetalle.Producto.UsuarioId;
                    var vendedorInfo = await _usuarioRepository.GetUserById(vendedorId); 

                    if (vendedorInfo != null && !string.IsNullOrEmpty(vendedorInfo.Mail))
                    {
                        string asuntoVendedor = $"¡Entrega Confirmada! El cliente ya recibió su producto 🎁 - MercadoExpress";
                        string htmlVendedor = $@"
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                                <h2 style='color: #10b981; text-align: center;'>¡Pedido Entregado! 🎉</h2>
                                <p style='color: #334155; font-size: 16px;'>
                                    Hola <strong>{vendedorInfo.UserName}</strong>, te avisamos que el cliente <strong>{searchOrden.CustomerName}</strong> ya confirmó que tiene el producto en sus manos.
                                </p>
                                <hr style='border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;' />
                                <p style='color: #475569; font-size: 14px;'>
                                    🆔 <strong>Orden N°:</strong> {searchOrden.Id.ToString().Substring(0, 8).ToUpper()}<br/>
                                    ✅ El circuito logístico de esta venta ha finalizado con éxito en Neon.
                                </p>
                            </div>";

                        // Le disparamos el mail de éxito a tu cuenta de la facu o del vendedor
                        await _emailService.SendEmailAsync(vendedorInfo.Mail, asuntoVendedor, htmlVendedor);
                        Console.WriteLine($"===> MAILKIT LOGÍSTICA: Alerta de recepción enviada al vendedor {vendedorInfo.Mail}");
                    }  
                }
                
            }
            catch (Exception exDelivered)
            {
                Console.WriteLine($"===> ADVERTENCIA MAILKIT DELIVERED: {exDelivered.Message}");
            }
            return new UpdateOrdenDeliveredDtoResponse
            {
                Message = "¡Recepcion confirmada! El pedido fue marcado como entregado con éxito."
            };
        }
    }
}
