import { useState, useEffect } from "react";
import { createReclamo, updateReclamo, type CreateReclamoDto } from "../../api/reclamos";
import { getTipoReclamos, getPrioridades, getNivelesCriticidad } from "../../api/catalogs";
import { getProyectos } from "../../api/proyectos";
import { getClientes } from "../../api/clientes";
import "./ReclamoForm.css";

type Item = Record<string, unknown>;

const getId = (it: Item) => String(it['id'] ?? it['_id'] ?? '');
const getLabel = (it: Item) => String(it['nombre'] ?? it['name'] ?? it['descripcion'] ?? it['tipo'] ?? it['razonSocial'] ?? it['nombreProyecto'] ?? it['nombreNivel'] ?? '');

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type ReclamoResp = {
  id: string;
  titulo?: string;
  descripcion?: string;
  archivos?: string[];
  tipoReclamoId?: string;
  prioridadId?: string;
  nivelCriticidadId?: string;
  proyectoId?: string;
  clienteId?: string;
};

type PropsEx = Props & { reclamo?: ReclamoResp | null };

export default function ReclamoForm({ onClose, onSuccess, reclamo }: PropsEx) {
  const [formData, setFormData] = useState<Partial<CreateReclamoDto>>({
    titulo: "",
    descripcion: "",
    archivos: [],
    tipoReclamoId: "",
    prioridadId: "",
    nivelCriticidadId: "",
    proyectoId: "",
    clienteId: "",
  });
  
  const [tipoReclamos, setTipoReclamos] = useState<Item[]>([]);
  const [prioridades, setPrioridades] = useState<Item[]>([]);
  const [niveles, setNiveles] = useState<Item[]>([]);
  const [proyectos, setProyectos] = useState<Item[]>([]);
  const [clientes, setClientes] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadErrors, setLoadErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const promises = [
        getTipoReclamos(),
        getPrioridades(),
        getNivelesCriticidad(),
        getProyectos(),
        getClientes(),
      ];

      const keys = [
        'tipoReclamos',
        'prioridades',
        'niveles',
        'proyectos',
        'clientes',
      ];

      try {
        const results = await Promise.allSettled(promises);
        results.forEach((res, i) => {
          if (res.status === 'fulfilled') {
            const value = res.value as Item[];
            switch (keys[i]) {
              case 'tipoReclamos': setTipoReclamos(value); break;
              case 'prioridades': setPrioridades(value); break;
              case 'niveles': setNiveles(value); break;
              case 'proyectos': setProyectos(value); break;
              case 'clientes': setClientes(value); break;
            }
          } else {
            console.warn(`Warning loading ${keys[i]}:`, res.reason);
            setLoadErrors((prev) => ({ ...prev, [keys[i]]: String(res.reason) }));
          }
        });
      } catch (err) {
        console.error('Error inesperado cargando catálogos:', err);
        setError('Error al cargar datos del formulario');
      }
    };
    load();
  }, []);

  // Prefill cuando recibimos un reclamo para editar
  useEffect(() => {
    if (!reclamo) return;
    setFormData({
      titulo: reclamo.titulo ?? "",
      descripcion: reclamo.descripcion ?? "",
      archivos: reclamo.archivos ?? [],
      tipoReclamoId: reclamo.tipoReclamoId ?? "",
      prioridadId: reclamo.prioridadId ?? "",
      nivelCriticidadId: reclamo.nivelCriticidadId ?? "",
      proyectoId: reclamo.proyectoId ?? "",
      clienteId: reclamo.clienteId ?? "",
    });
  }, [reclamo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const payload: CreateReclamoDto = {
        titulo: formData.titulo || "",
        descripcion: formData.descripcion || "",
        archivos: formData.archivos || [],
        tipoReclamoId: formData.tipoReclamoId || "",
        prioridadId: formData.prioridadId || "",
        nivelCriticidadId: formData.nivelCriticidadId || "",
        proyectoId: formData.proyectoId || "",
        clienteId: formData.clienteId || "",
      };

      console.log('📤 Enviando reclamo:', payload);

      if (reclamo) {
        await updateReclamo(reclamo.id, payload);
      } else {
        await createReclamo(payload);
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('💥 Error:', err);
      setError(err.message || "Error al guardar el reclamo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{reclamo ? 'Editar Reclamo' : 'Crear Reclamo'}</h2>
          <button className="form-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="form-error">{error}</div>}
        
        {Object.keys(loadErrors).length > 0 && (
          <div style={{ background: '#fff6e6', color: '#7a4a00', padding: 8, borderRadius: 6, marginBottom: 8 }}>
            <strong>Algunos catálogos no se pudieron cargar:</strong>
            <ul>
              {Object.entries(loadErrors).map(([k, v]) => (
                <li key={k}><strong>{k}</strong>: {v}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reclamo-form">
          <div className="form-group">
            <label>Título *</label>
            <input 
              name="titulo" 
              value={formData.titulo || ""} 
              onChange={handleChange} 
              required 
              placeholder="Ej: Problema de acceso"
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion || ""} 
              onChange={handleChange} 
              rows={3}
              required
              placeholder="Describe el reclamo..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Reclamo *</label>
              <select 
                name="tipoReclamoId" 
                value={formData.tipoReclamoId || ""} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione tipo</option>
                {tipoReclamos.map((t) => (
                  <option key={getId(t)} value={getId(t)}>
                    {getLabel(t) || getId(t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Prioridad *</label>
              <select 
                name="prioridadId" 
                value={formData.prioridadId || ""} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione prioridad</option>
                {prioridades.map((p) => (
                  <option key={getId(p)} value={getId(p)}>
                    {getLabel(p) || getId(p)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nivel de Criticidad *</label>
              <select 
                name="nivelCriticidadId" 
                value={formData.nivelCriticidadId || ""} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione nivel</option>
                {niveles.map((n) => (
                  <option key={getId(n)} value={getId(n)}>
                    {getLabel(n) || getId(n)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cliente *</label>
              <select 
                name="clienteId" 
                value={formData.clienteId || ""} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione cliente</option>
                {clientes.map((c) => (
                  <option key={getId(c)} value={getId(c)}>
                    {getLabel(c) || getId(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Proyecto *</label>
            <select 
              name="proyectoId" 
              value={formData.proyectoId || ""} 
              onChange={handleChange}
              required
            >
              <option value="">Seleccione proyecto</option>
              {proyectos.map((pr) => (
                <option key={getId(pr)} value={getId(pr)}>
                  {getLabel(pr) || getId(pr)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Guardando...' : (reclamo ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}