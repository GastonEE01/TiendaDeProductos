using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Interface
{
    public interface INotificacionRepository
    {
        Task Add(Notificacion notificacion);
        Task<List<Notificacion>> GetNotificacionVendedor(Guid usuarioId);
        Task<List<Notificacion>> GetUnreadNotification(Guid usuarioId);
        Task SaveChangesAsync();
    }
}
