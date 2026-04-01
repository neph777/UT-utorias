import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { alumnos, tutorias, grupos, usuarios } from '../../data/mockData'

const ExpedienteAlumno = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()
  const alumno = alumnos.find(a => a.id === Number(alumnoId))
  const historial = tutorias.filter(t => t.alumnoId === Number(alumnoId))
  const grupo = grupos.find(g => g.id === alumno?.grupoId)
  const tutor = usuarios.find(u => u.id === grupo?.maestroId)

  const semaforoEstilo = {
    rojo:     { badge: 'badge-error',   texto: 'Prioridad alta' },
    amarillo: { badge: 'badge-warning', texto: 'Seguimiento preventivo' },
    verde:    { badge: 'badge-success', texto: 'Estable' },
  }

  if (!alumno) return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 text-center text-gray-500">Alumno no encontrado</div>
    </Layout>
  )

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline">
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Expediente del Alumno</h1>
            <p className="text-gray-500 mt-1">Detalle académico y tutorías registradas</p>
          </div>
        </div>

        {/* Tarjeta de perfil */}
        <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {alumno.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Nombre</p>
                  <p className="font-semibold text-gray-800">{alumno.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Matrícula</p>
                  <p className="font-semibold text-gray-800 font-mono">{alumno.matricula}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Grupo</p>
                  <p className="font-semibold text-gray-800">{grupo?.nombre || 'Sin grupo'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tutor</p>
                  <p className="font-semibold text-gray-800">{tutor?.nombre || 'Sin tutor'}</p>
                </div>
              </div>
            </div>

            {/* Stats del alumno */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="stats shadow bg-base-200 border-l-4 border-primary-500">
                <div className="stat py-4">
                  <div className="stat-title">Promedio actual</div>
                  <div className="stat-value text-primary-500">{alumno.promedio}</div>
                </div>
              </div>
              <div className="stats shadow bg-base-200 border-l-4 border-gray-400">
                <div className="stat py-4">
                  <div className="stat-title">Tutorías recibidas</div>
                  <div className="stat-value text-gray-600">{historial.length}</div>
                </div>
              </div>
              <div className="stats shadow bg-base-200 border-l-4 border-yellow-500">
                <div className="stat py-4">
                  <div className="stat-title">Última tutoría</div>
                  <div className="stat-value text-yellow-500 text-2xl">{alumno.ultimaTutoria}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <p className="text-sm text-gray-500">Estado:</p>
              <span className={`badge ${semaforoEstilo[alumno.semaforo]?.badge}`}>
                {semaforoEstilo[alumno.semaforo]?.texto}
              </span>
            </div>
          </div>
        </div>

        {/* Historial de tutorías */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-0">
            <div className="px-6 py-4 border-b border-base-200">
              <h2 className="font-semibold text-gray-800">Historial de tutorías</h2>
            </div>
            {historial.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin tutorías registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Promedio</th>
                      <th>Compromisos</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map(t => (
                      <tr key={t.id} className="hover">
                        <td className="font-mono text-sm">{t.fecha}</td>
                        <td><span className="badge badge-ghost badge-sm">{t.tipo}</span></td>
                        <td className="font-semibold">{t.promedio}</td>
                        <td className="text-sm text-gray-600">{t.compromisos}</td>
                        <td className="text-sm text-gray-500">{t.observaciones}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default ExpedienteAlumno