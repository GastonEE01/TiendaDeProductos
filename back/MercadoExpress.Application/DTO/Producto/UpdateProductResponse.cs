using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Producto
{
    public class UpdateProductResponse
    {
        public string? Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public Decimal? Price { get; set; }
        public string? IMG { get; set; } = string.Empty;
        public int? Stock { get; set; }
        public string? NameCategoria { get; set; } = string.Empty;
        public string Message {  get; set; } = string.Empty;
    }
}
