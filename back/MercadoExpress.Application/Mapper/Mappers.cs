using AutoMapper;
using MercadoExpress.Application.DTO.Orden;
using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.DTO.Usuario;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.Mapper
{
    public class Mappers : Profile
    {
        public Mappers()
        {
            CreateMap<RegisterDtoRequest, Usuario>().ReverseMap()// aca el RegisterDtoRequest seria origen por que viene del front o por que al ser ida y vuelta con ReverseMap 
              .ForMember(dest => dest.Password, opt => opt.Ignore());

            CreateMap<AddProductoRequest, Producto>()
     .ForMember(dest => dest.IMG, opt => opt.Ignore())
     .ForMember(dest => dest.CategoriaId, opt => opt.Ignore()) // Lo manejamos a mano en el caso de uso
     .ForMember(dest => dest.UsuarioId, opt => opt.Ignore());  // Lo manejamos a mano o con el token


            CreateMap<Usuario, LoginDtoResponse>()
          .ForMember(dest => dest.Mail, opt => opt.MapFrom(src => src.Mail));


            CreateMap<Producto, UpdateProductResponse>()
    .ForMember(dest => dest.NameCategoria, opt => opt.MapFrom(src => src.Categoria.Name));

            CreateMap<Producto, GetProductResponse>()
                .ForMember(dest => dest.CategoriaName, opt => opt.MapFrom(src => src.Categoria.Name));

            CreateMap<OrdenDtoRequest, Orden>()
             .ForMember(dest => dest.Detalles, opt => opt.Ignore());

        }
    }
}
