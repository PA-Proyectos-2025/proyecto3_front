import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const getProyectos = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/proyecto`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
};

export const createProyecto = async (data: Record<string, unknown>) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    const res = await axios.post(`${API_URL}/proyecto`, data, { headers });
    return res.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};

export const deleteProyecto = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${API_URL}/proyecto/${id}`, { headers });
  } catch (error) {
    console.error(`Error al eliminar proyecto con ID ${id}:`, error);
    throw error;
  }
};
