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
    public class AddProductoUseCase
    {
        public readonly IMapper _mapper;
        public readonly IProductoRepository _productoRepository;
        public readonly ICategoriaRepository _categoriaRepository;

        public AddProductoUseCase(IMapper mapper, IProductoRepository productoRespository, ICategoriaRepository categoriaRepository)
        {
            _mapper = mapper;
            _productoRepository = productoRespository;
            _categoriaRepository = categoriaRepository;
        }

        public async Task<AddProductoResponse> AddProducto(AddProductoRequest dto)
        {

            if (string.IsNullOrEmpty(dto.Name)) throw new ArgumentException("Ingrese el nombre del producto");
            if (string.IsNullOrEmpty(dto.Description)) throw new ArgumentException("Ingrese la descripcion del producto");
            if (dto.Price == 0) throw new ArgumentException("Ingrese el precio del producto");
            if (string.IsNullOrEmpty(dto.CategoriaName)) throw new ArgumentException("Ingrese la categoria del producto");
            if (dto.Stock == 0) throw new ArgumentException("Ingrese el stock del producto");
            if (string.IsNullOrEmpty(dto.IMG)) throw new ArgumentException("Suba una IMG del producto");


            // 1. Mapeas el producto básico con AutoMapper
            Producto product = _mapper.Map<Producto>(dto);

            // 2. Buscas o creas la categoría por su nombre (lógica de negocio)
            var categoria = await _categoriaRepository.GetByName(dto.CategoriaName);
            if (categoria == null)
            {
                categoria = new Categoria { Name = dto.CategoriaName };
                await _categoriaRepository.AddAsync(categoria);
            }

            // 3. Conectas las relaciones manualmente para asegurar que no falte nada
            product.CategoriaId = categoria.Id;
            product.UsuarioId = dto.UsuarioId; // O lo sacas directamente del Token del usuario logueado


            await _productoRepository.Add(product);

            return new AddProductoResponse
            {
                Message = "Producto agregado."
            };

        }
    }
}
