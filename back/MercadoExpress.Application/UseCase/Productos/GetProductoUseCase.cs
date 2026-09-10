using AutoMapper;
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

        public GetProductoUseCase(IProductoRepository productoRespository)
        {
            _productoRepository = productoRespository;
        }
        public async Task<List<Producto>> GetProduts()
        {
            List<Producto> products = await _productoRepository.GetAll();
            return products;
        }
    }
}
