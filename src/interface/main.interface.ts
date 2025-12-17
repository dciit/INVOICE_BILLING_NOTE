export interface ContextInterface {
    appname?: string;
    style?: StyleInterface;
}

export interface StyleInterface {
    baseColorText?: string;
}

export interface ReduxInterface {
    login: boolean;
    authen: AuthenInfo
}

export interface AuthenInfo {
    username: string;
    incharge: string;
    vendername: string;
    role: string;
    pwd: string;
    token: string;
    input: string;
    login: boolean;
}