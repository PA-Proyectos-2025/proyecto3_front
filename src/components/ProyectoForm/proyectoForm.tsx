import { useState, useEffect } from "react";
import { createProyecto, updateProyecto, type Proyecto, type CreateProyectoDto } from "../../api/proyectos";
import "./ProyectoForm.css";

type ProyectoFormProps = {
  proyecto: Proyecto | null;
  estados: any[];
  tipos: any[];
  clientes: any[];
  usuarios: any[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function ProyectoForm({ 
  proyecto, 
  estados, 
  tipos, 
  clientes, 
  usuarios, 
  onClose, 
  onSuccess 
}: ProyectoFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha_hora_inicio: "",
    fecha_hora_fin: "",
    estadoProyectoId: "",
    tipoProyectoId: "",
    id_cliente: "",
    id_responsable_area: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion || "",
        fecha_hora_inicio: proyecto.fecha_hora_inicio ? new Date(proyecto.fecha_hora_inicio).toISOString().slice(0, 16) : "",
        fecha_hora_fin: proyecto.fecha_hora_fin ? new Date(proyecto.fecha_hora_fin).toISOString().slice(0, 16) : "",
        estadoProyectoId: proyecto.estadoProyectoId || "",
        tipoProyectoId: proyecto.tipoProyectoId || "",
        id_cliente: proyecto.id_cliente || "",
        id_responsable_area: proyecto.id_responsable_area || "",
      });
    }
  }, [proyecto]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dataToSend: CreateProyectoDto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fecha_hora_inicio: new Date(formData.fecha_hora_inicio),
        fecha_hora_fin: new Date(formData.fecha_hora_fin),
        estadoProyectoId: formData.estadoProyectoId,
        tipoProyectoId: formData.tipoProyectoId,
        id_cliente: formData.id_cliente,
        id_responsable_area: formData.id_responsable_area,
      };

      console.log('📤 Enviando datos:', dataToSend);

      if (proyecto) {
        await updateProyecto(proyecto._id, dataToSend as any); // ← Usar as any para evitar error de tipos
      } else {
        await createProyecto(dataToSend);
      }

      onSuccess();
    } catch (err: any) {
      console.error('💥 Error:', err);
      setError(err.message || (proyecto ? "Error al actualizar el proyecto" : "Error al crear el proyecto"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{proyecto ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</h2>
          <button className="form-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="proyecto-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Ej: Sistema de Gestión"
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_cliente">Cliente *</label>
              <select
                id="id_cliente"
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id || cliente._id} value={cliente.id || cliente._id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              placeholder="Descripción del proyecto"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha_hora_inicio">Fecha y Hora de Inicio *</label>
              <input
                type="datetime-local"
                id="fecha_hora_inicio"
                name="fecha_hora_inicio"
                value={formData.fecha_hora_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_hora_fin">Fecha y Hora de Fin *</label>
              <input
                type="datetime-local"
                id="fecha_hora_fin"
                name="fecha_hora_fin"
                value={formData.fecha_hora_fin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estadoProyectoId">Estado *</label>
              <select
                id="estadoProyectoId"
                name="estadoProyectoId"
                value={formData.estadoProyectoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un estado</option>
                {estados.map((estado) => (
                  <option key={estado.id || estado._id} value={estado.id || estado._id}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tipoProyectoId">Tipo de Proyecto *</label>
              <select
                id="tipoProyectoId"
                name="tipoProyectoId"
                value={formData.tipoProyectoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id || tipo._id} value={tipo.id || tipo._id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="id_responsable_area">Responsable *</label>
            <select
              id="id_responsable_area"
              name="id_responsable_area"
              value={formData.id_responsable_area}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un responsable</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id || usuario._id} value={usuario.id || usuario._id}>
                  {usuario.name} ({usuario.email})
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
              {loading ? "Guardando..." : proyecto ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}