using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.UseCase.Productos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        public readonly AddProductoUseCase _addProductoUseCase;
        public readonly DeleteProductoUseCase _deleteProductoUseCase;
        public readonly UpdateProductoUseCase _updateProductoUseCase;
        public readonly GetProductoUseCase _getProductoUseCase;


        public ProductoController(AddProductoUseCase addProductoUseCase, DeleteProductoUseCase deleteProductoUseCase, UpdateProductoUseCase updateProductoUseCase, GetProductoUseCase getProductoUseCase)
        {
            _addProductoUseCase = addProductoUseCase;
            _deleteProductoUseCase = deleteProductoUseCase;
            _updateProductoUseCase = updateProductoUseCase;
            _getProductoUseCase = getProductoUseCase;
        }

        [Authorize]
        [HttpPost("Add")]
        public async Task<IActionResult> AddProducto([FromForm] AddProductoRequest dto)
        {
            if (dto.IMG == null || dto.IMG.Length == 0)
                throw new ArgumentException("Suba una IMG del producto");

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
            var response = await _addProductoUseCase.AddProducto(dto);
            return Ok(response);
        }

        [Authorize]
        [HttpDelete("Delete{id}")]
        public async Task<IActionResult> DeleteProducto(Guid id)
        {
            var response = await _deleteProductoUseCase.DeleteProducto(id);
            return Ok(response);
        }

        [Authorize]
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateProducto([FromForm] UpdateProductoDtoRequest dto)
        {
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

            var response = await _updateProductoUseCase.UpdateProducto(dto);
            return Ok(response);
        }

        [HttpGet("GetProduct")]
        public async Task<IActionResult> GetProducts()
        {
            var response = await _getProductoUseCase.GetProduts();
            return Ok(response);
        }
    }
}
