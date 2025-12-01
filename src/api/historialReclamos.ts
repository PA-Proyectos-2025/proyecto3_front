// En 'src/api/historialReclamos.ts'
export type HistorialReclamo = {
    _id: string; // El OID de MongoDB como string
    reclamoId: string;
    estadoReclamoId: string;
    usuarioResponsableId: string;
    opinionId: string;
    fechaHoraInicio: string; // La fecha ISO como string
    fechaHoraFin: string | null;
    deleted: boolean;
    deletedAt: string | null;

};

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ENDPOINT_PATH = '/historial-estado'; 


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Añade el token si existe
  };
};

// ==========================================================
// 1. OBTENER HISTORIALES (findAll - Activos)
// Endpoint: GET /historial-estado
// ==========================================================
export async function getHistoriales(): Promise<HistorialReclamo[]> {
  const token = localStorage.getItem("token"); // o donde lo guardes
  const response = await fetch("http://localhost:3000/historial-estado", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const createHistorial = async (data: Omit<HistorialReclamo, '_id' | 'deleted' | 'deletedAt'>): Promise<HistorialReclamo> => {
  console.log(`FETCH: POST ${BASE_URL}${ENDPOINT_PATH}`);

  const response = await fetch(`${BASE_URL}${ENDPOINT_PATH}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Fallo al crear historial. Error: ${errorBody.message || 'Error desconocido'}`);
  }
  
  return response.json();
};

// ==========================================================
// 3. ACTUALIZAR HISTORIAL
// Endpoint: PATCH /historial-estado/:id
// ==========================================================
export const updateHistorial = async (id: string, data: Partial<HistorialReclamo>): Promise<HistorialReclamo> => {
  console.log(`FETCH: PATCH ${BASE_URL}${ENDPOINT_PATH}/${id}`);

  const response = await fetch(`${BASE_URL}${ENDPOINT_PATH}/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Fallo al actualizar historial. Error: ${errorBody.message || 'Error desconocido'}`);
  }
  
  return response.json();
};

export const deleteHistorial = async (id: string): Promise<void> => {
  console.log(`FETCH: DELETE ${BASE_URL}${ENDPOINT_PATH}/${id}`);

  // El endpoint de NestJS maneja el soft delete con DELETE
  const response = await fetch(`${BASE_URL}${ENDPOINT_PATH}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Fallo al eliminar historial. Error: ${errorBody.message || 'Error desconocido'}`);
  }
};


export const findByReclamoId = async (reclamoId: string): Promise<HistorialReclamo[]> => {
    const response = await fetch(`${BASE_URL}${ENDPOINT_PATH}/by-reclamo?reclamoId=${reclamoId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Fallo al buscar por reclamoId. Código: ${response.status}`);
    }
    return response.json();
};