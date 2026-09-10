using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class DetalleOrden
    {
        public Guid Id { get; set; }
        public Guid OrdenId { get; set; }
        public Guid ProductoId { get; set; }
        public int Quantity { get; set; }
        public Decimal UnitPrice { get; set; }
        public Orden Orden {  get; set; } = null!;
        public Producto Producto { get; set; } = null!;

    }
}
