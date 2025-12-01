import axios from "axios";
import { apiConfirm } from "./constants";

const apiConfirmInstance = axios.create({
    baseURL: apiConfirm,
    headers: { "Content-Type": "application/json" },
});

export default {
    apiConfirm: apiConfirmInstance,
};
