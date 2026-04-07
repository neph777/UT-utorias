import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { alumnos as alumnosMock, grupos as gruposMock, tutorias } from '../../data/mockData'

const DashboardMaestro = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [selectedGroup, setSelectedGroup] = useState('IDGS-81')
  const [showCitarModal, setShowCitarModal] = useState(false)
  const [showReporteModal, setShowReporteModal] = useState(false)
  const [selectedAlumnosReporte, setSelectedAlumnosReporte] = useState([])

  const grupos = gruposMock
  const alumnos = alumnosMock

  const grupoActual = grupos.find(g => g.nombre === selectedGroup)
  const alumnosDelGrupo = alumnos.filter(a => grupoActual?.alumnos.includes(a.id))
  const tutoriasRealizadas = tutorias.length

  const getSemaforoColor = (color) => {
    const colors = {
      rojo:     'badge badge-error',
      amarillo: 'badge badge-warning',
      verde:    'badge badge-success',
    }
    return colors[color] || 'badge badge-ghost'
  }

  const getSemaforoTexto = (color) => {
    const textos = {
      rojo:     'Prioridad Alta',
      amarillo: 'Seguimiento',
      verde:    'Estable',
    }
    return textos[color] || color
  }

  const generarReporteWord = () => {
    const alumnosSeleccionados = selectedAlumnosReporte.length > 0
      ? alumnosDelGrupo.filter(a => selectedAlumnosReporte.includes(a.id))
      : alumnosDelGrupo

    const contenido = `
      UNIVERSIDAD TECNOLÓGICA DE NAYARIT
      SISTEMA DE TUTORÍAS

      REPORTE DE SEGUIMIENTO ACADÉMICO

      Grupo: ${selectedGroup}
      Fecha de generación: ${new Date().toLocaleDateString()}
      Tutor: ${user?.nombre_completo || user?.nombre}

      ================================================

      ESTADÍSTICAS GENERALES

      • Total de alumnos en el grupo: ${alumnosDelGrupo.length}
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
      Nivel de atención: ${a.semaforo.toUpperCase()}
      Última tutoría: ${a.ultimaTutoria}
      ────────────────────────────────────────────────
      `).join('')}

      ================================================

      Este reporte fue generado automáticamente por el Sistema de Tutorías UTN.
      Para cualquier aclaración, contactar a la Coordinación Académica.
    `

    const blob = new Blob([contenido], { type: 'application/msword' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Reporte_Tutorias_${selectedGroup}_${new Date().toISOString().split('T')[0]}.doc`
    link.click()
    URL.revokeObjectURL(link.href)
    setShowReporteModal(false)
    setSelectedAlumnosReporte([])
  }

  const citarAlumnos = () => {
    alert('Se han enviado citatorios a los alumnos seleccionados.')
    setShowCitarModal(false)
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mis Tutorías</h1>
            <p className="text-gray-500 mt-1">Gestiona el seguimiento académico de tus alumnos</p>
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
              Generar Reporte
            </button>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats shadow bg-base-100 border-l-4 border-primary-500">
            <div className="stat">
              <div className="stat-title">Alumnos en el Grupo</div>
              <div className="stat-value text-primary-500">{alumnosDelGrupo.length}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-red-500">
            <div className="stat">
              <div className="stat-title">Requieren Atención</div>
              <div className="stat-value text-red-500">
                {alumnosDelGrupo.filter(a => a.semaforo === 'rojo').length}
              </div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-green-500">
            <div className="stat">
              <div className="stat-title">Tutorías Realizadas</div>
              <div className="stat-value text-green-500">{tutoriasRealizadas}</div>
            </div>
          </div>
        </div>

        {/* Selector de grupos */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {grupos.map(grupo => (
            <button
              key={grupo.id}
              onClick={() => {
                setSelectedGroup(grupo.nombre)
                setSelectedAlumnosReporte([])
              }}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedGroup === grupo.nombre
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {grupo.nombre}
              <span className="ml-2 text-xs opacity-80">
                ({alumnos.filter(a => grupo.alumnos.includes(a.id)).length})
              </span>
            </button>
          ))}
        </div>

        {/* Tabla de alumnos */}
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Promedio</th>
                  <th>Nivel de Atención</th>
                  <th>Última Tutoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDelGrupo.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400 py-8">
                      No hay alumnos en este grupo
                    </td>
                  </tr>
                ) : (
                  alumnosDelGrupo.map(alumno => (
                    <tr key={alumno.id} className="hover">
                      <td className="font-mono text-sm text-gray-500">{alumno.matricula}</td>
                      <td className="font-medium">{alumno.nombre}</td>
                      <td className="font-semibold">{alumno.promedio}</td>
                      <td>
                        <span className={getSemaforoColor(alumno.semaforo)}>
                          {getSemaforoTexto(alumno.semaforo)}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500">{alumno.ultimaTutoria}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/tutor/cita/${alumno.id}`)}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            Citar
                          </button>
                          <button
                            onClick={() => navigate(`/tutor/tutoria/${alumno.id}`)}
                            className="btn btn-xs btn-outline btn-success"
                          >
                            Registrar
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

      {/* Modal citar alumnos */}
      {showCitarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Citar Alumnos a Tutoría</h2>
              <button onClick={() => setShowCitarModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <p className="text-gray-500 text-sm mb-4">Selecciona los alumnos que deseas citar</p>
            <div className="space-y-2 max-h-96 overflow-y-auto border-t border-gray-100 pt-3">
              {alumnosDelGrupo.map(alumno => (
                <label key={alumno.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">{alumno.nombre}</span>
                    <span className="text-xs text-gray-400 ml-2">{alumno.matricula}</span>
                  </div>
                  <span className={getSemaforoColor(alumno.semaforo)}>
                    {getSemaforoTexto(alumno.semaforo)}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={citarAlumnos} className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Enviar Citatorios
              </button>
              <button onClick={() => setShowCitarModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal generar reporte */}
      {showReporteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Generar Reporte</h2>
              <button onClick={() => setShowReporteModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                <select
                  className="select select-bordered w-full focus:border-primary-500 focus:outline-none"
                  value={selectedGroup}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value)
                    setSelectedAlumnosReporte([])
                  }}
                >
                  {grupos.map(g => <option key={g.id}>{g.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar alumnos <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto p-2">
                  {alumnosDelGrupo.map(alumno => (
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
                        {alumno.semaforo}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Deja vacío para incluir a todos</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                <select className="select select-bordered w-full bg-gray-50 text-gray-500">
                  <option>Microsoft Word (.doc)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={generarReporteWord} className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Descargar Reporte
              </button>
              <button onClick={() => setShowReporteModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default DashboardMaestro