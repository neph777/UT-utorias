import { useLocation } from 'react-router-dom'

// Define aquí todas tus rutas y sus migas de pan
// El orden importa: de más general a más específica
const ROUTE_MAP = [
  { path: '/alumno',                  label: 'Mi Panel' },
  { path: '/alumno/historial',        label: 'Historial' },
  { path: '/alumno/tutorias',         label: 'Mis Tutorías' },

  { path: '/tutor',                   label: 'Mis Tutorías' },
  { path: '/tutor/semaforo',          label: 'Semáforo' },

  { path: '/admin',                   label: 'Panel de Control' },
  { path: '/admin/usuarios',          label: 'Gestión de Usuarios' },
  { path: '/admin/grupos',            label: 'Gestión de Grupos' },
  { path: '/admin/semaforo',          label: 'Semaforo General' },
  { path: '/admin/backup',            label: 'Gestión de Backup'   },
  
]

// Etiqueta amigable para la raíz según rol
const ROL_HOME = {
  alumno:  'Alumno',
  maestro: 'Maestro',
  admin:   'Administración',
}

export const useBreadcrumbs = (user) => {
  const location = useLocation()
  const pathname = location.pathname

  // Segmentos del path actual, ej: ['', 'maestro', 'alumno']
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = []

  // Construye crumbs acumulando el path segmento a segmento
  let accumulated = ''

  for (const segment of segments) {
    accumulated += '/' + segment
    const match = ROUTE_MAP.find(r => r.path === accumulated)
    if (match) {
      crumbs.push({ label: match.label, path: accumulated })
    } else if (accumulated.includes('/admin/grupos/')) {
      crumbs.push({ label: 'Asignación de Alumnos', path: accumulated })
    } else if (accumulated.includes('/admin/alumnos/')) {
      crumbs.push({ label: 'Expediente del Alumno', path: accumulated })
    } else if (accumulated.includes('/tutor/cita/')) {
       crumbs.push({ label: 'Generar Cita', path: accumulated })
    } else if (accumulated.includes('/tutor/tutoria/')) {
      crumbs.push({ label: 'Registrar Tutoría', path: accumulated })
    }  
  }

  // El último crumb es la página actual (sin link)
  // Los anteriores son navegables
  return crumbs.map((crumb, i) => ({
    ...crumb,
    isActive: i === crumbs.length - 1,
  }))
}