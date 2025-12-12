export interface RequestRegis {
    username: string;
    password: string;
    usertype: string;
    incharge: string;
    email: string;
    tel: string;
    textid: string;
    fax: string;
    address: string;
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

export interface Editpass {
    username: string;
    oldPassword: string;
    newPassword: string;
}