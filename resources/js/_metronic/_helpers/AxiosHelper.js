import axios from "axios";

export const API = axios.create({
    withCredentials:true,
    baseURL : `https://pc.test/api`,
});

export const WEB = axios.create({
    withCredentials:true,
    baseURL : `https://pc.test/`,
});

export const AXIOS = axios.create({
});

