import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type CreateReclamoDto = {
  titulo: string;
  descripcion: string;
  archivos?: string[];
  tipoReclamoId: string;
  prioridadId: string;
  nivelCriticidadId: string;
  proyectoId: string;
  clienteId: string;
  areaId: string;
  subareaId?: string;
};

export const getReclamos = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/reclamo`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error al obtener reclamos:", error);
    throw error;
  }
};

export const getReclamo = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/reclamo/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener reclamo ${id}:`, error);
    throw error;
  }
};

export const updateReclamo = async (id: string, data: Partial<CreateReclamoDto>) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
    const res = await axios.patch(`${API_URL}/reclamo/${id}`, data, { headers });
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar reclamo ${id}:`, error);
    throw error;
  }
};


export const createReclamo = async (data: CreateReclamoDto, usuarioResponsableId?: string) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
    const url = usuarioResponsableId ? `${API_URL}/reclamo?usuarioResponsableId=${encodeURIComponent(usuarioResponsableId)}` : `${API_URL}/reclamo`;
    const res = await axios.post(url, data, { headers });
    return res.data;
  } catch (error) {
    console.error("Error al crear reclamo:", error);
    throw error;
  }
};

export const deleteReclamo = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${API_URL}/reclamo/${id}`, { headers });
  } catch (error) {
    console.error(`Error al eliminar reclamo con ID ${id}:`, error);
    throw error;
  }
};
