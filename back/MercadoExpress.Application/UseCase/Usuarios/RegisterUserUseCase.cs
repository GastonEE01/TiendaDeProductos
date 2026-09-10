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
    public class RegisterUserUseCase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IMapper _mapper;
        public RegisterUserUseCase(IUsuarioRepository usuarioRepository,IMapper mapper)
        {
            _mapper = mapper;
            _usuarioRepository = usuarioRepository;
        }

        public async Task<RegisterDtoResponse> AddUser(RegisterDtoRequest dto)
        {
            if (string.IsNullOrEmpty(dto.UserName)) throw new ArgumentException("Ingrese el nombre de usuario");
            if (string.IsNullOrEmpty(dto.Mail)) throw new ArgumentException("Ingrese el Email ");

            Usuario searchMail = await _usuarioRepository.GetUserByMail(dto.Mail);
            if (searchMail != null) throw new ArgumentException("Ya existe este Mail");

            if (string.IsNullOrEmpty(dto.Password)) throw new ArgumentException("Ingrese la contraseña");
            if (string.IsNullOrEmpty(dto.ConfirmPassword)) throw new ArgumentException("Confirme la contraseña");

            if (!dto.Mail.Contains("@")) throw new ArgumentException("El Email debe tener @");
            if ((!dto.Mail.Contains("gmail.com")) && (!dto.Mail.Contains("outlook.com"))) throw new ArgumentException("El Email debe terminar en gmail.com o outlook.com");

            // validar  la contraseña 
            bool containMayus = dto.Password.Any(Char.IsUpper);
            bool containMinus = dto.Password.Any(Char.IsLower);
            bool containNumber = dto.Password.Any(Char.IsDigit);

            if (string.IsNullOrWhiteSpace(dto.Password))
                throw new ArgumentException("La contraseña es obligatoria.");

            if (dto.Password.Length <= 5 || !containMayus || !containMinus || !containNumber)
                throw new ArgumentException("La contraseña debe tener 6 o mas caracteres y contener una letra mayuscula,una minuscula y un numero");

            if (!dto.Password.Equals(dto.ConfirmPassword))
                throw new ArgumentException("La contraseña no coincide con la contraseña confirmada");

            if ((string.IsNullOrEmpty(dto.MercadoPagoAccessToken)) && (string.IsNullOrEmpty(dto.AliasCBU))) throw new ArgumentException("Debe ingresar al menos 1 metodo para recibir el dinero de los productos");


            var user = _mapper.Map<Usuario>(dto);

            var passworHasher = new PasswordHasher<Usuario>();
            string passworHasherConfirm = passworHasher.HashPassword(user, dto.Password);

            user.Password = passworHasherConfirm;
            user.Rol = "Admin";

            await _usuarioRepository.Add(user);

            return new RegisterDtoResponse
            {
                Message = "Registro exitoso"
            };

        }
    }
}
