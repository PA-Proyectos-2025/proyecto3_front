import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getNivelCriticidadById = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/nivel-criticidad/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};