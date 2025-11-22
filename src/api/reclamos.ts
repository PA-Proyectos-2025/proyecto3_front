import axios from "axios";

const BASE_URL = "http://localhost:3000"; // ajustá si usás otro puerto o dominio

export const getReclamos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reclamos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener reclamos:", error);
    throw error;
  }
};

export const deleteReclamo = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/reclamos/${id}`);
  } catch (error) {
    console.error(`Error al eliminar reclamo con ID ${id}:`, error);
    throw error;
  }
};
