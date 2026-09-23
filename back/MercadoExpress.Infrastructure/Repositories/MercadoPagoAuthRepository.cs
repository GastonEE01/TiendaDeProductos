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
    public class MercadoPagoAuthRepository : IMercadoPagoAuthRepository
    {
        private readonly AppDbContext _context;

        public MercadoPagoAuthRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MercadoPagoAuth?> GetByUsuarioId(Guid usuarioId)
        {
            return await _context.AutenticacionesMP.FirstOrDefaultAsync(a => a.UsuarioId == usuarioId);
        }


        public async Task Upsert(MercadoPagoAuth auth)
        {
            var existing = await _context.AutenticacionesMP
                .FirstOrDefaultAsync(a => a.UsuarioId == auth.UsuarioId);

            if (existing is null)
            {
                await _context.AutenticacionesMP.AddAsync(auth);
            }
            else
            {
                existing.AccessToken = auth.AccessToken;
                existing.RefreshToken = auth.RefreshToken;
                existing.ExpiresAtUtc = auth.ExpiresAtUtc;
                existing.UpdatedAtUtc = auth.UpdatedAtUtc;
                existing.MercadoPagoUserId = auth.MercadoPagoUserId;
            }

            await _context.SaveChangesAsync();
        }
    }
}
