using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Interface
{
    public interface IMercadoPagoAuthRepository
    {
        Task<MercadoPagoAuth?> GetByUsuarioId(Guid usuarioId);
        Task Upsert(MercadoPagoAuth auth);
    }
}
