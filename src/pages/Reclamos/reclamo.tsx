import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getReclamos, deleteReclamo, getReclamo } from "../../api/reclamos";
import ReclamoForm from "../../components/ReclamoForm/reclamoForm";
import { getClienteById } from "../../api/clientes";
import { getProyectoById } from "../../api/proyectos";
import { getPrioridadById } from "../../api/prioridad";
import { getNivelCriticidadById } from "../../api/nivelCriticidad";
import { getTipoReclamoById } from "../../api/tiposReclamos";

import "./reclamo.css";

type Reclamo = {
  _id: string;
  id?: string;
  titulo: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaCierre?: string | null;
  archivos: string[];
  clienteId: string;
  proyectoId: string;
  prioridadId: string;
  nivelCriticidadId: string;
  tipoReclamoId: string;
  deleted: boolean;
  deletedAt?: string | null;
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
};

export default function Reclamos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReclamo, setEditingReclamo] = useState<ReclamoDetail | null>(null);
  const [selectedReclamo, setSelectedReclamo] = useState<Reclamo | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Estados para los nombres de las relaciones
  const [detailsData, setDetailsData] = useState<{
    clienteNombre: string;
    proyectoNombre: string;
    prioridadNombre: string;
    nivelCriticidadNombre: string;
    tipoReclamoNombre: string;
  }>({
    clienteNombre: '',
    proyectoNombre: '',
    prioridadNombre: '',
    nivelCriticidadNombre: '',
    tipoReclamoNombre: '',
  });
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const itemsPerPage = 3;

  useEffect(() => {
    loadReclamos();
  }, []);

  const loadReclamos = async () => {
    try {
      setLoading(true);
      const data = await getReclamos();
      
      console.log('📋 Reclamos recibidos:', data);
      console.log('📋 Primer reclamo RAW:', JSON.stringify(data[0], null, 2));
      
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
        console.log("🗑️ Eliminando reclamo con ID:", id);
        await deleteReclamo(id);
        console.log("✅ Reclamo eliminado exitosamente");
        await loadReclamos();
      } catch (err: any) {
        console.error("💥 Error al eliminar:", err);
        setError(err.message || "Error al eliminar el reclamo");
      }
    }
  };

  const handleAdd = async () => {
    setEditingReclamo(null);
    setIsFormOpen(true);
  };

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

  const handleShowDetails = async (reclamo: Reclamo) => {
    setSelectedReclamo(reclamo);
    setShowDetailModal(true);
    setLoadingDetails(true);
    
    try {
      console.log('🔍 Cargando detalles para reclamo:', reclamo);
      console.log('📌 IDs a buscar:', {
        clienteId: reclamo.clienteId,
        proyectoId: reclamo.proyectoId,
        prioridadId: reclamo.prioridadId,
        nivelCriticidadId: reclamo.nivelCriticidadId,
        tipoReclamoId: reclamo.tipoReclamoId
      });
      let clienteNombre = reclamo.clienteId;
      let proyectoNombre = reclamo.proyectoId;
      let prioridadNombre = reclamo.prioridadId;
      let nivelCriticidadNombre = reclamo.nivelCriticidadId;
      let tipoReclamoNombre = reclamo.tipoReclamoId;

      try {
        const cliente = await getClienteById(reclamo.clienteId);
        console.log('✅ Cliente obtenido:', cliente);
        console.log('📝 Nombre del cliente:', cliente?.nombre);
        console.log('🔍 Propiedades del cliente:', Object.keys(cliente || {}));
        clienteNombre = cliente?.nombre || reclamo.clienteId;
      } catch (err) {
        console.error('❌ Error cargando cliente:', err);
        clienteNombre = reclamo.clienteId;
      }
      
      try {
        const proyecto = await getProyectoById(reclamo.proyectoId);
        console.log('✅ Proyecto obtenido:', proyecto);
        proyectoNombre = proyecto?.nombre || proyecto?.nombre || reclamo.proyectoId;
      } catch (err) {
        console.error('❌ Error cargando proyecto:', err);
      }
      
      try {
        const prioridad = await getPrioridadById(reclamo.prioridadId);
        console.log('✅ Prioridad obtenida:', prioridad);
        prioridadNombre = prioridad?.nombre || reclamo.prioridadId;
      } catch (err) {
        console.error('❌ Error cargando prioridad:', err);
      }
      
      try {
        const nivelCriticidad = await getNivelCriticidadById(reclamo.nivelCriticidadId);
        console.log('✅ Nivel de Criticidad obtenido:', nivelCriticidad);
        nivelCriticidadNombre = nivelCriticidad?.nombre || nivelCriticidad?.descripcion || reclamo.nivelCriticidadId;
      } catch (err) {
        console.error('❌ Error cargando nivel de criticidad:', err);
      }
      
      try {
        const tipoReclamo = await getTipoReclamoById(reclamo.tipoReclamoId);
        console.log('✅ Tipo de Reclamo obtenido:', tipoReclamo);
        tipoReclamoNombre = tipoReclamo?.nombre || tipoReclamo?.descripcion || reclamo.tipoReclamoId;
      } catch (err) {
        console.error('❌ Error cargando tipo de reclamo:', err);
      }
      
      setDetailsData({
        clienteNombre,
        proyectoNombre,
        prioridadNombre,
        nivelCriticidadNombre,
        tipoReclamoNombre,
      });
    } catch (err) {
      console.error('💥 Error general cargando detalles:', err);
      setDetailsData({
        clienteNombre: reclamo.clienteId,
        proyectoNombre: reclamo.proyectoId,
        prioridadNombre: reclamo.prioridadId,
        nivelCriticidadNombre: reclamo.nivelCriticidadId,
        tipoReclamoNombre: reclamo.tipoReclamoId,
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReclamo(null);
  };

  const filteredReclamos = reclamos.filter((r) =>
    r.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <span className="search-icon"></span>
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
          <ReclamoForm 
            reclamo={editingReclamo} 
            onClose={handleFormClose} 
            onSuccess={handleFormSuccess} 
          />
        )}

        <div className="table-container">
          <table className="reclamos-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha Creación</th>
                <th>Fecha Cierre</th>
                <th>Ver Más</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReclamos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
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
                      <td className="td-descripcion">
                        {r.descripcion 
                          ? (r.descripcion.length > 50 
                              ? r.descripcion.substring(0, 50) + '...' 
                              : r.descripcion)
                          : 'Sin descripción'}
                      </td>
                      <td>{new Date(r.fechaCreacion).toLocaleDateString()}</td>
                      <td>
                        {r.fechaCierre 
                          ? new Date(r.fechaCierre).toLocaleDateString() 
                          : '-'}
                      </td>
                      
                      <td>
                        <button 
                          className="btn-details"
                          onClick={() => handleShowDetails(r)}
                          title="Ver detalles completos"
                        >
                          👁️ Detalles
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit" 
                            onClick={() => handleEdit(rid)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => rid ? handleDelete(rid) : setError('ID de reclamo inválido')}
                            title="Eliminar"
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

        {totalPages > 1 && (
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

      {/* Modal de Detalles */}
      {showDetailModal && selectedReclamo && (
        <div className="modal-overlay" onClick={handleCloseDetailModal}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Detalles del Reclamo</h2>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Información General</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Título:</span>
                    <span className="detail-value">{selectedReclamo.titulo}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Descripción:</span>
                    <span className="detail-value">{selectedReclamo.descripcion || 'Sin descripción'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Fechas</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Fecha de Creación:</span>
                    <span className="detail-value">
                      {new Date(selectedReclamo.fechaCreacion).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha de Cierre:</span>
                    <span className="detail-value">
                      {selectedReclamo.fechaCierre 
                        ? new Date(selectedReclamo.fechaCierre).toLocaleString() 
                        : 'No cerrado'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Clasificación</h3>
                {loadingDetails ? (
                  <div className="loading-details">Cargando detalles...</div>
                ) : (
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Cliente:</span>
                      <span className="detail-value">{detailsData.clienteNombre}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Proyecto:</span>
                      <span className="detail-value">{detailsData.proyectoNombre}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Prioridad:</span>
                      <span className="detail-value">{detailsData.prioridadNombre}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nivel de Criticidad:</span>
                      <span className="detail-value">{detailsData.nivelCriticidadNombre}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tipo de Reclamo:</span>
                      <span className="detail-value">{detailsData.tipoReclamoNombre}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>Archivos Adjuntos</h3>
                <div className="detail-item">
                  <span className="detail-label">Cantidad de archivos:</span>
                  <span className="detail-value">{selectedReclamo.archivos?.length || 0}</span>
                </div>
                {selectedReclamo.archivos && selectedReclamo.archivos.length > 0 && (
                  <div className="archivos-list">
                    {selectedReclamo.archivos.map((archivo, idx) => (
                      <div key={idx} className="archivo-item">
                        📎 {archivo}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" onClick={handleCloseDetailModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}