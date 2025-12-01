const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type Subarea = {
  _id: string;
  nombre: string;
  descripcion: string;
  areaId: string | null;
  areaNombre?: string;
};

export type CreateSubareaDto = {
  nombre: string;
  descripcion?: string;
  areaId?: string;
};

export type UpdateSubareaDto = {
  nombre?: string;
  descripcion?: string;
  areaId?: string;
};

// ✅ NUEVO: Tipos para la paginación
export type SubareaFilters = {
  page?: number;
  limit?: number;
  nombre?: string;
  areaId?: string;
  deleted?: boolean;
};

export type PaginatedSubareasResponse = {
  data: Subarea[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// ✅ NUEVO: Obtener subáreas con paginación del backend
export const getSubareasWithFilters = async (filters: SubareaFilters = {}): Promise<PaginatedSubareasResponse> => {
  const token = localStorage.getItem("token");
  
  // Construir query params
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.nombre) params.append('nombre', filters.nombre);
  if (filters.areaId) params.append('areaId', filters.areaId);
  if (filters.deleted !== undefined) params.append('deleted', filters.deleted.toString());
  
  console.log('🔍 Obteniendo subáreas con filtros:', filters);
  console.log('📡 Query params:', params.toString());
  
  const response = await fetch(`${API_URL}/subareas/filter?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    throw new Error(`Error al obtener las subáreas: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Subáreas paginadas recibidas:', data);
  
  return data;
};

// Obtener todas las subáreas (sin paginación)
export const getSubareas = async (): Promise<Subarea[]> => {
  const token = localStorage.getItem("token");
  
  console.log('📡 Llamando a:', `${API_URL}/subareas`);
  
  const response = await fetch(`${API_URL}/subareas`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    throw new Error(`Error al obtener las subáreas: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Subáreas raw recibidas:', data);
  
  // Mapear correctamente los datos del backend
  const mapped = data.map((subarea: any) => ({
    _id: subarea._id || '',
    nombre: subarea.nombre || '',
    descripcion: subarea.descripcion || '',
    areaId: subarea.areaId || null,
    areaNombre: subarea.areaNombre || 'Área desconocida',
  }));
  
  console.log('✅ Subáreas mapeadas:', mapped);
  
  return mapped;
};

export const getSubareaById = async (id: string): Promise<Subarea> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/subareas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener la subárea");
  }

  return response.json();
};

export const createSubarea = async (subareaData: CreateSubareaDto): Promise<Subarea> => {
  const token = localStorage.getItem("token");
  
  console.log('🚀 createSubarea - Datos recibidos:', subareaData);
  console.log('🚀 createSubarea - JSON a enviar:', JSON.stringify(subareaData));
  
  const response = await fetch(`${API_URL}/subareas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subareaData),
  });

  console.log('🚀 createSubarea - Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "Error al crear la subárea");
    } catch {
      throw new Error(errorText || "Error al crear la subárea");
    }
  }

  const result = await response.json();
  console.log('✅ createSubarea - Resultado:', result);
  return result;
};

export const updateSubarea = async (
  id: string,
  subareaData: UpdateSubareaDto
): Promise<Subarea> => {
  const token = localStorage.getItem("token");
  
  const filteredData: Record<string, unknown> = {};
  if (subareaData.nombre !== undefined) filteredData.nombre = subareaData.nombre;
  if (subareaData.descripcion !== undefined) filteredData.descripcion = subareaData.descripcion;
  if (subareaData.areaId !== undefined) {
    filteredData.areaId = subareaData.areaId || null;
  }
  
  const response = await fetch(`${API_URL}/subareas/${id}`, {
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
    throw new Error("Error al actualizar la subárea");
  }

  return response.json();
};

// Soft delete
export const deleteSubarea = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/subareas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la subárea");
  }
};

// Restaurar subárea
export const restoreSubarea = async (id: string): Promise<Subarea> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/subareas/${id}/restore`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al restaurar la subárea");
  }

  return response.json();
};

// Obtener áreas para el selector
export const getAreas = async () => {
  const token = localStorage.getItem("token");
  
  console.log('🔍 Llamando a /areas...');
  
  const response = await fetch(`${API_URL}/areas`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener las áreas");
  }

  const data = await response.json();
  
  console.log('🏢 Áreas RAW del backend:', data);
  console.log('🏢 Primera área ejemplo:', data[0]);
  
  // Filtrar áreas no eliminadas
  const filteredAreas = data.filter((area: any) => !area.deleted);
  
  console.log('🏢 Áreas filtradas (no eliminadas):', filteredAreas);
  
  const mappedAreas = filteredAreas.map((area: any) => {
    // Intentar diferentes formas de obtener el ID
    const id = area._id?.$oid || area._id || area.id;
    console.log('🔍 Mapeando área:', {
      nombre: area.nombre,
      _id_original: area._id,
      _id_type: typeof area._id,
      id_final: id
    });
    return {
      _id: id,
      nombre: area.nombre,
    };
  });
  
  console.log('✅ Áreas finales mapeadas:', mappedAreas);
  
  return mappedAreas;
};