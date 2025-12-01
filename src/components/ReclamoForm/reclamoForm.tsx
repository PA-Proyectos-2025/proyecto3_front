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

export type ArchivoDto = {
  id: string;
  nombre: string;
  size?: number;
  mimeType?: string;
};

export type ReclamoResp = {
  id: string;
  titulo?: string;
  descripcion?: string;
  archivos?: ArchivoDto[];   // 👈 antes string[], ahora objetos
  tipoReclamoId?: string;
  prioridadId?: string;
  nivelCriticidadId?: string;
  proyectoId?: string;
  clienteId?: string;
};

type PropsEx = Props & { reclamo?: ReclamoResp | null };

export default function ReclamoForm({ onClose, onSuccess, reclamo }: PropsEx) {
  // CAMBIADO: Renombré 'formData' a 'formState' para evitar conflictos de nombres
  const [formState, setFormState] = useState<Partial<CreateReclamoDto>>({
    titulo: "",
    descripcion: "",
    archivos: [],
    tipoReclamoId: "",
    prioridadId: "",
    nivelCriticidadId: "",
    proyectoId: "",
    clienteId: "",
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
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

  useEffect(() => {
    if (!reclamo) return;
    setFormState({
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
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // CAMBIADO: Declaro 'payload' sin tipo explícito para que TypeScript lo infiera como FormData
      const payload = new FormData();
      payload.append('titulo', formState.titulo || "");
      payload.append('descripcion', formState.descripcion || "");
      payload.append('tipoReclamoId', formState.tipoReclamoId || "");
      payload.append('prioridadId', formState.prioridadId || "");
      payload.append('nivelCriticidadId', formState.nivelCriticidadId || "");
      payload.append('proyectoId', formState.proyectoId || "");
      payload.append('clienteId', formState.clienteId || "");
      
      selectedFiles.forEach((file) => {
        payload.append('archivos', file);
      });
      
      console.log('📤 Enviando reclamo con archivos:', payload);
      
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
              value={formState.titulo || ""} 
              onChange={handleChange} 
              required 
              placeholder="Ej: Problema de acceso"
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea 
              name="descripcion" 
              value={formState.descripcion || ""} 
              onChange={handleChange} 
              rows={3}
              required
              placeholder="Describe el reclamo..."
            />
          </div>

          <div className="form-group">
            <label>Archivos Adjuntos</label>
            <input 
              type="file" 
              multiple 
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setSelectedFiles(files);
              }} 
              accept=".pdf,.doc,.docx,.jpg,.png,.txt"
            />
            {selectedFiles.length > 0 && (
              <ul className="file-list">
                {selectedFiles.map((file, idx) => (
                    <li key={idx} className="file-item">
                    <span>📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                      className="remove-file"
                    >
                      ✕
                    </button>
                </li>
              ))}
            </ul>
          )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Reclamo *</label>
              <select 
                name="tipoReclamoId" 
                value={formState.tipoReclamoId || ""} 
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
                value={formState.prioridadId || ""} 
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
                value={formState.nivelCriticidadId || ""} 
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
                value={formState.clienteId || ""} 
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
              value={formState.proyectoId || ""} 
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