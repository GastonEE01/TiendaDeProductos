using AutoMapper;
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
        private readonly IMapper _mapper;

        public GetProductoVendedorUseCase(IProductoRepository productoRepository, IMapper mapper)
        {
            _productoRepository = productoRepository;
            _mapper = mapper;
        }
        public async Task<List<UpdateProductResponse>> GetProductosVendedor(Guid usuarioId)
        {
            var products = await _productoRepository.GetProductVendedor(usuarioId);
            return _mapper.Map<List<UpdateProductResponse>>(products);

        }
    }
}
