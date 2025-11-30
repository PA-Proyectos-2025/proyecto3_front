import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getReclamos, deleteReclamo, getReclamo } from "../../api/reclamos";
import ReclamoForm from "../../components/ReclamoForm/reclamoForm";
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

type ReclamoDetail = {
  id: string;
  titulo?: string;
  descripcion?: string;
  archivos?: string[];
  tipoReclamoId?: string;
  prioridadId?: string;
  nivelCriticidadId?: string;
  proyectoId?: string;
  clienteId?: string;
  areaId?: string;
  subareaId?: string;
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

  const handleAdd = async () => {
    // Abrir modal de creación (el formulario cargará los catálogos necesarios)
    setEditingReclamo(null);
    setIsFormOpen(true);
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReclamo, setEditingReclamo] = useState<ReclamoDetail | null>(null);

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFormSuccess = async () => {
    await loadReclamos();
    handleFormClose();
  };

  const handleEdit = async (id: string) => {
    if (!id) {
      setError('ID de reclamo inválido');
      return;
    }
    try {
      setLoading(true);
      const rec = await getReclamo(id);
      const mapped: ReclamoDetail = {
        id: rec.id ?? rec._id ?? id,
        titulo: rec.titulo,
        descripcion: rec.descripcion,
        archivos: rec.archivos,
        tipoReclamoId: rec.tipoReclamoId,
        prioridadId: rec.prioridadId,
        nivelCriticidadId: rec.nivelCriticidadId,
        proyectoId: rec.proyectoId,
        clienteId: rec.clienteId,
        areaId: rec.areaId,
        subareaId: rec.subareaId,
      };
      setEditingReclamo(mapped);
      setIsFormOpen(true);
    } catch (err) {
      console.error('Error al obtener reclamo para editar', err);
      setError('No se pudo cargar el reclamo para editar');
    } finally {
      setLoading(false);
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
  const role = localStorage.getItem("role") || "USUARIO";

  return (
    <div className="reclamos-container">
      <Sidebar />

      <div className="reclamos-content">
        <div className="reclamos-header">
          <h1 className="reclamos-title">Reclamos</h1>
          <div className="admin-badge">
            <div className="admin-avatar">👩‍💻</div>
            <span className="admin-text">{role.toUpperCase()}</span>
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

          <button className="btn-add" onClick={handleAdd}>
            Agregar <span className="plus-icon">+</span>
          </button>
        </div>

        {isFormOpen && (
          <ReclamoForm reclamo={editingReclamo} onClose={handleFormClose} onSuccess={handleFormSuccess} />
        )}

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
                paginatedReclamos.map((r, idx) => {
                  const obj = r as unknown as { _id?: string; id?: string };
                  const rid = obj._id ?? obj.id ?? '';
                  return (
                    <tr key={rid ?? `r-${startIndex + idx}`}>
                      <td className="td-titulo">{r.titulo}</td>
                      <td>{r.area}</td>
                      <td>{r.fecha}</td>
                      <td>{r.estado}</td>
                      <td>{r.cliente}</td>
                      <td>{r.proyecto}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleEdit(rid)}>✏️</button>
                          <button
                            className="btn-delete"
                            onClick={() => rid ? handleDelete(rid) : setError('ID de reclamo inválido')}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
