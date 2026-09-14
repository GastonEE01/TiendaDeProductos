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

        // agrego 
        public decimal CommissionPercentage { get; set; }
        public decimal CommissionAmount { get; set; }
        public decimal SellerAmount { get; set; }
        public string CustomerPhone { get; set; } = string.Empty; // Nuevo
        public string DeliveryMethod { get; set; } = string.Empty; // "Shipping" o "Pickup"
        public string City { get; set; } = string.Empty; // Nuevo

        public string PostalCode { get; set; } = string.Empty; // Nuevo


    }
}


/*
 * 
 * /*
 *  public Guid Id { get; set; }
    public DateTime CreationDate { get; set; } 
    public string State { get; set; } = string.Empty; // Pending, Approved, Rejected
    
    // Totales y comisiones históricos (Paso 5)
    public decimal Total { get; set; } 
    public decimal CommissionPercentage { get; set; }
    public decimal CommissionAmount { get; set; }
    public decimal SellerAmount { get; set; }

    // Datos del Cliente (Paso 2)
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty; // Nuevo
    public string DeliveryMethod { get; set; } = string.Empty; // "Shipping" o "Pickup"
    public string CustomerAddress { get; set; } = string.Empty; // Calle, altura, depto
    public string City { get; set; } = string.Empty; // Nuevo
    public string PostalCode { get; set; } = string.Empty; // Nuevo

    // Mercado Pago Link
    public string? MercadoPagoPreferenceId { get; set; } // Para guardar el ID de la transacción
*/