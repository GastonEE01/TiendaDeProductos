import {RegisterDtoRequest, LoginDtoRequest,LoginDtoResponse} from '../interfaces/UsuarioType'


const API_URL = import.meta.env.VITE_API_URL;

export interface ApiResponse<T = void>{
    message: string;
    data?: T;
}

// Usuario
export const register = async (credentials : RegisterDtoRequest,) : Promise<ApiResponse> =>  {
    const rest = await fetch(`${API_URL}/api/Registro`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(credentials),  
    });

    if(!rest.ok){
        const errorData = await rest.json().catch(() => ({}));
        const messageError = errorData.Message || errorData.message ;
    throw new Error(messageError);
    }

    console.log(rest);

    return rest.json();
};

export const login = async (credentials : LoginDtoRequest,) : Promise<LoginDtoResponse & ApiResponse> =>  {
    const rest = await fetch(`${API_URL}/api/Login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(credentials),  
    });

    if(!rest.ok){
        const errorData = await rest.json().catch(() => ({}));
        const messageError = errorData.Message || errorData.message ;
    throw new Error(messageError);
    }
    return rest.json();
};