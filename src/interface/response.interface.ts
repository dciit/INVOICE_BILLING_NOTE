export interface ResLogin {
    login: any;
    result: string;
    input: string;
    pwd: string;
    username: string;
    incharge: string;
    vendername: string;
    vendercode: string;
    role: string
}

export interface BankAccount {
    accountcode: string;
    account: string;
    accountname: string;
}

export interface ResCalendar {
    cldcode: string | null,
    cldyear: string | null;
    cldmonth: string | null;
    eventtype: string;
    startdate: string;
    enddate: string
}

export interface ResTypeCalendar {
    dicttype: string,
    dictkeyno: string,
    dictrefno: string,
    dicttitle: string,
    dictvalue: string | null
}

export interface ResVenderinfo {
    VENDER: string;
    VDNAME: string;
    VDABBR: string;
    ADDR1: string;
    ADDR2: string;
    ZIPCODE: string;
    TELNO: string;
    FAXNO: string;
    TLXNO: string | null;
    STRYMN: string;
    ENDMN: string;
    POADDR1: string;
    POADDR2: string;
    POTELNO: string;
    POFAXNO: string;
    PUCONTACT: string | null;
    ACCONTACT: string | null;
    INCHARGE: string;
    CURR: string;
    PAYTRM: number;
    CLASS: string | null;
    POEMAIL: string | null;
    AIEMAIL: string | null;
    ACEMAIL: string | null;
    ACCSET: string;
    BKNO: string;
    ACCODE: string;
    BKACNO: string;
    LOCATION: string | null;
    VDTYPE: string;
    TAXCALC: string | null;
    SEKBN: string;
    HENKU: number;
    HENRES: string;
    HTANTO: string;
    CDATE: string;
    UDATE: string;
    NOTICE: string | null;
    BKCODE: string;
    BRCODE: string;
    VDNAME2: string | null;
    GACONTACT: string | null;
    GAEMAIL: string | null,
    PODCONTACT: string | null,
    PODEMAIL: string | null,
    PODINCHARGE: string | null,
    GPMAIL: string | null,
    GPBIT: string | null,
    PAYTERM_DAY: string | null,
    KAISEQ: string,
    MOTOKAI: string,
    ENDYMN: string,
    TAXID: string,
    OFFICETYPE: string,
    BRANCHNO: string,
    STOP: string,
    OWNER: string | null,
    PROPOSER: string | null,
    BANKBIT: string,
    CHKBY: string | null,
    CHKDATE: string | null,
    APVBY: string | null,
    APVDATE: string | null,
    COUNTRY: string,
    BKNAME: string | null,
    BRNAME: string | null,
    SWIFTCODE: string | null,
    IZSBIT: string | null,
    IGOMBIT: string | null,
    CFINBIT: string | null,
    DAIKINBIT: string | null,
    GLOCODE: string | null,
    WHTTYPE: string | null
}

export interface Autheninfo {
    username: string;
    usertype: string;
    companY_NAME: string;
    email: string;
    telephone: string;
    taxid: string;
    fax: string;
    compantbranch: string;
    address: string;
    accounT_NAME: string;
    accounT_NUMER: string;
    banK_NAME: string;
    bankbrancH_NAME: string;
    bankbrancH_NO: string;
}

export interface Accfromvendor {
    id: null,
    username: string;
    name: string;
    companyname: string;
    email: string;
    taxid: string;
    branchno: string;
    fax: string;
    telephone: string;
    address: string;
    accname: string;
    accno: string;
    bankname: string;
    bankbranchname: string;
    bankbranchno: string;
}