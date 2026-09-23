using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class OAuthState
    {
        public Guid Id { get; set; }
        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public string State { get; set; } = string.Empty;
        public DateTime ExpiresAtUtc { get; set; }
        public DateTime? UsedAtUtc { get; set; }
    }
}
