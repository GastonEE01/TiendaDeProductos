using MercadoExpress.Application.DTO.Orden;
using MercadoExpress.Application.UseCase.Ordenes;
using MercadoExpress.Application.UseCase.Productos;
using MercadoPago.Client.Preference;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class OrdenController : ControllerBase
    {
        private readonly AddOrdenUseCase _addOrden;
        public readonly GetCustomerCartClientUseCase _getCustomerCartClientUseCase;
        public readonly SimulatePaymentWebhookUseCase _simulatePaymentWebhookUseCase;
        public readonly UpdateStateOrdenShippedUseCase _updateStateOrdenShipped;
        public readonly UpdateOrdenDeliveredUseCase _updateOrdenDelivered;

        public OrdenController(AddOrdenUseCase addOrden, GetCustomerCartClientUseCase getCustomerCartClientUseCase, SimulatePaymentWebhookUseCase simulatePaymentWebhookUseCase, UpdateStateOrdenShippedUseCase updateStateOrdenShipped, UpdateOrdenDeliveredUseCase updateOrdenDelivered)
        {
            _addOrden = addOrden;
            _getCustomerCartClientUseCase = getCustomerCartClientUseCase;
            _simulatePaymentWebhookUseCase = simulatePaymentWebhookUseCase;
            _updateStateOrdenShipped = updateStateOrdenShipped;
            _updateOrdenDelivered = updateOrdenDelivered;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody] OrdenDtoRequest dto)
        {
            //var response = await _addOrden.AddOrden(dto);
            //return Ok(response);
            try
            {
                var response = await _addOrden.AddOrden(dto);
                return Ok(response);
            }
            // Captura si el SDK de Mercado Pago chilla por algún campo numérico
            catch (MercadoPago.Error.MercadoPagoException mpEx)
            {
                Console.WriteLine("🛑 EXCEPCIÓN DE MERCADO PAGO EN LA ORDEN:");
                Console.WriteLine(mpEx.Message);
                return StatusCode(500, new { Message = "Error de pasarela", Detail = mpEx.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine("🛑 ERROR GENERAL DEL BACKEND:");
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { Message = "Error interno del servidor", Detail = ex.Message });
            }
        }

        [HttpGet("GetCustomerCartClient/{email}")]
        public async Task<IActionResult> GetCustomerCartClient(string email)
        {
            var response = await _getCustomerCartClientUseCase.GetCart(email);
            return Ok(response);
        }

        [HttpPost("simulate-webhook/{preferenceId}")]
        public async Task<IActionResult> SimulateWebhook(string preferenceId)
        {
                var messageResult = await _simulatePaymentWebhookUseCase.Execute(preferenceId);
                return Ok(new { Message = messageResult });          
        }

        [Authorize]
        [HttpPut("OrdenShipped/{ordenId}")]
        public async Task<IActionResult> UpdateStateOrdenShipped(Guid ordenId)
        {
            var response = await _updateStateOrdenShipped.UpdateStateOrdenShipped(ordenId);
            return Ok(response);
        }


        [HttpPut("UpdateOrdenDelivered/{ordenId}/{email}")]
        public async Task<IActionResult> UpdateOrdenDelivered(Guid ordenId,string email)
        {
            var response = await _updateOrdenDelivered.UpdateOrdenDelivered(ordenId, email);
            return Ok(response);
        }

    }
}

    

