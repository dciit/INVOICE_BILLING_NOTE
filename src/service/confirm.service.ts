import http from "../_configAxios";

const getNbr = () => {
    return http.apiConfirm.get(`getNbr`);
}

const getVendor = () => {
    return http.apiConfirm.get(`getVendor`);
}

const PostLoadInvoiceRequet = (param: any) => {
    return http.apiConfirm.post("PostLoadInvoiceRequet", param);
}

const PostCreateInvoice = (param: any) => {
    return http.apiConfirm.post("PostCreateInvoice", param);
}


const PostDeleteDocumentNo = (param: any) => {
    return http.apiConfirm.post("PostDeleteDocumentNo", param);
}


const PostReportVendorHeader = (param: any) => {
    return http.apiConfirm.post("PostReportVendorHeader", param);
}

const PostReportVendorDetail = (param: any) => {
    return http.apiConfirm.post("PostReportVendorDetail", param);
}


const PostConfirmACHeader = (param: any) => {
    return http.apiConfirm.post("PostConfirmACHeader", param);
}

const PostReportACAndVendorDetail = (param: any) => {
    return http.apiConfirm.post("PostReportACAndVendorDetail", param);
}

const PostConfirmBilling = (param: any) => {
    return http.apiConfirm.post("PostConfirmBilling", param);
}


const PostRejectbilling = (param: any) => {
    return http.apiConfirm.post("PostRejectbilling", param);
}

const PostCancelConfirmBilling = (param: any) => {
    return http.apiConfirm.post("PostCancelConfirmBilling", param);
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

const PostConfirmACDetail = (param: any) => {
    return http.apiConfirm.post("PostConfirmACDetail", param);
}



export default {
    getNbr,
    getVendor,
    PostLoadInvoiceRequet,
    PostCreateInvoice,
    PostDeleteDocumentNo,
    PostReportVendorHeader,
    PostReportVendorDetail,
    PostConfirmACHeader,
    PostReportACAndVendorDetail,
    PostConfirmBilling,
    PostCancelConfirmBilling,
    PostRejectbilling,
    PostReportACHeader,
    PostPayment,
    PostReportInvoiceByAC,
    PostReportVendorDetailPrint,
    PostConfirmACDetail,
};
