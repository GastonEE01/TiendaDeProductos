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
        public string MercadoPagoPreferenceId { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; } 
        public string PaymentUrl {  get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public decimal Total { get; set; } 
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerAddress { get; set; } = string.Empty;
        public List<DetalleOrden> Detalles { get; set; } = new List<DetalleOrden>();

        public decimal CommissionPercentage { get; set; }
        public decimal CommissionAmount { get; set; }
        public decimal SellerAmount { get; set; }
        public string CustomerPhone { get; set; } = string.Empty; 
        public string DeliveryMethod { get; set; } = string.Empty; // "Shipping" o "Pickup"
        public string City { get; set; } = string.Empty; 
        public string PostalCode { get; set; } = string.Empty; 
    }
}
