using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class MercadoPagoAuth
    {
        public Guid Id { get; set; }

        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;

        public DateTime ExpiresAtUtc { get; set; }  // para saber cuándo renovar
        public DateTime CreatedAtUtc { get; set; }
        public DateTime UpdatedAtUtc { get; set; }

        // Opcional (pero útil): identificar a qué cuenta de MP quedó vinculado
        public long? MercadoPagoUserId { get; set; }
    }
}
