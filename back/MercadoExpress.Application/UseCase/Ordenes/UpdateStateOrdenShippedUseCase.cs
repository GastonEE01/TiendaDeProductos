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
    public class UpdateStateOrdenShippedUseCase
    {
        private readonly IOrdenRepository _ordenRepository;
        private readonly IEmailService _emailService;


        public UpdateStateOrdenShippedUseCase(IOrdenRepository ordenRepository, IEmailService emailService)
        {
            _ordenRepository = ordenRepository;
            _emailService = emailService;

        }

        public async Task<UpdateStateOrdenShippedResponse> UpdateStateOrdenShipped(Guid ordenId)
        {
            Orden searchOrden = await _ordenRepository.GetOrdenById(ordenId);

            if (searchOrden == null) throw new KeyNotFoundException("No se encontro la orden para enviar");

            searchOrden.State = "Shipped";

            await _ordenRepository.SaveChangesAsync();

            // gmail para el cliente qeu su pedido esta en camino
            try
            {
                if (!string.IsNullOrEmpty(searchOrden.CustomerEmail))
                {
                    string asuntoEnvio = $"¡Tu pedido de MercadoExpress está en camino! 🚚💨";
                    string htmlEnvio = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                            <h2 style='color: #f59e0b; text-align: center;'>¡Pedido Despachado! 🚚</h2>
                            <p style='color: #334155; font-size: 16px;'>
                                ¡Hola <strong>{searchOrden.CustomerName}</strong>! Te queremos avisar que el vendedor ya empaquetó tus productos y los entregó al correo.
                            </p>
                            <hr style='border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;' />
                            <p style='color: #475569; font-size: 15px;'>
                                🏠 <strong>Dirección de destino:</strong> {searchOrden.CustomerAddress}<br/>
                                🆔 <strong>Número de rastreo interno:</strong> {searchOrden.Id.ToString().Substring(0, 8).ToUpper()}
                            </p>
                            <p style='color: #64748b; font-size: 12px; text-align: center; margin-top: 30px;'>
                                Cuando el paquete llegue a tu puerta, recordá abrir la campanita en MercadoExpress y presionar el botón verde para confirmar la recepción. ¡Gracias por tu compra!
                            </p>
                         <div style='text-align: center; margin: 30px 0;'>
                         <a href='http://localhost:5173/confirmar-entrega?ordenId={searchOrden.Id}' 
                              style='background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;'>
                              Ya tengo mi producto ✅
                         </a>
                         </div>
                         <p style='color: #64748b; font-size: 12px; text-align: center;'>
                           Al hacer clic, se confirmará la recepción y le avisaremos al vendedor.
                         </p>
                        </div>";

                    await _emailService.SendEmailAsync(searchOrden.CustomerEmail, asuntoEnvio, htmlEnvio);
                    Console.WriteLine($"===> MAILKIT LOGÍSTICA: Mail de despacho enviado con éxito a {searchOrden.CustomerEmail}");
                }
            }
            catch (Exception exEnvio)
            {
                // Si el SMTP de Google chilla por algo, el front no se entera y el log te avisa acá
                Console.WriteLine($"===> ADVERTENCIA MAILKIT DESPACHO: {exEnvio.Message}");
            }
            return new UpdateStateOrdenShippedResponse
            {
                Message = "El producto ya fue enviado.",
            };


        }

    }
}
