export interface RequestRegis {
    username: string;
    password: string;
    usertype: string;
    incharge?: string;
    email?: string;
    tel?: string;
    textid?: string;
    fax?: string;
    address?: string;
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
    confirmPassword: string;
}

export interface CrCalendar {
    cldYear: string;
    cldMonth: string;
    dateStart: string;
    dateEnd: string;
    cldType: string;
    crBy: string;
}

export interface UserInfo {
    username: string;
}

export interface RejectVdInfo {
    username: string;
    remark: string;
}

export interface CrdVenderinfo {
    username: string;
    name: string;
    compname: string;
    email: string;
    taxID: string;
    branchno: string;
    fax: string;
    telephone: string;
    address: string;
    accountname: string;
    accountno: string;
    bName: string;
    bBranchname: string;
    bBranchno: string;
}