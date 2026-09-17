using MercadoExpress.Application.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Notificaciones
{
    public class MarkNotificationsReadUseCase
    {
        private readonly INotificacionRepository _notificacionRepository;

        public MarkNotificationsReadUseCase(INotificacionRepository notificacionRepository)
        {
            _notificacionRepository = notificacionRepository;
        }

        public async Task<string> MarkNotificationsRead(Guid usuarioId)
        {
            var pendingNotifications = await _notificacionRepository.GetUnreadNotification(usuarioId);

            if (!pendingNotifications.Any())
            {
                return "No tienes notificaciones pendientes de lectua";
            }

            foreach (var notif in pendingNotifications)
            {
                notif.State = "Read";
            }

            await _notificacionRepository.SaveChangesAsync();

            return $"Se marcaron {pendingNotifications.Count} notificaciones como leídas.";

        }
    }
}
