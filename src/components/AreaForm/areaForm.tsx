import { useState, useEffect } from "react";
import { createArea, updateArea, type Area, type CreateAreaDto } from "../../api/areas";
import "./AreaForm.css";

type User = {
  id: string;
  name: string;
  email: string;
};

type AreaFormProps = {
  area: Area | null;
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function AreaForm({ area, users, onClose, onSuccess }: AreaFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    email: "",
    id_responsable_area: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (area) {
      setFormData({
        nombre: area.nombre,
        descripcion: area.descripcion,
        email: area.email,
        id_responsable_area: area.id_responsable_area || "",
      });
    }
  }, [area]);

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
      const dataToSend: CreateAreaDto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        email: formData.email,
        id_responsable_area: formData.id_responsable_area || undefined,
      };

      if (area) {
        await updateArea(area.id, dataToSend);
      } else {
        await createArea(dataToSend);
      }

      onSuccess();
    } catch (err) {
      setError(area ? "Error al actualizar el área" : "Error al crear el área");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{area ? "Editar Área" : "Crear Nueva Área"}</h2>
          <button className="form-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="area-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Recursos Humanos"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              placeholder="Descripción del área"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="area@empresa.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_responsable_area">Responsable</label>
            <select
              id="id_responsable_area"
              name="id_responsable_area"
              value={formData.id_responsable_area}
              onChange={handleChange}
            >
              <option value="">Sin asignar</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
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
              {loading ? "Guardando..." : area ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}