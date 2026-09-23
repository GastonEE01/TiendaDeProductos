using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class Usuario
    {
        public Guid Id { get; set; }
        public string Mail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
         public string AliasCBU { get; set; } = string.Empty;
        // public string MercadoPagoAccessToken { get; set; } = string.Empty;
        public string IMG { get; set; } = string.Empty;
        public MercadoPagoAuth? MercadoPagoAuth { get; set; }
        // Adentro de tu Usuario.cs, abajo de todo agregá:
        public List<OAuthState>? OAuthStates { get; set; } = new List<OAuthState>();
        public List<Producto>? Productos { get; set; } = new List<Producto>();

    }

}
