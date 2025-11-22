const API_URL = "http://localhost:3000"; // Ajusta según tu backend

export const getClientes = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/clientes`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los clientes");
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
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clienteData),
  });

  if (!response.ok) {
    throw new Error("Error al crear el cliente");
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
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clienteData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el cliente");
  }

  return response.json();
};

export const deleteCliente = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el cliente");
  }

  return response.json();
};
