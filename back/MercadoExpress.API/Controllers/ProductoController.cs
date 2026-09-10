using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.UseCase.Productos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MercadoExpress.API.Controllers
{
    [Authorize]
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

        [HttpPost("AgregarProductos")]
        public async Task<IActionResult> AddProducto([FromBody] AddProductoRequest dto)
        {
            var response = await _addProductoUseCase.AddProducto(dto);
            return Ok(response);
        }

        [HttpDelete("EliminarProductos")]
        public async Task<IActionResult> DeleteProducto(Guid id)
        {
            var response = await _deleteProductoUseCase.DeleteProducto(id);
            return Ok(response);
        }


        [HttpPut("ActualizarProductos")]
        public async Task<IActionResult> UpdateProducto([FromBody] UpdateProductoDtoRequest dto)
        {
            var response = await _updateProductoUseCase.UpdateProducto(dto);
            return Ok(response);
        }

        [HttpGet("Productos")]
        public async Task<IActionResult> GetProducts()
        {
            var response = await _getProductoUseCase.GetProduts();
            return Ok(response);
        }
    }
}
