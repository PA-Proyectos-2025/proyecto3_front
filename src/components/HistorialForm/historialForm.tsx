// En 'src/components/HistorialForm/HistorialForm.tsx'

import React, { useState, useEffect } from 'react';
import type { HistorialReclamo } from '../../api/historialReclamos'; // Ajusta la ruta de importación
import { createHistorial, updateHistorial } from '../../api/historialReclamos'; // Ajusta la ruta de importación
import './historialForm.css';

interface HistorialFormProps {
  historial: HistorialReclamo | null; 
  onClose: () => void;
  onSuccess: () => void;
}

// Valores iniciales (strings planos)
const initialFormData = {
  reclamoId: '',
  estadoReclamoId: '',
  usuarioResponsableId: '',
  opinionId: '',
  fechaHoraInicio: new Date().toISOString().substring(0, 16), // YYYY-MM-DDTHH:mm
  fechaHoraFin: '',
};

type FormState = typeof initialFormData; // Usa el tipo inferido de initialFormData

export default function HistorialForm({ historial, onClose, onSuccess }: HistorialFormProps) {
  const isEditing = !!historial;
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing && historial) {
      setFormData({
        // Acceso directo a las propiedades string
        reclamoId: historial.reclamoId,
        estadoReclamoId: historial.estadoReclamoId,
        usuarioResponsableId: historial.usuarioResponsableId,
        opinionId: historial.opinionId,
        // Convertimos la fecha ISO (string) a formato de input datetime-local
        fechaHoraInicio: historial.fechaHoraInicio ? new Date(historial.fechaHoraInicio).toISOString().substring(0, 16) : initialFormData.fechaHoraInicio,
        fechaHoraFin: historial.fechaHoraFin ? new Date(historial.fechaHoraFin).toISOString().substring(0, 16) : '',
      });
    } else {
        setFormData(initialFormData);
    }
  }, [historial, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepara los datos a enviar. Enviamos strings planos, el backend es responsable
    // de convertirlos a OID/Date si es necesario.
    const dataToSubmit: Partial<HistorialReclamo> = {
        // Enviar ID/OID como string
        reclamoId: formData.reclamoId,
        estadoReclamoId: formData.estadoReclamoId,
        usuarioResponsableId: formData.usuarioResponsableId,
        opinionId: formData.opinionId,
        // Enviar la fecha como string ISO para que el backend la interprete
        fechaHoraInicio: new Date(formData.fechaHoraInicio).toISOString(),
        fechaHoraFin: formData.fechaHoraFin ? new Date(formData.fechaHoraFin).toISOString() : null,
    };
    
    try {
      if (isEditing) {
        // Usamos el ID de string plano para actualizar
        await updateHistorial(historial!._id, dataToSubmit);
      } else {
        // Para crear, solo enviamos las propiedades sin _id
        await createHistorial(dataToSubmit as Omit<HistorialReclamo, '_id' | 'deleted' | 'deletedAt'>);
      }
      onSuccess();
    } catch (err: any) {
      console.error("💥 Error al guardar:", err);
      setError(err.message || 'Error al guardar el registro de historial.');
    } finally {
      setLoading(false);
    }
  };

  // ... (El resto del JSX del formulario es el mismo)
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isEditing ? "Editar Historial" : "Agregar Historial"}</h2>
        {error && <div className="form-error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="historial-form">
            
          {/* Campo ID Reclamo */}
          <div className="form-group">
            <label htmlFor="reclamoId">ID Reclamo:</label>
            <input
              type="text"
              id="reclamoId"
              name="reclamoId"
              value={formData.reclamoId}
              onChange={handleChange}
              placeholder="69285246f4aeffeff2e6f4ec"
              required
            />
          </div>

          {/* Campo ID Estado Reclamo */}
          <div className="form-group">
            <label htmlFor="estadoReclamoId">ID Estado:</label>
            <input
              type="text"
              id="estadoReclamoId"
              name="estadoReclamoId"
              value={formData.estadoReclamoId}
              onChange={handleChange}
              placeholder="69278fd471de6f39337f71aa"
              required
            />
          </div>

          {/* Campo ID Usuario Responsable */}
          <div className="form-group">
            <label htmlFor="usuarioResponsableId">ID Usuario Resp.:</label>
            <input
              type="text"
              id="usuarioResponsableId"
              name="usuarioResponsableId"
              value={formData.usuarioResponsableId}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo Fecha/Hora Inicio */}
          <div className="form-group">
            <label htmlFor="fechaHoraInicio">Fecha/Hora Inicio:</label>
            <input
              type="datetime-local"
              id="fechaHoraInicio"
              name="fechaHoraInicio"
              value={formData.fechaHoraInicio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo Fecha/Hora Fin (Opcional) */}
          <div className="form-group">
            <label htmlFor="fechaHoraFin">Fecha/Hora Fin (Opcional):</label>
            <input
              type="datetime-local"
              id="fechaHoraFin"
              name="fechaHoraFin"
              value={formData.fechaHoraFin}
              onChange={handleChange}
            />
          </div>

          {/* Campo ID Opinión */}
          <div className="form-group">
            <label htmlFor="opinionId">ID Opinión:</label>
            <input
              type="text"
              id="opinionId"
              name="opinionId"
              value={formData.opinionId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? "Guardando..." : (isEditing ? "Guardar Cambios" : "Crear Historial")}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}