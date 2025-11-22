import axios from "axios";
const BASE_URL = "http://localhost:3000"; // ajustá si usás otro puerto o dominio

export const getProyectos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/proyectos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    throw error;
  }
};

export const deleteProyecto = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/proyectos/${id}`);
  } catch (error) {
    console.error(`Error al eliminar proyecto con ID ${id}:`, error);
    throw error;
  }
};
