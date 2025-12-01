import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import VolumenMensualChart, { type VolumenMensualItem } from "../../components/Charts/volumenMensual";
import EstadoActualChart from "../../components/Charts/estadoActual";
import ReclamoByResponsableChart from "../../components/Charts/reclamoPorResponsable";
import TiposReclamosChart from "../../components/Charts/tiposReclamos";
import "./dashboard.css";
import TiempoPromResChart from "../../components/Charts/tiempoPromedioRes";
import FeedbackPorCalificacionChart from "../../components/Charts/feedback";
import TopProyectosChart, { type TopProyectoItem } from "../../components/Charts/top-proyectos"; 
import DistribucionPorEstadoChart from "../../components/Charts/distribucionPorEstado";

// 1. Importar el nuevo componente y su tipo
import BalanceCargaChart, { type BalanceCargaItem } from "../../components/Charts/balanceCarga"; 

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Dashboard() {
  const roleRaw = localStorage.getItem("role") || "USUARIO";
  const role = roleRaw.toUpperCase();
  const token = localStorage.getItem("token");

  // ============= Estados GERENTE =============
  const [volumenMensual, setVolumenMensual] = useState<VolumenMensualItem[]>([]);
  const [filtrosVolumen, setFiltrosVolumen] = useState({
    fechaCreacion: "",
    fechaCierre: "",
    clienteId: "",
    proyectoId: "",
    deleted: false,
  });

  const [estadoActual, setEstadoActual] = useState<any[]>([]);
  const [filtrosEstado, setFiltrosEstado] = useState({
    estadoReclamoId: "",
    usuarioResponsableId: "",
    opinionId: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    deleted: false,
  });

  const [tiempoPromRes, setTiempoPromRes] = useState<any[]>([]);
  const [filtrosTiempoPromRes, setFiltrosTiempoProm] = useState({
    clienteId: "",
    proyectoId: "",
    tipoReclamoId: "",
    nivelCriticidadId: "",
    deleted: false,
  });

  const [reclamosResponsables, setReclamosResponsables] = useState<any[]>([]);
  const [filtrosReclamosResponsables, setFiltrosReclamosResponsables] = useState({
    reclamoId: "",
    estadoReclamoId: "",
    usuarioResponsableId: "",
    opinionId: "",
    deleted: false,
  });

  const [tiposReclamos, setTiposReclamos] = useState<any[]>([]);

  // ============= Estados ADMIN =============
  const [feedback, setFeedback] = useState<any[]>([]);
  const [filtrosFeedback, setFiltrosFeedback] = useState({
    reclamoId: "",
    estadoReclamoId: "",
    usuarioResponsableId: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    opinionId: "",
    deleted: false,
  });
  
  const [topProyectos, setTopProyectos] = useState<TopProyectoItem[]>([]);
  const [filtrosTopProyectos, setFiltrosTopProyectos] = useState({
    estadoReclamoId: "",
    usuarioResponsableId: "",
    opinionId: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    deleted: false,
  });

  // 2. Nuevo estado y filtros para Balance de Carga
  const [balanceCarga, setBalanceCarga] = useState<BalanceCargaItem[]>([]);
  const [filtrosBalanceCarga, setFiltrosBalanceCarga] = useState({
    estadoReclamoId: "",
    usuarioResponsableId: "",
    opinionId: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    deleted: false,
  });

  // ============= Estados RESPONSABLE_AREA =============
  const [distribucionPorEstado, setDistribucionPorEstado] = useState<any[]>([]);
  const [filtrosDistribucion, setFiltrosDistribucion] = useState({
    estadoReclamoId: "",
    usuarioResponsableId: "",
    opinionId: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    deleted: false,
  });

  const [opinionesPorResponsable, setOpinionesPorResponsable] = useState<any[]>([]);
  const [filtrosOpiniones, setFiltrosOpiniones] = useState({
    estadoReclamoId: "",
    usuarioResponsableId: "",
    opinionId: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    deleted: false,
  });

  const [reclamosPorResponsable, setReclamosPorResponsable] = useState<any[]>([]);
  const [filtrosReclamosResp, setFiltrosReclamosResp] = useState({
    estadoReclamoId: "",
    usuarioResponsableId: "",
    opinionId: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    deleted: false,
  });

  // Helper para query string
  const buildQuery = (filtros: Record<string, any>) => {
    const query = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        query.append(key, value.toString());
      }
    });
    return query.toString();
  };

  // ============= Fetchs GERENTE =============
  const fetchVolumenMensual = () => {
    console.log("📥 Filtros Volumen Mensual:", filtrosVolumen);
    const url = `${API_URL}/estadisticas/volumen-mensual?${buildQuery(filtrosVolumen)}`;
    console.log("🔗 URL Volumen Mensual:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setVolumenMensual)
      .catch((err) => console.error("❌ Error volumen mensual:", err));
  };

  const fetchEstadoActual = () => {
    console.log("📥 Filtros Estado Actual:", filtrosEstado);
    const url = `${API_URL}/estadisticas/estado-actual?${buildQuery(filtrosEstado)}`;
    console.log("🔗 URL Estado Actual:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setEstadoActual)
      .catch((err) => console.error("❌ Error estado actual:", err));
  };

  const fetchTiempoPromRes = () => {
    console.log("📥 Filtros Tiempo Promedio Resolución:", filtrosTiempoPromRes);
    const url = `${API_URL}/estadisticas/tiempo-promedio-resolucion?${buildQuery(filtrosTiempoPromRes)}`;
    console.log("🔗 URL Tiempo Promedio Resolución:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setTiempoPromRes)
      .catch((err) => console.error("❌ Error tiempo promedio de resolución:", err));
  };

  const fetchReclamosResponsables = () => {
    console.log("📥 Filtros Reclamos con Responsables Asignados:", filtrosReclamosResponsables);
    const url = `${API_URL}/estadisticas/reclamos-responsables?${buildQuery(filtrosReclamosResponsables)}`;
    console.log("📊 Fetch Reclamos por Responsable");
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setReclamosResponsables)
      .catch((err) => console.error("❌ Error reclamos responsables:", err));
  };

  const fetchTiposReclamos = () => {
    console.log("📊 Fetch Tipos de Reclamos");
    fetch(`${API_URL}/estadisticas/tipos-reclamos-comunes`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setTiposReclamos)
      .catch((err) => console.error("❌ Error tipos reclamos:", err));
  };

  // ============= Fetchs ADMIN =============
  const fetchFeedback = () => {
    const url = `${API_URL}/estadisticas/feedback?${buildQuery(filtrosFeedback)}`;
    console.log("📊 Fetch Feedback");
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setFeedback)
      .catch((err) => console.error("❌ Error feedback:", err));
  };

  const fetchTopProyectos = () => {
    console.log("📥 Filtros Top Proyectos:", filtrosTopProyectos);
    const url = `${API_URL}/estadisticas/top-proyectos?${buildQuery(filtrosTopProyectos)}`;
    console.log("🔗 URL Top Proyectos:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setTopProyectos)
      .catch((err) => console.error("❌ Error top proyectos:", err));
  };

  // 3. Nueva función de fetch para Balance de Carga
  const fetchBalanceCarga = () => {
    console.log("📥 Filtros Balance de Carga:", filtrosBalanceCarga);
    const url = `${API_URL}/estadisticas/balance-carga?${buildQuery(filtrosBalanceCarga)}`;
    console.log("🔗 URL Balance de Carga:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setBalanceCarga)
      .catch((err) => console.error("❌ Error balance de carga:", err));
  };

  // ============= Fetchs RESPONSABLE_AREA =============
  const fetchDistribucionPorEstado = () => {
    console.log("📥 Filtros Distribución por Estado:", filtrosDistribucion);
    const url = `${API_URL}/estadisticas/distribucion-por-estado?${buildQuery(filtrosDistribucion)}`;
    console.log("🔗 URL Distribución por Estado:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setDistribucionPorEstado)
      .catch((err) => console.error("❌ Error distribución por estado:", err));
  };

  const fetchOpinionesPorResponsable = () => {
    console.log("📥 Filtros Opiniones por Responsable:", filtrosOpiniones);
    const url = `${API_URL}/estadisticas/opiniones-por-responsable?${buildQuery(filtrosOpiniones)}`;
    console.log("🔗 URL Opiniones por Responsable:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setOpinionesPorResponsable)
      .catch((err) => console.error("❌ Error opiniones por responsable:", err));
  };

  const fetchReclamosPorResponsable = () => {
    console.log("📥 Filtros Reclamos por Responsable:", filtrosReclamosResp);
    const url = `${API_URL}/estadisticas/reclamos-por-responsable?${buildQuery(filtrosReclamosResp)}`;
    console.log("🔗 URL Reclamos por Responsable:", url);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setReclamosPorResponsable)
      .catch((err) => console.error("❌ Error reclamos por responsable:", err));
  };

  // ============= useEffects iniciales =============
  useEffect(() => {
    if (role === "GERENTE") {
      fetchVolumenMensual();
      fetchEstadoActual();
      fetchTiempoPromRes();
      fetchReclamosResponsables();
      fetchTiposReclamos();
    }
    // Agregar fetchTopProyectos y fetchBalanceCarga al useEffect inicial de ADMIN
    if (role === "ADMIN") {
      fetchFeedback();
      fetchTopProyectos(); 
      fetchBalanceCarga(); // <-- NUEVO FETCH INICIAL
    }
    if (role === "RESPONSABLE_AREA") {
      fetchDistribucionPorEstado();
      fetchOpinionesPorResponsable();
      fetchReclamosPorResponsable();
    }
  }, [role, token]);

  // ============= useEffects para filtros GERENTE =============
  useEffect(() => {
    if (role === "GERENTE") fetchVolumenMensual();
  }, [filtrosVolumen]);

  useEffect(() => {
    if (role === "GERENTE") fetchEstadoActual();
  }, [filtrosEstado]);

  useEffect(() => {
    if (role === "GERENTE") fetchTiempoPromRes();
  }, [filtrosTiempoPromRes]);

  useEffect(() => {
    if (role === "GERENTE") fetchReclamosResponsables();
  }, [filtrosReclamosResponsables]);

  // ============= useEffects para filtros ADMIN =============
  useEffect(() => {
    if (role === "ADMIN") fetchFeedback();
  }, [filtrosFeedback]);

  useEffect(() => {
    if (role === "ADMIN") fetchTopProyectos();
  }, [filtrosTopProyectos]);

  // 4. Agregar useEffect para filtros de Balance de Carga de ADMIN
  useEffect(() => {
    if (role === "ADMIN") fetchBalanceCarga();
  }, [filtrosBalanceCarga]);

  // ============= useEffects para filtros RESPONSABLE_AREA =============
  useEffect(() => {
    if (role === "RESPONSABLE_AREA") fetchDistribucionPorEstado();
  }, [filtrosDistribucion]);

  useEffect(() => {
    if (role === "RESPONSABLE_AREA") fetchOpinionesPorResponsable();
  }, [filtrosOpiniones]);

  useEffect(() => {
    if (role === "RESPONSABLE_AREA") fetchReclamosPorResponsable();
  }, [filtrosReclamosResp]);

  // ============= RENDER =============
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

        {/* ... SECCIÓN GERENTE (sin cambios en el render) ... */}
        {role === "GERENTE" && (
          <>
            {/* Volumen Mensual */}
            <div className="filtros-container">
              <h3>Filtros: Volumen Mensual</h3>
              <div className="filtros-grid">
                <label>
                  Fecha Creación:
                  <input type="date" value={filtrosVolumen.fechaCreacion} onChange={(e) => setFiltrosVolumen({ ...filtrosVolumen, fechaCreacion: e.target.value })} />
                </label>
                <label>
                  Fecha Cierre:
                  <input type="date" value={filtrosVolumen.fechaCierre} onChange={(e) => setFiltrosVolumen({ ...filtrosVolumen, fechaCierre: e.target.value })} />
                </label>
                <label>
                  Cliente ID:
                  <input type="text" value={filtrosVolumen.clienteId} onChange={(e) => setFiltrosVolumen({ ...filtrosVolumen, clienteId: e.target.value })} />
                </label>
                <label>
                  Proyecto ID:
                  <input type="text" value={filtrosVolumen.proyectoId} onChange={(e) => setFiltrosVolumen({ ...filtrosVolumen, proyectoId: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosVolumen.deleted} onChange={(e) => setFiltrosVolumen({ ...filtrosVolumen, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <VolumenMensualChart data={volumenMensual} />
              </div>
            </div>

            {/* Estado Actual */}
            <div className="filtros-container">
              <h3>Filtros: Estado Actual</h3>
              <div className="filtros-grid">
                <label>
                  Estado Reclamo ID:
                  <input type="text" value={filtrosEstado.estadoReclamoId} onChange={(e) => setFiltrosEstado({ ...filtrosEstado, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Responsable ID:
                  <input type="text" value={filtrosEstado.usuarioResponsableId} onChange={(e) => setFiltrosEstado({ ...filtrosEstado, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinion ID:
                  <input type="text" value={filtrosEstado.opinionId} onChange={(e) => setFiltrosEstado({ ...filtrosEstado, opinionId: e.target.value })} />
                </label>
                <label>
                  Fecha Inicio:
                  <input type="date" value={filtrosEstado.fechaHoraInicio} onChange={(e) => setFiltrosEstado({ ...filtrosEstado, fechaHoraInicio: e.target.value })} />
                </label>
                <label>
                  Fecha Fin:
                  <input type="date" value={filtrosEstado.fechaHoraFin} onChange={(e) => setFiltrosEstado({ ...filtrosEstado, fechaHoraFin: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosEstado.deleted} onChange={(e) => setFiltrosEstado({ ...filtrosEstado, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <EstadoActualChart data={estadoActual} />
              </div>
            </div>

            {/* Tiempo Promedio Resolución */}
            <div className="filtros-container">
              <h3>Filtros: Tiempo Promedio Resolución</h3>
              <div className="filtros-grid">
                <label>
                  Cliente ID:
                  <input type="text" value={filtrosTiempoPromRes.clienteId} onChange={(e) => setFiltrosTiempoProm({ ...filtrosTiempoPromRes, clienteId: e.target.value })} />
                </label>
                <label>
                  Proyecto ID:
                  <input type="text" value={filtrosTiempoPromRes.proyectoId} onChange={(e) => setFiltrosTiempoProm({ ...filtrosTiempoPromRes, proyectoId: e.target.value })} />
                </label>
                <label>
                  Tipo Reclamo ID:
                  <input type="text" value={filtrosTiempoPromRes.tipoReclamoId} onChange={(e) => setFiltrosTiempoProm({ ...filtrosTiempoPromRes, tipoReclamoId: e.target.value })} />
                </label>
                <label>
                  Nivel Criticidad ID:
                  <input type="text" value={filtrosTiempoPromRes.nivelCriticidadId} onChange={(e) => setFiltrosTiempoProm({ ...filtrosTiempoPromRes, nivelCriticidadId: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosTiempoPromRes.deleted} onChange={(e) => setFiltrosTiempoProm({ ...filtrosTiempoPromRes, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <TiempoPromResChart data={tiempoPromRes} />
              </div>
            </div>

            {/* Reclamos con Responsables */}
            <div className="filtros-container">
              <h3>Filtros: Reclamos con Responsables Asignados</h3>
              <div className="filtros-grid">
                <label>
                  Reclamo Id:
                  <input type="text" value={filtrosReclamosResponsables.reclamoId} onChange={(e) => setFiltrosReclamosResponsables({ ...filtrosReclamosResponsables, reclamoId: e.target.value })} />
                </label>
                <label>
                  Estado Reclamo Id:
                  <input type="text" value={filtrosReclamosResponsables.estadoReclamoId} onChange={(e) => setFiltrosReclamosResponsables({ ...filtrosReclamosResponsables, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Usuario Responsable Id:
                  <input type="text" value={filtrosReclamosResponsables.usuarioResponsableId} onChange={(e) => setFiltrosReclamosResponsables({ ...filtrosReclamosResponsables, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinion Id:
                  <input type="text" value={filtrosReclamosResponsables.opinionId} onChange={(e) => setFiltrosReclamosResponsables({ ...filtrosReclamosResponsables, opinionId: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosReclamosResponsables.deleted} onChange={(e) => setFiltrosReclamosResponsables({ ...filtrosReclamosResponsables, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <ReclamoByResponsableChart data={reclamosResponsables} />
              </div>
            </div>

            {/* Tipos de Reclamos */}
            <div className="charts-container">
              <div className="chart-box">
                <TiposReclamosChart data={tiposReclamos} />
              </div>
            </div>
          </>
        )}

        {/* ===================== SECCIÓN ADMIN ===================== */}
        {role === "ADMIN" && (
          <>
            {/* Balance de Carga por Área/Responsable */}
            
            
            {/* Feedback */}
            <div className="filtros-container">
              <h3>Filtros: Feedback</h3>
              <div className="filtros-grid">
                <label>
                  Reclamo ID:
                  <input type="text" value={filtrosFeedback.reclamoId} onChange={(e) => setFiltrosFeedback({ ...filtrosFeedback, reclamoId: e.target.value })} />
                </label>
                <label>
                  Estado Reclamo ID:
                  <input type="text" value={filtrosFeedback.estadoReclamoId} onChange={(e) => setFiltrosFeedback({ ...filtrosFeedback, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Usuario Responsable ID:
                  <input type="text" value={filtrosFeedback.usuarioResponsableId} onChange={(e) => setFiltrosFeedback({ ...filtrosFeedback, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinión ID:
                  <input type="text" value={filtrosFeedback.opinionId} onChange={(e) => setFiltrosFeedback({ ...filtrosFeedback, opinionId: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosFeedback.deleted} onChange={(e) => setFiltrosFeedback({ ...filtrosFeedback, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <FeedbackPorCalificacionChart data={feedback} />
              </div>
            </div>


            {/* Top Proyectos */}
            <div className="filtros-container">
              <h3>Filtros: Top Proyectos</h3>
              <div className="filtros-grid">
                <label>
                  Estado Reclamo ID:
                  <input type="text" value={filtrosTopProyectos.estadoReclamoId} onChange={(e) => setFiltrosTopProyectos({ ...filtrosTopProyectos, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Usuario Responsable ID:
                  <input type="text" value={filtrosTopProyectos.usuarioResponsableId} onChange={(e) => setFiltrosTopProyectos({ ...filtrosTopProyectos, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinión ID:
                  <input type="text" value={filtrosTopProyectos.opinionId} onChange={(e) => setFiltrosTopProyectos({ ...filtrosTopProyectos, opinionId: e.target.value })} />
                </label>
                <label>
                  Fecha Inicio:
                  <input type="date" value={filtrosTopProyectos.fechaHoraInicio} onChange={(e) => setFiltrosTopProyectos({ ...filtrosTopProyectos, fechaHoraInicio: e.target.value })} />
                </label>
                <label>
                  Fecha Fin:
                  <input type="date" value={filtrosTopProyectos.fechaHoraFin} onChange={(e) => setFiltrosTopProyectos({ ...filtrosTopProyectos, fechaHoraFin: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosTopProyectos.deleted} onChange={(e) => setFiltrosTopProyectos({ ...filtrosTopProyectos, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <TopProyectosChart data={topProyectos} />
              </div>
            </div>

            <div className="filtros-container">
              <h3>Filtros: Balance de Carga</h3>
              <div className="filtros-grid">
                <label>
                  Estado Reclamo ID:
                  <input type="text" value={filtrosBalanceCarga.estadoReclamoId} onChange={(e) => setFiltrosBalanceCarga({ ...filtrosBalanceCarga, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Usuario Responsable ID:
                  <input type="text" value={filtrosBalanceCarga.usuarioResponsableId} onChange={(e) => setFiltrosBalanceCarga({ ...filtrosBalanceCarga, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinión ID:
                  <input type="text" value={filtrosBalanceCarga.opinionId} onChange={(e) => setFiltrosBalanceCarga({ ...filtrosBalanceCarga, opinionId: e.target.value })} />
                </label>
                <label>
                  Fecha Inicio:
                  <input type="date" value={filtrosBalanceCarga.fechaHoraInicio} onChange={(e) => setFiltrosBalanceCarga({ ...filtrosBalanceCarga, fechaHoraInicio: e.target.value })} />
                </label>
                <label>
                  Fecha Fin:
                  <input type="date" value={filtrosBalanceCarga.fechaHoraFin} onChange={(e) => setFiltrosBalanceCarga({ ...filtrosBalanceCarga, fechaHoraFin: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosBalanceCarga.deleted} onChange={(e) => setFiltrosBalanceCarga({ ...filtrosBalanceCarga, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            
            <div className="charts-container">
              <div className="chart-box">
                {/* 5. Renderizar el nuevo BalanceCargaChart */}
                <BalanceCargaChart data={balanceCarga} />
              </div>
            </div>
          </>
        )}

        {/* ... SECCIÓN RESPONSABLE_AREA (sin cambios en el render) ... */}
        {role === "RESPONSABLE_AREA" && (
          <>
            {/* Distribución por Estado */}
            <div className="filtros-container">
              <h3>Filtros: Distribución por Estado</h3>
              <div className="filtros-grid">
                <label>
                  Estado Reclamo ID:
                  <input type="text" value={filtrosDistribucion.estadoReclamoId} onChange={(e) => setFiltrosDistribucion({ ...filtrosDistribucion, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Usuario Responsable ID:
                  <input type="text" value={filtrosDistribucion.usuarioResponsableId} onChange={(e) => setFiltrosDistribucion({ ...filtrosDistribucion, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinión ID:
                  <input type="text" value={filtrosDistribucion.opinionId} onChange={(e) => setFiltrosDistribucion({ ...filtrosDistribucion, opinionId: e.target.value })} />
                </label>
                <label>
                  Fecha Inicio:
                  <input type="date" value={filtrosDistribucion.fechaHoraInicio} onChange={(e) => setFiltrosDistribucion({ ...filtrosDistribucion, fechaHoraInicio: e.target.value })} />
                </label>
                <label>
                  Fecha Fin:
                  <input type="date" value={filtrosDistribucion.fechaHoraFin} onChange={(e) => setFiltrosDistribucion({ ...filtrosDistribucion, fechaHoraFin: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosDistribucion.deleted} onChange={(e) => setFiltrosDistribucion({ ...filtrosDistribucion, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <DistribucionPorEstadoChart data={distribucionPorEstado} />
              </div>
            </div>

            {/* Opiniones por Responsable */}
            <div className="filtros-container">
              <h3>Filtros: Opiniones por Responsable</h3>
              <div className="filtros-grid">
                <label>
                  Estado Reclamo ID:
                  <input type="text" value={filtrosOpiniones.estadoReclamoId} onChange={(e) => setFiltrosOpiniones({ ...filtrosOpiniones, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Usuario Responsable ID:
                  <input type="text" value={filtrosOpiniones.usuarioResponsableId} onChange={(e) => setFiltrosOpiniones({ ...filtrosOpiniones, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinión ID:
                  <input type="text" value={filtrosOpiniones.opinionId} onChange={(e) => setFiltrosOpiniones({ ...filtrosOpiniones, opinionId: e.target.value })} />
                </label>
                <label>
                  Fecha Inicio:
                  <input type="date" value={filtrosOpiniones.fechaHoraInicio} onChange={(e) => setFiltrosOpiniones({ ...filtrosOpiniones, fechaHoraInicio: e.target.value })} />
                </label>
                <label>
                  Fecha Fin:
                  <input type="date" value={filtrosOpiniones.fechaHoraFin} onChange={(e) => setFiltrosOpiniones({ ...filtrosOpiniones, fechaHoraFin: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosOpiniones.deleted} onChange={(e) => setFiltrosOpiniones({ ...filtrosOpiniones, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <FeedbackPorCalificacionChart data={opinionesPorResponsable} />
              </div>
            </div>

            {/* Cantidad de Reclamos por Responsable */}
            <div className="filtros-container">
              <h3>Filtros: Cantidad de Reclamos por Responsable</h3>
              <div className="filtros-grid">
                <label>
                  Estado Reclamo ID:
                  <input type="text" value={filtrosReclamosResp.estadoReclamoId} onChange={(e) => setFiltrosReclamosResp({ ...filtrosReclamosResp, estadoReclamoId: e.target.value })} />
                </label>
                <label>
                  Usuario Responsable ID:
                  <input type="text" value={filtrosReclamosResp.usuarioResponsableId} onChange={(e) => setFiltrosReclamosResp({ ...filtrosReclamosResp, usuarioResponsableId: e.target.value })} />
                </label>
                <label>
                  Opinión ID:
                  <input type="text" value={filtrosReclamosResp.opinionId} onChange={(e) => setFiltrosReclamosResp({ ...filtrosReclamosResp, opinionId: e.target.value })} />
                </label>
                <label>
                  Fecha Inicio:
                  <input type="date" value={filtrosReclamosResp.fechaHoraInicio} onChange={(e) => setFiltrosReclamosResp({ ...filtrosReclamosResp, fechaHoraInicio: e.target.value })} />
                </label>
                <label>
                  Fecha Fin:
                  <input type="date" value={filtrosReclamosResp.fechaHoraFin} onChange={(e) => setFiltrosReclamosResp({ ...filtrosReclamosResp, fechaHoraFin: e.target.value })} />
                </label>
                <label>
                  Incluir eliminados:
                  <input type="checkbox" checked={filtrosReclamosResp.deleted} onChange={(e) => setFiltrosReclamosResp({ ...filtrosReclamosResp, deleted: e.target.checked })} />
                </label>
              </div>
            </div>
            <div className="charts-container">
              <div className="chart-box">
                <ReclamoByResponsableChart data={reclamosPorResponsable} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}