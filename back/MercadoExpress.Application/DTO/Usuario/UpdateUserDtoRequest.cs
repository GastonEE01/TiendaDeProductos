using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Usuario
{
    public class UpdateUserDtoRequest
    {
        public string? Mail { get; set; } = string.Empty;
        public string? UserName { get; set; } = string.Empty;
        public string? AliasCBU { get; set; } = string.Empty;
        public IFormFile? IMG { get; set; } 
        public string? ImgPath { get; set; } = string.Empty;

    }
}
