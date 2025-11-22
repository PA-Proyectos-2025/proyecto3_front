import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getAreas, deleteArea } from "../../api/areas";
import "./area.css";

type Area = {
  id: string;
  nombre: string;
  descripcion: string;
};

export default function Areas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const data = await getAreas();
      console.log("Áreas recibidas:", data); // 👀 debug
      setAreas(data);
      setError("");
    } catch (err) {
      setError("Error al cargar las áreas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta área?")) {
      try {
        await deleteArea(id);
        await loadAreas(); // Recargar la lista
      } catch (err) {
        setError("Error al eliminar el área");
        console.error(err);
      }
    }
  };

  const filteredAreas = areas.filter((area) =>
    area.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAreas = filteredAreas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="areas-container">
        <Sidebar />
        <div className="areas-content">
          <div className="loading">Cargando áreas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="areas-container">
      <Sidebar />

      <div className="areas-content">
        <div className="areas-header">
          <h1 className="areas-title">Áreas</h1>
          <div className="admin-badge">
            <div className="admin-avatar"></div>
            <span className="admin-text">ADMINISTRADOR</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="areas-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar área"
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
          <table className="areas-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAreas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="no-data">
                    No se encontraron áreas
                  </td>
                </tr>
              ) : (
                paginatedAreas.map((area) => (
                  <tr key={area.id}>
                    <td className="td-nombre">{area.nombre}</td>
                    <td className="td-descripcion">{area.descripcion}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">✏️</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(area.id)}
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
