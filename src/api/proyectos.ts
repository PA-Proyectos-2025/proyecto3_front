const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type Proyecto = {
  _id: string;
  nombre: string;
  descripcion?: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  estadoProyectoId: string;
  tipoProyectoId: string;
  id_cliente: string;
  id_responsable_area: string;
  estadoNombre?: string;
  tipoNombre?: string;
  clienteNombre?: string;
  responsableNombre?: string;
};

export type CreateProyectoDto = {
  nombre: string;
  descripcion?: string;
  fecha_hora_inicio: Date | string; // ← Agregar | string
  fecha_hora_fin: Date | string;    // ← Agregar | string
  estadoProyectoId: string;
  tipoProyectoId: string;
  id_cliente: string;
  id_responsable_area: string;
};

export type UpdateProyectoDto = Partial<CreateProyectoDto>; // ← Cambiar a esto

export type ProyectoFilters = {
  page?: number;
  limit?: number;
  nombre?: string;
  estadoProyectoId?: string;
  tipoProyectoId?: string;
  id_cliente?: string;
  deleted?: boolean;
};

export type PaginatedProyectosResponse = {
  data: Proyecto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const getProyectos = async (): Promise<Proyecto[]> => {
  const token = localStorage.getItem('token');
  
  console.log('🔍 Obteniendo proyectos...');
  
  const response = await fetch(`${API_URL}/proyecto`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('📡 Response status:', response.status);

  if (!response.ok) {
    const txt = await response.text();
    console.error('❌ Error:', txt);
    throw new Error(`Error al obtener los proyectos: ${response.status}`);
  }

  const data = await response.json();
  console.log('📦 Proyectos recibidos:', data);

  // ✅ MAPEAR: Asegurar que _id exista
  const mapped = data.map((proyecto: any) => ({
    ...proyecto,
    _id: proyecto._id || proyecto.id, // ← AGREGAR ESTO
  }));

  console.log('✅ Proyectos mapeados:', mapped);

  return mapped;
};

export const getProyectosWithFilters = async (filters: ProyectoFilters = {}): Promise<PaginatedProyectosResponse> => {
  const token = localStorage.getItem('token');
  
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.nombre) params.append('nombre', filters.nombre);
  if (filters.estadoProyectoId) params.append('estadoProyectoId', filters.estadoProyectoId);
  if (filters.tipoProyectoId) params.append('tipoProyectoId', filters.tipoProyectoId);
  if (filters.id_cliente) params.append('id_cliente', filters.id_cliente);
  if (filters.deleted !== undefined) params.append('deleted', filters.deleted.toString());
  
  console.log('🔍 Obteniendo proyectos con filtros:', filters);
  
  const response = await fetch(`${API_URL}/proyecto/filter?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    throw new Error(`Error al obtener los proyectos: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Proyectos paginados recibidos:', data);
  
  return data;
};

export const getProyectoById = async (id: string): Promise<Proyecto> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/proyecto/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el proyecto');
  }

  return response.json();
};

export const createProyecto = async (proyectoData: CreateProyectoDto): Promise<Proyecto> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/proyecto`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proyectoData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'Error al crear el proyecto');
    } catch {
      throw new Error(errorText || 'Error al crear el proyecto');
    }
  }

  return response.json();
};

export const updateProyecto = async (
  id: string,
  proyectoData: UpdateProyectoDto
): Promise<Proyecto> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/proyecto/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proyectoData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error del servidor:', errorText);
    throw new Error('Error al actualizar el proyecto');
  }

  return response.json();
};

export const deleteProyecto = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/proyecto/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el proyecto');
  }
};

export const getEstadosProyecto = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/estado-proyecto`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener estados de proyecto');
  }

  const data = await response.json();
  
  // ✅ MAPEAR: Extraer el $oid si existe
  const mapped = data.map((estado: any) => ({
    id: estado._id?.$oid || estado._id?.toString() || estado._id || estado.id,
    _id: estado._id?.$oid || estado._id,
    nombre: estado.nombre,
    deleted: estado.deleted,
  }));
  
  console.log('✅ Estados mapeados:', mapped);
  
  return mapped;
};

export const getTiposProyecto = async () => {
  const token = localStorage.getItem('token');
  
  console.log('🏷️ Llamando a /tipo-proyecto...');
  
  const response = await fetch(`${API_URL}/tipo-proyecto`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener tipos de proyecto');
  }

  const data = await response.json();
  
  console.log('🏷️ Tipos RAW del backend:', data);
  console.log('🏷️ Primer tipo completo:', JSON.stringify(data[0], null, 2));
  
  const mapped = data.map((tipo: any) => {
    const idExtraido = tipo._id?.$oid || tipo._id?.toString() || tipo._id || tipo.id;
    
    console.log('🏷️ Mapeando tipo:', {
      nombre: tipo.nombre,
      _id_original: tipo._id,
      id_extraido: idExtraido
    });
    
    return {
      id: idExtraido,
      _id: idExtraido,
      nombre: tipo.nombre,
      deleted: tipo.deleted,
    };
  });
  
  console.log('✅ Tipos finales mapeados:', mapped);
  
  return mapped;
};

export const getUsers = async () => {
  const token = localStorage.getItem('token');
  
  console.log('👤 Obteniendo usuarios...');
  
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('❌ Error usuarios - Status:', response.status);
    throw new Error('Error al obtener usuarios');
  }

  const data = await response.json();
  console.log('👤 Usuarios raw:', data);
  
  // ✅ MAPEAR: Convertir _id a string simple
  const mapped = data.map((user: any) => ({
    id: user._id?.toString() || user._id || user.id,
    _id: user._id,
    name: user.name || user.nombre,
    email: user.email,
  }));
  
  console.log('✅ Usuarios mapeados:', mapped);
  
  return mapped;
};

export const getClientes = async () => {
  const token = localStorage.getItem('token');
  
  console.log('👥 Obteniendo clientes...');
  
  const response = await fetch(`${API_URL}/cliente`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('❌ Error clientes - Status:', response.status);
    throw new Error('Error al obtener clientes');
  }

  const data = await response.json();
  console.log('👥 Clientes RAW:', data);
  
  const mapped = data.map((cliente: any) => {
    const idExtraido = cliente._id?.toString() || cliente._id || cliente.id;
    return {
      id: idExtraido,
      _id: idExtraido,
      nombre: cliente.nombre,
      email: cliente.email,
      deleted: cliente.deleted,
    };
  });
  
  console.log('✅ Clientes mapeados:', mapped);
  
  return mapped;
};