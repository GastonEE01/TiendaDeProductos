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
