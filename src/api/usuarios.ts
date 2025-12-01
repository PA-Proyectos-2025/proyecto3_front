import axios from 'axios';

const API_URL = 'http://localhost:3000';

export type Usuario = {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  // Agrega otras propiedades según tu backend
};

// Cache para usuarios
let usuariosCache: Usuario[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minuto

const getAllUsuarios = async (): Promise<Usuario[]> => {
  const now = Date.now();
  
  // Si tenemos cache válido, usarlo
  if (usuariosCache && (now - lastFetchTime) < CACHE_DURATION) {
    return usuariosCache;
  }

  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  usuariosCache = response.data;
  lastFetchTime = now;
  
  return response.data;
};

export const getUsuarioById = async (id: string): Promise<Usuario> => {
  try {
    const usuarios = await getAllUsuarios();
    const usuario = usuarios.find(u => u._id === id || u.id === id);
    
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    
    return usuario;
  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error);
    throw error;
  }
};