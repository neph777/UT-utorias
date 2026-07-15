import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js'
import { Doughnut, Bar, Radar } from 'react-chartjs-2'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
)

// ============================================
// CATEGORÍAS ACTUALIZADAS
// ============================================
const CATEGORIAS = {
  economico: { label: 'Económico', icon: '💰', description: 'Situación económica del alumno' },
  academico: { label: 'Académico', icon: '📚', description: 'Rendimiento académico y calificaciones' },
  personal: { label: 'Personal', icon: '🧠', description: 'Situación personal y emocional' },
  familiar: { label: 'Familiar', icon: '👨‍👩‍👧‍👦', description: 'Situación familiar y entorno' }
}

const COLORES = {
  verde: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', badge: 'badge-success' },
  amarillo: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', badge: 'badge-warning' },
  rojo: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', badge: 'badge-error' }
}

const ExpedienteAlumno = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()

  const [alumno, setAlumno] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generandoPDF, setGenerandoPDF] = useState(false)

  useEffect(() => {
    cargarExpediente()
  }, [alumnoId])

  const cargarExpediente = async () => {
    setLoading(true)
    setError('')

    try {
      console.log('Cargando expediente del alumno (tutor):', alumnoId)
      const response = await api.getTutorExpediente(alumnoId)
      console.log('Expediente recibido:', response)

      if (response.success && response.data) {
        setAlumno(response.data.alumno)
        setCategorias(response.data.categorias || [])
        setHistorial(response.data.historial || [])
      } else {
        setError(response.message || 'Error al cargar el expediente')
      }
    } catch (error) {
      console.error('Error al cargar expediente:', error)
      setError('Error al cargar el expediente del alumno')
    } finally {
      setLoading(false)
    }
  }

  const handleGuardarCategorias = async () => {
    setSaving(true)
    try {
      const data = {
        categorias: categorias.map(c => ({
          id: c.id,
          color: c.color,
          observacion: c.observacion
        }))
      }

      const response = await api.actualizarCategoriasTutor(alumnoId, data)

      if (response.success) {
        setEditando(false)
        await cargarExpediente()
        alert('Categorías actualizadas correctamente')
      }
    } catch (error) {
      console.error('Error guardando:', error)
      alert('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  const generarReportePDF = async () => {
    setGenerandoPDF(true)

    try {
      const contenido = document.createElement('div')
      contenido.style.padding = '20px'
      contenido.style.fontFamily = 'Arial, sans-serif'
      contenido.style.backgroundColor = '#ffffff'
      contenido.style.width = '700px'
      contenido.style.position = 'fixed'
      contenido.style.left = '-9999px'
      contenido.style.top = '0'

      const nombre = alumno?.nombre_completo || 'Alumno'
      const matricula = alumno?.matricula || 'N/A'
      const promedio = alumno?.promedio || 'N/A'
      const semaforo = alumno?.semaforo_color || 'verde'

      const categoriasData = categorias
      const rojos = categoriasData.filter(c => c.color === 'rojo').length
      const amarillos = categoriasData.filter(c => c.color === 'amarillo').length
      const verdes = categoriasData.filter(c => c.color === 'verde').length

      contenido.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #1e40af; margin: 0;">Universidad Tecnológica de Nayarit</h2>
          <h3 style="margin: 5px 0;">Sistema de Tutorías - Expediente Académico</h3>
          <p style="color: #6b7280; margin: 5px 0;">Fecha: ${new Date().toLocaleDateString()}</p>
          <hr/>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af;">Datos del Alumno</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px; width: 120px;"><strong>Nombre:</strong></td><td style="padding: 5px;">${nombre}</td></tr>
            <tr><td style="padding: 5px;"><strong>Matrícula:</strong></td><td style="padding: 5px;">${matricula}</td></tr>
            <tr><td style="padding: 5px;"><strong>Promedio:</strong></td><td style="padding: 5px;">${promedio}</td></tr>
            <tr><td style="padding: 5px;"><strong>Estado General:</strong></td>
              <td style="padding: 5px;">
                <span style="background-color: ${semaforo === 'rojo' ? '#ef4444' : semaforo === 'amarillo' ? '#f59e0b' : '#22c55e'}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px;">
                  ${semaforo.toUpperCase()}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af;">Resumen de Categorías</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Categoría</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Estado</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Observación</th>
              </tr>
            </thead>
            <tbody>
              ${categoriasData.map(c => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${CATEGORIAS[c.categoria]?.label || c.categoria}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">
                    <span style="background-color: ${c.color === 'rojo' ? '#ef4444' : c.color === 'amarillo' ? '#f59e0b' : '#22c55e'}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px;">
                      ${c.color.toUpperCase()}
                    </span>
                  </td>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${c.observacion || 'Sin observación'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af;">Estadísticas</h3>
          <div style="display: flex; gap: 20px; justify-content: center;">
            <div style="text-align: center; padding: 10px; background-color: #fef2f2; border-radius: 8px; flex: 1;">
              <p style="font-size: 24px; font-weight: bold; color: #dc2626; margin: 0;">${rojos}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">Prioridad Alta</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #fef3c7; border-radius: 8px; flex: 1;">
              <p style="font-size: 24px; font-weight: bold; color: #d97706; margin: 0;">${amarillos}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">Seguimiento</p>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #d1fae5; border-radius: 8px; flex: 1;">
              <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">${verdes}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">Estable</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
          <hr/>
          <p>Documento generado automáticamente por el Sistema de Tutorías UTN</p>
        </div>
      `

      document.body.appendChild(contenido)

      const canvas = await html2canvas(contenido, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'letter',
        orientation: 'portrait'
      })

      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      pdf.save(`Expediente_${nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)

      document.body.removeChild(contenido)

    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Error al generar el PDF')
    } finally {
      setGenerandoPDF(false)
    }
  }

  const cambiarColorCategoria = (id, nuevoColor) => {
    setCategorias(categorias.map(c =>
      c.id === id ? { ...c, color: nuevoColor } : c
    ))
  }

  const cambiarObservacion = (id, nuevaObs) => {
    setCategorias(categorias.map(c =>
      c.id === id ? { ...c, observacion: nuevaObs } : c
    ))
  }

  const getSemaforoInfo = (semaforo) => {
    const estilos = {
      rojo: { badge: 'badge-error', texto: 'Prioridad alta', color: 'text-red-600' },
      amarillo: { badge: 'badge-warning', texto: 'Seguimiento preventivo', color: 'text-yellow-600' },
      verde: { badge: 'badge-success', texto: 'Estable', color: 'text-green-600' }
    }
    return estilos[semaforo] || { badge: 'badge-ghost', texto: 'Sin estado', color: 'text-gray-600' }
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

  // ========== DATOS PARA GRÁFICAS ==========

  // 1. Gráfica de categorías (Doughnut) - Orden: Económico, Académico, Personal, Familiar
  const categoriasData = {
    labels: categorias.map(c => CATEGORIAS[c.categoria]?.label || c.categoria),
    datasets: [{
      data: categorias.map(c => c.color === 'rojo' ? 3 : c.color === 'amarillo' ? 2 : 1),
      backgroundColor: categorias.map(c => c.color === 'rojo' ? '#ef4444' : c.color === 'amarillo' ? '#f59e0b' : '#22c55e'),
      borderWidth: 0
    }]
  }

  const categoriasOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11 }
        }
      }
    },
    cutout: '60%'
  }

  // 2. Gráfica de radar - Desempeño del alumno (4 categorías + Promedio + Tutorías)
  const radarData = {
    labels: ['Económico', 'Académico', 'Personal', 'Familiar', 'Promedio', 'Tutorías'],
    datasets: [{
      label: 'Desempeño del Alumno',
      data: [
        categorias.find(c => c.categoria === 'economico')?.color === 'rojo' ? 30 :
          categorias.find(c => c.categoria === 'economico')?.color === 'amarillo' ? 60 : 90,
        categorias.find(c => c.categoria === 'academico')?.color === 'rojo' ? 30 :
          categorias.find(c => c.categoria === 'academico')?.color === 'amarillo' ? 60 : 90,
        categorias.find(c => c.categoria === 'personal')?.color === 'rojo' ? 30 :
          categorias.find(c => c.categoria === 'personal')?.color === 'amarillo' ? 60 : 90,
        categorias.find(c => c.categoria === 'familiar')?.color === 'rojo' ? 30 :
          categorias.find(c => c.categoria === 'familiar')?.color === 'amarillo' ? 60 : 90,
        parseFloat(alumno?.promedio || 0),
        Math.min(historial.length * 10, 100)
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6',
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3b82f6'
    }]
  }

  const radarOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  }

  // 3. Gráfica de barras - Historial de tutorías por mes
  const tutoriasPorMes = historial.reduce((acc, t) => {
    const mes = new Date(t.fecha).getMonth()
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const key = meses[mes]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const barData = {
    labels: Object.keys(tutoriasPorMes).length > 0 ? Object.keys(tutoriasPorMes) : ['Sin datos'],
    datasets: [{
      label: 'Tutorías por Mes',
      data: Object.values(tutoriasPorMes).length > 0 ? Object.values(tutoriasPorMes) : [0],
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      borderSkipped: false
    }]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
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
          <button onClick={() => navigate(-1)} className="btn btn-primary mt-4">
            Volver
          </button>
        </div>
      </Layout>
    )
  }

  const semaforoInfo = getSemaforoInfo(alumno.semaforo_color)

  return (
    <Layout user={user} onLogout={onLogout}>
      <div id="reporte-expediente" className="p-6 max-w-7xl mx-auto bg-white">

        {/* Encabezado */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline">
              ← Volver
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Expediente del Alumno</h1>
              <p className="text-gray-500 mt-1">{alumno.nombre_completo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={generarReportePDF} className="btn btn-sm bg-red-600 text-white" disabled={generandoPDF}>
              {generandoPDF ? '⏳ Generando...' : '📄 PDF'}
            </button>
            {!editando && (
              <button onClick={() => setEditando(true)} className="btn btn-sm btn-primary">
                ✏️ Editar
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
                {getInitials(alumno.nombre_completo)}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Nombre</p>
                  <p className="font-semibold">{alumno.nombre_completo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Matrícula</p>
                  <p className="font-semibold font-mono">{alumno.matricula}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Promedio</p>
                  <p className="font-semibold text-primary-500">{alumno.promedio || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estado General</p>
                  <span className={`badge ${semaforoInfo.badge}`}>
                    {semaforoInfo.texto}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="stats shadow bg-base-200 border-l-4 border-primary-500">
                <div className="stat py-4">
                  <div className="stat-title">Promedio actual</div>
                  <div className="stat-value text-primary-500 text-3xl">{alumno.promedio || 'N/A'}</div>
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
          </div>
        </div>

        {/* ===== GRÁFICAS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Gráfica 1: Categorías (Doughnut) */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Estado por Categorías</h2>
              <p className="text-sm text-gray-500 mb-2">Distribución de áreas evaluadas</p>
              {categorias.length > 0 ? (
                <>
                  <div className="h-56 flex items-center justify-center">
                    <Doughnut data={categoriasData} options={categoriasOptions} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categorias.map(c => {
                      const info = CATEGORIAS[c.categoria] || { label: c.categoria, icon: '📌' }
                      const colores = COLORES[c.color] || COLORES.verde
                      return (
                        <div key={c.id} className={`flex items-center gap-2 p-2 rounded-lg ${colores.bg}`}>
                          <span>{info.icon}</span>
                          <span className="text-sm font-medium">{info.label}</span>
                          <span className={`badge badge-sm ml-auto ${colores.badge}`}>
                            {c.color.toUpperCase()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-center py-8">No hay categorías registradas</p>
              )}
            </div>
          </div>

          {/* Gráfica 2: Radar - Desempeño */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Desempeño del Alumno</h2>
              <p className="text-sm text-gray-500 mb-2">Evaluación integral del alumno</p>
              <div className="h-56 flex items-center justify-center">
                <Radar data={radarData} options={radarOptions} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Promedio</p>
                  <p className="text-lg font-bold text-blue-500">{alumno.promedio || 'N/A'}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600">Tutorías</p>
                  <p className="text-lg font-bold text-green-500">{historial.length}</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600">Estado</p>
                  <p className="text-lg font-bold text-purple-500">{semaforoInfo.texto}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfica 3: Barras - Tutorías por Mes */}
          <div className="card bg-base-100 shadow-sm border border-base-200 md:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-lg">Tutorías por Mes</h2>
              <p className="text-sm text-gray-500 mb-2">Historial de tutorías mensuales</p>
              <div className="h-48">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>

        </div>

        {/* Categorías del Semáforo (Editable) */}
        <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg">Estado por Categorías (Editable)</h2>
            <p className="text-sm text-gray-500 mb-4">
              {editando ? 'Edita los colores y observaciones de cada categoría' : 'Estado actual del alumno por categoría'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorias.map(cat => {
                const info = CATEGORIAS[cat.categoria] || { label: cat.categoria, icon: '📌' }
                const colores = COLORES[cat.color] || COLORES.verde

                return (
                  <div key={cat.id} className={`p-4 rounded-lg border-l-4 ${colores.border} bg-gray-50`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <p className="font-semibold">{info.label}</p>
                          <p className="text-xs text-gray-400">{info.description}</p>
                        </div>
                      </div>

                      {editando ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={cat.color}
                            onChange={(e) => cambiarColorCategoria(cat.id, e.target.value)}
                            className="select select-bordered select-sm"
                          >
                            <option value="verde">🟢 Verde</option>
                            <option value="amarillo">🟡 Amarillo</option>
                            <option value="rojo">🔴 Rojo</option>
                          </select>
                        </div>
                      ) : (
                        <span className={`badge ${colores.badge}`}>
                          {cat.color.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {editando ? (
                      <textarea
                        className="textarea textarea-bordered w-full mt-2 text-sm"
                        rows="2"
                        placeholder="Observaciones..."
                        value={cat.observacion || ''}
                        onChange={(e) => cambiarObservacion(cat.id, e.target.value)}
                      />
                    ) : (
                      cat.observacion && (
                        <p className="text-sm text-gray-600 mt-2">{cat.observacion}</p>
                      )
                    )}
                  </div>
                )
              })}
            </div>

            {editando && (
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={handleGuardarCategorias} className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button onClick={() => {
                  setEditando(false)
                  cargarExpediente()
                }} className="btn btn-outline">
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Historial de Tutorías */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-0">
            <div className="px-6 py-4 border-b border-base-200">
              <h2 className="font-semibold text-gray-800">Historial de Tutorías</h2>
            </div>
            {historial.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Sin tutorías registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tutor</th>
                      <th>Tema</th>
                      <th>Compromiso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map(t => (
                      <tr key={t.id}>
                        <td className="font-mono text-sm">{formatDate(t.fecha)}</td>
                        <td>{t.tutor}</td>
                        <td>{t.tema}</td>
                        <td className="text-sm text-gray-600">{t.compromiso}</td>
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