import { useLocation } from 'react-router-dom'

// Define aquí todas tus rutas y sus migas de pan
// El orden importa: de más general a más específica
const ROUTE_MAP = [
  { path: '/alumno',                  label: 'Mi Panel' },
  { path: '/alumno/historial',        label: 'Historial' },
  { path: '/alumno/tutorias',         label: 'Mis Tutorías' },

  { path: '/maestro',                 label: 'Mis Tutorías' },
  { path: '/maestro/grupo',           label: 'Detalle de Grupo' },
  { path: '/maestro/alumno',          label: 'Perfil de Alumno' },
  { path: '/maestro/reportes',        label: 'Reportes' },

  { path: '/admin',                   label: 'Panel de Control' },
  { path: '/admin/grupos',            label: 'Gestión de Grupos' },
  { path: '/admin/tutores',           label: 'Tutores' },
  { path: '/admin/reportes',          label: 'Reportes Generales' },
  { path: '/admin/estadisticas',      label: 'Estadísticas' },
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
    }
  }

  // El último crumb es la página actual (sin link)
  // Los anteriores son navegables
  return crumbs.map((crumb, i) => ({
    ...crumb,
    isActive: i === crumbs.length - 1,
  }))
}