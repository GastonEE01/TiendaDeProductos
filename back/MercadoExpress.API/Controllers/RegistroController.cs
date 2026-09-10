using MercadoExpress.Application.DTO.Usuario;
using MercadoExpress.Application.UseCase.Usuarios;
using Microsoft.AspNetCore.Mvc;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroController : ControllerBase
    {
        private readonly RegisterUserUseCase _registerUserUseCase;

        public RegistroController(RegisterUserUseCase registerUserUseCase)
        {
            _registerUserUseCase = registerUserUseCase;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDtoRequest dto)
        {
            var response = await _registerUserUseCase.AddUser(dto);
            return Ok(response);
        }
    }
}
