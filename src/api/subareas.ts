const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'; // Ajusta según tu backend

export const getSubareas = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subareas`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Error al obtener las subáreas: ${response.status} ${txt}`);
  }

  return response.json();
};

export const createSubarea = async (subareaData: {
  nombre: string;
  areaId: string; // referencia al área
}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subareas`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subareaData),
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Error al crear la subárea: ${response.status} ${txt}`);
  }

  return response.json();
};

export const updateSubarea = async (
  id: string,
  subareaData: {
    nombre?: string;
    areaId?: string;
  }
) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subareas/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subareaData),
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Error al actualizar la subárea: ${response.status} ${txt}`);
  }

  return response.json();
};

export const deleteSubarea = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/subareas/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Error al eliminar la subárea: ${response.status} ${txt}`);
  }

  return response.json();
};
