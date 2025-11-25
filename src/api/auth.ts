export const login = async (email: string, password: string) => {
  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Error");

  return res.json();
};
