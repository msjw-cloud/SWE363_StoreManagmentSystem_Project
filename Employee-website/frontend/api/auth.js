import API from './axios';

export const login = async (email, password) => {
    try {
        const response = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export const register = async (userData) => {
    try {
        const response = await API.post('/auth/register', userData);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const getUserProfile = async () => {
    try {
        const response = await API.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to get user profile';
    }
};