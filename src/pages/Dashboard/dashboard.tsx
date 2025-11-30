// src/pages/Dashboard/dashboard.tsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import VolumenMensualChart, { type VolumenMensualItem } from "../../components/Charts/volumenMensual";
import "./dashboard.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type Filtros = {
  fechaCreacion?: string;
  fechaCierre?: string;
  clienteId?: string;
  proyectoId?: string;
  tipoReclamoId?: string;
  nivelCriticidadId?: string;
  deleted?: boolean;
};

export default function Dashboard() {
  const roleRaw = localStorage.getItem("role") || "USUARIO";
  const role = roleRaw.toUpperCase();
  const [volumenMensual, setVolumenMensual] = useState<VolumenMensualItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({});

  const token = localStorage.getItem("token");

  const fetchVolumenMensual = () => {
    if (role === "GERENTE") {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${API_URL}/estadisticas/volumen-mensual?${queryParams.toString()}`;
      console.log("🔗 URL con filtros:", url);

      fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((data) => {
          console.log("📊 Datos recibidos:", data);
          setVolumenMensual(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error en fetch:", err);
          setError(err.message || "Error desconocido");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumenMensual();
  }, [role, token, roleRaw]);

  useEffect(() => {
    if (role === "GERENTE") {
      fetchVolumenMensual();
    }
  }, [filtros]);

  const handleFiltroChange = (key: keyof Filtros, value: string | boolean) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Administración</h1>
          <div className="admin-badge">
            <div className="admin-avatar">👩‍💻</div>
            <span className="admin-text">{role}</span>
          </div>
        </div>

        {role === "GERENTE" && (
          <div className="filtros-container">
            <h3>Filtros para Volumen Mensual</h3>
            <label>
              Fecha Creación:
              <input
                type="date"
                value={filtros.fechaCreacion || ""}
                onChange={(e) => handleFiltroChange("fechaCreacion", e.target.value)}
              />
            </label>
            <label>
              Fecha Cierre:
              <input
                type="date"
                value={filtros.fechaCierre || ""}
                onChange={(e) => handleFiltroChange("fechaCierre", e.target.value)}
              />
            </label>
            <label>
              Cliente ID:
              <input
                type="text"
                value={filtros.clienteId || ""}
                onChange={(e) => handleFiltroChange("clienteId", e.target.value)}
              />
            </label>
            <label>
              Proyecto ID:
              <input
                type="text"
                value={filtros.proyectoId || ""}
                onChange={(e) => handleFiltroChange("proyectoId", e.target.value)}
              />
            </label>
            <label>
              Incluir eliminados:
              <input
                type="checkbox"
                checked={filtros.deleted || false}
                onChange={(e) => handleFiltroChange("deleted", e.target.checked)}
              />
            </label>
          </div>
        )}

        <div className="charts-container">
          {role === "GERENTE" ? (
            loading ? (
              <p>Cargando volumen mensual...</p>
            ) : error ? (
              <p style={{ color: "red" }}>Error: {error}</p>
            ) : volumenMensual.length > 0 ? (
              <VolumenMensualChart data={volumenMensual} />
            ) : (
              <p>No hay datos disponibles para el volumen mensual.</p>
            )
          ) : (
            <p>Acceso restringido: Solo para GERENTE.</p>
          )}
        </div>
      </div>
    </div>
  );
}
