using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using MercadoExpress.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Infrastructure.Repositories
{
    public class NotificacionRepository : INotificacionRepository
    {
        private readonly AppDbContext _context;

        public NotificacionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(Notificacion notificacion)
        {
            await _context.Notificaciones.AddAsync(notificacion);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Notificacion>> GetNotificacionVendedor(Guid usuarioId)
        {
            return await _context.Notificaciones
                .Include(n => n.Orden)
                 .ThenInclude(o => o.Detalles) // 🚀 1. Entra a la orden y trae la lista de detalles
                .ThenInclude(d => d.Producto) // 🚀 2. Entra al detalle y trae el Producto (ahí está la Img y el Name)
                .Where(n => n.UsuarioId ==  usuarioId)
                .OrderByDescending(n => n.CreationDate).
                ToListAsync();
        }

        public async Task<List<Notificacion>> GetUnreadNotification(Guid usuarioId)
        {
            return await _context.Notificaciones
                 .Where(n => n.UsuarioId == usuarioId && n.State == "Unread")
                 .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

       
    }
}
