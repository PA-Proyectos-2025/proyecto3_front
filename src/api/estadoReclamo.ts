const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type EstadoReclamo = {
  _id: string;
  nombre: string;
  descripcion?: string;
};

export const getEstadosReclamo = async (): Promise<EstadoReclamo[]> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/estado-reclamo`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener estados de reclamo');
  }

  const data = await response.json();
  
  return data.map((item: any) => ({
    _id: item._id || item.id,
    nombre: item.nombre || item.name,
    descripcion: item.descripcion || item.description,
  }));
};

export const getEstadoReclamoById = async (id: string): Promise<EstadoReclamo> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/estado-reclamo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener estado');
  }

  const data = await response.json();
  return {
    _id: data._id || data.id,
    nombre: data.nombre || data.name,
    descripcion: data.descripcion || data.description,
  };
};