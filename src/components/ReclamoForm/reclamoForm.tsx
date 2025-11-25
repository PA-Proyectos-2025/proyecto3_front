import { useState, useEffect } from "react";
import { createReclamo, updateReclamo, type CreateReclamoDto } from "../../api/reclamos";
import { getTipoReclamos, getPrioridades, getNivelesCriticidad, getUsers } from "../../api/catalogs";
import { getProyectos } from "../../api/proyectos";
import { getClientes } from "../../api/clientes";
import { getAreas } from "../../api/areas";
import { getSubareas } from "../../api/subareas";
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
  });
  const [tipoReclamos, setTipoReclamos] = useState<Item[]>([]);
  const [prioridades, setPrioridades] = useState<Item[]>([]);
  const [niveles, setNiveles] = useState<Item[]>([]);
  const [proyectos, setProyectos] = useState<Item[]>([]);
  const [clientes, setClientes] = useState<Item[]>([]);
  const [areas, setAreas] = useState<Item[]>([]);
  const [subareas, setSubareas] = useState<Item[]>([]);
  const [users, setUsers] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadErrors, setLoadErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // no prefill aquí (se maneja en efecto separado)
    const load = async () => {
      // Cargamos catálogos en paralelo pero permitimos que algunos fallen
      const promises = [
        getTipoReclamos(),
        getPrioridades(),
        getNivelesCriticidad(),
        getProyectos(),
        getClientes(),
        getAreas(),
        getSubareas(),
        getUsers(),
      ];

      const keys = [
        'tipoReclamos',
        'prioridades',
        'niveles',
        'proyectos',
        'clientes',
        'areas',
        'subareas',
        'users',
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
              case 'areas': setAreas(value); break;
              case 'subareas': setSubareas(value); break;
              case 'users': setUsers(value); break;
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
    setFormData((prev) => ({
      ...prev,
      titulo: reclamo.titulo ?? prev.titulo,
      descripcion: reclamo.descripcion ?? prev.descripcion,
      archivos: reclamo.archivos ?? prev.archivos,
      // los ids de catálogo
  tipoReclamoId: reclamo.tipoReclamoId ?? prev.tipoReclamoId,
  prioridadId: reclamo.prioridadId ?? prev.prioridadId,
  nivelCriticidadId: reclamo.nivelCriticidadId ?? prev.nivelCriticidadId,
  proyectoId: reclamo.proyectoId ?? prev.proyectoId,
  clienteId: reclamo.clienteId ?? prev.clienteId,
    }));
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
      // usuarioResponsableId: si hay un responsable seleccionado, úsalo, sino usa primer user si existe
    const fd = formData as Record<string, unknown>;
      const usuarioResponsableId = fd['usuarioResponsableId'] ? String(fd['usuarioResponsableId']) : undefined;

      const payload: CreateReclamoDto = {
        titulo: String(fd['titulo'] ?? ''),
        descripcion: String(fd['descripcion'] ?? ''),
        archivos: (formData.archivos as string[]) || [],
        tipoReclamoId: String(fd['tipoReclamoId'] ?? getId(tipoReclamos[0]) ?? ''),
        prioridadId: String(fd['prioridadId'] ?? getId(prioridades[0]) ?? ''),
        nivelCriticidadId: String(fd['nivelCriticidadId'] ?? getId(niveles[0]) ?? ''),
        proyectoId: String(fd['proyectoId'] ?? getId(proyectos[0]) ?? ''),
        clienteId: String(fd['clienteId'] ?? getId(clientes[0]) ?? ''),
        areaId: String(fd['areaId'] ?? getId(areas[0]) ?? ''),
        subareaId: String(fd['subareaId'] ?? '') || undefined,
      };

      if (reclamo) {
        // edición
        // updateReclamo acepta sólo los campos permitidos (area/subarea no se actualizan)
        const { titulo, descripcion, archivos, tipoReclamoId, prioridadId, nivelCriticidadId, proyectoId, clienteId } = payload;
        await updateReclamo(reclamo.id, { titulo, descripcion, archivos, tipoReclamoId, prioridadId, nivelCriticidadId, proyectoId, clienteId });
      } else {
        await createReclamo(payload, usuarioResponsableId as string | undefined);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Error al crear reclamo");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar subáreas según área seleccionada
  const fdView = formData as Record<string, unknown>;
  const filteredSubareas = subareas.filter((s) => {
    const areaId = String(fdView['areaId'] ?? '');
    if (!areaId) return true;
    const sid = String(s['areaId'] ?? s['area'] ?? s['id_area'] ?? s['id'] ?? s['_id'] ?? '');
    return sid === areaId;
  });

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{reclamo ? 'Editar Reclamo' : 'Crear Reclamo'}</h2>
          <button className="form-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {/* Mostrar advertencias si algún catálogo falló */}
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
            <input name="titulo" value={formData.titulo || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion || ""} onChange={handleChange} rows={3} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipoReclamoId" value={String(fdView['tipoReclamoId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione tipo</option>
                {tipoReclamos.map((t) => (
                  <option key={getId(t)} value={getId(t)}>{getLabel(t) || getId(t)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Prioridad</label>
              <select name="prioridadId" value={String(fdView['prioridadId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione prioridad</option>
                {prioridades.map((p) => (
                  <option key={getId(p)} value={getId(p)}>{getLabel(p) || getId(p)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Nivel de Criticidad</label>
              <select name="nivelCriticidadId" value={String(fdView['nivelCriticidadId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione nivel</option>
                {niveles.map((n) => (
                  <option key={getId(n)} value={getId(n)}>{getLabel(n) || getId(n)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Proyecto</label>
              <select name="proyectoId" value={String(fdView['proyectoId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione proyecto</option>
                {proyectos.map((pr) => (
                  <option key={getId(pr)} value={getId(pr)}>{getLabel(pr) || getId(pr)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cliente</label>
              <select name="clienteId" value={String(fdView['clienteId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione cliente</option>
                {clientes.map((c) => (
                  <option key={getId(c)} value={getId(c)}>{getLabel(c) || getId(c)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Área</label>
              <select name="areaId" value={String(fdView['areaId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione área</option>
                {areas.map((a) => (
                  <option key={getId(a)} value={getId(a)}>{getLabel(a) || getId(a)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subárea</label>
              <select name="subareaId" value={String(fdView['subareaId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione subárea</option>
                {filteredSubareas.map((s) => (
                  <option key={getId(s)} value={getId(s)}>{getLabel(s) || getId(s)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Responsable</label>
              <select name="usuarioResponsableId" value={String(fdView['usuarioResponsableId'] ?? '')} onChange={handleChange}>
                <option value="">Seleccione responsable</option>
                {users.map((u) => (
                  <option key={getId(u)} value={getId(u)}>{getLabel(u) || getId(u)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? (reclamo ? 'Guardando...' : 'Creando...') : (reclamo ? 'Guardar' : 'Crear')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
