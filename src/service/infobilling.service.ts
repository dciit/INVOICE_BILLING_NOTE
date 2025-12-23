import axios from "axios";
import {  apiBilling } from "../constants";
import type { BankAccount } from "../interface/response.interface";
import type { CrCalendar } from "../interface/mParam";

const http = axios.create({
    baseURL: apiBilling,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_GET_VENDERNAME() {
    return new Promise<any>(resolve => {
        http.get(`/vdname`).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            resolve({ status: false, message: e.message });
        })
    })
}

export function API_GET_BANKACCOUNT() {
    return new Promise<BankAccount[]>(resolve => {
        http.get(`/backaccount`).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            throw (e)
        })
    })
}

export function API_CREATECALENDARBILLING(mParam: CrCalendar) {
    return new Promise<any>(resolve => {
        http.post(`/cldbilling`, mParam).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            resolve({ status: false, message: e.message });
        })
    })
}