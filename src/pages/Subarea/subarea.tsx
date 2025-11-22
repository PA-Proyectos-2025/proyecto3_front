import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getSubareas, deleteSubarea } from "../../api/subareas";
import "./subarea.css";

type Subarea = {
  _id: string;
  nombre: string;
  descripcion?: string;
  areaId: string;
  areaNombre: string;
};


export default function Subareas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subareas, setSubareas] = useState<Subarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    loadSubareas();
  }, []);

  const loadSubareas = async () => {
    try {
      setLoading(true);
      const data = await getSubareas();
      setSubareas(data);
      setError("");
    } catch (err) {
      setError("Error al cargar las subáreas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta subárea?")) {
      try {
        await deleteSubarea(id);
        await loadSubareas();
      } catch (err) {
        setError("Error al eliminar la subárea");
        console.error(err);
      }
    }
  };

  const filteredSubareas = subareas.filter((subarea) =>
    subarea.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubareas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubareas = filteredSubareas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="subareas-container">
        <Sidebar />
        <div className="subareas-content">
          <div className="loading">Cargando subáreas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="subareas-container">
      <Sidebar />

      <div className="subareas-content">
        <div className="subareas-header">
          <h1 className="subareas-title">Subáreas</h1>
          <div className="admin-badge">
            <div className="admin-avatar"></div>
            <span className="admin-text">ADMINISTRADOR</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="subareas-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar subárea"
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
          <table className="subareas-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Área asociada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubareas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="no-data">
                    No se encontraron subáreas
                  </td>
                </tr>
              ) : (
                paginatedSubareas.map((subarea) => (
                  <tr key={subarea._id}>
                    <td className="td-nombre">{subarea.nombre}</td>
                    <td>{subarea.areaNombre}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">✏️</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(subarea._id)}
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
