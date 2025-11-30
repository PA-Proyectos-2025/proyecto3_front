import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { 
  getSubareasWithFilters, 
  deleteSubarea, 
  getAreas, 
  type Subarea,
  type SubareaFilters 
} from "../../api/subareas";
import SubareaForm from "../../components/SubareaForm/subareaForm";
import "./subarea.css";

type Area = {
  _id: string;
  nombre: string;
};

export default function Subareas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subareas, setSubareas] = useState<Subarea[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubarea, setSelectedSubarea] = useState<Subarea | null>(null);
  
  // ✅ NUEVO: Estado para la paginación del backend
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    loadAreas();
  }, []);

  // ✅ NUEVO: Cargar subáreas cuando cambia la página o el término de búsqueda
  useEffect(() => {
    loadSubareas();
  }, [currentPage, searchTerm]);

  const loadAreas = async () => {
    try {
      const areasData = await getAreas();
      console.log('🏢 Áreas cargadas en Subareas.tsx:', areasData);
      setAreas(areasData);
    } catch (areaErr) {
      console.warn('⚠️ No se pudieron cargar áreas:', areaErr);
      setAreas([]);
    }
  };

  const loadSubareas = async () => {
  try {
    setLoading(true);
    
    const filters: SubareaFilters = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (searchTerm.trim()) {
      filters.nombre = searchTerm;
    }

    console.log('🔍 Cargando subáreas con filtros:', filters);

    const response = await getSubareasWithFilters(filters);
    
    console.log('📦 Respuesta COMPLETA del backend:', response);
    console.log('📊 response.meta:', response.meta);
    console.log('📄 response.meta.totalPages:', response.meta?.totalPages);
    console.log('📝 response.meta.total:', response.meta?.total);
    console.log('📋 response.data.length:', response.data?.length);

    setSubareas(response.data);
    setTotalPages(response.meta.totalPages);
    setTotalItems(response.meta.total);
    
    console.log('✅ Estado actualizado - totalPages:', response.meta.totalPages);

    setError("");
  } catch (err) {
    setError("Error al cargar las subáreas");
    console.error('❌ Error:', err);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta subárea?")) {
      try {
        await deleteSubarea(id);
        // Recargar la página actual
        await loadSubareas();
      } catch (err) {
        setError("Error al eliminar la subárea");
        console.error(err);
      }
    }
  };

  const handleEdit = (subarea: Subarea) => {
    setSelectedSubarea(subarea);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedSubarea(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedSubarea(null);
  };

  const handleFormSuccess = async () => {
    await loadSubareas();
    handleFormClose();
  };

  // ✅ MODIFICADO: Reiniciar a página 1 cuando cambia la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Volver a la primera página al buscar
  };

  const getAreaName = (areaId: string | null) => {
    if (!areaId) return "Sin asignar";
    const area = areas.find((a) => a._id === areaId);
    return area ? area.nombre : "Desconocido";
  };

  if (loading && subareas.length === 0) {
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
              placeholder="Buscar subárea por nombre"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => handleSearchChange("")}
              >
                ✕
              </button>
            )}
          </div>

          <button className="btn-add" onClick={handleAdd}>
            Agregar <span className="plus-icon">+</span>
          </button>
        </div>

        {/* ✅ NUEVO: Mostrar total de resultados */}
        {totalItems >= 0 && (
          <div style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
            Mostrando {subareas.length} de {totalItems} subárea(s)
          </div>
        )}

        <div className="table-container">
          <table className="subareas-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Área</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="no-data">
                    Cargando...
                  </td>
                </tr>
              ) : subareas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="no-data">
                    No se encontraron subáreas
                  </td>
                </tr>
              ) : (
                subareas.map((subarea) => (
                  <tr key={subarea._id}>
                    <td className="td-nombre">{subarea.nombre}</td>
                    <td className="td-descripcion">{subarea.descripcion || "Sin descripción"}</td>
                    <td className="td-area">
                      {subarea.areaNombre || getAreaName(subarea.areaId)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(subarea)}
                        >
                          ✏️
                        </button>
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

        {/* ✅ NUEVO: Paginación con datos del backend */}
        {totalPages > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              ←
            </button>
            <span className="pagination-info">
              Página {currentPage}/{totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
            >
              →
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <SubareaForm
          subarea={selectedSubarea}
          areas={areas}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}