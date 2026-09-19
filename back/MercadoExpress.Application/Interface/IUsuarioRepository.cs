using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Interface
{
    public interface IUsuarioRepository
    {
        Task Add(Usuario user);
        Task<Usuario> GetUserById(Guid usuarioId);
        Task<Usuario> GetUserByMail(string email);
        Task<Usuario> Update(Usuario searchUser);
    }
}
