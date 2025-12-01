import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Definimos un tipo para los archivos
export type ArchivoDto = {
  id: string;          // hash único o filename
  nombre: string;      // nombre original del archivo
  size?: number;       // tamaño en bytes (opcional)
  mimeType?: string;   // tipo MIME (opcional)
};

export type Reclamo = {
  _id: string;
  id?: string;
  titulo: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaCierre?: string | null;
  archivos: ArchivoDto[];   // 👈 antes string[], ahora objetos
  clienteId: string;
  proyectoId: string;
  prioridadId: string;
  nivelCriticidadId: string;
  tipoReclamoId: string;
  deleted: boolean;
  deletedAt?: string | null;
};

export type CreateReclamoDto = {
  titulo: string;
  descripcion: string;
  archivos?: ArchivoDto[];  // 👈 igual que en Reclamo
  tipoReclamoId: string;
  prioridadId: string;
  nivelCriticidadId: string;
  proyectoId: string;
  clienteId: string;
};

export const getReclamos = async (): Promise<Reclamo[]> => {
  const token = localStorage.getItem('token');
  
  console.log('🔍 Obteniendo reclamos...');
  
  const response = await fetch(`${API_URL}/reclamo`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const txt = await response.text();
    console.error('❌ Error:', txt);
    throw new Error(`Error al obtener los reclamos: ${response.status}`);
  }

  const data = await response.json();
  console.log('📦 Reclamos RAW del backend:', data);

  // Mapear para convertir ObjectIds a strings
  const mapped = data.map((reclamo: any) => ({
    _id: reclamo._id?.$oid || reclamo._id || reclamo.id,
    id: reclamo.id || reclamo._id?.$oid || reclamo._id,
    titulo: reclamo.titulo || '',
    descripcion: reclamo.descripcion || '',
    fechaCreacion: reclamo.fechaCreacion?.$date || reclamo.fechaCreacion,
    fechaCierre: reclamo.fechaCierre?.$date || reclamo.fechaCierre || null,
    archivos: reclamo.archivos || [],
    clienteId: reclamo.clienteId?.$oid || reclamo.clienteId || '',
    proyectoId: reclamo.proyectoId?.$oid || reclamo.proyectoId || '',
    prioridadId: reclamo.prioridadId?.$oid || reclamo.prioridadId || '',
    nivelCriticidadId: reclamo.nivelCriticidadId?.$oid || reclamo.nivelCriticidadId || '',
    tipoReclamoId: reclamo.tipoReclamoId?.$oid || reclamo.tipoReclamoId || '',
    deleted: reclamo.deleted || false,
    deletedAt: reclamo.deletedAt?.$date || reclamo.deletedAt || null,
  }));

  console.log('✅ Reclamos mapeados:', mapped);
  console.log('✅ Primer reclamo mapeado:', mapped[0]);

  return mapped;
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

export const updateReclamo = async (id: string, data: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    // No necesitas "Content-Type": axios lo maneja para FormData
    
    const res = await axios.patch(`${API_URL}/reclamo/${id}`, data, { headers });
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar reclamo ${id}:`, error);
    throw error;
  }
};


export const createReclamo = async (data: FormData, usuarioResponsableId?: string) => {
  try {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    // No necesitas "Content-Type": axios lo maneja para FormData
    
    const url = usuarioResponsableId 
      ? `${API_URL}/reclamo?usuarioResponsableId=${encodeURIComponent(usuarioResponsableId)}` 
      : `${API_URL}/reclamo`;
    
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
