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
    public class GetProductoVendedorUseCase
    {
        private readonly IProductoRepository _productoRepository;

        public GetProductoVendedorUseCase(IProductoRepository productoRepository)
        {
            _productoRepository = productoRepository;
        }
        public async Task<List<Producto>> GetProductosVendedor(Guid usuarioId)
        {
            return await _productoRepository.GetProductVendedor(usuarioId);


        }
    }
}
