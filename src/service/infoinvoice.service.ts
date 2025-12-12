import axios from "axios";
import { apiAuthen } from "../constants";

const http = axios.create({
    baseURL: apiAuthen,
    headers: {
        'Content-Type' : 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_GET_VENDERNAME(){
    return new Promise<any>(resolve => {
        http.get(`/vdname`).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            resolve({ status: false, message: e.message });
        })
    })
}