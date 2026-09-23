using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.MercadoPago
{
    public class MpOauthTokenRequest
    {
        public string client_id { get; set; } = "";
        public string client_secret { get; set; } = "";
        public string grant_type { get; set; } = "authorization_code";
        public string code { get; set; } = "";
        public string redirect_uri { get; set; } = "";

        // opcional: si querés tokens de prueba
        public bool test_token { get; set; } = true;
    }
}
