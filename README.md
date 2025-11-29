# Proyecto3_front

> Frontend del proyecto (React + Vite + TypeScript). Interfaz para crear/editar/eliminar reclamos, gestionar catálogos y visualizar datos.

## Resumen
- Framework: React
- Bundler: Vite
- Lenguaje: TypeScript

## Requisitos
- Node.js 18+ y npm
- Backend corriendo (por defecto `http://localhost:3000`)

## Variables de entorno
Crear un archivo `.env` o `.env.local` en la carpeta `proyecto3_front` con:

```
VITE_API_URL=http://localhost:3000
```

## Instalación

En PowerShell, desde `proyecto3_front`:

```powershell
npm install
```

## Ejecutar en desarrollo

```powershell
npm run dev
```

Abre el navegador en la URL que Vite muestre (por defecto `http://localhost:5173`).

## Build y preview

```powershell
npm run build
npm run preview
```

## Funcionalidades relevantes
- Crear reclamos mediante modal (`ReclamoForm`).
- Editar reclamos: haz clic en el icono ✏️ en la lista de reclamos para abrir el modal con datos precargados.
- Borrar reclamos mediante el botón ✕ en la tabla (realiza soft-delete en backend).

## Token de autenticación
Algunas rutas requieren JWT. El frontend guarda el token en `localStorage` bajo la clave `token`. Para pruebas manuales puedes hacer:

```javascript
localStorage.setItem('token', '<TU_JWT_AQUI>')
```

## Problemas comunes & soluciones
- `Filename too long` o `git add` fallando: añade `**/node_modules/` a `.gitignore` y usa `git rm -r --cached node_modules` o mueve el repo a una ruta más corta.
- Advertencias LF/CRLF: ejecuta `git add --renormalize .` si aplicaste `.gitattributes`.

## Desarrollo y testing rápido
- Para probar la creación de reclamos desde PowerShell (ejemplo):

```powershell
$body = @{ titulo='Reclamo prueba automatizada'; descripcion='Prueba desde PowerShell'; archivos=@(); tipoReclamoId='ID_TIPO'; prioridadId='ID_PRIORIDAD'; nivelCriticidadId='ID_NIVEL'; proyectoId='ID_PROYECTO'; clienteId='ID_CLIENTE'; areaId='ID_AREA'; subareaId='ID_SUBAREA' } | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/reclamo' -Body $body -ContentType 'application/json'
```

## Estructura relevante
- `src/api/` : helpers para llamadas a la API (reclamos, catálogos, clientes, proyectos, etc.).
- `src/components/ReclamoForm/reclamoForm.tsx` : formulario/modal para crear/editar reclamos.
- `src/pages/Reclamos/reclamo.tsx` : listado, botones de acción y wiring del modal.

## Consejos
- Asegúrate de que `VITE_API_URL` apunta al backend correcto.
- Si ves errores 401 al cargar `/users`, agrega temporalmente un token en `localStorage` para pruebas.
