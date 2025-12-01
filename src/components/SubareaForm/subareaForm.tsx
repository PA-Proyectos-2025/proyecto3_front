import { useState, useEffect } from "react";
import { createSubarea, updateSubarea, type Subarea, type CreateSubareaDto } from "../../api/subareas";
import "./SubareaForm.css";

type Area = {
  _id: string;
  nombre: string;
};

type SubareaFormProps = {
  subarea: Subarea | null;
  areas: Area[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function SubareaForm({ subarea, areas, onClose, onSuccess }: SubareaFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    areaId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (subarea) {
      setFormData({
        nombre: subarea.nombre,
        descripcion: subarea.descripcion || "",
        areaId: subarea.areaId || "",
      });
    }
  }, [subarea]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // 🔍 DEBUG: Ver qué se selecciona
    if (name === 'areaId') {
      console.log('🔄 Valor seleccionado en el select:', value);
      console.log('🔄 Tipo:', typeof value);
      
      // Buscar el área en la lista
      const selectedArea = areas.find(a => a._id === value);
      console.log('🏢 Área encontrada en la lista:', selectedArea);
      
      // Ver todos los IDs disponibles
      console.log('📋 Todos los IDs de áreas:', areas.map(a => a._id));
      console.log('📋 Áreas completas:', areas);
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log('🔍 FormData antes de enviar:', formData);

    try {
      const dataToSend: CreateSubareaDto = {
        nombre: formData.nombre,
      };

      // Solo agregar descripcion si no está vacía
      if (formData.descripcion && formData.descripcion.trim() !== '') {
        dataToSend.descripcion = formData.descripcion;
      }

      // Solo agregar areaId si existe y no es vacío
      if (formData.areaId && formData.areaId.trim() !== '') {
        dataToSend.areaId = formData.areaId;
      }

      console.log('📤 Enviando datos:', JSON.stringify(dataToSend, null, 2));
      console.log('📤 Modo:', subarea ? 'EDITAR' : 'CREAR');
      console.log('📤 Valores individuales:');
      console.log('  - nombre:', dataToSend.nombre, '(tipo:', typeof dataToSend.nombre, ')');
      console.log('  - descripcion:', dataToSend.descripcion, '(tipo:', typeof dataToSend.descripcion, ')');
      console.log('  - areaId:', dataToSend.areaId, '(tipo:', typeof dataToSend.areaId, ')');

      if (subarea) {
        console.log('📤 ID de subárea a actualizar:', subarea._id);
        const result = await updateSubarea(subarea._id, dataToSend);
        console.log('✅ Resultado del update:', result);
      } else {
        const result = await createSubarea(dataToSend);
        console.log('✅ Resultado del create:', result);
      }

      onSuccess();
    } catch (err: any) {
      console.error('💥 Error completo:', err);
      console.error('💥 Mensaje:', err.message);
      console.error('💥 Response:', err.response);
      const errorMessage = err.message || (subarea ? "Error al actualizar la subárea" : "Error al crear la subárea");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{subarea ? "Editar Subárea" : "Crear Nueva Subárea"}</h2>
          <button className="form-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="subarea-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Subárea de Reclutamiento"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la subárea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="areaId">Área</label>
            <select
              id="areaId"
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
            >
              <option key="sin-asignar" value="">Sin asignar</option>
              {areas.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Guardando..." : subarea ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}