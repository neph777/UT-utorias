import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'

const GenerarCita = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()
  
  const [alumno, setAlumno] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    asunto: '',
    observaciones: ''
  })
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    cargarAlumno()
  }, [alumnoId])

  const cargarAlumno = async () => {
    try {
      const gruposRes = await api.getTutorGrupos()
      if (gruposRes.success) {
        for (const grupo of gruposRes.data) {
          const alumnosRes = await api.getAlumnosByGrupo(grupo.id)
          if (alumnosRes.success) {
            const found = alumnosRes.data.alumnos.find(a => a.id === parseInt(alumnoId))
            if (found) {
              setAlumno(found)
              break
            }
          }
        }
      }
    } catch (error) {
      console.error('Error cargando alumno:', error)
      setError('No se pudo cargar la información del alumno')
    } finally {
      setLoading(false)
    }
  }

  const handleGuardar = async () => {
    if (!form.asunto) return
    
    setSaving(true)
    setError('')
    
    try {
      const response = await api.generarCita({
        alumno_id: parseInt(alumnoId),
        fecha: form.fecha,
        asunto: form.asunto,
        observaciones: form.observaciones
      })
      
      if (response.success) {
        setEnviado(true)
      } else {
        setError(response.message || 'Error al generar la cita')
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      setError('Error al conectar con el servidor')
    } finally {
      setSaving(false)
    }
  }

  const getSemaforoBadge = (semaforo) => {
    const clases = {
      rojo: 'badge-error',
      amarillo: 'badge-warning',
      verde: 'badge-success'
    }
    return clases[semaforo] || 'badge-ghost'
  }

  const getSemaforoTexto = (semaforo) => {
    const textos = {
      rojo: 'Prioridad Alta',
      amarillo: 'Seguimiento',
      verde: 'Estable'
    }
    return textos[semaforo] || semaforo
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

  if (!alumno && !loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 text-center">
          <div className="alert alert-error max-w-md mx-auto">
            <span>Alumno no encontrado</span>
          </div>
          <button onClick={() => navigate('/tutor')} className="btn btn-primary mt-4">
            Volver al Dashboard
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-2xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/tutor')} className="btn btn-sm btn-outline">
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Generar Cita</h1>
            <p className="text-gray-500 mt-1">Agenda una cita de tutoría con el alumno</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {enviado ? (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body items-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Cita agendada correctamente</h2>
              <p className="text-gray-500 mt-1">
                Se notificará a <span className="font-medium">{alumno?.nombre}</span>
              </p>
              <div className="mt-4 bg-base-200 rounded-lg p-4 text-left w-full max-w-sm space-y-1">
                <p className="text-sm text-gray-600"><span className="font-medium">Alumno:</span> {alumno?.nombre}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Fecha:</span> {form.fecha}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Asunto:</span> {form.asunto}</p>
                {form.observaciones && (
                  <p className="text-sm text-gray-600"><span className="font-medium">Observaciones:</span> {form.observaciones}</p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    setEnviado(false)
                    setForm({
                      fecha: new Date().toISOString().split('T')[0],
                      asunto: '',
                      observaciones: ''
                    })
                  }} 
                  className="btn btn-outline"
                >
                  Nueva cita
                </button>
                <button
                  onClick={() => navigate('/tutor')}
                  className="btn bg-primary-500 hover:bg-primary-600 text-white border-none"
                >
                  Volver al dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">

              {/* Info del alumno */}
              <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {alumno?.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'A'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{alumno?.nombre}</p>
                  <p className="text-sm text-gray-500">Matrícula: {alumno?.matricula}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Promedio</p>
                  <p className="text-2xl font-bold text-primary-500">{alumno?.promedio || 'N/A'}</p>
                </div>
                <span className={`badge ${getSemaforoBadge(alumno?.semaforo)}`}>
                  {getSemaforoTexto(alumno?.semaforo)}
                </span>
              </div>

              {/* Formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                    value={form.fecha}
                    onChange={e => setForm({ ...form, fecha: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto de la cita <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                  placeholder="Ej: Seguimiento académico, revisión de compromisos..."
                  value={form.asunto}
                  onChange={e => setForm({ ...form, asunto: e.target.value })}
                />
                {!form.asunto && (
                  <p className="text-xs text-red-400 mt-1">El asunto es obligatorio</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones adicionales
                </label>
                <textarea
                  rows="3"
                  className="textarea textarea-bordered w-full focus:border-primary-500 focus:outline-none"
                  placeholder="Información relevante para la cita..."
                  value={form.observaciones}
                  onChange={e => setForm({ ...form, observaciones: e.target.value })}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGuardar}
                  disabled={!form.asunto || saving}
                  className="btn bg-primary-500 hover:bg-primary-600 text-white border-none flex-1 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Agendar cita'}
                </button>
                <button onClick={() => navigate('/tutor')} className="btn btn-outline flex-1">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default GenerarCita