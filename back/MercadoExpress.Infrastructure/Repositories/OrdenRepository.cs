using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using MercadoExpress.Infrastructure.Data;
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
    }
}
