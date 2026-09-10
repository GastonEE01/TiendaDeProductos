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
    public class UpdateProductoUseCase
    {
        public readonly IProductoRepository _productoRepository;

        public readonly IMapper _mapper;


        public UpdateProductoUseCase(IProductoRepository productoRepository, IMapper mapper)
        {
            _productoRepository = productoRepository;
            _mapper = mapper;
        }

        public async Task<UpdateProductResponse> UpdateProducto(UpdateProductoDtoRequest dto)
        {
            Producto searchProduct = await _productoRepository.GetProductoById(dto.Id);
            if (searchProduct == null) throw new KeyNotFoundException("No se encontro el producto");

            if (!string.IsNullOrEmpty(dto.Name)) searchProduct.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Description)) searchProduct.Description = dto.Description;
            if (dto.Price.HasValue) searchProduct.Price = dto.Price.Value;
            if (!string.IsNullOrEmpty(dto.IMG)) searchProduct.IMG = dto.IMG;
            if (dto.Stock.HasValue) searchProduct.Stock = dto.Stock.Value;
            if (!string.IsNullOrEmpty(dto.NameCategoria)) searchProduct.Categoria.Name = dto.NameCategoria;

            await _productoRepository.Update(searchProduct); 

            UpdateProductResponse response = _mapper.Map<UpdateProductResponse>(searchProduct);
            response.Message = "Producto actualizado.";
            return response;

        }
    }
    }
