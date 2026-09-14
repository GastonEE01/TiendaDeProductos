using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Orden
{
    public class OrdenDtoRequest
    {
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public long CustomerPhone { get; set; } // Usá 'long' por si el celular es largo
        public string DeliveryMethod { get; set; } = string.Empty ;
        public string CustomerAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    }

    public class CartItemDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}

