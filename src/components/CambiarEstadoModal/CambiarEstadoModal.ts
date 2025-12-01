// src/components/CambiarEstadoModal/CambiarEstadoModal.tsx
import { useState, useEffect } from "react";
import { getEstadosReclamo } from "../../api/estadoReclamo";
import { getUsuarios } from "../../api/usuarios";
import "./cambiarEstadoModal.css";

type Reclamo = {
  _id: string;
  titulo: string;
};

type Props = {
  reclamo: Reclamo;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CambiarEstadoModal({ reclamo, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    estadoReclamoId: '',
    usuarioResponsableId: '',
    fechaHoraInicio: '',
    fechaHoraFin: '',
    opinionId: ''
  });
  const [estadosDisponibles, setEstadosDisponibles] = useState<any[]>([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    setLoading(true);
    
    // Establecer fecha/hora actual por defecto
    const now = new Date();
    const localDateTime = now.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, fechaHoraInicio: localDateTime }));

    try {
      const [estados, usuarios] = await Promise.all([
        getEstadosReclamo(),
        getUsuarios()
      ]);
      
      setEstadosDisponibles(estados);
      setUsuariosDisponibles(usuarios);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar estados y usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const payload: any = {
        reclamoId: reclamo._id,
        estadoReclamoId: formData.estadoReclamoId,
      };

      if (formData.usuarioResponsableId) {
        payload.usuarioResponsableId = formData.usuarioResponsableId;
      }

      if (formData.fechaHoraInicio) {
        payload.fechaHoraInicio = new Date(formData.fechaHoraInicio).toISOString();
      }

      if (formData.fechaHoraFin) {
        payload.fechaHoraFin = new Date(formData.fechaHoraFin).toISOString();
      }

      if (formData.opinionId) {
        payload.opinionId = formData.opinionId;
      }

      const response = await fetch(`${API_URL}/historial-estado`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar el cambio de estado');
      }

      alert('✅ Cambio de estado registrado exitosamente');
      onSuccess();
    } catch (err: any) {
      console.error('Error:', err);
      alert(`❌ Error: ${err.message}`);
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content estado-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✍️ Registrar Cambio de Estado</h2>
          <button className="btn-close-x" onClick={onClose}>✕</button>
        </div>
        
        <div className="reclamo-info-bar">
          <div className="info-item">
            <span className="info-icon">📋</span>
            <div className="info-content">
              <strong>Reclamo:</strong> {reclamo.titulo}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="estado-form">
          <div className="modal-body">
            {loading ? (
              <div className="loading-form">⏳ Cargando datos del formulario...</div>
            ) : error ? (
              <div className="error-form">⚠️ {error}</div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="estadoReclamoId">🔄 Nuevo Estado *</label>
                  <select
                    id="estadoReclamoId"
                    required
                    value={formData.estadoReclamoId}
                    onChange={(e) => setFormData({...formData, estadoReclamoId: e.target.value})}
                  >
                    <option value="">Seleccionar estado...</option>
                    {estadosDisponibles.map((estado) => (
                      <option key={estado._id} value={estado._id}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="usuarioResponsableId">👤 Usuario Responsable (opcional)</label>
                  <select
                    id="usuarioResponsableId"
                    value={formData.usuarioResponsableId}
                    onChange={(e) => setFormData({...formData, usuarioResponsableId: e.target.value})}
                  >
                    <option value="">Seleccionar responsable...</option>
                    {usuariosDisponibles.map((usuario) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombre} {usuario.email ? `(${usuario.email})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="fechaHoraInicio">📅 Fecha y Hora de Inicio (opcional)</label>
                  <input
                    type="datetime-local"
                    id="fechaHoraInicio"
                    value={formData.fechaHoraInicio}
                    onChange={(e) => setFormData({...formData, fechaHoraInicio: e.target.value})}
                  />
                  <small className="form-hint">
                    Si se omite, el servidor asignará la fecha actual
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="fechaHoraFin">🏁 Fecha y Hora de Fin (opcional)</label>
                  <input
                    type="datetime-local"
                    id="fechaHoraFin"
                    value={formData.fechaHoraFin}
                    onChange={(e) => setFormData({...formData, fechaHoraFin: e.target.value})}
                  />
                  <small className="form-hint">
                    Dejar vacío si el estado sigue activo
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="opinionId">💬 Opinión ID (opcional)</label>
                  <input
                    type="text"
                    id="opinionId"
                    placeholder="ID de la opinión/comentario"
                    value={formData.opinionId}
                    onChange={(e) => setFormData({...formData, opinionId: e.target.value})}
                  />
                  <small className="form-hint">
                    Si ya existe una opinión creada, ingresa su ID aquí
                  </small>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              💾 Registrar Cambio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}