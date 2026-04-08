import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const ExpedienteAlumno = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()
  
  const [alumno, setAlumno] = useState(null)
  const [historial, setHistorial] = useState([])
  const [grupo, setGrupo] = useState(null)
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generandoPDF, setGenerandoPDF] = useState(false)
  const [formData, setFormData] = useState({
    promedio: '',
    semaforo_color: '',
    semaforo_razon: '',
    observaciones: ''
  })

  useEffect(() => {
    cargarExpediente()
  }, [alumnoId])

  const cargarExpediente = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Cargando expediente del alumno:', alumnoId)
      const expediente = await api.getExpedienteAlumno(alumnoId)
      console.log('Expediente recibido:', expediente)
      
      if (expediente.alumno) {
        setAlumno(expediente.alumno)
        setHistorial(expediente.historial || [])
        setGrupo(expediente.alumno.grupos?.[0] || null)
        setTutor(expediente.alumno.tutor || null)
        setFormData({
          promedio: expediente.alumno.promedio_general || expediente.alumno.promedio || '',
          semaforo_color: expediente.alumno.semaforo_color || expediente.alumno.semaforo || 'verde',
          semaforo_razon: expediente.alumno.semaforo_razon || '',
          observaciones: expediente.alumno.semaforo_observacion || ''
        })
      } else {
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

  const handleEdit = () => {
    setEditando(true)
  }

  const handleCancelEdit = () => {
    setEditando(false)
    setFormData({
      promedio: alumno?.promedio_general || alumno?.promedio || '',
      semaforo_color: alumno?.semaforo_color || alumno?.semaforo || 'verde',
      semaforo_razon: alumno?.semaforo_razon || '',
      observaciones: alumno?.semaforo_observacion || ''
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.actualizarExpediente(alumnoId, formData)
      setEditando(false)
      await cargarExpediente()
      alert('Expediente actualizado correctamente')
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

const generarReportePDF = () => {
  setGenerandoPDF(true)
  
  try {
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'letter',
      orientation: 'portrait'
    })
    
    const nombre = nombreAlumno
    const matricula = matriculaAlumno
    const grupoNom = grupoNombre
    const tutorNom = tutorNombre
    const promedio = alumno?.promedio_general || alumno?.promedio || 'N/A'
    const estado = semaforoInfo.texto
    const razon = alumno?.semaforo_razon || ''
    const historialData = historial
    
    // Configurar fuente
    pdf.setFont('helvetica')
    
    // Título principal
    pdf.setFontSize(18)
    pdf.setTextColor(30, 64, 175) // azul
    pdf.text('Universidad Tecnológica de Nayarit', 105, 20, { align: 'center' })
    
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Sistema de Tutorías - Expediente Académico', 105, 30, { align: 'center' })
    
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' })
    
    pdf.line(20, 42, 190, 42)
    
    // Sección: Datos del Alumno
    pdf.setFontSize(14)
    pdf.setTextColor(30, 64, 175)
    pdf.text('Datos del Alumno', 20, 55)
    
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    
    let y = 65
    const lineHeight = 8
    
    pdf.text(`Nombre: ${nombre}`, 20, y)
    y += lineHeight
    pdf.text(`Matrícula: ${matricula}`, 20, y)
    y += lineHeight
    pdf.text(`Grupo: ${grupoNom}`, 20, y)
    y += lineHeight
    pdf.text(`Tutor: ${tutorNom}`, 20, y)
    y += lineHeight
    pdf.text(`Promedio: ${promedio}`, 20, y)
    y += lineHeight
    pdf.text(`Estado Académico: ${estado}`, 20, y)
    y += lineHeight
    
    if (razon) {
      const razonLines = pdf.splitTextToSize(`Razón: ${razon}`, 160)
      pdf.text(razonLines, 20, y)
      y += (razonLines.length * lineHeight)
    }
    
    y += 5
    pdf.line(20, y, 190, y)
    y += 8
    
    // Sección: Historial de Tutorías
    pdf.setFontSize(14)
    pdf.setTextColor(30, 64, 175)
    pdf.text('Historial de Tutorías', 20, y)
    y += 8
    
    if (historialData.length === 0) {
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text('No hay tutorías registradas', 105, y + 5, { align: 'center' })
    } else {
      // Encabezados de tabla
      pdf.setFillColor(229, 231, 235)
      pdf.rect(20, y, 170, 8, 'F')
      
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Fecha', 22, y + 5)
      pdf.text('Tutor', 52, y + 5)
      pdf.text('Tema', 92, y + 5)
      pdf.text('Compromiso', 132, y + 5)
      
      y += 8
      
      // Filas de la tabla
      pdf.setFontSize(8)
      for (const t of historialData) {
        if (y > 260) {
          pdf.addPage()
          y = 20
        }
        
        const fecha = formatDate(t.fecha)
        const tutorText = t.tutor || 'N/A'
        const tema = t.tema || 'N/A'
        const compromiso = t.compromiso || 'N/A'
        
        pdf.text(fecha, 22, y + 4)
        pdf.text(tutorText.length > 15 ? tutorText.substring(0, 12) + '...' : tutorText, 52, y + 4)
        pdf.text(tema.length > 15 ? tema.substring(0, 12) + '...' : tema, 92, y + 4)
        pdf.text(compromiso.length > 15 ? compromiso.substring(0, 12) + '...' : compromiso, 132, y + 4)
        
        y += 6
      }
    }
    
    // Pie de página
    y += 10
    pdf.line(20, y, 190, y)
    y += 5
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Este documento fue generado automáticamente por el Sistema de Tutorías UTN', 105, y + 3, { align: 'center' })
    pdf.text('Universidad Tecnológica de Nayarit - Sistema Integral de Tutorías', 105, y + 8, { align: 'center' })
    
    // Guardar PDF
    pdf.save(`Expediente_${nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
    
  } catch (error) {
    console.error('Error al generar PDF:', error)
    alert('Error al generar el PDF: ' + error.message)
  } finally {
    setGenerandoPDF(false)
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
            <span>{error || 'Alumno no encontrado'}</span>
          </div>
          <button onClick={() => navigate('/admin/usuarios')} className="btn btn-primary mt-4">
            Volver a Usuarios
          </button>
        </div>
      </Layout>
    )
  }

  const semaforoInfo = getSemaforoInfo(formData.semaforo_color || alumno?.semaforo_color)
  const nombreAlumno = alumno.nombre_completo || alumno.nombre || 'Alumno'
  const matriculaAlumno = alumno.matricula || 'No disponible'
  const grupoNombre = grupo?.clave || grupo?.nombre || 'Sin grupo'
  const tutorNombre = tutor?.nombre_completo || tutor?.nombre || 'Sin tutor'

  return (
    <Layout user={user} onLogout={onLogout}>
      <div id="reporte-expediente" className="p-6 max-w-7xl mx-auto bg-white">
        
        {/* Encabezado del reporte - visible solo en PDF */}
        <div className="text-center mb-6 hidden-pdf">
          <img src="/imagenes/logoutnay.png" alt="UTN" className="h-16 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Universidad Tecnológica de Nayarit</h2>
          <h3 className="text-lg">Sistema de Tutorías - Expediente Académico</h3>
          <p className="text-sm text-gray-500">Fecha de generación: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline">
              ← Volver
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Expediente del Alumno</h1>
              <p className="text-gray-500 mt-1">Detalle académico y tutorías registradas</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={generarReportePDF} 
              className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none"
              disabled={generandoPDF}
            >
              {generandoPDF ? ' Generando PDF...' : ' Descargar PDF'}
          </button>
            {!editando && user?.rol === 'admin' && (
              <button onClick={handleEdit} className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none">
                 Editar
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

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

            {/* Formulario de edición o vista */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="stats shadow bg-base-200 border-l-4 border-primary-500">
                <div className="stat py-4">
                  <div className="stat-title">Promedio actual</div>
                  {editando ? (
                    <input 
                      type="number" 
                      step="0.01"
                      className="input input-bordered w-full mt-2"
                      value={formData.promedio}
                      onChange={(e) => setFormData({...formData, promedio: e.target.value})}
                    />
                  ) : (
                    <div className="stat-value text-primary-500 text-3xl">{alumno.promedio_general || alumno.promedio || 'N/A'}</div>
                  )}
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

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">Estado académico:</p>
                {editando ? (
                  <select 
                    className="select select-bordered select-sm"
                    value={formData.semaforo_color}
                    onChange={(e) => setFormData({...formData, semaforo_color: e.target.value})}
                  >
                    <option value="verde"> Estable</option>
                    <option value="amarillo"> Seguimiento preventivo</option>
                    <option value="rojo"> Prioridad alta</option>
                  </select>
                ) : (
                  <span className={`badge ${semaforoInfo.badge}`}>{semaforoInfo.texto}</span>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Razón del estado:</p>
                {editando ? (
                  <textarea 
                    className="textarea textarea-bordered w-full text-sm"
                    rows={2}
                    value={formData.semaforo_razon}
                    onChange={(e) => setFormData({...formData, semaforo_razon: e.target.value})}
                    placeholder="Razón del estado actual..."
                  />
                ) : (
                  <p className="text-sm text-gray-600">{alumno.semaforo_razon || 'Sin razón registrada'}</p>
                )}
              </div>
            </div>

            {editando && (
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={handleSave} className="btn btn-sm btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button onClick={handleCancelEdit} className="btn btn-sm btn-outline">Cancelar</button>
              </div>
            )}
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
                <p className="text-gray-400">No hay tutorías registradas</p>
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
                        <td className="text-sm">{tutoria.tema || 'No especificado'}</td>
                        <td className="text-sm">{tutoria.compromiso || 'Sin compromisos'}</td>
                        <td className="text-sm">{tutoria.observaciones || 'Sin observaciones'}</td>
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