import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

const DashboardMaestro = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const L = t.dashboardMaestro
  const [grupos, setGrupos] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [alumnos, setAlumnos] = useState([])
  const [stats, setStats] = useState({
    total_alumnos: 0,
    alumnos_rojo: 0,
    tutorias_realizadas: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCitarModal, setShowCitarModal] = useState(false)
  const [showReporteModal, setShowReporteModal] = useState(false)
  const [selectedAlumnosReporte, setSelectedAlumnosReporte] = useState([])
  const [citaData, setCitaData] = useState({ fecha: '', asunto: '', alumnoId: null })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      // Cargar estadísticas
      const statsRes = await api.getTutorStats()
      if (statsRes.success) {
        setStats(statsRes.data)
      }

      // Cargar grupos
      const gruposRes = await api.getTutorGrupos()
      if (gruposRes.success && gruposRes.data.length > 0) {
        setGrupos(gruposRes.data)
        setSelectedGroupId(gruposRes.data[0].id)
        await cargarAlumnos(gruposRes.data[0].id)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const cargarAlumnos = async (grupoId) => {
    try {
      const res = await api.getAlumnosByGrupo(grupoId)
      if (res.success) {
        setAlumnos(res.data.alumnos || [])
      }
    } catch (error) {
      console.error('Error cargando alumnos:', error)
    }
  }

  const handleGroupChange = (grupoId) => {
    setSelectedGroupId(grupoId)
    cargarAlumnos(grupoId)
    setSelectedAlumnosReporte([])
  }

  const getSemaforoColor = (color) => {
    const colors = {
      rojo: 'badge badge-error',
      amarillo: 'badge badge-warning',
      verde: 'badge badge-success',
    }
    return colors[color] || 'badge badge-ghost'
  }

  const getSemaforoTexto = (color) => {
    const textos = {
      rojo: L.semaforo.rojo,
      amarillo: L.semaforo.amarillo,
      verde: L.semaforo.verde,
    }
    return textos[color] || color
  }

  const generarReporteWord = () => {
    const alumnosSeleccionados = selectedAlumnosReporte.length > 0
      ? alumnos.filter(a => selectedAlumnosReporte.includes(a.id))
      : alumnos

    const grupoActual = grupos.find(g => g.id === selectedGroupId)

    const contenido = `
      UNIVERSIDAD TECNOLÓGICA DE NAYARIT
      SISTEMA DE TUTORÍAS

      REPORTE DE SEGUIMIENTO ACADÉMICO

      Grupo: ${grupoActual?.clave || 'N/A'}
      Fecha de generación: ${new Date().toLocaleDateString()}
      Tutor: ${user?.nombre_completo || user?.nombre}

      ================================================

      ESTADÍSTICAS GENERALES

      • Total de alumnos en el grupo: ${alumnos.length}
      • Alumnos reportados: ${alumnosSeleccionados.length}
      • Alumnos en prioridad alta (rojo): ${alumnosSeleccionados.filter(a => a.semaforo === 'rojo').length}
      • Alumnos en seguimiento (amarillo): ${alumnosSeleccionados.filter(a => a.semaforo === 'amarillo').length}
      • Alumnos estables (verde): ${alumnosSeleccionados.filter(a => a.semaforo === 'verde').length}

      ================================================

      LISTADO DE ALUMNOS

      ${alumnosSeleccionados.map(a => `
      ────────────────────────────────────────────────
      Alumno: ${a.nombre}
      Matrícula: ${a.matricula}
      Promedio: ${a.promedio}
      Nivel de atención: ${a.semaforo?.toUpperCase() || 'VERDE'}
      Última tutoría: ${a.ultima_tutoria || 'Sin tutorías'}
      ────────────────────────────────────────────────
      `).join('')}

      ================================================

      Este reporte fue generado automáticamente por el Sistema de Tutorías UTN.
      Para cualquier aclaración, contactar a la Coordinación Académica.
    `

    const blob = new Blob([contenido], { type: 'application/msword' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Reporte_Tutorias_${grupoActual?.clave}_${new Date().toISOString().split('T')[0]}.doc`
    link.click()
    URL.revokeObjectURL(link.href)
    setShowReporteModal(false)
    setSelectedAlumnosReporte([])
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

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{L.title}</h1>
            <p className="text-gray-500 mt-1">{L.subtitle}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate('/tutor/semaforo')}
              className="btn btn-outline btn-error"
            >
              Ver Semáforo
            </button>
            <button
              onClick={() => setShowReporteModal(true)}
              className="btn bg-primary-500 hover:bg-primary-600 text-white border-none"
            >
              {L.generateReport}
            </button>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats shadow bg-base-100 border-l-4 border-primary-500">
            <div className="stat">
              <div className="stat-title">{L.studentsInGroup}</div>
              <div className="stat-value text-primary-500">{alumnos.length}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-red-500">
            <div className="stat">
              <div className="stat-title">{L.requireAttention}</div>
              <div className="stat-value text-red-500">
                {alumnos.filter(a => a.semaforo === 'rojo').length}
              </div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-green-500">
            <div className="stat">
              <div className="stat-title">{L.tutoriasCompleted}</div>
              <div className="stat-value text-green-500">{stats.tutorias_realizadas}</div>
            </div>
          </div>
        </div>

        {/* Selector de grupos */}
        {grupos.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {grupos.map(grupo => (
              <button
                key={grupo.id}
                onClick={() => handleGroupChange(grupo.id)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedGroupId === grupo.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {grupo.clave || grupo.nombre}
                <span className="ml-2 text-xs opacity-80">
                  ({grupo.alumnos_count || grupo.alumnos?.length || 0})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tabla de alumnos */}
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>{L.table.matricula}</th>
                  <th>{L.table.name}</th>
                  <th>{L.table.average}</th>
                  <th>{L.table.status}</th>
                  <th>{L.table.lastTutoria}</th>
                  <th>{L.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400 py-8">
                      {L.noStudents}
                    </td>
                  </tr>
                ) : (
                  alumnos.map(alumno => (
                    <tr key={alumno.id} className="hover">
                      <td className="font-mono text-sm text-gray-500">{alumno.matricula}</td>
                      <td className="font-medium">{alumno.nombre}</td>
                      <td className="font-semibold">{alumno.promedio || 'N/A'}</td>
                      <td>
                        <span className={getSemaforoColor(alumno.semaforo)}>
                          {getSemaforoTexto(alumno.semaforo)}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500">
                        {alumno.ultima_tutoria || L.table.noTutorias}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {/*<button
                            onClick={() => navigate(`/tutor/cita/${alumno.usuario_id || alumno.id}`)}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            Citar
                          </button>*/}
                          <button
                            onClick={() => navigate(`/tutor/tutoria/${alumno.id}`)}
                            className="btn btn-xs btn-outline btn-success"
                          >
                            {L.actions.tutoria}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal generar reporte */}
      {showReporteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{L.generateReport}</h2>
              <button onClick={() => setShowReporteModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{L.group}</label>
                <select
                  className="select select-bordered w-full focus:border-primary-500 focus:outline-none"
                  value={selectedGroupId || ''}
                  onChange={(e) => handleGroupChange(parseInt(e.target.value))}
                >
                  {grupos.map(g => (
                    <option key={g.id} value={g.id}>{g.clave || g.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {L.selectStudents} <span className="text-gray-400 font-normal">({L.optional})</span>
                </label>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto p-2">
                  {alumnos.map(alumno => (
                    <label key={alumno.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={selectedAlumnosReporte.includes(alumno.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAlumnosReporte([...selectedAlumnosReporte, alumno.id])
                          } else {
                            setSelectedAlumnosReporte(selectedAlumnosReporte.filter(id => id !== alumno.id))
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{alumno.nombre}</span>
                      <span className={`badge badge-sm ml-auto ${
                        alumno.semaforo === 'rojo' ? 'badge-error' :
                        alumno.semaforo === 'amarillo' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {alumno.semaforo || 'verde'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={generarReporteWord} className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                {L.download}
              </button>
              <button onClick={() => setShowReporteModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                {L.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default DashboardMaestro