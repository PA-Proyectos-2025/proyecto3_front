import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { 
  getHistoriales, 
  deleteHistorial, 
  type HistorialReclamo 
} from "../../api/historialReclamos"; 
import HistorialForm from "../../components/HistorialForm/historialForm";
import "./historial.css";

export default function Historial() { 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [historiales, setHistoriales] = useState<HistorialReclamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState<HistorialReclamo | null>(null);
  
  const itemsPerPage = 3; 

  useEffect(() => {
    loadHistoriales();
  }, []);

  const loadHistoriales = async () => {
    try {
      setLoading(true);
      console.log("🚀 Cargando historiales de reclamos...");

      const data = await getHistoriales();
      console.log("📦 Datos recibidos del backend:", data);

      setHistoriales(data);
      console.log("✅ Estado 'historiales' actualizado:", data);

      setError("");
    } catch (err: any) {
      console.error("💥 Error de conexión o autenticación:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Error de conexión: Asegúrate de que el servidor backend esté corriendo en http://localhost:3000.");
      } else {
        setError(err.message || "Error al cargar los historiales de reclamos");
      }
    } finally {
      setLoading(false);
      console.log("⏳ Loading finalizado. Estado:", loading);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de historial?")) {
      try {
        console.log("🗑️ Eliminando historial con ID:", id);
        await deleteHistorial(id); 
        console.log("✅ Historial eliminado exitosamente");
        await loadHistoriales();
        alert("Registro de historial eliminado correctamente");
      } catch (err: any) {
        console.error("💥 Error al eliminar:", err);
        setError(err.message || "Error al eliminar el registro de historial");
        alert("Error al eliminar el registro de historial");
      }
    }
  };

  const handleEdit = (historial: HistorialReclamo) => {
    console.log("✏️ Editando historial:", historial);
    setSelectedHistorial(historial);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    console.log("➕ Agregando nuevo historial");
    setSelectedHistorial(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    console.log("❌ Cerrando formulario");
    setIsFormOpen(false);
    setSelectedHistorial(null);
  };

  const handleFormSuccess = async () => {
    console.log("✅ Formulario guardado con éxito, recargando historiales...");
    await loadHistoriales();
    handleFormClose();
  };

  const lowerSearchTerm = searchTerm.toLowerCase();
  const filteredHistoriales = historiales.filter((historial) => {
    const match =
      historial.reclamoId.toLowerCase().includes(lowerSearchTerm) ||
      historial.estadoReclamoId.toLowerCase().includes(lowerSearchTerm) ||
      historial.usuarioResponsableId.toLowerCase().includes(lowerSearchTerm);

    console.log("🔍 Evaluando historial:", historial, "Match:", match);
    return match;
  });

  console.log("📊 Historiales filtrados:", filteredHistoriales);

  const totalPages = Math.ceil(filteredHistoriales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistoriales = filteredHistoriales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log("📑 Página actual:", currentPage);
  console.log("📑 Historiales paginados:", paginatedHistoriales);

  if (loading) {
    return (
      <div className="historiales-container">
        <Sidebar />
        <div className="historiales-content">
          <div className="loading">Cargando historiales de reclamos...</div>
        </div>
      </div>
    );
  }

  const role = localStorage.getItem("role") || "USUARIO";

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div className="historiales-container">
      <Sidebar />

      <div className="historiales-content">
        <div className="historiales-header">
          <h1 className="historiales-title">Historiales de Reclamos</h1>
          <div className="admin-badge">
            <div className="admin-avatar">📄</div>
            <span className="admin-text">{role.toUpperCase()}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="historiales-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por ID de Reclamo, Estado o Usuario"
              value={searchTerm}
              onChange={(e) => {
                console.log("⌨️ SearchTerm cambiado:", e.target.value);
                setSearchTerm(e.target.value);
              }}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => {
                  console.log("🧹 Limpiando búsqueda");
                  setSearchTerm("");
                }}
              >
                ✕
              </button>
            )}
          </div>

          <button className="btn-add" onClick={handleAdd}>
            Agregar <span className="plus-icon">+</span>
          </button>
        </div>

        <div className="table-container">
          <table className="historiales-table">
            <thead>
              <tr>
                <th>ID Historial</th>
                <th>ID Reclamo</th>
                <th>ID Estado</th>
                <th>Usuario Resp.</th>
                <th>Fecha/Hora Inicio</th>
                <th>Fecha/Hora Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistoriales.map((historial, index) => {
                console.log("📝 Renderizando fila:", historial);
                return (
                  <tr key={historial._id || `row-${index}`}>
                    <td className="td-id-historial">{historial._id}</td>
                    <td>{historial.reclamoId}</td>
                    <td>{historial.estadoReclamoId}</td>
                    <td>{historial.usuarioResponsableId}</td>
                    <td>{formatDateTime(historial.fechaHoraInicio)}</td>
                    <td>{formatDateTime(historial.fechaHoraFin)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(historial)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(historial._id)}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => {
                console.log("⬅️ Página anterior");
                setCurrentPage(Math.max(1, currentPage - 1));
              }}
              disabled={currentPage === 1}
            >
              ←
            </button>
            <span className="pagination-info">
              Página {currentPage}/{totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => {
                console.log("➡️ Página siguiente");
                setCurrentPage(Math.min(totalPages, currentPage + 1));
              }}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <HistorialForm
          historial={selectedHistorial}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
