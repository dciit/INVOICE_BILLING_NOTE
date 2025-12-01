import http from "../_configAxios";

const PostInvoiceRequert = (param: any) => {
    return http.apiConfirm.post("PostInvoiceRequert", param);
}


const PostInvoiceReport = (param: any) => {
    return http.apiConfirm.post("PostInvoiceReport", param);
}

export default {
    PostInvoiceRequert,
    PostInvoiceReport,
};
