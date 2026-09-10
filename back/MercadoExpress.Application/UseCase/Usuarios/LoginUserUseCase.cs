using AutoMapper;
using MercadoExpress.Application.DTO.Usuario;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Usuarios
{
    public class LoginUserUseCase
    {
        public readonly IUsuarioRepository _usuarioRepository;
        private readonly PasswordHasher<Usuario> _passwordHasher;
        private readonly IJwtTokenGenerator _service;
        public readonly IMapper _mapper;

        public LoginUserUseCase(IUsuarioRepository usuarioRepository, IJwtTokenGenerator jwtTokenGenerator,IMapper mapper)
        {
            _usuarioRepository = usuarioRepository;
            _passwordHasher = new PasswordHasher<Usuario>();
            _service = jwtTokenGenerator;
            _mapper = mapper;
        }

        public async Task<LoginDtoResponse> Login(LoginDtoRequest dto)
        {
            Usuario searchUserEmail = await _usuarioRepository.GetUserByMail(dto.Email);

            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password)) throw new ArgumentException("El email y la contraseña son obligatorios.");
            if (searchUserEmail == null) throw new KeyNotFoundException("No se  encontro ese Mail");

            var validationPassword = _passwordHasher.VerifyHashedPassword(searchUserEmail, searchUserEmail.Password, dto.Password);
            if (validationPassword == PasswordVerificationResult.Failed) throw new KeyNotFoundException("Contraseña incorrecta.");

            string token = _service.GenerateToken(searchUserEmail.Id.ToString(), searchUserEmail.Mail, searchUserEmail.Rol);
            var response = _mapper.Map<LoginDtoResponse>(searchUserEmail);
            response.Token  = token;
            response.Message = "Login Exitoso";

            return response;
        }
    }
}
