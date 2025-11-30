import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getPrioridadById = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/prioridad/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};