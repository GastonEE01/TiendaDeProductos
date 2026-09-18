using AutoMapper;
using MercadoExpress.Application.DTO.Producto;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MercadoExpress.Application.DTO.Orden;

namespace MercadoExpress.Application.UseCase.Productos
{
    public class GetCustomerCartClientUseCase
    {
        public readonly IOrdenRepository _ordenRepository;

        public GetCustomerCartClientUseCase(IOrdenRepository ordenRepository)
        {

            _ordenRepository = ordenRepository;
        }

        public async Task<List<CustomerPurchasesDtoResponse>> GetCart(string email)
        {
            var comprasRaw = await _ordenRepository.GetShoppingByUserEmail(email);

            if (comprasRaw == null || !comprasRaw.Any()) throw new KeyNotFoundException($"No se encontraron compras asociadas al correo: {email}");

            var response = comprasRaw.Select(o => new CustomerPurchasesDtoResponse
            {
                Id = o.Id,
                CreationDate = o.CreationDate,
                State = o.State,
                DeliveryMethod = o.DeliveryMethod,
                Total = o.Total,

                Productos = o.Detalles.Select(d => new CustomerPurchaseItemDto
                {
                    Name = d.Producto?.Name ?? string.Empty,
                    Img = d.Producto?.IMG ?? string.Empty,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice,
                }).ToList()
            }).ToList();


            return response;
        }

    }
}