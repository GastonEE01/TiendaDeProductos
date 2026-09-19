using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.DTO.Usuario;
using MercadoExpress.Application.Interface;
using MercadoExpress.Application.UseCase.Productos;
using MercadoExpress.Application.UseCase.Usuarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly UpdateUserUseCase _updateUserUseCase;

        public UserController(UpdateUserUseCase updateUserUseCase)
        {
            _updateUserUseCase = updateUserUseCase;
        }

        [Authorize]
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateProfileUser([FromForm] UpdateUserDtoRequest dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var usuarioId = Guid.Parse(userIdClaim);

            if (dto.IMG is not null && dto.IMG.Length > 0)
            {
                var uploadsPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads",
                    "products");
                Directory.CreateDirectory(uploadsPath);

                var extension = Path.GetExtension(dto.IMG.FileName).ToLowerInvariant();
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                if (!allowedExtensions.Contains(extension))
                    throw new ArgumentException("La IMG debe ser JPG, JPEG, PNG o WEBP");

                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsPath, fileName);
                await using (var stream = System.IO.File.Create(filePath))
                {
                    await dto.IMG.CopyToAsync(stream);
                }

                dto.ImgPath = $"/uploads/products/{fileName}";
            }

            var response = await _updateUserUseCase.UpdateUser(usuarioId,dto);
            return Ok(response);
        }
    }
}
