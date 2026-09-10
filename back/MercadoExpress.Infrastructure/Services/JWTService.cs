using MercadoExpress.Application.Interface;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Infrastructure.Services
{
    public class JWTService : IJwtTokenGenerator
    {
        public string GenerateToken(string usuarioId,string email,string rol)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuarioId),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, rol),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("UnaClaveSuperSecretaYMuyLargaDeMasDe32Caracteres!"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "TuEmisorGenérico",
                audience: "TuAudienciaGenérica",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3), // cuanto dura el login
                signingCredentials: creds);

            // Transformamos el objet en el string largo que react va a guardar
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
