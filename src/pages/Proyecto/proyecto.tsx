import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getProyectos, deleteProyecto } from "../../api/proyectos";
import "./proyecto.css";

type Proyecto = {
  _id: string;
  nombre: string;
  descripcion?: string;
  cliente: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
};

export default function Proyectos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    loadProyectos();
  }, []);

  const loadProyectos = async () => {
    try {
      setLoading(true);
      const data = await getProyectos();
      setProyectos(data);
      setError("");
    } catch (err) {
      setError("Error al cargar los proyectos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        await deleteProyecto(id);
        await loadProyectos();
      } catch (err) {
        setError("Error al eliminar el proyecto");
        console.error(err);
      }
    }
  };

  const filteredProyectos = proyectos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProyectos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProyectos = filteredProyectos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="proyectos-container">
        <Sidebar />
        <div className="proyectos-content">
          <div className="loading">Cargando proyectos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="proyectos-container">
      <Sidebar />

      <div className="proyectos-content">
        <div className="proyectos-header">
          <h1 className="proyectos-title">Proyectos</h1>
          <div className="admin-badge">
            <div className="admin-avatar"></div>
            <span className="admin-text">ADMINISTRADOR</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="proyectos-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar proyecto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <button className="btn-add">
            Agregar <span className="plus-icon">+</span>
          </button>
        </div>

        <div className="table-container">
          <table className="proyectos-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cliente</th>
                <th>Fecha inicio/fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProyectos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    No se encontraron proyectos
                  </td>
                </tr>
              ) : (
                paginatedProyectos.map((p) => (
                  <tr key={p._id}>
                    <td>{p.nombre}</td>
                    <td>{p.descripcion}</td>
                    <td>{p.cliente}</td>
                    <td>{p.fechaInicio} - {p.fechaFin}</td>
                    <td>{p.estado}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">✏️</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(p._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            <span className="pagination-info">
              Página {currentPage}/{totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
