using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Interface
{
    public interface IProductoRepository
    {
        Task<Producto> Add(Producto product);
        Task Delete(Producto producto);
        Task <List<Producto>> GetAll();
        Task<Producto> GetProductoById(Guid id);
        Task<Producto>Update(Producto searchProduct);
    }
}
