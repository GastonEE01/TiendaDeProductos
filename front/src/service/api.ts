import { ProductDtoRequest } from "../interfaces/ProductoType";
import {
  LoginDtoRequest,
  LoginDtoResponse,
} from "../interfaces/UsuarioType";
import { OrdenDtoRequest,OrdenResponseData } from "../interfaces/OrdenType";
import { NotificacionDtoResponse } from "../interfaces/NotificacionType"
import { CustomerPurchasesDtoResponse } from "../interfaces/CartType"
const API_URL = import.meta.env.VITE_API_URL;

export interface ApiResponse<T = void> {
  message: string;
  data?: T;
}

export interface UpdateProductRequest {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  nameCategoria: string;
  img: File | null;
}

export interface UpdateProductResponse extends ApiResponse {
  img?: string;
}

// Usuario
export const register = async (
  credentials: FormData,
): Promise<ApiResponse> => {
  const rest = await fetch(`${API_URL}/api/Registro`, {
    method: "POST",
    body: credentials,
  });

  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }

  console.log(rest);

  return rest.json();
};

export const login = async (
  credentials: LoginDtoRequest,
): Promise<LoginDtoResponse & ApiResponse> => {
  const rest = await fetch(`${API_URL}/api/Login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }
  console.log(rest);
  return rest.json();
};

export const updatePerfil = async (
  credentials: FormData,
): Promise<LoginDtoResponse & ApiResponse> => {
  const token = localStorage.getItem("token");

  const rest = await fetch(`${API_URL}/Api/User/Update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: credentials,
  });

  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }

  console.log(rest);

  return rest.json();
};


export const conectAuhtMP = async (token: string): Promise<any> => {
  const rest = await fetch(`${API_URL}/Api/MercadoPago/Auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }//,
   // body: token,
  });
// boton En el front, en el click del botón, hacés window.location.href = data.url.

  const responseData = await rest.json().catch(() => ({}));
  if (!rest.ok) {
    const validationMessage = responseData.errors
      ? Object.values(responseData.errors).flat().join(" ")
      : undefined;
    const messageError =
      validationMessage ||
      responseData.Message ||
      responseData.message ||
      responseData.title ||
      "Error al agregar el producto";
    throw new Error(messageError);
  }
  return responseData;
};

// Producto
export const addProduct = async (
  credentials: FormData,
): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");

  const rest = await fetch(`${API_URL}/api/Producto/Add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: credentials,
  });

  const responseData = await rest.json().catch(() => ({}));
  if (!rest.ok) {
    const validationMessage = responseData.errors
      ? Object.values(responseData.errors).flat().join(" ")
      : undefined;
    const messageError =
      validationMessage ||
      responseData.Message ||
      responseData.message ||
      responseData.title ||
      "Error al agregar el producto";
    throw new Error(messageError);
  }
  return responseData;
};

export const getProducts = async (): Promise<ProductDtoRequest[]> => {
  const token = localStorage.getItem("token");
  const rest = await fetch(`${API_URL}/api/Producto/GetProduct`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }
  console.log(rest);
  return rest.json();
};

export const getProductsSeller = async (): Promise<ProductDtoRequest[]> => {
  const token = localStorage.getItem("token");
  const rest = await fetch(`${API_URL}/api/Producto/GetProductSeller`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }
  console.log(rest);
  return rest.json();
};


export const deleteProduct = async ( id: String): Promise< ApiResponse > => {
  const token = localStorage.getItem("token");
const rest = await fetch(`${API_URL}/api/Producto/Delete${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }
  console.log(rest);
  return rest.json()
}


export const updateProduct = async (
  credentials: UpdateProductRequest,
): Promise<UpdateProductResponse> => {
  const productData = new FormData();

  productData.append("Id", credentials.id);
  productData.append("Name", credentials.name);
  productData.append("Description", credentials.description);
  productData.append("Price", String(credentials.price));
  productData.append("Stock", String(credentials.stock));
  productData.append("NameCategoria", credentials.nameCategoria);

  if (credentials.img instanceof File) {
    productData.append("IMG", credentials.img);
  }

  const rest = await fetch(`${API_URL}/api/Producto/Update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: productData,
  });

  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }

  console.log(rest);

  return rest.json();
};


// Oden
export const addOrden = async (
  credentials: OrdenDtoRequest,): Promise<ApiResponse<OrdenResponseData>> => {
  //const token = localStorage.getItem("token");
  const rest = await fetch(`${API_URL}/Api/Orden/Add`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
         body: JSON.stringify(credentials),

  });

    if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }
  console.log(rest);
  return rest.json();
    
}

export const getNotificacionesAdmin = async (): Promise<NotificacionDtoResponse[]> => {
  const token = localStorage.getItem("token"); // Ajustalo a cómo recuperás tu JWT
  const rest = await fetch(`${API_URL}/Api/Notificacion/GetNotificacionAdmin`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}` // Crucial para que .NET lea el Claim
    },
  });

  if (!rest.ok) {
    throw new Error("No se pudieron cargar las notificaciones");
  }

  return rest.json();
};

export const MarkNotificationsRead = async (): Promise<void> => {
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/Api/Notificacion/MarkNotificationsRead`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
};

export const GetCustomerCartClient = async (email: string): Promise<CustomerPurchasesDtoResponse[]> => {
  const rest = await fetch(`${API_URL}/Api/Orden/GetCustomerCartClient/${email}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!rest.ok) {
    throw new Error("No se pudieron cargar las compras");
  }

  return rest.json();
};

export const updateOrdenShipped = async (
  ordenId: string,
): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");

  const rest = await fetch(`${API_URL}/Api/Orden/OrdenShipped/${ordenId}`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}`

    },
  });

  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }

  console.log(rest);

  return rest.json();
};

export const updateOrdenDelivered = async (
  ordenId: string,email: string
): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");

  const rest = await fetch(`${API_URL}/Api/Orden/UpdateOrdenDelivered/${ordenId}/${email}`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}`

    },
  });

  if (!rest.ok) {
    const errorData = await rest.json().catch(() => ({}));
    const messageError = errorData.Message || errorData.message;
    throw new Error(messageError);
  }

  console.log(rest);

  return rest.json();
};
