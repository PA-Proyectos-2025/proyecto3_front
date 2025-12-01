import { useState, useEffect } from "react";
import { 
  createCliente, 
  updateCliente, 
  type Cliente, 
  type CreateClienteDto 
} from "../../api/clientes";
import "./ClienteForm.css";

type ClienteFormProps = {
  cliente: Cliente | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ClienteForm({ 
  cliente, 
  onClose, 
  onSuccess 
}: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    cuit: "",
    direccion: "",
    razonSocial: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        email: cliente.email || "",
        cuit: cliente.cuit || "",
        direccion: cliente.direccion || "",
        razonSocial: cliente.razonSocial || "",
        telefono: cliente.telefono || "",
      });
    }
  }, [cliente]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dataToSend: CreateClienteDto = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        cuit: formData.cuit.trim(),
        direccion: formData.direccion.trim(),
        razonSocial: formData.razonSocial.trim(),
        telefono: formData.telefono.trim() || undefined,
      };

      console.log('📤 Enviando datos:', dataToSend);

      if (cliente) {
        await updateCliente(cliente._id, dataToSend);
        console.log('✅ Cliente actualizado');
      } else {
        await createCliente(dataToSend);
        console.log('✅ Cliente creado');
      }

      onSuccess();
    } catch (err: any) {
      console.error('💥 Error:', err);
      setError(
        err.message || 
        (cliente ? "Error al actualizar el cliente" : "Error al crear el cliente")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{cliente ? "Editar Cliente" : "Crear Nuevo Cliente"}</h2>
          <button className="form-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="cliente-form">
          {/* Primera fila: Nombre y Email */}
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
                placeholder="Ej: Juan Pérez"
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
                placeholder="cliente@ejemplo.com"
              />
            </div>
          </div>

          {/* Segunda fila: CUIT y Razón Social */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cuit">CUIT *</label>
              <input
                type="text"
                id="cuit"
                name="cuit"
                value={formData.cuit}
                onChange={handleChange}
                required
                placeholder="20-12345678-9"
              />
            </div>

            <div className="form-group">
              <label htmlFor="razonSocial">Razón Social *</label>
              <input
                type="text"
                id="razonSocial"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Empresa ABC S.A."
              />
            </div>
          </div>

          {/* Tercera fila: Teléfono y Dirección */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+54 351 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                placeholder="Calle Falsa 123, Villa María, Córdoba"
              />
            </div>
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
              {loading ? "Guardando..." : cliente ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}