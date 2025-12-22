import http from "../_configAxios";

const getNbr = () => {
    return http.apiConfirm.get(`getNbr`);
}

const PostSearchInvoiceRequet = (param: any) => {
    return http.apiConfirm.post("PostSearchInvoiceRequet", param);
}


const PostCreateInvoice = (param: any) => {
    return http.apiConfirm.post("PostCreateInvoice", param);
}

const PostReportACAndVendorHeader = (param: any) => {
    return http.apiConfirm.post("PostReportACAndVendorHeader", param);
}

const PostReportACAndVendorDetail = (param: any) => {
    return http.apiConfirm.post("PostReportACAndVendorDetail", param);
}

const PostReceivebilling = (param: any) => {
    return http.apiConfirm.post("PostReceivebilling", param);
}


const PostReportACHeader = (param: any) => {
    return http.apiConfirm.post("PostReportACHeader", param);
}

const PostPayment = (param: any) => {
    return http.apiConfirm.post("PostPayment", param);
}

const PostReportInvoiceByAC = (param: any) => {
    return http.apiConfirm.post("PostReportInvoiceByAC", param);
}

const PostReportVendorDetailPrint = (param: any) => {
    return http.apiConfirm.post("PostReportVendorDetailPrint", param);
}


export default {
    getNbr,
    PostSearchInvoiceRequet,
    PostCreateInvoice,
    PostReportACAndVendorHeader,
    PostReportACAndVendorDetail,
    PostReceivebilling,
    PostReportACHeader,
    PostPayment,
    PostReportInvoiceByAC,
    PostReportVendorDetailPrint,
};
