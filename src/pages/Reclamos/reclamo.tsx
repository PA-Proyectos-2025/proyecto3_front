import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getReclamos, deleteReclamo } from "../../api/reclamos";
import "./reclamo.css";

type Reclamo = {
  _id: string;
  titulo: string;
  area: string;
  fecha: string;
  estado: string;
  cliente: string;
  proyecto: string;
};

export default function Reclamos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    loadReclamos();
  }, []);

  const loadReclamos = async () => {
    try {
      setLoading(true);
      const data = await getReclamos();
      setReclamos(data);
      setError("");
    } catch (err) {
      setError("Error al cargar los reclamos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este reclamo?")) {
      try {
        await deleteReclamo(id);
        await loadReclamos();
      } catch (err) {
        setError("Error al eliminar el reclamo");
        console.error(err);
      }
    }
  };

  const filteredReclamos = reclamos.filter((r) =>
    r.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReclamos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReclamos = filteredReclamos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="reclamos-container">
        <Sidebar />
        <div className="reclamos-content">
          <div className="loading">Cargando reclamos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reclamos-container">
      <Sidebar />

      <div className="reclamos-content">
        <div className="reclamos-header">
          <h1 className="reclamos-title">Reclamos</h1>
          <div className="admin-badge">
            <div className="admin-avatar">R</div>
            <span className="admin-text">ADMINISTRADOR</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="reclamos-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar reclamo"
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
          <table className="reclamos-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Área</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th>Proyecto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReclamos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    No se encontraron reclamos
                  </td>
                </tr>
              ) : (
                paginatedReclamos.map((r) => (
                  <tr key={r._id}>
                    <td className="td-titulo">{r.titulo}</td>
                    <td>{r.area}</td>
                    <td>{r.fecha}</td>
                    <td>{r.estado}</td>
                    <td>{r.cliente}</td>
                    <td>{r.proyecto}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">✏️</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(r._id)}
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
