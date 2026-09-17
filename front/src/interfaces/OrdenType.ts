import { CartItemDto } from "./CartType";

export interface OrdenDtoRequest{
customerName: string,
customerEmail: string,
customerPhone: number,
deliveryMethod: string,
customerAddress: string,
city: string,
postalCode: string,
 items: CartItemDto[]; 
}

export interface OrdenResponseData {
  paymentUrl: string;
  preferenceId: string;
  // Si en el futuro querés mandar más datos (como el ID de la orden), los agregás acá
}
