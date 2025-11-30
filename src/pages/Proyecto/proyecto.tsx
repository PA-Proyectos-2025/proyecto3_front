import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { 
  getProyectos, 
  deleteProyecto,
  getEstadosProyecto,
  getTiposProyecto,
  getClientes,
  getUsers,
  type Proyecto
} from "../../api/proyectos";
import ProyectoForm from "../../components/ProyectoForm/proyectoForm";
import "./proyecto.css";

export default function Proyectos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para catálogos
  const [estados, setEstados] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  
  // Estados para el formulario
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  
  const itemsPerPage = 3;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      console.log('🚀 Iniciando carga...');
      
      // Cargar en paralelo
      const [
        proyectosData, 
        estadosData, 
        tiposData,
        clientesData,
        usuariosData,
      ] = await Promise.all([
        getProyectos(),
        getEstadosProyecto().catch((e) => { 
          console.error('❌ Error cargando estados:', e); 
          return []; 
        }),
        getTiposProyecto().catch((e) => { 
          console.error('❌ Error cargando tipos:', e); 
          return []; 
        }),
        getClientes().catch((e) => { 
          console.error('❌ Error cargando clientes:', e); 
          return []; 
        }),
        getUsers().catch((e) => { 
          console.error('❌ Error cargando usuarios:', e); 
          return []; 
        }),
      ]);
      
      console.log('📦 Proyectos cargados:', proyectosData);
      console.log('📊 Estados cargados:', estadosData);
      console.log('📋 Tipos cargados:', tiposData);
      console.log('👥 Clientes cargados:', clientesData);
      console.log('👤 Usuarios cargados:', usuariosData);
      
      setProyectos(proyectosData);
      setEstados(estadosData);
      setTipos(tiposData);
      setClientes(clientesData);
      setUsuarios(usuariosData);

      console.log('📦 Proyectos cargados:', proyectosData);
      console.log('📦 PRIMER PROYECTO COMPLETO:', JSON.stringify(proyectosData[0], null, 2)); // ← AGREGA ESTA LÍNEA
      console.log('📊 Estados cargados:', estadosData);
      
      setError("");
    } catch (err) {
      setError("Error al cargar los datos");
      console.error('💥 Error general:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoNombre = (estadoId: string) => {
    if (!estadoId) return "Sin estado";
    const estado = estados.find((e) => e.id === estadoId || e._id === estadoId);
    return estado ? estado.nombre : `ID: ${estadoId}`;
  };

  const getClienteNombre = (clienteId: string) => {
    if (!clienteId) return "Sin cliente";
    const cliente = clientes.find((c) => c.id === clienteId || c._id === clienteId);
    return cliente ? cliente.nombre : `ID: ${clienteId}`;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        console.log("🗑️ Eliminando proyecto con ID:", id);
        await deleteProyecto(id);
        console.log("✅ Proyecto eliminado exitosamente");
        await loadInitialData();
      } catch (err: any) {
        console.error("💥 Error al eliminar:", err);
        setError(err.message || "Error al eliminar el proyecto");
        alert("Error al eliminar el proyecto");
      }
    }
};

  const handleEdit = (proyecto: Proyecto) => {
    console.log("✏️ Editando proyecto:", proyecto);
    setSelectedProyecto(proyecto);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedProyecto(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProyecto(null);
  };

  const handleFormSuccess = async () => {
    await loadInitialData();
    handleFormClose();
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

          <button className="btn-add" onClick={handleAdd}>
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
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProyectos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    No se encontraron proyectos
                  </td>
                </tr>
              ) : (
                paginatedProyectos.map((p) => (
                  <tr key={p._id}>
                    <td className="td-nombre">{p.nombre}</td>
                    <td>{p.descripcion || 'Sin descripción'}</td>
                    <td>{getClienteNombre(p.id_cliente)}</td>
                    <td>{new Date(p.fecha_hora_inicio).toLocaleDateString()}</td>
                    <td>{new Date(p.fecha_hora_fin).toLocaleDateString()}</td>
                    <td>{getEstadoNombre(p.estadoProyectoId)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(p)}
                        >
                          ✏️
                        </button>
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

      {isFormOpen && (
        <ProyectoForm
          proyecto={selectedProyecto}
          estados={estados}
          tipos={tipos}
          clientes={clientes}
          usuarios={usuarios}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}