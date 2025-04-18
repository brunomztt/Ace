import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const API_URL = 'http://localhost:5008/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const { response } = error;

        if (!response) {
            return Promise.reject({ message: 'Erro de conexão com o servidor' });
        }

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        return Promise.reject(response.data || { message: 'Erro desconhecido' });
    }
);

export const api = {
    get: async <T>(url: string, config?: AxiosRequestConfig) => {
        try {
            const response = await apiClient.get<T>(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
        try {
            const response = await apiClient.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    put: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
        try {
            const response = await apiClient.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async <T>(url: string, config?: AxiosRequestConfig) => {
        try {
            const response = await apiClient.delete<T>(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default api;
