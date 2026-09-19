using MercadoExpress.Application.UseCase.Notificaciones;
using MercadoExpress.Application.UseCase.Productos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class NotificacionController : ControllerBase
    {
        private readonly GetNotificacionUserAdminUseCase _getNotificacionUserAdmin;
        private readonly MarkNotificationsReadUseCase _markNotificationsRead;
        public NotificacionController(GetNotificacionUserAdminUseCase getNotificacionUserAdmin, MarkNotificationsReadUseCase markNotificationsRead)
        {
            _getNotificacionUserAdmin = getNotificacionUserAdmin;
            _markNotificationsRead = markNotificationsRead;
        }

        [HttpGet("GetNotificacionAdmin")]
        public async Task<IActionResult> GetNotificacionUserAdmin()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var usuarioId = Guid.Parse(userIdClaim);
            var notificaciones = await _getNotificacionUserAdmin.GetNotificacionesVendedor(usuarioId);

            return Ok(notificaciones);
        }

        [Authorize]
        [HttpPut("MarkNotificationsRead")]
        public async Task<IActionResult> MarcarComoLeidas()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var usuarioId = Guid.Parse(userIdClaim);

            var resultMessage = _markNotificationsRead.MarkNotificationsRead(usuarioId);

            return Ok(new { Message = resultMessage });
        }

    }
}
