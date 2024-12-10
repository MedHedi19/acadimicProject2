// src/utils/notification.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message) => {
    toast.success(message, {
        position: "top-left",
        autoClose: 1500,
        closeOnClick: true,
    });
};

export const notifyError = (message) => {
    toast.error(message, {
        position: "top-left",
        autoClose: 1500,
        closeOnClick: true,
    });
};
export const notifyInfo = (message) => {
    toast.info(message, {
        position: "center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: true,
    });
};
