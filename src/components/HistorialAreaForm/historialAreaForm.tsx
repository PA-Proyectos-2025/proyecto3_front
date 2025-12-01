// src/components/HistorialAreaForm/historialAreaForm.tsx

import React, { useState, useEffect } from 'react';
import { getReclamos } from '../../api/reclamos';
import '../HistorialForm/historialForm.css';

interface HistorialAreaFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Reclamo = {
  _id: string;
  id?: string;
  titulo: string;
};

type Area = {
  _id?: string;
  id?: string;
  nombre?: string;
  name?: string;
};

const initialFormData = {
  reclamoId: '',
  areaId: '',
  fechaHoraInicio: new Date().toISOString().substring(0, 16),
  fechaHoraFin: '',
};

type FormState = typeof initialFormData;

export default function HistorialAreaForm({ onClose, onSuccess }: HistorialAreaFormProps) {
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  // Cargar datos de las APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const token = localStorage.getItem('token');
        
        // Cargar reclamos
        const reclamosData = await getReclamos();
        setReclamos(reclamosData);

        // Cargar áreas - intentar varios endpoints posibles
        const possibleEndpoints = [
          'http://localhost:3000/area',
        ];

        let areasData = [];
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`🔍 Intentando endpoint: ${endpoint}`);
            const response = await fetch(endpoint, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              areasData = await response.json();
              console.log(`✅ Áreas cargadas desde ${endpoint}:`, areasData);
              // Verificar estructura de cada área
              areasData.forEach((area: any) => {
                console.log(`  - Área completa:`, area);
              });
              setAreas(areasData);
              break; // Salir del loop si encontramos el endpoint correcto
            }
          } catch (err) {
            console.log(`❌ Falló ${endpoint}`);
          }
        }

        if (areasData.length === 0) {
          console.error('⚠️ No se pudo cargar áreas de ningún endpoint');
          setError('No se pudieron cargar las áreas. Verifica que el endpoint esté disponible.');
        }

      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos del formulario');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

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

    // Validar que los IDs sean válidos
    if (!formData.reclamoId || !formData.areaId) {
      setError('Debe seleccionar un reclamo y un área');
      setLoading(false);
      return;
    }

    const dataToCreate = {
      reclamoId: formData.reclamoId.trim(),
      areaId: formData.areaId.trim(),
      fechaHoraInicio: new Date(formData.fechaHoraInicio).toISOString(),
      fechaHoraFin: formData.fechaHoraFin 
        ? new Date(formData.fechaHoraFin).toISOString() 
        : null,
    };

    console.log('📤 Creando historial de área:', dataToCreate);
    console.log('🔍 Validación de IDs:');
    console.log('  - reclamoId:', dataToCreate.reclamoId, '(length:', dataToCreate.reclamoId.length, ')');
    console.log('  - areaId:', dataToCreate.areaId, '(length:', dataToCreate.areaId.length, ')');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/historial-area', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToCreate)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      console.log('✅ Historial de área creado exitosamente');
      onSuccess();
    } catch (err: any) {
      console.error('💥 Error al guardar:', err);
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
        <h2>Agregar Historial de Área</h2>
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

          {/* Selector de Área */}
          <div className="form-group">
            <label htmlFor="areaId">Área:</label>
            <select
              id="areaId"
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un área</option>
              {areas.map((area, index) => {
                // Intentar obtener el ID de diferentes propiedades posibles
                const areaId = area._id || area.id;
                const areaNombre = area.nombre || area.name || 'Sin nombre';
                
                return (
                  <option key={areaId || `area-${index}`} value={areaId || ''}>
                    {areaNombre}
                    {!areaId && ' (⚠️ Sin ID)'}
                  </option>
                );
              })}
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

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? "Guardando..." : "Crear Historial"}
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