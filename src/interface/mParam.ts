export interface RequestRegis {
    username: string;
    password: string;
    fname: string;
    lname: string;
    role: string;
}

export interface GetToken {
    username: string;
    password: string;
}

export interface Login {
    username: string;
    password: string;
    token: string;
}