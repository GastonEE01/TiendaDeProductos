
export interface RegisterDtoRequest{
    mail: string,
    password: string
    confirmPassword: string,
    userName: string,
    aliasCBU: string,
    mercadoPagoAccessToken: string
}

export interface LoginDtoRequest{
    mail: string,
    password: string
}


export interface LoginDtoResponse{
    id: string,
    token: string,
    rol: string,
    userName: string,
    mail: string,
    aliasCBU: string,
    mercadoPagoAccessToken: string,
    img: string
}

export interface AutenticacionType{
    user: LoginDtoResponse | null;
    token: string | null;
    login: (userData: LoginDtoResponse, token: string) => void;
    logout: () => void; 
}

export interface ProfileDtoRequest{
    userName: string,
    email: string,
    mercadoPagoAccessToken: string,
    aliasCBU: string,
    img: File | null,
}