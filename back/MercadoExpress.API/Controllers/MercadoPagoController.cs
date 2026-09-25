using MercadoExpress.Application.UseCase.MercadoPagos;
using MercadoPago.Client;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class MercadoPagoController : ControllerBase
    {
        private readonly ConnectMercadoPagoUseCase _connectMP;
        private readonly MercadoPagoCallbackUseCase _mercadoPagoCallback;
        public MercadoPagoController(ConnectMercadoPagoUseCase connectMP, MercadoPagoCallbackUseCase mercadoPagoCallback)
        {
            _connectMP = connectMP;
            _mercadoPagoCallback = mercadoPagoCallback;
        }

        [HttpPost("mp/preference-test")]
        public async Task<IActionResult> PreferenceTest()
        {
            try
            {
                var token = MercadoPagoConfig.AccessToken;
                if (string.IsNullOrWhiteSpace(token))
                    return StatusCode(500, new { message = "No hay Access Token configurado" });

                var request = new PreferenceRequest
                {
                    Items = new List<PreferenceItemRequest>
            {
                new PreferenceItemRequest
                {
                    Title = "Test Swagger A/B",
                    Quantity = 1,
                    CurrencyId = "ARS",
                    UnitPrice = 100m
                }
            }
                };

                var client = new PreferenceClient();

                // Creamos la preferencia en los servidores de MP
                var pref = await client.CreateAsync(request, new RequestOptions { AccessToken = token });

                // 🚀 RECTIFICADO PRUEBA A/B: Devolvemos ambos links para hacer el descarte de cookies
                return Ok(new
                {
                    PreferenceId = pref.Id,
                    PaymentUrlSandbox = pref.SandboxInitPoint, // 🧪 El de pruebas (Sandbox)
                    PaymentUrlProdLike = pref.InitPoint       // 🌍 El de producción (Live)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        /*  [HttpPost("mp/preference-test")]
          public async Task<IActionResult> PreferenceTest()
          {
              try
              {
                  var token = MercadoPagoConfig.AccessToken;
                  if (string.IsNullOrWhiteSpace(token))
                      return StatusCode(500, new { message = "No hay Access Token configurado" });

                  var request = new PreferenceRequest
                  {
                      Items = new List<PreferenceItemRequest>
              {
                  new PreferenceItemRequest
                  {
                      Title = "Test Swagger",
                      Quantity = 1,
                      CurrencyId = "ARS",
                      UnitPrice = 100m
                  }
              }
                  };

                  var client = new PreferenceClient();
                  var pref = await client.CreateAsync(request, new RequestOptions { AccessToken = token });

                  return Ok(new { pref.Id, pref.InitPoint });
              }
              catch (Exception ex)
              {
                  // Temporal: para diagnóstico local, así ves el motivo real
                  return StatusCode(500, new { message = ex.ToString() });
              }
          }
  */
        [Authorize]
        [HttpPost("Auth")]
        public async Task<IActionResult> ConnectMercadoPago()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var usuarioId = Guid.Parse(userIdClaim);

            var responseUrl = await _connectMP.ConnectMercadoPagoAuth (usuarioId);
            //return Ok(responseUrl);
            return Ok(new { Url = responseUrl });
        }

      
        


        [HttpGet("Callback")]
        public async Task<IActionResult> MercadoPagoCallback([FromQuery] string code, [FromQuery] string state)
        {
            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
                return Redirect("https://tienda-de-productos-ivory.vercel.app/login?mp_error=missing_params");

            try
            {
                await _mercadoPagoCallback.Execute(code, state);
                return Redirect("https://tienda-de-productos-ivory.vercel.app/admin?mp_connected=1");
            }
            catch (Exception ex)
            {
                var detail = Uri.EscapeDataString(ex.Message);
                return Redirect($"https://tienda-de-productos-ivory.vercel.app/login?mp_error=oauth&detail={detail}");
            }
        }
        /*[HttpGet("Callback")]
        public async Task<IActionResult> MercadoPagoCallback([FromQuery] string code, [FromQuery] string state)
        {
            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
            {
                return Redirect("https://tienda-de-productos-ivory.vercel.app/login");
            }

            try
            {
                await _mercadoPagoCallback.Execute(code, state);
                return Redirect("https://tienda-de-productos-ivory.vercel.app/admin?mp_connected=1");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🛑 ERROR EN CALLBACK: {ex.Message}");

                if (ex.Message.Contains("ya usado") || ex.Message.Contains("inválido"))
                {
                    return Redirect("https://tienda-de-productos-ivory.vercel.app/login");
                }

                return Redirect($"https://vercel.app{Uri.EscapeDataString(ex.Message)}");
            }
        }*/



    }



}
