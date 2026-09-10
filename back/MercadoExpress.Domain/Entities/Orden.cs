using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Domain.Entities
{
    public class Orden
    {
        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; } 
        public string State { get; set; } = string.Empty;
        public decimal Total { get; set; } 
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerAddress { get; set; } = string.Empty;
        public List<DetalleOrden> Detalles { get; set; } = new List<DetalleOrden>();
    }
}
