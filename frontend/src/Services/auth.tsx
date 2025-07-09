import {API_URL_SERVER, Axios} from './index'

const PATH = 'auth';

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await Axios.post(`${API_URL_SERVER}/${PATH}/login`, {
            username,
            password,
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkAuthAndFetch = async () => {
    try {
        const response = await Axios.get(`${API_URL_SERVER}/${PATH}/verify`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
