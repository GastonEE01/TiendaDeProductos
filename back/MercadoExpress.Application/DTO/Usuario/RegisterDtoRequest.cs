using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Usuario
{
    public class RegisterDtoRequest
    {
        public string Mail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string AliasCBU { get; set; } = string.Empty;
        public string MercadoPagoAccessToken { get; set; } = string.Empty;
    }
}
