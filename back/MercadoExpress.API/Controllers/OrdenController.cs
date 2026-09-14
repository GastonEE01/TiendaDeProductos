using MercadoExpress.Application.DTO.Orden;
using MercadoExpress.Application.UseCase.Ordenes;
using Microsoft.AspNetCore.Mvc;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class OrdenController : ControllerBase
    {
        private readonly AddOrdenUseCase _addOrden;

        public OrdenController(AddOrdenUseCase addOrden)
        {
            _addOrden = addOrden;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody] OrdenDtoRequest dto)
        {
            var response = await _addOrden.AddOrden(dto);
            return Ok(response);
        }
    }
}
