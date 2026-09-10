using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Usuario
{
    public class LoginDtoResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public string UserName { get; set; }  = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AliasCBU { get; set; } = string.Empty;
        public string MercadoPagoAccessToken { get; set; } = string.Empty;
        public string Message = string.Empty;

    }
}
