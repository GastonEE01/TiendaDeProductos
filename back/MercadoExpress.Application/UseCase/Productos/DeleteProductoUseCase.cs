using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Productos
{
    public class DeleteProductoUseCase
    {
        private readonly IProductoRepository _productoRepository;

        public DeleteProductoUseCase(IProductoRepository productoRepository)
        {
            _productoRepository = productoRepository;
        }

        public async Task<DeleteProductResponse> DeleteProducto(Guid id)
        {
            Producto searchProduct = await _productoRepository.GetProductoById(id);
            if (searchProduct == null) throw new KeyNotFoundException("No se encontro el producto");

            await _productoRepository.Delete(searchProduct);
            return new DeleteProductResponse
            { Message = "Producto eliminado."};

            

        }
            
    }
}
