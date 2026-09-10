using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using MercadoExpress.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Infrastructure.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly AppDbContext _context;

        public ProductoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Producto> Add(Producto product)
        {
            _context.AddAsync(product);
            _context.SaveChanges();
            return product;
        }

        public async Task Delete(Producto producto)
        {
            _context.Productos.Remove(producto);
            _context.SaveChanges();
        }

        public async Task<List<Producto>> GetAll()
        {
            return await _context.Productos
                .ToListAsync();
        }

        public async Task<Producto> GetProductoById(Guid id)
        {
            return await _context.Productos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);
 //           _context.SaveChanges();
        }

        public async Task<Producto> Update(Producto searchProduct)
        {
            _context.Productos.Update(searchProduct);
            await _context.SaveChangesAsync();
            return searchProduct;
        }
    }
}
