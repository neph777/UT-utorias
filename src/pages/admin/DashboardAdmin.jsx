import Layout from '../../components/layout/Layout'

const DashboardAdmin = ({ user, onLogout }) => {
  const stats = [
    { label: 'Total Alumnos', value: 180, color: 'border-primary-500', textColor: 'text-primary-500' },
    { label: 'Tutores Activos', value: 12, color: 'border-blue-500', textColor: 'text-blue-500' },
    { label: 'Tutorías Realizadas', value: 156, color: 'border-green-500', textColor: 'text-green-500' },
    { label: 'Alumnos en Rojo', value: 8, color: 'border-red-500', textColor: 'text-red-500' },
  ]

  const semaforo = [
    { label: 'Prioridad alta', color: 'bg-red-500', cantidad: 8, total: 180 },
    { label: 'Seguimiento preventivo', color: 'bg-yellow-500', cantidad: 24, total: 180 },
    { label: 'Estable', color: 'bg-green-500', cantidad: 148, total: 180 },
  ]

  const acciones = [
    'Generar Reporte General',
    'Gestionar Grupos',
    'Asignar Tutores',
    'Ver Estadísticas por Grupo',
  ]

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 mt-1">Resumen general del programa de tutorías</p>
        </div>

        {/* Tarjetas de stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`card bg-white shadow-sm border-l-4 ${s.color}`}>
              <div className="card-body p-5">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={`text-4xl font-bold mt-1 ${s.textColor}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Semáforo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Estado general de alumnos</h2>
            <div className="space-y-5">
              {semaforo.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.cantidad}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.cantidad / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Acciones rápidas</h2>
            <div className="space-y-3">
              {acciones.map((accion, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all"
                >
                  {accion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardAdmin