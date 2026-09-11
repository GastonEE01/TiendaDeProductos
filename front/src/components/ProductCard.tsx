import { ProductDtoRequest } from "../interfaces/ProductoType";

interface ProductCardProps {
  product: ProductDtoRequest;
  onDelete: (id: string) => void;
  onEdit: (product: ProductDtoRequest) => void;
}

export const ProductCard = ({ product,onDelete,onEdit }: ProductCardProps) => {
  return (
   <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Precio: {product.price}</p>
      <p>Stock: {product.stock}</p>
      <button onClick={() => onDelete(product.id)}>Eliminar</button>
      <button onClick={() => onEdit(product)}>Editar</button>

    </div>
  )
}
