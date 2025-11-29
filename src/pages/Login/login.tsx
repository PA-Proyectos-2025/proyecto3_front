import { useState } from "react";
import { login } from "../../api/auth";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.access_token);
      window.location.href = "/dashboard";
    } catch (e) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <input
          type="email"
          placeholder="vanzettijuan@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}