using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Producto
{
    public class AddProductoRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Decimal Price { get; set; }
        public string IMG { get; set; } = string.Empty;
        public int Stock { get; set; }
       // public Guid CategoriaId { get; set; }
        public string CategoriaName { get; set;} = string.Empty;

        public Guid UsuarioId { get; set; }
    }
}
