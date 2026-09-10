using MercadoExpress.Application.DTO.Usuario;
using MercadoExpress.Application.UseCase.Usuarios;
using Microsoft.AspNetCore.Mvc;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class LoginController : ControllerBase
    {
        private readonly LoginUserUseCase _loginUserUseCase;
        public LoginController(LoginUserUseCase loginUserUseCase)
        {
            _loginUserUseCase = loginUserUseCase;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDtoRequest dto)
        {
            var response = await _loginUserUseCase.Login(dto);
            return Ok(response);
        }
    }
}
