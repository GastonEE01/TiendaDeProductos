using AutoMapper;
using MercadoExpress.Application.DTO.Orden;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Ordenes
{
    public class AddOrdenUseCase
    {
        private readonly IOrdenRepository _ordenRepository;
        private readonly IProductoRepository _productRepository;
        private readonly IMapper _mapper;

        public AddOrdenUseCase(IOrdenRepository ordenRepository, IProductoRepository productRepository, IMapper mapper)
        {
            _ordenRepository = ordenRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<OrdenDtoResponse> AddOrden(OrdenDtoRequest dto)
        {
            if (string.IsNullOrEmpty(dto.CustomerName)) throw new ArgumentException("El nombre es obligatorio");
            if (string.IsNullOrEmpty(dto.CustomerEmail)) throw new ArgumentException("El email es obligatorio");
            if (dto.CustomerPhone.ToString().Length < 10) throw new ArgumentException("Ingrese su telefono completo");
            if (string.IsNullOrEmpty(dto.CustomerAddress)) throw new ArgumentException("La direcion es obligatorio");
            if ((dto.DeliveryMethod != "presencial") && dto.DeliveryMethod != "domicilio") throw new ArgumentException("Elija una opcion");
            if (string.IsNullOrEmpty(dto.City)) throw new ArgumentException("La ciudad es obligatorio");
            if (string.IsNullOrEmpty(dto.PostalCode)) throw new ArgumentException("El codigo postal es obligatorio");

            decimal totalGeneral = 0;
            var detallesDeLaOrden = new List<DetalleOrden>();
            foreach (var item in dto.Items)
            {
                Producto searchProduct = await _productRepository.GetProductoById(item.ProductId);
                if (searchProduct == null) throw new KeyNotFoundException("No se encontro el producto");
                if (searchProduct.Stock < item.Quantity) throw new InvalidOperationException("No hay sufiente stock para hacer la operacion");

                searchProduct.Stock -= item.Quantity;

                await _productRepository.Update(searchProduct);
                totalGeneral += item.Quantity * searchProduct.Price;

                var detalleOrden = new DetalleOrden
                {
                    Id = Guid.NewGuid(),
                    ProductoId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = searchProduct.Price,
                    Producto = searchProduct,
                    
                };
                detallesDeLaOrden.Add(detalleOrden);
            }

            var orden = _mapper.Map<Orden>(dto);

            orden.Detalles = detallesDeLaOrden;

            // comision de la plataforma 3%
            decimal commissionAmount = (totalGeneral * 3) / 100;
            decimal dineroAdmin = totalGeneral - commissionAmount;

            orden.Total = totalGeneral;
            orden.CommissionAmount = commissionAmount;
            orden.SellerAmount = dineroAdmin;
            orden.State = "Pending";
            orden.CreationDate = DateTime.UtcNow;
            orden.CommissionPercentage = 3;


            await _ordenRepository.Add(orden);
            var response = new OrdenDtoResponse
            {
                Message = "Pedido completado"
            };
            return response;
                }
            }

        
    }

