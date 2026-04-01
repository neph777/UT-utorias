import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { alumnos } from '../../data/mockData'

const DashboardAdmin = ({ user, onLogout }) => {
  const navigate = useNavigate()

  const rojos    = alumnos.filter(a => a.semaforo === 'rojo').length
  const amarillos = alumnos.filter(a => a.semaforo === 'amarillo').length
  const verdes   = alumnos.filter(a => a.semaforo === 'verde').length

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 mt-1">Resumen general del programa de tutorías</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Alumnos',       value: alumnos.length, border: 'border-primary-500', text: 'text-primary-500' },
            { label: 'Tutores Activos',     value: 2,              border: 'border-info',        text: 'text-info'        },
            { label: 'Tutorías Realizadas', value: 4,              border: 'border-success',     text: 'text-success'     },
            { label: 'Alumnos en Rojo',     value: rojos,          border: 'border-error',       text: 'text-error'       },
          ].map((s, i) => (
            <div key={i} className={`stats shadow bg-base-100 border-l-4 ${s.border}`}>
              <div className="stat">
                <div className="stat-title">{s.label}</div>
                <div className={`stat-value ${s.text}`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Semáforo */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <h2 className="card-title">Estado general de alumnos</h2>
                <button
                  onClick={() => navigate('/admin/semaforo')}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Ver detalle
                </button>
              </div>
              <div className="space-y-4 mt-2">
                {[
                  { label: 'Prioridad alta',         color: 'progress-error',   cantidad: rojos,    total: alumnos.length },
                  { label: 'Seguimiento preventivo', color: 'progress-warning', cantidad: amarillos, total: alumnos.length },
                  { label: 'Estable',                color: 'progress-success', cantidad: verdes,   total: alumnos.length },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-bold">{item.cantidad}</span>
                    </div>
                    <progress className={`progress ${item.color} w-full`} value={item.cantidad} max={item.total} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title mb-2">Acciones rápidas</h2>
              <div className="space-y-3">
                {[
                  { label: 'Gestionar usuarios y roles', ruta: '/admin/usuarios' },
                  { label: 'Gestionar grupos',           ruta: '/admin/grupos'   },
                  { label: 'Ver semáforo general',       ruta: '/admin/semaforo' },
                ].map((accion, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(accion.ruta)}
                    className="btn btn-outline btn-primary w-full justify-start"
                  >
                    {accion.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default DashboardAdmin