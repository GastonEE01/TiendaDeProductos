import { ProductDtoRequest } from "./ProductoType";

export interface CartItem extends ProductDtoRequest{
  quantity: number;
}

export interface CartItemDto {
  productId: string;
  quantity: number;
}

export interface CartState {
  cart: CartItem[];
  addToCart: (product: ProductDtoRequest, quantity: number) => void;
  clearCart: () => void;
}
