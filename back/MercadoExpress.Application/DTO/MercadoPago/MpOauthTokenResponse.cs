using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.DTO.MercadoPago
{
    public class MpOauthTokenResponse
    {
        public string access_token { get; set; } = "";
        public string refresh_token { get; set; } = "";
        public int expires_in { get; set; }
        public long? user_id { get; set; }
    }
}
