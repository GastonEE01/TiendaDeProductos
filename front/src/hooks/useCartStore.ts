import  {create} from 'zustand';
import { persist } from 'zustand/middleware'; // Ruta exacta de middlewares
import { CartState } from '../interfaces/CartType';


export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [], // estado inicial

      addToCart: (product,quantity) => 
        set((state) => {
           const existingItemIndex = state.cart.findIndex((item) => item.id === product.id);

           if(existingItemIndex > -1){
            // si ya existe,creamos una copia del carrito y sumamos la cantidad
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += quantity;
            return { cart: newCart};
           }
            // Si NO existe, lo agregamos al carrito con la cantidad elegida
          return { cart: [...state.cart, { ...product, quantity }] };
        }),
           clearCart: () => set({cart: [] }),
        }),
        {
          name: "shopping-cart",
        }
  )
);

