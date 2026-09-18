using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Interface
{
    public interface IOrdenRepository
    {
        Task Add(Orden orden);
        Task SaveChangesAsync();
        Task<Orden?> GetByPreferenceIdAsync(string preferenceId);
        Task<List<Orden>> GetShoppingByUserEmail(string email);
        Task<Orden> GetOrdenById(Guid ordenId);
    }
}
