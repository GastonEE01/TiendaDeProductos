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

        public MercadoPagoCallbackUseCase( IOauthStateRepository oauthStateRepo,IMercadoPagoAuthRepository mpAuthRepo,IConfiguration config,HttpClient http)
        {
            _oauthStateRepository = oauthStateRepo;
            _mpAuthRepo = mpAuthRepo;
            _config = config;
            _http = http;
        }

        /* public async Task Execute(string code, string state)
         {
             var oauthState = await _oauthStateRepository.GetByState(state);
             if (oauthState is null) throw new Exception("State inválido");
             if (oauthState.UsedAtUtc != null) throw new Exception("State ya usado");
             if (oauthState.ExpiresAtUtc < DateTime.UtcNow) throw new Exception("State expirado");

             // Marcar como usado (idealmente antes del canje, para evitar reintentos maliciosos)
             oauthState.UsedAtUtc = DateTime.UtcNow;
             await _oauthStateRepository.Update(oauthState);

             var req = new MpOauthTokenRequest
             {
                 client_id = _config["MercadoPago:ClientId"]!,
                 client_secret = _config["MercadoPago:ClientSecret"]!,
                 code = code,
                 redirect_uri = _config["MercadoPago:RedirectUri"]!,
                 grant_type = "authorization_code",
                 test_token = true
             };

             var resp = await _http.PostAsJsonAsync("https://api.mercadopago.com/oauth/token", req);
             resp.EnsureSuccessStatusCode();

             var token = await resp.Content.ReadFromJsonAsync<MpOauthTokenResponse>();
             if (token is null || string.IsNullOrWhiteSpace(token.access_token))
                 throw new Exception("Respuesta inválida de Mercado Pago");

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
         }*/

        public async Task Execute(string code, string state)
        {
            var oauthState = await _oauthStateRepository.GetByState(state);
            if (oauthState is null) throw new Exception("State inválido");
            if (oauthState.UsedAtUtc != null) throw new Exception("State ya usado");
            if (oauthState.ExpiresAtUtc < DateTime.UtcNow) throw new Exception("State expirado");
            var dict = new Dictionary<string, string>
    {
        { "client_id", _config["MercadoPago:ClientId"]! },
        { "client_secret", _config["MercadoPago:ClientSecret"]! }, // 🎯 MEJORA 2: Usamos la clave secreta real de la app
        { "code", code },
        { "redirect_uri", _config["MercadoPago:RedirectUri"]! },
        { "grant_type", "authorization_code" },
        { "test_token", "true" } // Obligatorio para generar credenciales de Sandbox
    };
            using var reqContent = new FormUrlEncodedContent(dict);
            var resp = await _http.PostAsync("https://api.mercadopago.com/oauth/token", reqContent);
            var body = await resp.Content.ReadAsStringAsync();
            if (!resp.IsSuccessStatusCode)
            {
                throw new Exception($"Falla de Mercado Pago (Canje OAuth): {body}");
            }

            var token = JsonSerializer.Deserialize<MpOauthTokenResponse>(body);
            if (token is null || string.IsNullOrWhiteSpace(token.access_token))
            {
                throw new Exception("Respuesta inválida o vacía de Mercado Pago");
            }

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
