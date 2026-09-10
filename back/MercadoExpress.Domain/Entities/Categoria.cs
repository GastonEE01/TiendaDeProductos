using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class Categoria
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<Producto> Productos { get; set; } = new List<Producto>();

    }
}
