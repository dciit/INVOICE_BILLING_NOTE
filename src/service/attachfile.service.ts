import http from "../_configAxios";


const PostShowFile = (param: any) => {
    return http.apiAttach.post("PostShowFile", param);
}




export default {
    PostShowFile,
};
