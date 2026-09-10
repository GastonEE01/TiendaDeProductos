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
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(Usuario user)
        {
             await _context.AddAsync(user);
             await _context.SaveChangesAsync();
        }

        public async Task<Usuario> GetUserByMail(string email)
        {
            return  await _context.Usuarios.FirstOrDefaultAsync(e => e.Mail == email);
        }
    }
}
