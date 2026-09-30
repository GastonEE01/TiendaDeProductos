using MercadoExpress.Application.Interface;
using MercadoPago.Client.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.MercadoPagos
{
    public class ProcessMercadoPagoWebhookUseCase
    {
        private readonly IOrdenRepository _ordenRepository;
        private readonly INotificacionRepository _notificacionRepository;
        private readonly IEmailService _emailService;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IProductoRepository _productRepository;

        public ProcessMercadoPagoWebhookUseCase(
           IOrdenRepository ordenRepository,
           INotificacionRepository notificacionRepository, IEmailService emailService, IUsuarioRepository usuarioRepository, IProductoRepository productRepository)
        {
            _ordenRepository = ordenRepository;
            _notificacionRepository = notificacionRepository;
            _emailService = emailService;
            _usuarioRepository = usuarioRepository;
            _productRepository = productRepository;
        }

        public async Task Execute(string type, long dataId)
        {
            if (string.IsNullOrEmpty(type) || type.ToLower().Trim() != "payment") return;

            var paymentClient = new PaymentClient();
            var paymentInfo = await paymentClient.GetAsync(dataId);

            if (paymentInfo != null && paymentInfo.Status == "approved")
            {
                // Mostramos lo que trae  Webhook
                System.Diagnostics.Debug.WriteLine($"============================================");
                System.Diagnostics.Debug.WriteLine($"--> REVISANDO PAGO MP ID: {dataId}");
                System.Diagnostics.Debug.WriteLine($"--> SDK ExternalReference: '{paymentInfo.ExternalReference}'");
                System.Diagnostics.Debug.WriteLine($"--> SDK Order Id: '{paymentInfo.Order?.Id}'");
                System.Diagnostics.Debug.WriteLine($"============================================");

                string externalReference = paymentInfo.ExternalReference;

                if (!string.IsNullOrEmpty(externalReference) && Guid.TryParse(externalReference, out Guid ordenId))
                {
                    var ordenEnBase = await _ordenRepository.GetOrdenById(ordenId);

                    if (ordenEnBase != null && ordenEnBase.State == "Pending")
                    {
                        ordenEnBase.State = "Paid";

                        foreach (var detalle in ordenEnBase.Detalles)
                        {
                            var productoEnBase = await _productRepository.GetProductoById(detalle.ProductoId);
                            if (productoEnBase != null)
                            {
                                productoEnBase.Stock -= detalle.Quantity;
                                if (productoEnBase.Stock < 0) productoEnBase.Stock = 0;
                                await _productRepository.Update(productoEnBase);
                            }
                        }

                            await _ordenRepository.Update(ordenEnBase);

                        var notificacion = await _notificacionRepository.GetByOrdenId(ordenEnBase.Id);
                        if (notificacion != null)
                        {
                            notificacion.Message = $"¡Venta Confirmada! El cliente {ordenEnBase.CustomerName} pagó con éxito un total de ${ordenEnBase.Total}. El dinero ya está acreditado en tu cuenta.";
                            await _notificacionRepository.Update(notificacion);
                        }

                        try
                        {
                            string emailClient = $"¡Tu pago de ${ordenEnBase.Total} fue acreditado!";

                            string bodyHtml = $@"
                                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 8px;'>
                                    <h2 style='color: #10b981; text-align: center;'>¡Gracias por tu compra, {ordenEnBase.CustomerName}! 🙌</h2>
                                    <p style='color: #334155; font-size: 16px; line-height: 1.5;'>
                                        Queremos confirmarte que tu pago por un total de <strong>${ordenEnBase.Total}</strong> impactó con éxito en nuestra plataforma. El vendedor ya fue notificado y está preparando tu pedido.
                                    </p>
                                    <hr style='border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;' />
                                    <h3 style='color: #1e293b;'>Detalles del envío:</h3>
                                    <ul style='color: #475569; font-size: 14px; list-style: none; padding: 0;'>
                                        <li>📦 <strong>Método:</strong> {ordenEnBase.DeliveryMethod}</li>
                                        <li>📍 <strong>Dirección:</strong> {ordenEnBase.CustomerAddress}</li>
                                        <li>🆔 <strong>Pedido N°:</strong> {ordenEnBase.Id.ToString().Substring(0, 8).ToUpper()}</li>
                                    </ul>
                                    <p style='color: #64748b; font-size: 12px; text-align: center; margin-top: 30px;'>
                                        Podés seguir el estado de tu paquete abriendo la campanita en nuestro e-commerce MercadoExpress.
                                    </p>
                                </div>";

                            if (!string.IsNullOrEmpty(ordenEnBase.CustomerEmail))
                            {
                                await _emailService.SendEmailAsync(ordenEnBase.CustomerEmail, emailClient, bodyHtml);
                                Console.WriteLine($"===> MAILKIT: Notificación de pago enviada con éxito a {ordenEnBase.CustomerEmail}");
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"===> ADVERTENCIA MAILKIT: No se pudo enviar el correo: {ex.Message}");
                        }

                        var searchUseSeller = ordenEnBase.Detalles.FirstOrDefault();
                        if (searchUseSeller != null)
                        {
                            Guid vendedorId = searchUseSeller.Producto.UsuarioId;

                            try
                            {
                                // Buscamos al vendedor para mandar su gmail
                                var sellerInfo = await _usuarioRepository.GetUserById(vendedorId);

                                if (sellerInfo != null && !string.IsNullOrEmpty(sellerInfo.Mail))
                                {
                                    string emailSeller = $"¡Felicidades, tuviste una nueva venta! 💰 - MercadoExpress";
                                    string htmlVendedor = $@"
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                                <h2 style='color: #2563eb; text-align: center;'>¡Nueva venta confirmada! 🎉</h2>
                                <p style='color: #334155; font-size: 16px;'>
                                    Hola <strong>{sellerInfo.UserName}</strong>, el cliente <strong>{ordenEnBase.CustomerName}</strong> pagó con éxito un total de <strong>${ordenEnBase.Total}</strong>.
                                </p>
                                <hr style='border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;' />
                                <h3 style='color: #1e293b;'>Datos para el despacho:</h3>
                                <ul style='color: #475569; font-size: 14px; list-style: none; padding: 0;'>
                                    <li>📞 <strong>Teléfono cliente:</strong> {ordenEnBase.CustomerPhone}</li>
                                    <li>📍 <strong>Dirección de entrega:</strong> {ordenEnBase.CustomerAddress}</li>
                                    <li>🆔 <strong>Orden N°:</strong> {ordenEnBase.Id.ToString().Substring(0, 8).ToUpper()}</li>
                                </ul>
                            </div>";

                                    await _emailService.SendEmailAsync(sellerInfo.Mail, emailSeller, htmlVendedor);
                                    Console.WriteLine($"===> MAILKIT: Alerta de venta enviada al vendedor {sellerInfo.Mail}");
                                }
                            }
                            catch (Exception exVendedor)
                            {
                                Console.WriteLine($"===> ADVERTENCIA MAILKIT VENDEDOR: {exVendedor.Message}");
                            }
                        }

                    }
                }
            }
        }




    }
}


