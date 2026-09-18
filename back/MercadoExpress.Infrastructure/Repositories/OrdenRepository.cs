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
    public class OrdenRepository : IOrdenRepository
    {
        private readonly AppDbContext _context;

        public OrdenRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(Orden orden)
        {
            await _context.Ordenes.AddAsync(orden);
            await _context.SaveChangesAsync();
        }

      

        public async Task<List<Orden>> GetShoppingByUserEmail(string email)
        {
            return await _context.Ordenes
                .Include(o => o.Detalles)
                .ThenInclude(d => d.Producto)
                .Where(o => o.CustomerEmail == email)
                .OrderByDescending(o => o.CreationDate)
                .ToListAsync();
        }

        public async Task<Orden?> GetByPreferenceIdAsync(string preferenceId)
        {
            return await _context.Ordenes
                .FirstOrDefaultAsync(o => o.MercadoPagoPreferenceId == preferenceId);
        }


        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        public async Task<Orden> GetOrdenById(Guid ordenId)
        {
            return await _context.Ordenes
                .FirstAsync(o => o.Id == ordenId);
        }
    }
}
