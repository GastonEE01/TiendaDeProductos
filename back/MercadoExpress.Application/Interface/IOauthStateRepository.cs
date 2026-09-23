using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Interface
{
    public interface IOauthStateRepository
    {
        Task<OAuthState?> GetByState(string state);
        Task Add(OAuthState oauthState);
        Task Update(OAuthState oauthState);
    }
}
