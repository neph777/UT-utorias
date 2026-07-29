import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

const DashboardAlumno = ({ user, onLogout }) => {
  const { t } = useLanguage()
  const L = t.dashboardAlumno

  const getTodayInputDate = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    promedio: 0,
    tutorias_recibidas: 0,
    ultima_tutoria: null,
    proxima_tutoria: null
  })
  const [historial, setHistorial] = useState([])
  const [alertas, setAlertas] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [solicitudForm, setSolicitudForm] = useState({
    fecha: getTodayInputDate(),
    asunto: ''
  })
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false)
  const [solicitudOk, setSolicitudOk] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.getMiExpediente()
      console.log('Expediente del alumno:', response)

      if (response.success && response.alumno) {
        const alumnoData = response.alumno

        setStats({
          promedio: alumnoData.promedio || 0,
          tutorias_recibidas: response.historial?.length || 0,
          ultima_tutoria: alumnoData.ultima_tutoria_fecha,
          proxima_tutoria: response.alertas?.length > 0 ? response.alertas[0].fecha : null
        })

        const historialFormateado = (response.historial || []).map(t => ({
          fecha: formatDate(t.fecha),
          tipo: t.tipo || 'Individual',
          compromisos: t.compromiso || 'Sin compromisos',
          estado: t.estado || 'completada'
        }))

        setHistorial(historialFormateado)
        setAlertas(response.alertas || [])
        setSolicitudes(response.solicitudes || [])
      } else {
        throw new Error(response.message || 'Error al cargar datos')
      }
    } catch (error) {
      console.error('Error cargando datos del alumno:', error)
      setError('Error al cargar los datos del alumno')

      setStats({
        promedio: 85,
        tutorias_recibidas: 4,
        ultima_tutoria: '2024-03-10',
        proxima_tutoria: null
      })
      setHistorial([
        { fecha: '10/03/2024', tipo: 'Individual', compromisos: 'Entregar tarea de matemáticas', estado: 'completada' },
        { fecha: '01/03/2024', tipo: 'Grupal', compromisos: 'Asistir a asesoría', estado: 'completada' },
        { fecha: '20/02/2024', tipo: 'Individual', compromisos: 'Estudiar para examen parcial', estado: 'pendiente' },
      ])
      setAlertas([])
      setSolicitudes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSolicitarTutoria = async () => {
    if (!solicitudForm.asunto.trim()) return

    setEnviandoSolicitud(true)
    setError('')
    setSolicitudOk('')

    try {
      const response = await api.solicitarTutoria({
        fecha: solicitudForm.fecha,
        asunto: solicitudForm.asunto.trim()
      })

      if (response.success) {
        setSolicitudOk('Tu solicitud de tutoría fue enviada correctamente.')
        setSolicitudForm({
          fecha: getTodayInputDate(),
          asunto: ''
        })

        if (response.data) {
          setSolicitudes(prev => [response.data, ...prev])
        } else {
          cargarDatos()
        }
      } else {
        setError(response.message || 'No se pudo enviar la solicitud')
      }
    } catch (error) {
    console.error('Error al solicitar tutoría:', error)
    setError(error.message || 'Error al conectar con el servidor')
    }finally {
      setEnviandoSolicitud(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'

    const date = new Date(dateString)

    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateSimple = (dateString) => {
    if (!dateString) return 'Sin fecha'

    const date = new Date(dateString)

    return date.toLocaleString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const estadoBadge = (estado) => {
    if (estado === 'completada' || estado === 'completado' || estado === 'cumplido') {
      return 'bg-green-100 text-green-700 border border-green-200'
    }
    return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  }

  const getEstadoTexto = (estado) => {
    if (estado === 'completada' || estado === 'completado' || estado === 'cumplido') {
      return L.table?.fulfilled || 'Cumplido'
    }
    return L.table?.pending || 'Pendiente'
  }

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-gray-500">Cargando tu información...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {L.welcome || 'Bienvenido'}, {user?.nombre_completo?.split(' ')[0] || user?.nombre?.split(' ')[0] || 'Alumno'}
          </h1>
          <p className="text-gray-500 mt-1">{L.subtitle || 'Aquí puedes consultar tu historial y próximas tutorías'}</p>
        </div>

        {error && (
          <div className="alert alert-warning mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white shadow-sm border-l-4 border-primary-500">
            <div className="card-body p-6">
              <p className="text-sm text-gray-500 mb-1">{L.average || 'Mi Promedio'}</p>
              <p className="text-4xl font-bold text-primary-500">{stats.promedio}</p>
              <p className="text-xs text-gray-400 mt-1">{L.cycle || 'Ciclo actual'}</p>
            </div>
          </div>

          <div className="card bg-white shadow-sm border-l-4 border-green-500">
            <div className="card-body p-6">
              <p className="text-sm text-gray-500 mb-1">{L.tutoriasReceived || 'Tutorías Recibidas'}</p>
              <p className="text-4xl font-bold text-green-500">{stats.tutorias_recibidas}</p>
              <p className="text-xs text-gray-400 mt-1">{L.semester || 'Este semestre'}</p>
            </div>
          </div>

          <div className="card bg-white shadow-sm border-l-4 border-yellow-500">
            <div className="card-body p-6">
              <p className="text-sm text-gray-500 mb-1">{L.nextTutoria || 'Próxima Tutoría'}</p>
              <p className="text-3xl font-bold text-yellow-500">
                {stats.proxima_tutoria ? formatDateSimple(stats.proxima_tutoria) : 'Sin agendar'}
              </p>
              <p className="text-xs text-gray-400 mt-1">{L.nextTutoriaTime || 'Próxima sesión'}</p>
            </div>
          </div>
        </div>

        {/* Formulario para solicitar tutoría */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Solicitar tutoría
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha deseada
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                  value={solicitudForm.fecha}
                  onChange={e => setSolicitudForm({ ...solicitudForm, fecha: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo / asunto
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                  placeholder="Ej: Dudas en matemáticas, seguimiento académico..."
                  value={solicitudForm.asunto}
                  onChange={e => setSolicitudForm({ ...solicitudForm, asunto: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSolicitarTutoria}
                disabled={enviandoSolicitud || !solicitudForm.asunto.trim()}
                className="btn bg-primary-500 hover:bg-primary-600 text-white border-none disabled:opacity-50"
              >
                {enviandoSolicitud ? 'Enviando...' : 'Solicitar tutoría'}
              </button>
            </div>

            {solicitudOk && (
              <div className="alert alert-success">
                <span>{solicitudOk}</span>
              </div>
            )}
          </div>
        </div>

        {/* Próximas citas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximas citas
            </h2>
          </div>

          <div className="p-6">
            {alertas.length === 0 ? (
              <p className="text-gray-500">
                No tienes citas pendientes.
              </p>
            ) : (
              <div className="space-y-4">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="rounded-xl border border-yellow-200 bg-yellow-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {alerta.asunto}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Fecha: {alerta.fecha} {alerta.hora?.substring(0,5)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tutor: {alerta.tutor}
                        </p>
                      </div>

                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                        Pendiente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Solicitudes enviadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Mis solicitudes enviadas
            </h2>
          </div>

          <div className="p-6">
            {solicitudes.length === 0 ? (
              <p className="text-gray-500">
                Aún no has enviado solicitudes de tutoría.
              </p>
            ) : (
              <div className="space-y-4">
                {solicitudes.map((solicitud) => (
                  <div
                    key={solicitud.id}
                    className="rounded-xl border border-blue-200 bg-blue-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {solicitud.asunto}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Fecha sugerida: {solicitud.fecha} {solicitud.hora?.substring(0,5)}
                        </p>
                        <div className="mt-2">
                        {solicitud.estado === "pendiente" && (
                            <span className="badge badge-warning">
                                Pendiente
                            </span>
                        )}

                        {solicitud.estado === "aceptada" && (
                            <span className="badge badge-success">
                                Tu tutor acepto la solicitud
                                Revisa el apartado de citas
                            </span>
                        )}

                        {solicitud.estado === "rechazada" && (
                            <span className="badge badge-error">
                                Tu tutor rechazo la solicitud
                            </span>
                        )}

                    </div>
                        <p className="text-sm text-gray-600">
                          Tutor: {solicitud.tutor}
                        </p>
                      </div>

                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {solicitud.atendida ? 'Atendida' : 'Enviada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">{L.historyTitle || 'Historial de Tutorías'}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {L.table?.date || 'Fecha'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {L.table?.type || 'Tipo'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {L.table?.commitments || 'Compromisos'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {L.table?.status || 'Estado'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historial.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">
                      No hay tutorías registradas
                    </td>
                  </tr>
                ) : (
                  historial.map((tutoria, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">{tutoria.fecha}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{tutoria.tipo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{tutoria.compromisos}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge(tutoria.estado)}`}>
                          {getEstadoTexto(tutoria.estado)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardAlumno