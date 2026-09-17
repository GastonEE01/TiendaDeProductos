using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class Notificacion
    {
        public Guid Id { get; set; }
        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public Guid OrdenId { get; set; }
        public Orden Orden { get; set; } = null!;
        public string Message { get; set; } = "Unread"; // "Unread" (Sin leer) o "Read" (Leída)
        public string State { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    }
}
