using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Orden
{
    public class CustomerPurchasesDtoResponse
    {
        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; }
        public string State { get; set; } = string.Empty;
        public string DeliveryMethod { get; set; } = string.Empty;
        public List<CustomerPurchaseItemDto> Productos { get; set; } = new();
        public decimal Total { get; set; }

    }

    // Es la clase secundaria exclusiva para los items del carrito comprado
    public class CustomerPurchaseItemDto
    {
        public string Name { get; set; } = string.Empty;
        public string Img { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
