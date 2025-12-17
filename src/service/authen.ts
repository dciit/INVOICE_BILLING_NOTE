import {apiAuthen} from "../constants";
import axios from "axios";
import type { GetToken, Login, RequestRegis } from "../interface/mParam";

const http = axios.create({
    baseURL: apiAuthen,
    headers: {
        'Content-Type' : 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_REQUEST_REGISTER(mParam: RequestRegis) {
    return new Promise<any>(resolve => {
        http.post(`/regisuser`, mParam).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({ status: false, message: e.message });
        })
    })
}


export function API_GETTOKEN(mParam: GetToken) {
    return new Promise<any>(resolve => {
        http.post(`/login`, mParam).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({ status: false, message: e.message });
        })
    })
}

export function API_LOGIN(mParam: Login) {
    console.log('Login params:', mParam);
    return new Promise<any>(resolve => {
        http.post(`/checkauthen`, mParam, {
            headers: { Authorization: `Bearer ${mParam.token}` }
        })
        .then((res) => resolve(res.data))
        .catch((e) => {
            resolve({
                status: e.response ? e.response.status : 0,
                message: e.response ? e.response.statusText : e.message
            })
        })
    })
}

