import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

const ORDEN = { rojo: 0, amarillo: 1, verde: 2 }

const SemaforoMaestro = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const L = t.semaforoMaestro
  const Ls = t.semaforo
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroSemaforo, setFiltroSemaforo] = useState('todos')

  useEffect(() => {
    cargarAlumnos()
  }, [])

  const cargarAlumnos = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Obtener todos los grupos del tutor
      const gruposRes = await api.getTutorGrupos()
      
      if (!gruposRes.success) {
        setError(gruposRes.message || 'Error al cargar grupos')
        setLoading(false)
        return
      }
      
      let todosAlumnos = []
      
      // Para cada grupo, obtener sus alumnos
      for (const grupo of gruposRes.data) {
        const alumnosRes = await api.getAlumnosByGrupo(grupo.id)
        
        if (alumnosRes.success) {
          // Agregar el nombre del grupo a cada alumno
          const alumnosConGrupo = alumnosRes.data.alumnos.map(alumno => ({
            ...alumno,
            grupoNombre: grupo.clave
          }))
          todosAlumnos = [...todosAlumnos, ...alumnosConGrupo]
        }
      }
      
      setAlumnos(todosAlumnos)
      
    } catch (error) {
      console.error('Error cargando alumnos:', error)
      setError('Error al cargar los datos del semáforo')
    } finally {
      setLoading(false)
    }
  }

  const filtrados = alumnos
    .filter(a => filtroSemaforo === 'todos' || a.semaforo === filtroSemaforo)
    .sort((a, b) => ORDEN[a.semaforo] - ORDEN[b.semaforo])

  const semaforoEstilo = {
    rojo:     { badge: 'badge-error',   borde: 'border-l-4 border-red-400',    texto: Ls.rojo    },
    amarillo: { badge: 'badge-warning', borde: 'border-l-4 border-yellow-400', texto: Ls.amarillo},
    verde:    { badge: 'badge-success', borde: 'border-l-4 border-green-400',  texto: Ls.verde   },
  }

  const conteo = (color) => alumnos.filter(a => a.semaforo === color).length

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin tutorías'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX')
  }

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/tutor')} className="btn btn-sm btn-outline">
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{L.title}</h1>
            <p className="text-gray-500 mt-1">{L.subtitle}</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
            <button onClick={cargarAlumnos} className="btn btn-sm btn-ghost">Reintentar</button>
          </div>
        )}

        {/* Tarjetas resumen clickeables */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { color: 'rojo',     label: Ls.rojo,     border: 'border-red-500',    text: 'text-red-500'    },
            { color: 'amarillo', label: Ls.amarillo, border: 'border-yellow-500', text: 'text-yellow-500' },
            { color: 'verde',    label: Ls.verde,    border: 'border-green-500',  text: 'text-green-500'  },
          ].map(item => (
            <button
              key={item.color}
              onClick={() => setFiltroSemaforo(filtroSemaforo === item.color ? 'todos' : item.color)}
              className={`stats shadow bg-base-100 border-l-4 ${item.border} w-full cursor-pointer hover:shadow-md transition-shadow ${
                filtroSemaforo === item.color ? 'ring-2 ring-offset-1' : ''
              }`}
            >
              <div className="stat py-4">
                <div className="stat-title">{item.label}</div>
                <div className={`stat-value ${item.text}`}>{conteo(item.color)}</div>
                <div className="stat-desc text-xs">
                  {alumnos.length > 0 ? Math.round((conteo(item.color) / alumnos.length) * 100) : 0}% del total
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Filtro */}
        <div className="flex items-center gap-3 mb-4">
          <select
            className="select select-bordered select-sm focus:border-primary-500 focus:outline-none"
            value={filtroSemaforo}
            onChange={e => setFiltroSemaforo(e.target.value)}
          >
            <option value="todos">{L.all} ({alumnos.length})</option>
            <option value="rojo">{Ls.rojo} ({conteo('rojo')})</option>
            <option value="amarillo">{Ls.amarillo} ({conteo('amarillo')})</option>
            <option value="verde">{Ls.verde} ({conteo('verde')})</option>
          </select>
          {filtroSemaforo !== 'todos' && (
            <button onClick={() => setFiltroSemaforo('todos')} className="btn btn-sm btn-ghost">
              Limpiar filtro
            </button>
          )}
        </div>

        {/* Tabla */}
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-base-200">
                <tr>
                  <th>{t.common.loading === 'Cargando...' ? 'Alumno' : 'Student'}</th>
                  <th>{t.dashboardMaestro.table.matricula}</th>
                  <th>{t.semaforo.table.group}</th>
                  <th>{t.dashboardMaestro.table.average}</th>
                  <th>{t.dashboardMaestro.table.status}</th>
                  <th>{t.dashboardMaestro.table.lastTutoria}</th>
                  <th>{t.dashboardMaestro.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No hay alumnos que coincidan con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  filtrados.map(alumno => {
                    const estilo = semaforoEstilo[alumno.semaforo] || semaforoEstilo.verde
                    return (
                      <tr key={alumno.id} className={`hover ${estilo.borde}`}>
                        <td className="font-medium">{alumno.nombre}</td>
                        <td className="font-mono text-sm text-gray-500">{alumno.matricula}</td>
                        <td className="text-sm">{alumno.grupoNombre || '—'}</td>
                        <td className="font-semibold">{alumno.promedio || 'N/A'}</td>
                        <td>
                          <span className={`badge badge-sm ${estilo.badge}`}>
                            {estilo.texto}
                          </span>
                        </td>
                        <td className="text-sm text-gray-500">{formatDate(alumno.ultima_tutoria)}</td>
                        <td>
                          <div className="flex gap-2">
                            {/*<button
                              onClick={() => navigate(`/tutor/cita/${alumno.id}`)}
                              className="btn btn-xs btn-outline btn-primary"
                            >
                              Citar
                            </button>*/}
                            <button
                              onClick={() => navigate(`/tutor/tutoria/${alumno.id}`)}
                              className="btn btn-xs btn-outline btn-success"
                            >
                              {t.dashboardMaestro.actions.tutoria}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        {alumnos.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {t.common.loading === 'Cargando...' ? `Mostrando ${filtrados.length} de ${alumnos.length} alumnos` : `Showing ${filtrados.length} of ${alumnos.length} students`}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default SemaforoMaestro