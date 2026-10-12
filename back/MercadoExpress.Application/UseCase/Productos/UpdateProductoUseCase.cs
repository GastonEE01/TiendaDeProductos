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
        private readonly ICategoriaRepository _categoriaRepository;

        public readonly IMapper _mapper;


        public UpdateProductoUseCase(
            IProductoRepository productoRepository,
            ICategoriaRepository categoriaRepository,
            IMapper mapper)
        {
            _productoRepository = productoRepository;
            _categoriaRepository = categoriaRepository;
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
            if (dto.ImagePaths.Count > 0)
            {
                searchProduct.Images.Clear();
                for (var index = 0; index < dto.ImagePaths.Count; index++)
                {
                    searchProduct.Images.Add(new ProductoImagen
                    {
                        Url = dto.ImagePaths[index],
                        SortOrder = index,
                        ProductoId = searchProduct.Id
                    });
                }
            }
            if (dto.Stock.HasValue) searchProduct.Stock = dto.Stock.Value;
            if (!string.IsNullOrWhiteSpace(dto.CategoriaName))
            {
                var categoria = await _categoriaRepository.GetByName(dto.CategoriaName.Trim());
                if (categoria == null)
                {
                    categoria = new Categoria { Name = dto.CategoriaName.Trim() };
                    await _categoriaRepository.AddAsync(categoria);
                }

                searchProduct.CategoriaId = categoria.Id;
                searchProduct.Categoria = categoria;
            }

            await _productoRepository.Update(searchProduct); 

            UpdateProductResponse response = _mapper.Map<UpdateProductResponse>(searchProduct);
            response.IMG = !string.IsNullOrEmpty(dto.ImgPath) ? dto.ImgPath : searchProduct.IMG;
            response.Id = searchProduct.Id;
            response.Images = searchProduct.Images
                .OrderBy(image => image.SortOrder)
                .Select(image => image.Url)
                .ToList();

            response.Message = "Producto actualizado.";
            return response;

        }
    }
    }
