import axios from "axios";
import {  apiBilling } from "../constants";
import type { Accfromvendor, BankAccount, ResTypeCalendar } from "../interface/response.interface";
import type { CrCalendar, CrdVenderinfo, UserInfo } from "../interface/mParam";

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


export function API_CALENDAR(year: number) {
    return new Promise<any>(resolve => {
        http.get(`/calendar?year=${year}`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({ status: false, message: e.message });
        })
    })
}

export function API_TYPECALENDAR() {
    return new Promise<ResTypeCalendar[]>(resolve => {
        http.get(`/typecalendar`).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            throw (e)
        })
    })
}

// export function API_GET_INFOVENDER(mParam: UserInfo) {
//     return new Promise<any>(resolve => {
//         http.post(`/venderinfo`, mParam).then((res) => {
//             resolve(res.data)
//         }).catch((e) => {
//             throw (e)
//         })
//     })
// }

export function API_GET_INFOAUTHEN(mParam: UserInfo) {
    return new Promise<any>(resolvev => {
        http.post(`/autheninfo`, mParam).then((res) => {
            resolvev(res.data)
        }).catch((e) => {
            throw (e)
        })
    })
}

export function API_CRDACCOUNTSETTING(mParam: CrdVenderinfo) {
    return new Promise<any>(resolve => {
        http.post(`/accountsetting`, mParam).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            throw (e)
        })
    })
}

export function API_EDITACCOUNTSETTING(mParam: CrdVenderinfo) {
    return new Promise<any>(resolve => {
        http.post(`/editvdinfo`, mParam).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            throw(e)
        })
    })
}

export function API_ACCOUNTSETTINGDATA_FROMVENDOR() {
    return new Promise<Accfromvendor[]>(resolve => {
        http.get(`/accfromvendor`).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            throw(e)
        })
    })
}

export function API_CONFIRMACCOUNTSETTING(mParam: UserInfo) {
    return new Promise<any>(resolve => {
        http.post(`/confirmaccsetting`, mParam).then((res) => {
            resolve(res.data)
        }).catch((e) => {
            throw(e)
        })
    })
}