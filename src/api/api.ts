import axios from "axios";
// import Cookies from "js-cookie";
import {apiUrl} from "./urls";


const api = axios.create({
    baseURL: apiUrl,
    responseType: "json",
});

export interface IApiError {
    code: number
    message: string
}

export const apiError = (e: any): IApiError => {
    if (axios.isAxiosError(e)) {
        // @ts-ignore
        return {code: e.response.status, message: e.response.data.detail || e.message}
    }
    return{code: 0, message: e.message}
}
// api.interceptors.request.use((config) => {
//     config.headers["X-CSRFToken"] = Cookies.get("csrftoken");
//     // console.log("api.interceptors.request: ", config.headers);
//     return config;
// });
//
// export const authInterceptor = (config, token) => {
//     config.headers['authorization'] = token;
//     return config;
// }

export const tryPrintTabel = (tabel_id: number) => {
    api.get(`${apiUrl}tabel/${tabel_id}/get_excel/`, {responseType: 'blob'})
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'tabel.xlsx');
            document.body.appendChild(link);
            link.click();
        }).catch(err => console.log(err))
}

export const tryPrintOrder = (order_id: number) => {
    api.get(`${apiUrl}remote/order/order/${order_id}/get_excel/`, {responseType: 'blob'})
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'order.xlsx');
            document.body.appendChild(link);
            link.click();
        }).catch(err => console.log(err))
}

export default api;