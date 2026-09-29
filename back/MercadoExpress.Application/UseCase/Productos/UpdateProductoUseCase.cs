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
            if (dto.Id == Guid.Empty)
            {
                throw new ArgumentException("El ID del producto llegó vacío o en un formato inválido desde el Frontend.");
            }

            Producto searchProduct = await _productoRepository.GetProductoById(dto.Id);
            if (searchProduct == null) throw new KeyNotFoundException("No se encontro el producto");

            if (!string.IsNullOrEmpty(dto.Name)) searchProduct.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Description)) searchProduct.Description = dto.Description;
            if (dto.Price.HasValue) searchProduct.Price = dto.Price.Value;
            if (!string.IsNullOrEmpty(dto.ImgPath)) searchProduct.IMG = dto.ImgPath;
            if (dto.Stock.HasValue) searchProduct.Stock = dto.Stock.Value;
            if (!string.IsNullOrEmpty(dto.CategoriaName)) searchProduct.Categoria.Name = dto.CategoriaName;

            await _productoRepository.Update(searchProduct); 

            UpdateProductResponse response = _mapper.Map<UpdateProductResponse>(searchProduct);
            response.IMG = !string.IsNullOrEmpty(dto.ImgPath) ? dto.ImgPath : searchProduct.IMG;
            response.Id = searchProduct.Id;

            response.Message = "Producto actualizado.";
            return response;

        }
    }
    }
