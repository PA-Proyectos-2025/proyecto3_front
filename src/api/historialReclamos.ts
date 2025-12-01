const API_URL = 'http://localhost:3000';

export type Opinion = {
  _id: string;
  id?: string;
  descripcion?: string;
  comentario?: string;
};

// ✅ Tipo para crear historial (enviar al servidor)
export type HistorialEstadoCreate = {
  reclamoId: string;
  estadoReclamoId: string;
  usuarioResponsableId?: string;
  opinionId?: string;
  fechaHoraInicio?: string; // ISO8601
  fechaHoraFin?: string; // ISO8601
};

// ✅ Tipo completo del historial (recibido del servidor)
export type HistorialReclamo = {
  _id: string;
  id?: string;
  reclamoId: string;
  estadoReclamoId: string;
  usuarioResponsableId: string;
  opinionId?: string;
  fechaHoraInicio: string | null;
  fechaHoraFin: string | null;
};

// Alias para compatibilidad
export type HistorialEstado = HistorialReclamo;

// ========================================
// OPINIONES
// ========================================

export const getOpiniones = async (): Promise<Opinion[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/opinion`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// ========================================
// HISTORIAL - CRUD COMPLETO
// ========================================

// GET - Obtener todos los historiales
export const getHistoriales = async (): Promise<HistorialReclamo[]> => {
  const token = localStorage.getItem('token');
  
  console.log('🔍 GET /historial-estado');
  
  const response = await fetch(`${API_URL}/historial-estado`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// GET - Obtener historial por Reclamo
export const getHistorialByReclamo = async (reclamoId: string): Promise<HistorialReclamo[]> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/historial-estado/reclamo/${reclamoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// POST - Crear historial
export const createHistorial = async (data: HistorialEstadoCreate): Promise<HistorialReclamo> => {
  const token = localStorage.getItem('token');
  
  // Asegurar que fechaHoraInicio sea ISO8601 si no se proporciona
  const payload = {
    ...data,
    fechaHoraInicio: data.fechaHoraInicio || new Date().toISOString(),
  };
  
  console.log('📤 POST /historial-estado');
  console.log('📦 DATOS:', payload);
  
  try {
    const response = await fetch(`${API_URL}/historial-estado`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📡 STATUS:', response.status);
    
    const responseText = await response.text();
    console.log('📄 RESPONSE:', responseText);
    
    if (!response.ok) {
      let errorMessage = 'Internal server error';
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        // Mostrar errores de validación si existen
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        }
      } catch {
        errorMessage = responseText || errorMessage;
      }
      
      throw new Error(`Fallo al crear historial. Error: ${errorMessage}`);
    }
    
    return JSON.parse(responseText);
    
  } catch (error) {
    console.error('💥 ERROR:', error);
    throw error;
  }
};

// PUT - Actualizar historial
export const updateHistorial = async (id: string, data: Partial<HistorialEstadoCreate>): Promise<HistorialReclamo> => {
  const token = localStorage.getItem('token');
  
  console.log('📝 PUT /historial-estado/' + id);
  console.log('📦 DATOS:', data);
  
  const response = await fetch(`${API_URL}/historial-estado/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  
  return response.json();
};

// DELETE - Eliminar historial
export const deleteHistorial = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  console.log('🗑️ DELETE /historial-estado/' + id);
  
  const response = await fetch(`${API_URL}/historial-estado/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
};