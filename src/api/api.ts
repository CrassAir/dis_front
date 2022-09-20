import axios, {AxiosError} from "axios";
import {apiUrl, getHostname} from "./urls";
import {IDefectoscopy} from "../models/IDefectoscopy";
import moment from "moment";


const api = axios.create({
    baseURL: apiUrl,
    responseType: "json",
});

export interface IApiError {
    code: number
    message: string
}

export const apiError = (e: Error | AxiosError) => {
    if (axios.isAxiosError(e)) {
        let data = e.response?.data
        if (typeof data === 'string' && data.length < 100) return {code: e.response?.status, message: data}
        return {code: e.response?.status, message: e.message.toString()}
    }
    return {code: 0, message: e.message}
}

export const uploadDefectoscopyFile = (report: IDefectoscopy, file: File) => {
    const header = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    return api.post(`${apiUrl}defectoscopy_report/${report.id}/load_excel/`, {file: file}, header)
}

export const downloadDefectReport = (report: IDefectoscopy) => {
    return api.get(`${apiUrl}defectoscopy_report/${report.id}/download_excel/`, {responseType: 'blob'})
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${report.doc_number}__${moment(report.date_create).format('DD_MM_YYYY')}.xlsx`);
            document.body.appendChild(link);
            link.click();
        })
}


export const downloadBlankReport = (report: IDefectoscopy) => {
    return api.get(`${getHostname()}/mediafiles/template/upload.xlsx`, {responseType: 'blob'})
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${report.doc_number}__blank.xlsx`);
            document.body.appendChild(link);
            link.click();
     })
}
//
// export const tryPrintOrder = (order_id: number) => {
//     api.get(`${apiUrl}remote/order/order/${order_id}/get_excel/`, {responseType: 'blob'})
//         .then(res => {
//             const url = window.URL.createObjectURL(new Blob([res.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', 'order.xlsx');
//             document.body.appendChild(link);
//             link.click();
//         }).catch(err => console.log(err))
// }

export default api;