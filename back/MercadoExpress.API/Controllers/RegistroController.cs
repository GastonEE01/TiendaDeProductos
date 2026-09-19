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

        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterDtoRequest dto)
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
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
            var response = await _registerUserUseCase.AddUser(dto);

            return Ok(response);
        }
    }
}
