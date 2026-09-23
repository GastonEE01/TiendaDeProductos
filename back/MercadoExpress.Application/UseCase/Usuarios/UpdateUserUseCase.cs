using AutoMapper;
using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.DTO.Usuario;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Usuarios
{
    public class UpdateUserUseCase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        public readonly IMapper _mapper;

        public UpdateUserUseCase(IUsuarioRepository usuarioRepository, IMapper mapper)
        {
            _usuarioRepository = usuarioRepository;
            _mapper = mapper;
        }
        public async Task<UpdateUserResponse> UpdateUser(Guid usuarioId,UpdateUserDtoRequest dto)
        {
            Usuario searchUser = await _usuarioRepository.GetUserById(usuarioId);
            if (searchUser == null) throw new KeyNotFoundException("No se encontro el usuario");

            if (!string.IsNullOrEmpty(dto.UserName)) searchUser.UserName = dto.UserName;
            if (!string.IsNullOrEmpty(dto.Mail)) searchUser.Mail = dto.Mail;
            if (!string.IsNullOrEmpty(dto.ImgPath)) searchUser.IMG = dto.ImgPath;
            if (!string.IsNullOrEmpty(dto.AliasCBU)) searchUser.AliasCBU = dto.AliasCBU;

            await _usuarioRepository.Update(searchUser);

            UpdateUserResponse response = _mapper.Map<UpdateUserResponse>(searchUser);
            response.Message = "Producto actualizado.";
            return response;
        }
    }
}
