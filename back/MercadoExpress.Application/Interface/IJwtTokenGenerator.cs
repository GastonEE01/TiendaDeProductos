using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Interface
{
    public interface IJwtTokenGenerator
    {
       public string GenerateToken(string usuarioId, string email, string rol);
    }
}
