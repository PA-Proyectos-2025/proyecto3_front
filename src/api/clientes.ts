const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'; // Ajusta según tu backend

export const getClientes = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/cliente`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Error al obtener los clientes: ${response.status} ${txt}`);
  }

  return response.json();
};

export const createCliente = async (clienteData: {
  nombre: string;
  email: string;
  cuit: string;
  direccion: string;
  razonSocial: string;
}) => {
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
    const txt = await response.text();
    throw new Error(`Error al crear el cliente: ${response.status} ${txt}`);
  }

  return response.json();
};

export const updateCliente = async (
  id: string,
  clienteData: {
    nombre?: string;
    email?: string;
    cuit?: string;
    direccion?: string;
    razonSocial?: string;
  }
) => {
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
    const txt = await response.text();
    throw new Error(`Error al actualizar el cliente: ${response.status} ${txt}`);
  }

  return response.json();
};

export const deleteCliente = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/cliente/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Error al eliminar el cliente: ${response.status} ${txt}`);
  }

  return response.json();
};
