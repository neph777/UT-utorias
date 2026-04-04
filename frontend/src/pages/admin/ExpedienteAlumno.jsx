import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'

const ExpedienteAlumno = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()
  
  const [alumno, setAlumno] = useState(null)
  const [historial, setHistorial] = useState([])
  const [grupo, setGrupo] = useState(null)
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarExpediente()
  }, [alumnoId])

  const cargarExpediente = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Cargando expediente del alumno:', alumnoId)
      
      // Obtener expediente completo del alumno desde la API
      const expediente = await api.getExpedienteAlumno(alumnoId)
      console.log('Expediente recibido:', expediente)
      
      // Estructurar los datos según lo que devuelve la API
      // La API de AlumnoController::expediente devuelve { alumno, historial }
      if (expediente.alumno) {
        setAlumno(expediente.alumno)
        setHistorial(expediente.historial || [])
        setGrupo(expediente.alumno.grupos?.[0] || null)
        setTutor(expediente.alumno.tutor || null)
      } else {
        // Si la respuesta tiene otra estructura
        setAlumno(expediente)
        setHistorial([])
      }
      
    } catch (error) {
      console.error('Error al cargar expediente:', error)
      setError('Error al cargar el expediente del alumno')
    } finally {
      setLoading(false)
    }
  }

  const semaforoEstilo = {
    rojo:     { badge: 'badge-error',   texto: 'Prioridad alta', color: 'text-red-600' },
    amarillo: { badge: 'badge-warning', texto: 'Seguimiento preventivo', color: 'text-yellow-600' },
    verde:    { badge: 'badge-success', texto: 'Estable', color: 'text-green-600' },
  }

  const getSemaforoInfo = (semaforo) => {
    return semaforoEstilo[semaforo] || { badge: 'badge-ghost', texto: 'Sin estado', color: 'text-gray-600' }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const getInitials = (nombre) => {
    if (!nombre) return 'A'
    return nombre.split(' ').map(n => n[0]).slice(0, 2).join('')
  }

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-gray-500">Cargando expediente...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !alumno) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 text-center">
          <div className="alert alert-error max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Alumno no encontrado'}</span>
          </div>
          <button 
            onClick={() => navigate('/admin/usuarios')} 
            className="btn btn-primary mt-4"
          >
            Volver a Usuarios
          </button>
        </div>
      </Layout>
    )
  }

  const semaforoInfo = getSemaforoInfo(alumno.semaforo_color || alumno.semaforo)
  const nombreAlumno = alumno.nombre || alumno.nombre_completo || 'Alumno'
  const matriculaAlumno = alumno.matricula || 'No disponible'
  const promedioAlumno = alumno.promedio || alumno.promedio_general || 'N/A'
  const grupoNombre = grupo?.clave || grupo?.nombre || 'Sin grupo'
  const tutorNombre = tutor?.nombre_completo || tutor?.nombre || 'Sin tutor'

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
                {getInitials(nombreAlumno)}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Nombre completo</p>
                  <p className="font-semibold text-gray-800">{nombreAlumno}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Matrícula</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm">{matriculaAlumno}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Grupo</p>
                  <p className="font-semibold text-gray-800">{grupoNombre}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tutor</p>
                  <p className="font-semibold text-gray-800">{tutorNombre}</p>
                </div>
              </div>
            </div>

            {/* Stats del alumno */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="stats shadow bg-base-200 border-l-4 border-primary-500">
                <div className="stat py-4">
                  <div className="stat-title">Promedio actual</div>
                  <div className="stat-value text-primary-500 text-3xl">{promedioAlumno}</div>
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
                  <div className="stat-value text-yellow-500 text-xl">
                    {historial.length > 0 ? formatDate(historial[0].fecha) : 'Sin tutorías'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <p className="text-sm text-gray-500">Estado académico:</p>
              <span className={`badge ${semaforoInfo.badge}`}>
                {semaforoInfo.texto}
              </span>
              {alumno.semaforo_razon && (
                <p className="text-xs text-gray-400 ml-2">
                  Razón: {alumno.semaforo_razon}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Historial de tutorías */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-0">
            <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Historial de tutorías</h2>
              <span className="badge badge-primary">{historial.length} registros</span>
            </div>
            {historial.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400">No hay tutorías registradas</p>
                <p className="text-xs text-gray-300 mt-1">Este alumno aún no ha recibido tutorías</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Fecha</th>
                      <th>Tutor</th>
                      <th>Tema</th>
                      <th>Compromiso</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((tutoria, index) => (
                      <tr key={tutoria.id || index} className="hover">
                        <td className="font-mono text-sm">{formatDate(tutoria.fecha)}</td>
                        <td className="text-sm">{tutoria.tutor || 'No especificado'}</td>
                        <td className="text-sm max-w-xs">{tutoria.tema || 'No especificado'}</td>
                        <td className="text-sm text-gray-600 max-w-xs">
                          {tutoria.compromiso || 'Sin compromisos registrados'}
                        </td>
                        <td className="text-sm text-gray-500 max-w-md">
                          {tutoria.observaciones || 'Sin observaciones'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Acciones adicionales */}
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={() => navigate('/admin/usuarios')} 
            className="btn btn-outline"
          >
            Volver a Usuarios
          </button>
          <button 
            onClick={() => navigate('/admin/semaforo')} 
            className="btn btn-primary"
          >
            Ver Semáforo General
          </button>
        </div>

      </div>
    </Layout>
  )
}

export default ExpedienteAlumno