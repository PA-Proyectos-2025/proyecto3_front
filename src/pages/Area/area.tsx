import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { 
  getAreasWithFilters, 
  deleteArea, 
  getUsers, 
  type Area,
  type AreaFilters 
} from "../../api/areas";
import AreaForm from "../../components/AreaForm/areaForm";
import "./area.css";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function Areas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [areas, setAreas] = useState<Area[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  
  // ✅ NUEVO: Estado para la paginación del backend
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ NUEVO: Cargar áreas cuando cambia la página o el término de búsqueda
  useEffect(() => {
    loadAreas();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (userErr) {
      console.warn('⚠️ No se pudieron cargar usuarios:', userErr);
      setUsers([]);
    }
  };

  const loadAreas = async () => {
    try {
      setLoading(true);
      
      // ✅ NUEVO: Construir filtros para el backend
      const filters: AreaFilters = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Agregar filtro de búsqueda si existe
      if (searchTerm.trim()) {
        filters.nombre = searchTerm;
        // También puedes buscar por email:
        // filters.email = searchTerm;
      }

      console.log('🔍 Cargando áreas con filtros:', filters);

      // ✅ NUEVO: Llamar al endpoint con paginación
      const response = await getAreasWithFilters(filters);
      
      console.log('📦 Respuesta del backend:', response);

      setAreas(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.total);
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
        // Recargar la página actual
        await loadAreas();
      } catch (err) {
        setError("Error al eliminar el área");
        console.error(err);
      }
    }
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedArea(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedArea(null);
  };

  const handleFormSuccess = async () => {
    await loadAreas();
    handleFormClose();
  };

  // ✅ MODIFICADO: Reiniciar a página 1 cuando cambia la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Volver a la primera página al buscar
  };

  const getResponsableName = (id_responsable: string | null) => {
    if (!id_responsable) return "Sin asignar";
    const user = users.find((u) => u.id === id_responsable);
    return user ? user.name : "Desconocido";
  };

  if (loading && areas.length === 0) {
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
              placeholder="Buscar área por nombre"
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
        {totalItems > 0 && (
          <div style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
            Mostrando {areas.length} de {totalItems} área(s)
          </div>
        )}

        <div className="table-container">
          <table className="areas-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Email</th>
                <th>Responsable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="no-data">
                    Cargando...
                  </td>
                </tr>
              ) : areas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="no-data">
                    No se encontraron áreas
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr key={area.id}>
                    <td className="td-nombre">{area.nombre}</td>
                    <td className="td-descripcion">{area.descripcion}</td>
                    <td className="td-email">{area.email}</td>
                    <td className="td-responsable">
                      {getResponsableName(area.id_responsable_area)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(area)}
                        >
                          ✏️
                        </button>
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
        <AreaForm
          area={selectedArea}
          users={users}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}