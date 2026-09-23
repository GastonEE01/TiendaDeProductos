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
    public class OauthStateRepository : IOauthStateRepository
    {
        private readonly AppDbContext _context;

        public OauthStateRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(OAuthState oauthState)
        {
            await _context.OAuthStates.AddAsync(oauthState);
            await _context.SaveChangesAsync();
        }

        public async Task<OAuthState?> GetByState(string state)
        {
            return await _context.OAuthStates
                .FirstOrDefaultAsync(s => s.State == state);
        }

        public async Task Update(OAuthState oauthState)
        {
            _context.OAuthStates.Update(oauthState);
            await _context.SaveChangesAsync();

        }
    }
}
