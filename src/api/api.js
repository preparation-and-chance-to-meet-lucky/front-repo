import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,//쿠키를 자동으로 포함
});

// 요청 인터셉터를 추가하여 모든 요청에 Authorization 헤더를 추가
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
})

export default api;