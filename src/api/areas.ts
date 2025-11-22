const API_URL = "http://localhost:3000"; // Ajusta según tu backend

export const getAreas = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/areas`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener las áreas");
  }

  return response.json();
};

export const createArea = async (areaData: {
  nombre: string;
  descripcion: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/areas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(areaData),
  });

  if (!response.ok) {
    throw new Error("Error al crear el área");
  }

  return response.json();
};

export const updateArea = async (
  id: string,
  areaData: {
    nombre?: string;
    descripcion?: string;
  }
) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/areas/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(areaData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el área");
  }

  return response.json();
};

export const deleteArea = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/areas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el área");
  }

  return response.json();
};
