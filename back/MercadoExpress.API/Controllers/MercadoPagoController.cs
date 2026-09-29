using MercadoExpress.Application.DTO.MercadoPago;
using MercadoExpress.Application.UseCase.MercadoPagos;
using MercadoPago.Client;
using MercadoPago.Client.Payment;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class MercadoPagoController : ControllerBase
    {
        private readonly ConnectMercadoPagoUseCase _connectMP;
        private readonly MercadoPagoCallbackUseCase _mercadoPagoCallback;
        private readonly ProcessMercadoPagoWebhookUseCase _processWebhookUseCase;
        public MercadoPagoController(ConnectMercadoPagoUseCase connectMP, MercadoPagoCallbackUseCase mercadoPagoCallback, ProcessMercadoPagoWebhookUseCase processWebhookUseCase)
        {
            _connectMP = connectMP;
            _mercadoPagoCallback = mercadoPagoCallback;
            _processWebhookUseCase = processWebhookUseCase;
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

                var pref = await client.CreateAsync(request, new RequestOptions { AccessToken = token });

                return Ok(new
                {
                    PreferenceId = pref.Id,
                    PaymentUrlSandbox = pref.SandboxInitPoint,
                    PaymentUrlProdLike = pref.InitPoint
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        [Authorize]
        [HttpPost("Auth")]
        public async Task<IActionResult> ConnectMercadoPago()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var usuarioId = Guid.Parse(userIdClaim);

            var responseUrl = await _connectMP.ConnectMercadoPagoAuth(usuarioId);
            return Ok(new { Url = responseUrl });
        }

        [AllowAnonymous]
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


        [HttpPost("mp/split-order-test")]
        public async Task<IActionResult> SplitOrderTest([FromBody] SplitOrderTestRequest dto)
        {
            var carts = new[]
            {
        new {
            Seller = "A",
            Token = dto.SellerATestAccessToken,
            Items = new List<PreferenceItemRequest> {
                new PreferenceItemRequest { Title="Item vendedor A", Quantity=1, CurrencyId="ARS", UnitPrice=100m }
            }
        }
    };
            var client = new PreferenceClient();
            var result = new List<object>();

            foreach (var c in carts)
            {
                decimal? totalNullable = c.Items.Sum(i => (decimal?)(i.UnitPrice * i.Quantity));
                decimal total = totalNullable ?? 0m;
                decimal fee = Math.Round(total * 0.03m, 2);

                var request = new PreferenceRequest
                {
                    Items = c.Items
                };

                var pref = await client.CreateAsync(
                    request,
                    new RequestOptions { AccessToken = c.Token }
                );

                result.Add(new
                {
                    seller = c.Seller,
                    preferenceId = pref.Id,
                    total,
                    marketplaceFee = fee,
                    paymentUrlSandbox = pref.SandboxInitPoint,
                    paymentUrlProdLike = pref.InitPoint
                });
            }
            return Ok(new
            {
                message = $"Se generaron {result.Count} preferencias (una por vendedor).",
                pagos = result
            });
        }

        /*[AllowAnonymous]
        [HttpPost("Webhook")]
        public async Task<IActionResult> MercadoPagoWebhook([FromQuery] string type, [FromQuery] long? data_id)
        {
            if (string.IsNullOrEmpty(type) || !data_id.HasValue)
            {
                return BadRequest("Parámetros de notificación inválidos o incompletos.");
            }
            try
            {
                await _processWebhookUseCase.Execute(type, data_id.Value);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error interno procesando Webhook de MP: {ex.Message}");
                return Ok(new { error = "Processed with internal logging" });
            }
        }*/

        [AllowAnonymous]
        [HttpPost("Webhook")]
        public async Task<IActionResult> MercadoPagoWebhook([FromBody] JsonElement body)
        {
            try
            {
                // 🕵️‍♂️ PESCAMOS LOS DATOS DESDE EL BODY (Como lo manda Mercado Pago de verdad)
                string? type = body.TryGetProperty("type", out var tProp) ? tProp.GetString() : null;

                long? dataId = null;
                if (body.TryGetProperty("data", out var dataProp) && dataProp.TryGetProperty("id", out var idProp))
                {
                    // Mercado Pago manda el ID como un string numérico o un número directo en el JSON
                    if (idProp.ValueKind == JsonValueKind.String)
                    {
                        if (long.TryParse(idProp.GetString(), out long parsedId)) dataId = parsedId;
                    }
                    else if (idProp.ValueKind == JsonValueKind.Number)
                    {
                        dataId = idProp.GetInt64();
                    }
                }

                // 🛡️ Filtro de seguridad: Si no es un pago, respondemos 200 y salimos rápido sin romper nada
                if (string.IsNullOrEmpty(type) || type.ToLower().Trim() != "payment" || !dataId.HasValue)
                {
                    Console.WriteLine("===> WEBHOOK: Se recibió una notificación automática que no es de pagos o está vacía.");
                    return Ok();
                }

                // 🚀 MANDAMOS LOS DATOS LIMPIOS AL USECASE DE SIEMPRE
                await _processWebhookUseCase.Execute(type.ToLower().Trim(), dataId.Value);

                return Ok(); // Todo salió impecable
            }
            catch (Exception ex)
            {
                Console.WriteLine($"===> ERROR CRÍTICO PROCESANDO WEBHOOK EN AZURE: {ex.Message}");

                // 🚨 SEGUIMOS EL CONSEJO SENIOR: Si el backend explotó de verdad por un nulo o base de datos, 
                // devolvemos un Error 500 para que Mercado Pago sepa que falló y nos vuelva a mandar la notificación más tarde.
                return StatusCode(500, new { message = "Error interno en el servidor", details = ex.Message });
            }
        }
    }



}




