import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
    ? ''  
    : 'http://localhost:5000/api';

export const createPaste = async (data) => {
    const response = await axios.post(`${API_BASE}/pastes`, data);
    return response.data;
};

export const getPaste = async (id) => {
    const response = await axios.get(`${API_BASE}/pastes/${id}`);
    return response.data;
};