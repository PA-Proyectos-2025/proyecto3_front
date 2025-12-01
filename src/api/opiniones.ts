const API_URL = 'http://localhost:3000';

export type Opinion = {
  _id: string;
  id?: string;
  descripcion?: string;
  comentario?: string;
};

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