using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Notificacion
{
    public class NotificacionDtoResponse
    {
        public Guid Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }

        // Datos del Comprador
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerAddress { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public decimal Total { get; set; }

        // Lista plana de los productos vendidos
        public List<NotificacionProductoDto> Productos { get; set; } = new();
    }

    public class NotificacionProductoDto
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Img { get; set; } = string.Empty;
    }

}
