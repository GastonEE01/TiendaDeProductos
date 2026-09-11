import { ProductDtoRequest } from "../interfaces/ProductoType";
import {
  RegisterDtoRequest,
  LoginDtoRequest,
  LoginDtoResponse,
} from "../interfaces/UsuarioType";

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
}

// Usuario
export const register = async (
  credentials: RegisterDtoRequest,
): Promise<ApiResponse> => {
  const rest = await fetch(`${API_URL}/api/Registro`, {
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
): Promise<ApiResponse> => {
  const rest = await fetch(`${API_URL}/api/Producto/Update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
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

