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
    public class UpdateOrdenDeliveredUseCase
    {
        private readonly IOrdenRepository _ordenRepository;

        public UpdateOrdenDeliveredUseCase(IOrdenRepository ordenRepository)
        {
            _ordenRepository = ordenRepository;
        }

        public async Task<UpdateOrdenDeliveredDtoResponse> UpdateOrdenDelivered(Guid ordenId, string email)
        {
            Orden searchOrden = await _ordenRepository.GetOrdenById(ordenId);

            if (searchOrden == null ) throw new KeyNotFoundException("No se encontro la orden para enviar");
            if (searchOrden.CustomerEmail != email) throw new UnauthorizedAccessException("No tienes permisos para confirmar");

            if (searchOrden.State != "Shipped") throw new InvalidOperationException("No puedes marcar como recibida una orden que no esta en camino");

            searchOrden.State = "Delivered";

            await _ordenRepository.SaveChangesAsync();

            return new UpdateOrdenDeliveredDtoResponse
            {
                Message = "¡Recepcion confirmada! El pedido fue marcado como entregado con éxito."
            };
        }
    }
}
