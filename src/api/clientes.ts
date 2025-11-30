const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type Cliente = {
  _id: string;
  id?: string; // ← agregado
  nombre: string;
  email: string;
  cuit: string;
  direccion: string;
  razonSocial: string;
  telefono?: string;
  deleted?: boolean;
};

export type CreateClienteDto = {
  nombre: string;
  email: string;
  cuit: string;
  direccion: string;
  razonSocial: string;
  telefono?: string;
};

export type UpdateClienteDto = Partial<CreateClienteDto>;

export type ClienteFilters = {
  page?: number;
  limit?: number;
  nombre?: string;
  email?: string;
  deleted?: boolean;
};

export type PaginatedClientesResponse = {
  data: Cliente[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const getClientes = async (): Promise<Cliente[]> => {
  const token = localStorage.getItem('token');
  
  console.log('🔍 Obteniendo clientes...');
  
  const response = await fetch(`${API_URL}/cliente`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('📡 Response status:', response.status);

  if (!response.ok) {
    const txt = await response.text();
    console.error('❌ Error:', txt);
    throw new Error(`Error al obtener los clientes: ${response.status}`);
  }

  const data = await response.json();
  console.log('📦 Clientes RAW del backend:', data);
  console.log('📦 PRIMER CLIENTE COMPLETO:', JSON.stringify(data[0], null, 2));

  // Mapear para asegurar estructura correcta
  const mapped = data.map((cliente: any) => ({
    _id: cliente._id || cliente.id,
    nombre: cliente.name || '',
    email: cliente.email || '',
    cuit: cliente.cuit || '',
    direccion: cliente.direccion || '',
    razonSocial: cliente.razonSocial || cliente.razon_social || '',
    telefono: cliente.telefono || '',
    deleted: cliente.deleted || false,
  }));

  console.log('✅ Clientes mapeados:', mapped);

  return mapped;
};

export const getClientesWithFilters = async (
  filters: ClienteFilters = {}
): Promise<PaginatedClientesResponse> => {
  const token = localStorage.getItem('token');
  
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.nombre) params.append('nombre', filters.nombre);
  if (filters.email) params.append('email', filters.email);
  if (filters.deleted !== undefined) params.append('deleted', filters.deleted.toString());
  
  console.log('🔍 Obteniendo clientes con filtros:', filters);
  
  const response = await fetch(`${API_URL}/cliente/filter?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    throw new Error(`Error al obtener los clientes: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Clientes paginados recibidos:', data);
  
  return data;
};

export const getClienteById = async (id: string): Promise<Cliente> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/cliente/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el cliente');
  }

  const data = await response.json();

  return {
    _id: data._id?.toString() || data.id, // ⚠️ normalizamos a _id
    nombre: data.nombre,
    email: data.email,
    cuit: data.cuit,
    direccion: data.direccion,
    razonSocial: data.razonSocial || data.razon_social,
    telefono: data.telefono,
    deleted: data.deleted,
  };
};



export const createCliente = async (clienteData: CreateClienteDto): Promise<Cliente> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/cliente`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clienteData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del servidor:', errorText);
    
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'Error al crear el cliente');
    } catch {
      throw new Error(errorText || 'Error al crear el cliente');
    }
  }

  return response.json();
};

export const updateCliente = async (
  id: string,
  clienteData: UpdateClienteDto
): Promise<Cliente> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/cliente/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clienteData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error del servidor:', errorText);
    throw new Error('Error al actualizar el cliente');
  }

  return response.json();
};

export const deleteCliente = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/cliente/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el cliente');
  }
};

export const restoreCliente = async (id: string): Promise<Cliente> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/cliente/${id}/restore`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al restaurar el cliente');
  }

  return response.json();
};