import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js'
import { Doughnut, Bar, Radar } from 'react-chartjs-2'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'

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
// CATEGORÍAS
// ============================================
const CATEGORIAS = {
  economico: { label: 'Económico', description: 'Situación económica del alumno' },
  academico: { label: 'Académico', description: 'Rendimiento académico y calificaciones' },
  personal: { label: 'Personal', description: 'Situación personal y emocional' },
  familiar: { label: 'Familiar', description: 'Situación familiar y entorno' }
}

const COLORES = {
  verde: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', badge: 'badge-success' },
  amarillo: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', badge: 'badge-warning' },
  rojo: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', badge: 'badge-error' }
}

const ExpedienteAlumno = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()

  // Refs para las gráficas
  const doughnutRef = useRef(null)
  const radarRef = useRef(null)
  const barRef = useRef(null)

  const [alumno, setAlumno] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generandoInforme, setGenerandoInforme] = useState(false)
  const [generandoExpediente, setGenerandoExpediente] = useState(false)

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

  // ============================================================
  // 1. INFORME INDIVIDUAL DE CADA TUTORÍA (Word - SIN GRÁFICAS)
  // ============================================================
  const generarWordTutoria = async (tutoria) => {
    setGenerandoInforme(true)

    try {
      const nombreAlumno = alumno?.nombre_completo || 'Alumno'
      const matricula = alumno?.matricula || 'N/A'
      const fecha = tutoria.fecha
      const tema = tutoria.tema || 'No especificado'
      const compromiso = tutoria.compromiso || 'Sin compromisos'
      const observaciones = tutoria.observaciones || 'Sin observaciones'
      const promedio = tutoria.promedio_tutoria || tutoria.promedio || 'N/A'

      const contenido = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Registro de Tutoría</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            h1, h2 { color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .firma { margin-top: 40px; display: flex; justify-content: space-around; }
            .firma p { margin-bottom: 40px; }
            .center { text-align: center; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <h1>Universidad Tecnológica de Nayarit</h1>
            <h2>Sistema de Tutorías - Registro de Sesión</h2>
            <p>Fecha: ${fecha}</p>
            <hr/>
          </div>

          <h2>Datos del Alumno</h2>
          <table>
            <tr><td width="120"><strong>Nombre:</strong></td><td>${nombreAlumno}</td></tr>
            <tr><td><strong>Matrícula:</strong></td><td>${matricula}</td></tr>
          </table>

          <h2>Registro de Tutoría</h2>
          <table>
            <tr><td width="120"><strong>Tema tratado:</strong></td><td>${tema}</td></tr>
            <tr><td><strong>Compromisos del alumno:</strong></td><td>${compromiso}</td></tr>
            <tr><td><strong>Observaciones del tutor:</strong></td><td>${observaciones}</td></tr>
            <tr><td><strong>Promedio:</strong></td><td>${promedio}</td></tr>
          </table>

          <div style="margin-top: 40px; display: flex; justify-content: space-around;">
            <div style="text-align: center;">
              <p style="margin-bottom: 40px;">__________________________</p>
              <p><strong>Firma del Tutor</strong></p>
            </div>
            <div style="text-align: center;">
              <p style="margin-bottom: 40px;">__________________________</p>
              <p><strong>Firma del Alumno</strong></p>
            </div>
          </div>
          <div style="text-align: center; font-size: 10px; color: #6b7280; margin-top: 20px;">
            Documento generado automáticamente por el Sistema de Tutorías UTN
          </div>
        </body>
        </html>
      `

      const blob = new Blob([contenido], { type: 'application/msword' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Registro_Tutoria_${nombreAlumno.replace(/\s/g, '_')}_${fecha}.doc`
      link.click()
      URL.revokeObjectURL(link.href)

    } catch (error) {
      console.error('Error al generar Word:', error)
      alert('Error al generar el informe')
    } finally {
      setGenerandoInforme(false)
    }
  }

  // ============================================================
  // 2. EXPEDIENTE COMPLETO (Word CON GRÁFICAS usando Chart.js)
  // ============================================================
  const generarWordExpediente = async () => {
    setGenerandoExpediente(true)

    try {
      // Función para capturar canvas de Chart.js
      const capturarCanvas = (ref) => {
        if (ref && ref.current) {
          const canvas = ref.current.canvas
          if (canvas) {
            return canvas.toDataURL('image/png')
          }
        }
        return null
      }

      // Capturar cada gráfica
      const imgDoughnut = capturarCanvas(doughnutRef)
      const imgRadar = capturarCanvas(radarRef)
      const imgBar = capturarCanvas(barRef)

      const nombre = alumno?.nombre_completo || 'Alumno'
      const matricula = alumno?.matricula || 'N/A'
      const promedio = alumno?.promedio || 'N/A'
      const semaforo = alumno?.semaforo_color || 'verde'

      const rojos = categorias.filter(c => c.color === 'rojo').length
      const amarillos = categorias.filter(c => c.color === 'amarillo').length
      const verdes = categorias.filter(c => c.color === 'verde').length

      let contenido = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Expediente Académico</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #d1d5db; padding: 6px; text-align: left; }
            th { background-color: #f3f4f6; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; color: white; }
            .badge-verde { background-color: #22c55e; }
            .badge-amarillo { background-color: #f59e0b; }
            .badge-rojo { background-color: #ef4444; }
            .graficas-container { display: flex; flex-wrap: wrap; justify-content: space-around; margin: 20px 0; }
            .grafica-item { text-align: center; margin: 10px; }
            .grafica-item img { max-width: 100%; max-height: 200px; }
            .grafica-item p { font-weight: bold; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Universidad Tecnológica de Nayarit</h1>
            <h2>Sistema de Tutorías - Expediente Académico</h2>
            <p>Fecha de generación: ${new Date().toLocaleDateString()}</p>
            <hr/>
          </div>

          <div class="section">
            <h2>Datos del Alumno</h2>
            <table>
              <tr><td width="120"><strong>Nombre:</strong></td><td>${nombre}</td></tr>
              <tr><td><strong>Matrícula:</strong></td><td>${matricula}</td></tr>
              <tr><td><strong>Promedio:</strong></td><td>${promedio}</td></tr>
              <tr><td><strong>Estado General:</strong></td>
                <td><span class="badge badge-${semaforo}">${semaforo.toUpperCase()}</span></td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>Estado por Categorías</h2>
            <table>
              <thead><tr><th>Categoría</th><th>Estado</th><th>Observación</th></tr></thead>
              <tbody>
                ${categorias.map(c => `
                  <tr>
                    <td>${CATEGORIAS[c.categoria]?.label || c.categoria}</td>
                    <td><span class="badge badge-${c.color}">${c.color.toUpperCase()}</span></td>
                    <td>${c.observacion || 'Sin observación'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Estadísticas de Categorías</h2>
            <table>
              <tr>
                <td style="background-color: #fef2f2; padding: 10px; text-align: center;">
                  <strong style="color: #dc2626;">🔴 Prioridad Alta</strong><br/>
                  <span style="font-size: 24px;">${rojos}</span>
                </td>
                <td style="background-color: #fef3c7; padding: 10px; text-align: center;">
                  <strong style="color: #d97706;">🟡 Seguimiento</strong><br/>
                  <span style="font-size: 24px;">${amarillos}</span>
                </td>
                <td style="background-color: #d1fae5; padding: 10px; text-align: center;">
                  <strong style="color: #059669;">🟢 Estable</strong><br/>
                  <span style="font-size: 24px;">${verdes}</span>
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>Gráficas de Desempeño</h2>
            <div class="graficas-container">
              ${imgDoughnut ? `
                <div class="grafica-item">
                  <img src="${imgDoughnut}" alt="Estado por Categorías" />
                  <p>Estado por Categorías</p>
                </div>
              ` : ''}
              ${imgRadar ? `
                <div class="grafica-item">
                  <img src="${imgRadar}" alt="Desempeño del Alumno" />
                  <p>Desempeño del Alumno</p>
                </div>
              ` : ''}
              ${imgBar ? `
                <div class="grafica-item">
                  <img src="${imgBar}" alt="Tutorías por Mes" />
                  <p>Tutorías por Mes</p>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <h2>Historial de Tutorías</h2>
            ${historial.length === 0 ? '<p>No hay tutorías registradas</p>' : `
              <table>
                <thead><tr><th>Fecha</th><th>Tutor</th><th>Tema</th><th>Compromiso</th></tr></thead>
                <tbody>
                  ${historial.map(t => `
                    <tr>
                      <td>${t.fecha}</td>
                      <td>${t.tutor || 'N/A'}</td>
                      <td>${t.tema || 'N/A'}</td>
                      <td>${t.compromiso || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>

          <div style="margin-top:30px; text-align:center; font-size:10px; color:#6b7280;">
            <hr/>
            <p>Documento generado automáticamente por el Sistema de Tutorías UTN</p>
          </div>
        </body>
        </html>
      `

      const blob = new Blob([contenido], { type: 'application/msword' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Expediente_${nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`
      link.click()
      URL.revokeObjectURL(link.href)

    } catch (error) {
      console.error('Error al generar Word expediente:', error)
      alert('Error al generar el expediente Word')
    } finally {
      setGenerandoExpediente(false)
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

        {/* Encabezado con ambos botones */}
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
          <div className="flex gap-2 flex-wrap">
            {/* Botón: Expediente completo con gráficas */}
            <button
              onClick={generarWordExpediente}
              className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none"
              disabled={generandoExpediente}
            >
              {generandoExpediente ? '⏳ Generando...' : 'Expediente Word'}
            </button>
            {!editando && (
              <button onClick={() => setEditando(true)} className="btn btn-sm btn-primary">
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

        {/* ===== GRÁFICAS CON REFS ===== */}
        <div id="graficas-expediente" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Gráfica 1: Categorías (Doughnut) */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Estado por Categorías</h2>
              <p className="text-sm text-gray-500 mb-2">Distribución de áreas evaluadas</p>
              {categorias.length > 0 ? (
                <>
                  <div className="h-56 flex items-center justify-center">
                    <Doughnut ref={doughnutRef} data={categoriasData} options={categoriasOptions} />
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
                <Radar ref={radarRef} data={radarData} options={radarOptions} />
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
                <Bar ref={barRef} data={barData} options={barOptions} />
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
                            <option value="verde"> Verde</option>
                            <option value="amarillo"> Amarillo</option>
                            <option value="rojo"> Rojo</option>
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

        {/* Historial de Tutorías con botón de informe en Word */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-0">
            <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Historial de Tutorías</h2>
              <span className="badge badge-primary">{historial.length} registros</span>
            </div>
            {historial.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No hay tutorías registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Fecha</th>
                      <th>Tutor</th>
                      <th>Tema</th>
                      <th>Compromiso</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((tutoria) => (
                      <tr key={tutoria.id} className="hover">
                        <td className="font-mono text-sm">{formatDate(tutoria.fecha)}</td>
                        <td className="text-sm">{tutoria.tutor}</td>
                        <td className="text-sm">{tutoria.tema}</td>
                        <td className="text-sm text-gray-600">{tutoria.compromiso}</td>
                        <td>
                          <button
                            onClick={() => generarWordTutoria(tutoria)}
                            className="btn btn-xs btn-outline btn-info"
                            disabled={generandoInforme}
                          >
                            {generandoInforme ? '⏳' : 'Informe'}
                          </button>
                        </td>
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