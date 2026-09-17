using MercadoPago.Resource.Preference;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.Orden
{
    public class OrdenDtoResponse
    {
        public string Message { get; set; } = string.Empty;
        public string PaymentUrl { get; set; } = string.Empty;
        public string? PreferenceId { get; set; }
    }
}
