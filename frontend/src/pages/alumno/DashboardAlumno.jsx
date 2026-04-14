import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

const DashboardAlumno = ({ user, onLogout }) => {
  const { t } = useLanguage()
  const L = t.dashboardAlumno
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    promedio: 0,
    tutorias_recibidas: 0,
    ultima_tutoria: null,
    proxima_tutoria: null
  })
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Usar el nuevo endpoint específico para alumnos
      const response = await api.getMiExpediente()
      console.log('Expediente del alumno:', response)
      
      if (response.success && response.alumno) {
        const alumnoData = response.alumno
        
        setStats({
          promedio: alumnoData.promedio || 0,
          tutorias_recibidas: response.historial?.length || 0,
          ultima_tutoria: alumnoData.ultima_tutoria_fecha,
          proxima_tutoria: null // Pendiente implementar citas futuras
        })
        
        // Formatear historial
        const historialFormateado = (response.historial || []).map(t => ({
          fecha: formatDate(t.fecha),
          tipo: t.tipo || 'Individual',
          compromisos: t.compromiso || 'Sin compromisos',
          estado: t.estado || 'completada'
        }))
        
        setHistorial(historialFormateado)
      } else {
        throw new Error(response.message || 'Error al cargar datos')
      }
      
    } catch (error) {
      console.error('Error cargando datos del alumno:', error)
      setError('Error al cargar los datos del alumno')
      
      // Datos de ejemplo para desarrollo
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
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateSimple = (dateString) => {
    if (!dateString) return 'Sin fecha'
    const date = new Date(dateString)
    return `${date.getDate()} ${getMonthName(date.getMonth())}`
  }

  const getMonthName = (month) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return months[month]
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
            <span>{error} - Mostrando datos de ejemplo</span>
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