const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type Area = {
  _id: string;
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

// ✅ NUEVO: Tipos para la paginación
export type AreaFilters = {
  page?: number;
  limit?: number;
  nombre?: string;
  email?: string;
  deleted?: boolean;
};

export type PaginatedAreasResponse = {
  data: Area[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// ✅ NUEVO: Obtener áreas con paginación del backend
export const getAreasWithFilters = async (filters: AreaFilters = {}): Promise<PaginatedAreasResponse> => {
  const token = localStorage.getItem("token");
  
  // Construir query params
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.nombre) params.append('nombre', filters.nombre);
  if (filters.email) params.append('email', filters.email);
  if (filters.deleted !== undefined) params.append('deleted', filters.deleted.toString());
  
  console.log('🔍 Obteniendo áreas con filtros:', filters);
  console.log('📡 Query params:', params.toString());
  
  const response = await fetch(`${API_URL}/areas/filter?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    throw new Error(`Error al obtener las áreas: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Áreas paginadas recibidas:', data);
  
  return data;
};

// Mantener el método original para compatibilidad
export const getAreas = async (): Promise<Area[]> => {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/areas`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    throw new Error(`Error al obtener las áreas: ${response.status}`);
  }

  return response.json();
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
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "Error al crear el área");
    } catch {
      throw new Error(errorText || "Error al crear el área");
    }
  }

  return response.json();
};

export const updateArea = async (
  id: string,
  areaData: UpdateAreaDto
): Promise<Area> => {
  const token = localStorage.getItem("token");
  
  const filteredData: Record<string, unknown> = {};
  if (areaData.nombre !== undefined) filteredData.nombre = areaData.nombre;
  if (areaData.descripcion !== undefined) filteredData.descripcion = areaData.descripcion;
  if (areaData.email !== undefined) filteredData.email = areaData.email;
  if (areaData.id_responsable_area !== undefined) {
    filteredData.id_responsable_area = areaData.id_responsable_area || null;
  }
  
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
  
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }

  const data = await response.json();
  
  const mappedUsers = data.map((user: any) => ({
    id: user._id?.toString() || user.id,
    name: user.name || user.nombre,
    email: user.email,
  }));
  
  return mappedUsers;
};