const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const get = async (path: string) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${path}`, { headers });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Error al obtener ${path}: ${res.status} ${txt}`);
  }
  return res.json();
};

export const getTipoReclamos = async () => get('tipo-reclamo');
export const getPrioridades = async () => get('prioridad');
export const getNivelesCriticidad = async () => get('nivel-criticidad');

export const getUsers = async () => {
  // Si no hay token, devolvemos lista vacía (evitar 401 en entorno sin auth)
  const token = localStorage.getItem('token');
  if (!token) return [];
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_URL}/users`, { headers });
  if (!res.ok) {
    if (res.status === 401) return [];
    const txt = await res.text();
    throw new Error(`Error al obtener users: ${res.status} ${txt}`);
  }
  return res.json();
};
