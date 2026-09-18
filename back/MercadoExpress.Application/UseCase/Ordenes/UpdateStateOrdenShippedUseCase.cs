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
    public class UpdateStateOrdenShippedUseCase
    {
        private readonly IOrdenRepository _ordenRepository;

        public UpdateStateOrdenShippedUseCase(IOrdenRepository ordenRepository)
        {
            _ordenRepository = ordenRepository;
        }

        public async Task<UpdateStateOrdenShippedResponse> UpdateStateOrdenShipped(Guid ordenId)
        {
            Orden searchOrden = await _ordenRepository.GetOrdenById(ordenId);

            if (searchOrden == null) throw new KeyNotFoundException("No se encontro la orden para enviar");

            searchOrden.State = "Shipped";

            await _ordenRepository.SaveChangesAsync();

            return new UpdateStateOrdenShippedResponse
            {
                Message = "El producto ya fue enviado.",
            };


        }

    }
}
