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
    public class GetProductoUseCase
    {
        public readonly IProductoRepository _productoRepository;
        public readonly IMapper _mapper;

        public GetProductoUseCase(IProductoRepository productoRespository, IMapper mapper)
        {
            _productoRepository = productoRespository;
            _mapper = mapper;
        }
        public async Task<List<GetProductResponse>> GetProduts()
        {
            List<Producto> products = await _productoRepository.GetAll();
            return _mapper.Map<List<GetProductResponse>>(products);
        }
    }
}
