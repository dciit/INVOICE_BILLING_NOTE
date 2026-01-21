import axios from "axios";
import { apiConfirm, apiAttachFile } from "./constants";

const apiConfirmInstance = axios.create({
    baseURL: apiConfirm,
    headers: { "Content-Type": "application/json" },
});


const apiAttachInstance = axios.create({
    baseURL: apiAttachFile,
    headers: { "Content-Type": "application/json" },
});

export default {
    apiConfirm: apiConfirmInstance,
    apiAttach: apiAttachInstance
};
