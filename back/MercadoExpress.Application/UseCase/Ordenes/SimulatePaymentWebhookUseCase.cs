using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Ordenes
{
    public class SimulatePaymentWebhookUseCase
    {
        private readonly IOrdenRepository _ordenRepository;
        private readonly INotificacionRepository _notificacionRepository;

        public SimulatePaymentWebhookUseCase(
            IOrdenRepository ordenRepository,
            INotificacionRepository notificacionRepository)
        {
            _ordenRepository = ordenRepository;
            _notificacionRepository = notificacionRepository;
        }

        public async Task<string> Execute(string preferenceId)
        {
            // 1. Buscamos la orden en Neon usando el ID de Mercado Pago
            var orden = await _ordenRepository.GetByPreferenceIdAsync(preferenceId);

            if (orden == null) throw new KeyNotFoundException("No se encontró ninguna orden con ese PreferenceId.");

            //  Si ya estaba aprobada, no hacemos nada para evitar duplicar lógica
            if (orden.State == "Approved") return "La orden ya se encontraba aprobada.";

            orden.State = "Approved";
            await _ordenRepository.SaveChangesAsync();

            // ========================================================
            // 🔔 3. CREACIÓN ATÓMICA DE LA NOTIFICACIÓN PARA EL VENDEDOR
            // ========================================================
            // Como tu entidad Orden ya tiene el SellerAmount y el CustomerName por el split, armamos el mensaje:
            string mensaje = $"¡Nueva venta registrada! El cliente {orden.CustomerName} pagó exitosamente. Total: ${orden.Total}. Ganancia neta para tu cuenta: ${orden.SellerAmount}.";

            var vendedorId = orden.Detalles.FirstOrDefault()?.Producto?.UsuarioId;

            if (vendedorId == null) throw new Exception("No se pudo determinar el vendedor de esta orden.");

            var nuevaNotificacion = new Notificacion
            {
                Id = Guid.NewGuid(),
                OrdenId = orden.Id,
                UsuarioId = vendedorId.Value, 
                Message = mensaje,
                State = "Unread",
                CreationDate = DateTime.UtcNow
            };

            await _notificacionRepository.Add(nuevaNotificacion);
            await _notificacionRepository.SaveChangesAsync();

            return $"Orden {orden.Id} aprobada con éxito. Notificación enviada al vendedor.";
        }
    }

}
