using MercadoExpress.Application.DTO.Notificacion;
using MercadoExpress.Application.Interface;
using MercadoExpress.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Application.UseCase.Notificaciones
{
    public class GetNotificacionUserAdminUseCase
    {
        private readonly INotificacionRepository _notificacionRepository;

        public GetNotificacionUserAdminUseCase(INotificacionRepository notificacionRepository)
        {
            _notificacionRepository = notificacionRepository;
        }

        public async Task<List<NotificacionDtoResponse>> GetNotificacionesVendedor(Guid usuarioId)
        {
            var notificaciones = await _notificacionRepository.GetNotificacionVendedor(usuarioId);

            var resultadoDto = notificaciones.Select(n => new NotificacionDtoResponse
            {
                Id = n.Id,
                Message = n.Message,
                State = n.State,
                CreationDate = n.CreationDate,
                OrderState = n.Orden?.State ?? string.Empty,
                OrdenId = n.OrdenId,
                CustomerName = n.Orden?.CustomerName ?? string.Empty,
                CustomerAddress = n.Orden?.CustomerAddress ?? string.Empty,
                CustomerPhone = n.Orden?.CustomerPhone ?? string.Empty,
                Total = n.Orden?.Total ?? 0,

                // Mapeamos la sublista de productos de forma segura
                Productos = n.Orden?.Detalles.Select(d => new NotificacionProductoDto
                {
                    Id = d.Id,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice,
                    Name = d.Producto?.Name ?? string.Empty,
                    Img = d.Producto?.IMG ?? string.Empty 
                }).ToList() ?? new List<NotificacionProductoDto>()
            }).ToList();

            return resultadoDto;


        }
    }
}
