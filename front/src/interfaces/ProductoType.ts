



export interface ProductDtoRequest{
    id: string, 
    name: string,
    description: string,
    price: number,
    img: string,
    images: string[],
    stock: number,
    categoriaName: string,
    usuarioId: string,
    phoneSeller: string;
    imgSeller: string;
    nameSeller: string;
}

