import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { 
  getHistoriales, 
  type HistorialReclamo 
} from "../../api/historialReclamos"; 
import { getReclamo } from "../../api/reclamos";
import { getEstadoReclamoById } from "../../api/estadoReclamo";
import { getUsuarioById } from "../../api/usuarios";
import HistorialForm from "../../components/HistorialForm/historialForm";
import HistorialSubareaForm from "../../components/HistorialSubareaForm/historialSubareaForm";
import HistorialAreaForm from "../../components/HistorialAreaForm/historialAreaForm";
import "./historial.css";

// Tipo para historial de subárea
type HistorialSubarea = {
  _id: string;
  id?: string;
  reclamoId: string;
  subareaId: string;
  fechaHoraInicio: string | null;
  fechaHoraFin: string | null;
  deleted?: boolean;
  deletedAt?: string | null;
};

// Tipo para historial de área
type HistorialArea = {
  _id: string;
  id?: string;
  reclamoId: string;
  areaId: string;
  fechaHoraInicio: string | null;
  fechaHoraFin: string | null;
  deleted?: boolean;
  deletedAt?: string | null;
};

type HistorialConNombres = HistorialReclamo & {
  reclamoTitulo?: string;
  estadoNombre?: string;
  usuarioNombre?: string;
};

type HistorialSubareaConNombres = HistorialSubarea & {
  reclamoTitulo?: string;
  subareaNombre?: string;
};

type HistorialAreaConNombres = HistorialArea & {
  reclamoTitulo?: string;
  areaNombre?: string;
};

export default function Historial() { 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'estados' | 'subareas' | 'areas'>('estados');
  
  // Estados para historial de estados
  const [historialesConNombres, setHistorialesConNombres] = useState<HistorialConNombres[]>([]);
  
  // Estados para historial de subáreas
  const [historialesSubareaConNombres, setHistorialesSubareaConNombres] = useState<HistorialSubareaConNombres[]>([]);
  
  // Estados para historial de áreas
  const [historialesAreaConNombres, setHistorialesAreaConNombres] = useState<HistorialAreaConNombres[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingNombres, setLoadingNombres] = useState(false);
  const [error, setError] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormSubareaOpen, setIsFormSubareaOpen] = useState(false);
  const [isFormAreaOpen, setIsFormAreaOpen] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState<HistorialReclamo | null>(null);
  
  const itemsPerPage = 5; 

  useEffect(() => {
    loadHistoriales();
    loadHistorialesSubarea();
    loadHistorialesArea();
  }, []);

  // Cargar historial de estados
  const loadHistoriales = async () => {
    try {
      setLoading(true);
      console.log("🚀 Cargando historiales de estados...");

      const data = await getHistoriales();
      console.log("📦 Datos de estados recibidos:", data);

      setError("");
      await loadNombresEstados(data);
    } catch (err: any) {
      console.error("💥 Error cargando estados:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Error de conexión: Asegúrate de que el servidor backend esté corriendo.");
      } else {
        setError(err.message || "Error al cargar los historiales");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial de subáreas
  const loadHistorialesSubarea = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/historial-subarea', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('⚠️ No se pudieron cargar historiales de subáreas');
        return;
      }

      const data = await response.json();
      console.log("📦 Historial subáreas:", data);
      
      await loadNombresSubareas(data);
    } catch (err: any) {
      console.error("💥 Error cargando subáreas:", err);
    }
  };

  // Cargar historial de áreas
  const loadHistorialesArea = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/historial-area', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('⚠️ No se pudieron cargar historiales de áreas');
        return;
      }

      const data = await response.json();
      console.log("📦 Historial áreas:", data);
      
      await loadNombresAreas(data);
    } catch (err: any) {
      console.error("💥 Error cargando áreas:", err);
    }
  };

  const loadNombresEstados = async (historiales: HistorialReclamo[]) => {
    setLoadingNombres(true);
    
    const historialesConNombresTemp = await Promise.all(
      historiales.map(async (historial) => {
        let reclamoTitulo = historial.reclamoId;
        let estadoNombre = historial.estadoReclamoId;
        let usuarioNombre = historial.usuarioResponsableId || 'Sin asignar';

        // Cargar reclamo
        try {
          const reclamo = await getReclamo(historial.reclamoId);
          reclamoTitulo = reclamo.titulo || historial.reclamoId;
        } catch (err) {
          console.error('Error cargando reclamo:', err);
        }

        // Cargar estado
        try {
          const estado = await getEstadoReclamoById(historial.estadoReclamoId);
          estadoNombre = estado.nombre || historial.estadoReclamoId;
        } catch (err) {
          console.error('Error cargando estado:', err);
        }

        // Cargar usuario
        if (historial.usuarioResponsableId) {
          try {
            const usuario = await getUsuarioById(historial.usuarioResponsableId);
            usuarioNombre = usuario.name || usuario.email || historial.usuarioResponsableId;
          } catch (err) {
            console.error('Error cargando usuario:', err);
          }
        }

        return {
          ...historial,
          reclamoTitulo,
          estadoNombre,
          usuarioNombre,
        };
      })
    );

    setHistorialesConNombres(historialesConNombresTemp);
    setLoadingNombres(false);
  };

  const loadNombresSubareas = async (historiales: HistorialSubarea[]) => {
    const token = localStorage.getItem('token');
    
    // Obtener todas las subáreas
    let todasLasSubareas: any[] = [];
    const possibleEndpoints = [
      'http://localhost:3000/subarea',
      'http://localhost:3000/subareas',
      'http://localhost:3000/sub-area',
      'http://localhost:3000/sub-areas',
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          todasLasSubareas = await response.json();
          console.log(`✅ Subáreas obtenidas desde ${endpoint}:`, todasLasSubareas);
          break;
        }
      } catch (err) {
        // Continuar al siguiente endpoint
      }
    }
    
    const historialesTemp = await Promise.all(
      historiales.map(async (historial) => {
        let reclamoTitulo = historial.reclamoId;
        let subareaNombre = historial.subareaId;

        // Cargar reclamo
        try {
          const reclamo = await getReclamo(historial.reclamoId);
          reclamoTitulo = reclamo.titulo || historial.reclamoId;
        } catch (err) {
          console.error('Error cargando reclamo:', err);
        }

        // Buscar subárea
        if (todasLasSubareas.length > 0) {
          const subarea = todasLasSubareas.find((s: any) => 
            (s._id === historial.subareaId) || (s.id === historial.subareaId)
          );
          if (subarea) {
            subareaNombre = subarea.nombre || subarea.name || historial.subareaId;
          }
        }

        return {
          ...historial,
          reclamoTitulo,
          subareaNombre,
        };
      })
    );

    setHistorialesSubareaConNombres(historialesTemp);
  };

  const loadNombresAreas = async (historiales: HistorialArea[]) => {
    const token = localStorage.getItem('token');
    
    // Obtener todas las áreas
    let todasLasAreas: any[] = [];
    const possibleEndpoints = [
      'http://localhost:3000/area',
      'http://localhost:3000/areas',
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          todasLasAreas = await response.json();
          console.log(`✅ Áreas obtenidas desde ${endpoint}:`, todasLasAreas);
          break;
        }
      } catch (err) {
        // Continuar al siguiente endpoint
      }
    }
    
    const historialesTemp = await Promise.all(
      historiales.map(async (historial) => {
        let reclamoTitulo = historial.reclamoId;
        let areaNombre = historial.areaId;

        // Cargar reclamo
        try {
          const reclamo = await getReclamo(historial.reclamoId);
          reclamoTitulo = reclamo.titulo || historial.reclamoId;
        } catch (err) {
          console.error('Error cargando reclamo:', err);
        }

        // Buscar área
        if (todasLasAreas.length > 0) {
          const area = todasLasAreas.find((a: any) => 
            (a._id === historial.areaId) || (a.id === historial.areaId)
          );
          if (area) {
            areaNombre = area.nombre || area.name || historial.areaId;
            console.log(`✅ Nombre de área encontrado: ${areaNombre}`);
          } else {
            console.warn(`⚠️ No se encontró área con ID: ${historial.areaId}`);
          }
        }

        return {
          ...historial,
          reclamoTitulo,
          areaNombre,
        };
      })
    );

    setHistorialesAreaConNombres(historialesTemp);
  };

  const handleAdd = () => {
    console.log("➕ Agregando nuevo historial de estado");
    setSelectedHistorial(null);
    setIsFormOpen(true);
  };

  const handleAddSubarea = () => {
    console.log("➕ Agregando nuevo historial de subárea");
    setIsFormSubareaOpen(true);
  };

  const handleAddArea = () => {
    console.log("➕ Agregando nuevo historial de área");
    setIsFormAreaOpen(true);
  };

  const handleFormClose = () => {
    console.log("❌ Cerrando formulario");
    setIsFormOpen(false);
    setSelectedHistorial(null);
  };

  const handleFormSubareaClose = () => {
    console.log("❌ Cerrando formulario de subárea");
    setIsFormSubareaOpen(false);
  };

  const handleFormAreaClose = () => {
    console.log("❌ Cerrando formulario de área");
    setIsFormAreaOpen(false);
  };

  const handleFormSuccess = async () => {
    console.log("✅ Formulario guardado con éxito");
    await loadHistoriales();
    await loadHistorialesSubarea();
    await loadHistorialesArea();
    handleFormClose();
    handleFormSubareaClose();
    handleFormAreaClose();
  };

  const formatDateTime = (isoString: string | null | undefined) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return "Fecha inválida";
    }
  };

  // Filtrado
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  const filteredHistorialesEstados = historialesConNombres.filter((historial) => {
    return (
      (historial.reclamoTitulo?.toLowerCase().includes(lowerSearchTerm)) ||
      (historial.estadoNombre?.toLowerCase().includes(lowerSearchTerm)) ||
      (historial.usuarioNombre?.toLowerCase().includes(lowerSearchTerm))
    );
  });

  const filteredHistorialesSubareas = historialesSubareaConNombres.filter((historial) => {
    return (
      (historial.reclamoTitulo?.toLowerCase().includes(lowerSearchTerm)) ||
      (historial.subareaNombre?.toLowerCase().includes(lowerSearchTerm))
    );
  });

  const filteredHistorialesAreas = historialesAreaConNombres.filter((historial) => {
    return (
      (historial.reclamoTitulo?.toLowerCase().includes(lowerSearchTerm)) ||
      (historial.areaNombre?.toLowerCase().includes(lowerSearchTerm))
    );
  });

  // Paginación
  const currentData = activeTab === 'estados' 
    ? filteredHistorialesEstados 
    : activeTab === 'subareas'
    ? filteredHistorialesSubareas
    : filteredHistorialesAreas;
    
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);

  // Reset página al cambiar tab
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="historiales-container">
        <Sidebar />
        <div className="historiales-content">
          <div className="loading">⏳ Cargando historiales...</div>
        </div>
      </div>
    );
  }

  const role = localStorage.getItem("role") || "USUARIO";

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

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'estados' ? 'active' : ''}`}
            onClick={() => setActiveTab('estados')}
          >
            📊 Historial de Estados
            {historialesConNombres.length > 0 && (
              <span className="tab-count">{historialesConNombres.length}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'areas' ? 'active' : ''}`}
            onClick={() => setActiveTab('areas')}
          >
            🏢 Historial de Áreas
            {historialesAreaConNombres.length > 0 && (
              <span className="tab-count">{historialesAreaConNombres.length}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'subareas' ? 'active' : ''}`}
            onClick={() => setActiveTab('subareas')}
          >
            📁 Historial de Subáreas
            {historialesSubareaConNombres.length > 0 && (
              <span className="tab-count">{historialesSubareaConNombres.length}</span>
            )}
          </button>
        </div>

        <div className="historiales-actions">
          <div className="search-box">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder={
                activeTab === 'estados' 
                  ? "Buscar por título, estado o usuario" 
                  : activeTab === 'areas'
                  ? "Buscar por título o área"
                  : "Buscar por título o subárea"
              }
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

          {activeTab === 'estados' && (
            <button className="btn-add" onClick={handleAdd}>
              Agregar <span className="plus-icon">+</span>
            </button>
          )}
          
          {activeTab === 'areas' && (
            <button className="btn-add" onClick={handleAddArea}>
              Agregar <span className="plus-icon">+</span>
            </button>
          )}
          
          {activeTab === 'subareas' && (
            <button className="btn-add" onClick={handleAddSubarea}>
              Agregar <span className="plus-icon">+</span>
            </button>
          )}
        </div>

        {loadingNombres && (
          <div style={{ textAlign: 'center', padding: '10px', color: '#0A3A96' }}>
            ⏳ Cargando información adicional...
          </div>
        )}

        <div className="table-container">
          {activeTab === 'estados' ? (
            <table className="historiales-table">
              <thead>
                <tr>
                  <th>Reclamo</th>
                  <th>Estado</th>
                  <th>Usuario Responsable</th>
                  <th>Fecha/Hora Inicio</th>
                  <th>Fecha/Hora Fin</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="no-data">
                      {searchTerm 
                        ? "No se encontraron resultados para tu búsqueda" 
                        : "No hay historiales de estados registrados"}
                    </td>
                  </tr>
                ) : (
                  (paginatedData as HistorialConNombres[]).map((historial, index) => {
                    const id = historial.id || historial._id;
                    return (
                      <tr key={id || `row-${index}`}>
                        <td title={historial.reclamoId}>
                          {historial.reclamoTitulo || historial.reclamoId}
                        </td>
                        <td title={historial.estadoReclamoId}>
                          <span className="estado-badge">
                            {historial.estadoNombre || historial.estadoReclamoId}
                          </span>
                        </td>
                        <td title={historial.usuarioResponsableId}>
                          {historial.usuarioNombre}
                        </td>
                        <td>{formatDateTime(historial.fechaHoraInicio)}</td>
                        <td>{formatDateTime(historial.fechaHoraFin)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : activeTab === 'areas' ? (
            <table className="historiales-table">
              <thead>
                <tr>
                  <th>Reclamo</th>
                  <th>Área</th>
                  <th>Fecha/Hora Inicio</th>
                  <th>Fecha/Hora Fin</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="no-data">
                      {searchTerm 
                        ? "No se encontraron resultados para tu búsqueda" 
                        : "No hay historiales de áreas registrados"}
                    </td>
                  </tr>
                ) : (
                  (paginatedData as HistorialAreaConNombres[]).map((historial, index) => {
                    const id = historial.id || historial._id;
                    return (
                      <tr key={id || `row-area-${index}`}>
                        <td title={historial.reclamoId}>
                          {historial.reclamoTitulo || historial.reclamoId}
                        </td>
                        <td title={historial.areaId}>
                          <span className="area-badge">
                            {historial.areaNombre || historial.areaId}
                          </span>
                        </td>
                        <td>{formatDateTime(historial.fechaHoraInicio)}</td>
                        <td>{formatDateTime(historial.fechaHoraFin)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="historiales-table">
              <thead>
                <tr>
                  <th>Reclamo</th>
                  <th>Subárea</th>
                  <th>Fecha/Hora Inicio</th>
                  <th>Fecha/Hora Fin</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="no-data">
                      {searchTerm 
                        ? "No se encontraron resultados para tu búsqueda" 
                        : "No hay historiales de subáreas registrados"}
                    </td>
                  </tr>
                ) : (
                  (paginatedData as HistorialSubareaConNombres[]).map((historial, index) => {
                    const id = historial.id || historial._id;
                    return (
                      <tr key={id || `row-subarea-${index}`}>
                        <td title={historial.reclamoId}>
                          {historial.reclamoTitulo || historial.reclamoId}
                        </td>
                        <td title={historial.subareaId}>
                          <span className="subarea-badge">
                            {historial.subareaNombre || historial.subareaId}
                          </span>
                        </td>
                        <td>{formatDateTime(historial.fechaHoraInicio)}</td>
                        <td>{formatDateTime(historial.fechaHoraFin)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
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
              Página {currentPage} de {totalPages} ({currentData.length} registros)
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

      {isFormSubareaOpen && (
        <HistorialSubareaForm
          onClose={handleFormSubareaClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {isFormAreaOpen && (
        <HistorialAreaForm
          onClose={handleFormAreaClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}