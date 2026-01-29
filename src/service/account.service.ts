import http from "../_configAxios";


const SummaryAllinvoice = (param: any) => {
    return http.apiAccount.post("SummaryAllinvoice", param);
}

const ReportConfirmHeader = (param: any) => {
    return http.apiAccount.post("ReportConfirmHeader", param);
}

const ReportConfirmDetail = (param: any) => {
    return http.apiAccount.post("ReportConfirmDetail", param);
}

const ReportConfirmPrint = (param: any) => {
    return http.apiAccount.post("ReportConfirmPrint", param);
}


const ConfirmBilling = (param: any) => {
    return http.apiAccount.post("ConfirmBilling", param);
}

const Rejectbilling = (param: any) => {
    return http.apiAccount.post("Rejectbilling", param);
}

const CancelBilling = (param: any) => {
    return http.apiAccount.post("CancelBilling", param);
}

const HeaderPayment = (param: any) => {
    return http.apiAccount.post("HeaderPayment", param);
}

const DetailPayment = (param: any) => {
    return http.apiAccount.post("DetailPayment", param);
}

const PaymentBilling = (param: any) => {
    return http.apiAccount.post("PaymentBilling", param);
}


const CancelPayment = (param: any) => {
    return http.apiAccount.post("CancelPayment", param);
}




export default {
    SummaryAllinvoice,
    ReportConfirmHeader,
    ReportConfirmDetail,
    ReportConfirmPrint,
    ConfirmBilling,
    Rejectbilling,
    CancelBilling,
    HeaderPayment,
    DetailPayment,
    PaymentBilling,
    CancelPayment
};