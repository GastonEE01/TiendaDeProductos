using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.UseCase.Productos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MercadoExpress.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private const int MaxImageCount = 8;
        private const long MaxImageSizeBytes = 5 * 1024 * 1024;
        private const long MaxUploadRequestSizeBytes = 41 * 1024 * 1024;
        private static readonly string[] AllowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

        public readonly AddProductoUseCase _addProductoUseCase;
        public readonly DeleteProductoUseCase _deleteProductoUseCase;
        public readonly UpdateProductoUseCase _updateProductoUseCase;
        public readonly GetProductoUseCase _getProductoUseCase;
        public readonly GetProductoVendedorUseCase _getProductoVendedorUseCase;


        public ProductoController(AddProductoUseCase addProductoUseCase, DeleteProductoUseCase deleteProductoUseCase, UpdateProductoUseCase updateProductoUseCase, GetProductoUseCase getProductoUseCase, GetProductoVendedorUseCase getProductoVendedorUseCase)
        {
            _addProductoUseCase = addProductoUseCase;
            _deleteProductoUseCase = deleteProductoUseCase;
            _updateProductoUseCase = updateProductoUseCase;
            _getProductoUseCase = getProductoUseCase;
            _getProductoVendedorUseCase = getProductoVendedorUseCase;
        }

        [Authorize]
        [HttpPost("Add")]
        [RequestSizeLimit(MaxUploadRequestSizeBytes)]
        public async Task<IActionResult> AddProducto([FromForm] AddProductoRequest dto)
        {
            dto.ImagePaths = [];
            dto.ImgPath = string.Empty;
            var images = GetImageFiles(dto.Images, dto.IMG);
            ValidateImages(images);
            dto.ImagePaths = await SaveImages(images);
            dto.ImgPath = dto.ImagePaths[0];
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
        [RequestSizeLimit(MaxUploadRequestSizeBytes)]
        public async Task<IActionResult> UpdateProducto([FromForm] UpdateProductoDtoRequest dto)
        {
            dto.ImagePaths = [];
            dto.ImgPath = string.Empty;
            var images = GetImageFiles(dto.Images, dto.IMG);
            if (images.Count > 0)
            {
                ValidateImages(images);
                dto.ImagePaths = await SaveImages(images);
                dto.ImgPath = dto.ImagePaths[0];
            }

            var response = await _updateProductoUseCase.UpdateProducto(dto);
            return Ok(response);
        }

        private static List<IFormFile> GetImageFiles(
            List<IFormFile> images,
            IFormFile? legacyImage)
        {
            var selectedImages = (images ?? []).Where(image => image.Length > 0).ToList();
            if (selectedImages.Count == 0 && legacyImage is { Length: > 0 })
            {
                selectedImages.Add(legacyImage);
            }

            return selectedImages;
        }

        private static void ValidateImages(IReadOnlyCollection<IFormFile> images)
        {
            if (images.Count == 0)
                throw new ArgumentException("Subí al menos una imagen del producto.");

            if (images.Count > MaxImageCount)
                throw new ArgumentException($"Cada producto puede tener hasta {MaxImageCount} imágenes.");

            foreach (var image in images)
            {
                if (image.Length > MaxImageSizeBytes)
                    throw new ArgumentException("Cada imagen puede pesar como máximo 5 MB.");

                var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
                if (!AllowedImageExtensions.Contains(extension))
                    throw new ArgumentException("Las imágenes deben ser JPG, JPEG, PNG o WEBP.");
            }
        }

        private async Task<List<string>> SaveImages(IReadOnlyCollection<IFormFile> images)
        {
            var uploadsPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads",
                "products");
            Directory.CreateDirectory(uploadsPath);

            var imagePaths = new List<string>(images.Count);
            foreach (var image in images)
            {
                var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                await using var stream = System.IO.File.Create(filePath);
                await image.CopyToAsync(stream);
                imagePaths.Add($"/uploads/products/{fileName}");
            }

            return imagePaths;
        }

        [HttpGet("GetProduct")]
        public async Task<IActionResult> GetProducts()
        {
            var response = await _getProductoUseCase.GetProduts();
            return Ok(response);
        }

        [Authorize]
        [HttpGet("GetProductSeller")]
        public async Task<IActionResult> GetMisProductos()
        {
            // Captura el ID del usuario autenticado desde los Claims del JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var usuarioId = Guid.Parse(userIdClaim);
            var productos = await _getProductoVendedorUseCase.GetProductosVendedor(usuarioId);

            return Ok(productos);
        }

        

    }
}
