using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class Producto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Decimal Price { get; set; }
        public string IMG { get; set; } = string.Empty;    
        public int Stock { get; set; }
        public Guid CategoriaId { get; set; }
        public Categoria Categoria { get; set; } = null!; 

        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;

    }
}
