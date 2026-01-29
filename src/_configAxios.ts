import axios from "axios";
import { apiConfirm, apiAttachFile, apiAccount } from "./constants";

const apiConfirmInstance = axios.create({
    baseURL: apiConfirm,
    headers: { "Content-Type": "application/json" },
});


const apiAttachInstance = axios.create({
    baseURL: apiAttachFile,
    headers: { "Content-Type": "application/json" },
});

const apiAccountInstance = axios.create({
    baseURL: apiAccount,
    headers: { "Content-Type": "application/json" },
});

export default {
    apiConfirm: apiConfirmInstance,
    apiAttach: apiAttachInstance,
    apiAccount: apiAccountInstance
};
