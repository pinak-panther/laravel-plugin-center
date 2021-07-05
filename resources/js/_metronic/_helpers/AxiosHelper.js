import axios from "axios";
import store from "../../redux/store"

const {auth: { authToken } } = store.getState();
export const API = axios.create({
    withCredentials:true,
    baseURL : `https://pc.test/api`,
    Authorization : `Bearer ${authToken}`
});

export const WEB = axios.create({
    withCredentials:true,
    baseURL : `https://pc.test/`,
});

export const AXIOS = axios.create({});
