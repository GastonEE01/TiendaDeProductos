using MercadoExpress.Application.DTO.MercadoPago;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.MercadoPagos
{
    public class MercadoPagoCallbackUseCase
    {
        private readonly IMercadoPagoAuthRepository _mpAuthRepo;
        private readonly IOauthStateRepository _oauthStateRepository;
        private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public MercadoPagoCallbackUseCase(IOauthStateRepository oauthStateRepo, IMercadoPagoAuthRepository mpAuthRepo, IConfiguration config, HttpClient http)
        {
            _oauthStateRepository = oauthStateRepo;
            _mpAuthRepo = mpAuthRepo;
            _config = config;
            _http = http;
        }

        public async Task Execute(string code, string state)
        {
            var oauthState = await _oauthStateRepository.GetByState(state);
            if (oauthState is null) throw new Exception("State inválido");
            if (oauthState.UsedAtUtc != null) throw new Exception("State ya usado");
            if (oauthState.ExpiresAtUtc < DateTime.UtcNow) throw new Exception("State expirado");
            var dict = new Dictionary<string, string>
            {
                { "client_id", _config["MercadoPago:ClientId"]! },        
                { "client_secret", _config["MercadoPago:ClientSecret"]! }, 
                { "code", code },
                { "redirect_uri", _config["MercadoPago:RedirectUri"]! },
                { "grant_type", "authorization_code" },
                { "test_token", "false" }
            };

            using var reqContent = new FormUrlEncodedContent(dict);
            var payload = await reqContent.ReadAsStringAsync();

            // capturamos la clave secreta por seguridad
            System.Diagnostics.Debug.WriteLine("OAUTH_TOKEN payload = " + payload.Replace(_config["MercadoPago:ClientSecret"]!, "********"));

            var resp = await _http.PostAsync("https://api.mercadopago.com/oauth/token", reqContent);
            var body = await resp.Content.ReadAsStringAsync();
            System.Diagnostics.Debug.WriteLine("OAUTH_TOKEN response = " + body);
            if (!resp.IsSuccessStatusCode)
            {
                throw new Exception($"Falla de Mercado Pago (Canje OAuth): {body}");
            }

            var token = JsonSerializer.Deserialize<MpOauthTokenResponse>(body);
            if (token is null || string.IsNullOrWhiteSpace(token.access_token))
            {
                throw new Exception("Respuesta inválida o vacía de Mercado Pago");
            }
            System.Diagnostics.Debug.WriteLine($"MP access_token prefix: {token.access_token.Substring(0, 8)} user_id: {token.user_id}");

            oauthState.UsedAtUtc = DateTime.UtcNow;
            await _oauthStateRepository.Update(oauthState);

            var auth = await _mpAuthRepo.GetByUsuarioId(oauthState.UsuarioId);

            if (auth is null)
            {
                auth = new MercadoPagoAuth
                {
                    Id = Guid.NewGuid(),
                    UsuarioId = oauthState.UsuarioId,
                    CreatedAtUtc = DateTime.UtcNow
                };
            }
            auth.AccessToken = token.access_token;
            auth.RefreshToken = token.refresh_token;
            auth.ExpiresAtUtc = DateTime.UtcNow.AddSeconds(token.expires_in);
            auth.UpdatedAtUtc = DateTime.UtcNow;
            auth.MercadoPagoUserId = token.user_id;

            await _mpAuthRepo.Upsert(auth);
        }

    }
}
