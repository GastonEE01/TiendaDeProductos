using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Usuario
{
    public class UpdateUserResponse
    {
        public string Mail { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string AliasCBU { get; set; } = string.Empty;
        public string MercadoPagoAccessToken { get; set; } = string.Empty;
        public string IMG { get; set; } = default!;
        public string Message { get; set; } = string.Empty;
    }
}
