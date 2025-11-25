const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type Area = {
  id: string;
  nombre: string;
  descripcion: string;
  email: string;
  id_responsable_area: string | null;
};

export type CreateAreaDto = {
  nombre: string;
  descripcion: string;
  email: string;
  id_responsable_area?: string;
};

export type UpdateAreaDto = {
  nombre?: string;
  descripcion?: string;
  email?: string;
  id_responsable_area?: string;
};

export const getAreas = async (): Promise<Area[]> => {
  const token = localStorage.getItem("token");
  
  console.log('🔍 Obteniendo áreas...'); // Debug
  console.log('Token:', token ? 'Existe' : 'No existe'); // Debug
  
  const response = await fetch(`${API_URL}/areas`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log('📡 Response status:', response.status); // Debug
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    throw new Error(`Error al obtener las áreas: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Áreas recibidas:', data); // Debug
  
  return data;
};

export const getAreaById = async (id: string): Promise<Area> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/areas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el área");
  }

  return response.json();
};

export const createArea = async (areaData: CreateAreaDto): Promise<Area> => {
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
  areaData: UpdateAreaDto
): Promise<Area> => {
  const token = localStorage.getItem("token");
  
  // Filtrar solo los campos que tienen valor
  const filteredData: Record<string, unknown> = {};
  if (areaData.nombre !== undefined) filteredData.nombre = areaData.nombre;
  if (areaData.descripcion !== undefined) filteredData.descripcion = areaData.descripcion;
  if (areaData.email !== undefined) filteredData.email = areaData.email;
  if (areaData.id_responsable_area !== undefined) {
    filteredData.id_responsable_area = areaData.id_responsable_area || null;
  }
  
  console.log('Actualizando área:', id, filteredData); // Debug
  
  const response = await fetch(`${API_URL}/areas/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error del servidor:', errorText);
    throw new Error("Error al actualizar el área");
  }

  return response.json();
};

export const deleteArea = async (id: string): Promise<void> => {
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
};

export const getUsers = async () => {
  const token = localStorage.getItem("token");
  
  console.log('👥 Obteniendo usuarios...'); // Debug
  
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log('📡 Users response status:', response.status); // Debug

  if (!response.ok) {
    const errorText = await response.text();
    console.warn('⚠️ Error al obtener usuarios:', errorText);
    throw new Error("Error al obtener los usuarios");
  }

  const data = await response.json();
  console.log('✅ Usuarios recibidos:', data); // Debug
  
  return data;
};