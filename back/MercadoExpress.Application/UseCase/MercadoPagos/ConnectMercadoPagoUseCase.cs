using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MercadoExpress.Application.UseCase.MercadoPagos
{
    public class ConnectMercadoPagoUseCase
    {
        private IUsuarioRepository _usuarioRepository;
        private IOauthStateRepository _oauthStateRepository;
        private readonly IConfiguration _config;

        public ConnectMercadoPagoUseCase(IUsuarioRepository usuarioRepository, IOauthStateRepository oauthStateRepository, IConfiguration config)
        {
            _usuarioRepository = usuarioRepository;
            _oauthStateRepository = oauthStateRepository;
            _config = config;
        }

        public async Task<string> ConnectMercadoPagoAuth(Guid usuarioId)
        {
           var user = await _usuarioRepository.GetUserById(usuarioId);
            if (user is null) throw new Exception("Usuario no encontrado");
            if (user.Rol != "Seller") throw new Exception("Solo sellers pueden conectar Mercado Pago");

            string state = Guid.NewGuid().ToString();

            var auth = new OAuthState
            {
                Id = Guid.NewGuid(),
                UsuarioId = usuarioId,
                State = state,
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(10),
                UsedAtUtc = null
            };

            await _oauthStateRepository.Add(auth);

            var clientId = _config["MercadoPago:ClientId"];
            var redirectUri = _config["MercadoPago:RedirectUri"];

            var url =
                "https://auth.mercadopago.com/authorization"
                + "?response_type=code"
                + $"&client_id={Uri.EscapeDataString(clientId)}"
                + $"&redirect_uri={Uri.EscapeDataString(redirectUri)}"
                + $"&state={Uri.EscapeDataString(state)}"
                + "&platform_id=mp";

            return url;

        }
    }
}
