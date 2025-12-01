// En 'src/components/HistorialForm/HistorialForm.tsx'

import React, { useState, useEffect } from 'react';
import type { HistorialReclamo, HistorialEstadoCreate } from '../../api/historialReclamos';
import { createHistorial, updateHistorial } from '../../api/historialReclamos';
import { getReclamos } from '../../api/reclamos';
import { getEstadosReclamo } from '../../api/estadoReclamo';
import { getOpiniones } from '../../api/historialReclamos';
import './historialForm.css';

interface HistorialFormProps {
  historial: HistorialReclamo | null; 
  onClose: () => void;
  onSuccess: () => void;
}

type Reclamo = {
  _id: string;
  id?: string;
  titulo: string;
};

type EstadoReclamo = {
  _id: string;
  id?: string;
  nombre: string;
};

type Usuario = {
  _id: string;
  id?: string;
  name: string;
  email: string;
};

type Opinion = {
  _id: string;
  id?: string;
  descripcion?: string;
  comentario?: string;
};

const initialFormData = {
  reclamoId: '',
  estadoReclamoId: '',
  usuarioResponsableId: '',
  opinionId: '',
  fechaHoraInicio: new Date().toISOString().substring(0, 16),
  fechaHoraFin: '',
};

type FormState = typeof initialFormData;

export default function HistorialForm({ historial, onClose, onSuccess }: HistorialFormProps) {
  const isEditing = !!historial;
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Estados para los datos de los selectores
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [estados, setEstados] = useState<EstadoReclamo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);

  // Cargar datos de las APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Cargar reclamos
        const reclamosData = await getReclamos();
        setReclamos(reclamosData);

        // Cargar estados
        const estadosData = await getEstadosReclamo();
        setEstados(estadosData);

        // Cargar usuarios
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const usuariosData = await response.json();
          setUsuarios(usuariosData);
        }

        // Cargar opiniones
        const opinionesData = await getOpiniones();
        setOpiniones(opinionesData);

      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos del formulario');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing && historial) {
      setFormData({
        reclamoId: historial.reclamoId,
        estadoReclamoId: historial.estadoReclamoId,
        usuarioResponsableId: historial.usuarioResponsableId || '',
        opinionId: historial.opinionId || '',
        fechaHoraInicio: historial.fechaHoraInicio 
          ? new Date(historial.fechaHoraInicio).toISOString().substring(0, 16) 
          : initialFormData.fechaHoraInicio,
        fechaHoraFin: historial.fechaHoraFin 
          ? new Date(historial.fechaHoraFin).toISOString().substring(0, 16) 
          : '',
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

    console.log('📝 Form Data antes de enviar:', formData);
    console.log('🔍 OpinionId seleccionado:', formData.opinionId);
    console.log('📋 Opiniones disponibles:', opiniones);

    try {
      if (isEditing) {
        // Actualizar historial existente
        const historialId = historial!.id || historial!._id;
        if (!historialId) {
          throw new Error('ID de historial no encontrado');
        }

        const dataToUpdate: Partial<HistorialEstadoCreate> = {
          reclamoId: formData.reclamoId,
          estadoReclamoId: formData.estadoReclamoId,
          usuarioResponsableId: formData.usuarioResponsableId || undefined,
          opinionId: formData.opinionId || undefined,
          fechaHoraInicio: new Date(formData.fechaHoraInicio).toISOString(),
          fechaHoraFin: formData.fechaHoraFin 
            ? new Date(formData.fechaHoraFin).toISOString() 
            : undefined,
        };

        await updateHistorial(historialId, dataToUpdate);
      } else {
        // Crear nuevo historial
        const dataToCreate: HistorialEstadoCreate = {
          reclamoId: formData.reclamoId,
          estadoReclamoId: formData.estadoReclamoId,
          usuarioResponsableId: formData.usuarioResponsableId || undefined,
          // Solo enviar opinionId si es un ObjectId válido (24 caracteres hexadecimales)
          opinionId: (formData.opinionId && /^[0-9a-fA-F]{24}$/.test(formData.opinionId)) 
            ? formData.opinionId 
            : undefined,
          fechaHoraInicio: new Date(formData.fechaHoraInicio).toISOString(),
          fechaHoraFin: formData.fechaHoraFin 
            ? new Date(formData.fechaHoraFin).toISOString() 
            : undefined,
        };

        await createHistorial(dataToCreate);
      }
      
      onSuccess();
    } catch (err: any) {
      console.error("💥 Error al guardar:", err);
      setError(err.message || 'Error al guardar el registro de historial.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Cargando datos del formulario...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isEditing ? "Editar Historial" : "Agregar Historial"}</h2>
        {error && <div className="form-error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="historial-form">
            
          {/* Selector de Reclamo */}
          <div className="form-group">
            <label htmlFor="reclamoId">Reclamo:</label>
            <select
              id="reclamoId"
              name="reclamoId"
              value={formData.reclamoId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un reclamo</option>
              {reclamos.map((reclamo) => (
                <option key={reclamo._id} value={reclamo._id}>
                  {reclamo.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Estado */}
          <div className="form-group">
            <label htmlFor="estadoReclamoId">Estado:</label>
            <select
              id="estadoReclamoId"
              name="estadoReclamoId"
              value={formData.estadoReclamoId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un estado</option>
              {estados.map((estado) => (
                <option key={estado._id} value={estado._id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Usuario Responsable */}
          <div className="form-group">
            <label htmlFor="usuarioResponsableId">Usuario Responsable:</label>
            <select
              id="usuarioResponsableId"
              name="usuarioResponsableId"
              value={formData.usuarioResponsableId}
              onChange={handleChange}
            >
              <option value="">Seleccione un usuario (opcional)</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.name} ({usuario.email})
                </option>
              ))}
            </select>
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

          {/* Selector de Opinión */}
          <div className="form-group">
            <label htmlFor="opinionId">Opinión (Opcional):</label>
            <select
              id="opinionId"
              name="opinionId"
              value={formData.opinionId}
              onChange={handleChange}
            >
              <option value="">Sin opinión</option>
              {opiniones.map((opinion) => (
                <option key={opinion._id} value={opinion._id}>
                  {opinion.descripcion || opinion.comentario || opinion._id}
                </option>
              ))}
            </select>
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