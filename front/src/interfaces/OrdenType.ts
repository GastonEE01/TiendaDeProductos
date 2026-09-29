import { CartItemDto } from "./CartType";

export interface OrdenDtoRequest{
customerName: string,
customerEmail: string,
customerPhone: string,
deliveryMethod: string,
customerAddress: string,
city: string,
postalCode: string,
items: CartItemDto[]; 
}

export interface PagoPorVendedorDto {
  ordenId: string;
  vendedorId: string;
  preferenceId: string;
  paymentUrl: string;
  total: number;
}

export interface OrdenResponseData {
  message: string
  pagos: PagoPorVendedorDto[];
}
