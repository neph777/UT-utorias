import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

const RegistrarTutoria = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const L = t.registrarTutoria
  
  const [alumno, setAlumno] = useState(null)
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(false)

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tema: '',
    compromiso: '',
    observaciones: '',
    promedio: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [alumnoId])

  const cargarDatos = async () => {
    try {
      const gruposRes = await api.getTutorGrupos()
      if (gruposRes.success) {
        for (const grupo of gruposRes.data) {
          const alumnosRes = await api.getAlumnosByGrupo(grupo.id)
          if (alumnosRes.success) {
            const found = alumnosRes.data.alumnos.find(a => a.id === parseInt(alumnoId))
            if (found) {
              setAlumno(found)
              setForm(prev => ({ ...prev, promedio: found.promedio || '' }))
              break
            }
          }
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
      setError('No se pudo cargar la información del alumno')
    } finally {
      setLoading(false)
    }
  }

  const handleGuardar = async () => {
    if (!form.tema || !form.compromiso || !form.observaciones) return
    
    setSaving(true)
    setError('')
    
    try {
      const response = await api.registrarTutoria({
        alumno_id: parseInt(alumnoId),
        fecha: form.fecha,
        tema: form.tema,
        compromiso: form.compromiso,
        observaciones: form.observaciones,
        promedio: form.promedio || null
      })
      
      if (response.success) {
        setGuardado(true)
      } else {
        setError(response.message || 'Error al registrar la tutoría')
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
      rojo: t.semaforo.rojo,
      amarillo: t.semaforo.amarillo,
      verde: t.semaforo.verde
    }
    return textos[semaforo] || semaforo
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'
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
      <div className="p-6 max-w-4xl mx-auto">

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
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Formulario */}
          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">

                {/* Info alumno */}
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold shrink-0">
                    {alumno?.nombre?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-primary-700">{alumno?.nombre}</p>
                    <p className="text-sm text-primary-600">Matrícula: {alumno?.matricula}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-primary-400">Promedio actual</p>
                    <p className="text-xl font-bold text-primary-600">{alumno?.promedio || 'N/A'}</p>
                  </div>
                  <span className={`badge ${getSemaforoBadge(alumno?.semaforo)}`}>
                    {getSemaforoTexto(alumno?.semaforo)}
                  </span>
                </div>

                {guardado ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Tutoría registrada</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      La sesión quedó guardada en el expediente de {alumno?.nombre}
                    </p>
                    <div className="flex gap-3 mt-6 justify-center">
                      <button 
                        onClick={() => {
                          setGuardado(false)
                          setForm({
                            fecha: new Date().toISOString().split('T')[0],
                            tema: '',
                            compromiso: '',
                            observaciones: '',
                            promedio: alumno?.promedio || ''
                          })
                        }} 
                        className="btn btn-outline btn-sm"
                      >
                        Registrar otra
                      </button>
                      <button
                        onClick={() => navigate('/tutor')}
                        className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none"
                      >
                        Volver al dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{L.fields.date}</label>
                        <input
                          type="date"
                          className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                          value={form.fecha}
                          onChange={e => setForm({ ...form, fecha: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.common.loading === 'Cargando...' ? 'Promedio en esta sesión' : 'Average in this session'}</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                          placeholder="Ej: 85.5"
                          value={form.promedio}
                          onChange={e => setForm({ ...form, promedio: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {L.fields.topic} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                        placeholder={L.fields.topicPlaceholder}
                        value={form.tema}
                        onChange={e => setForm({ ...form, tema: e.target.value })}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {L.fields.commitment} <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows="2"
                        className="textarea textarea-bordered w-full focus:border-primary-500 focus:outline-none"
                        placeholder={L.fields.commitmentPlaceholder}
                        value={form.compromiso}
                        onChange={e => setForm({ ...form, compromiso: e.target.value })}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {L.fields.observations} <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows="2"
                        className="textarea textarea-bordered w-full focus:border-primary-500 focus:outline-none"
                        placeholder={L.fields.observationsPlaceholder}
                        value={form.observaciones}
                        onChange={e => setForm({ ...form, observaciones: e.target.value })}
                      />
                    </div>

                    {(!form.tema || !form.compromiso || !form.observaciones) && (
                      <p className="text-xs text-red-400 mt-2">
                        Los campos marcados con * son obligatorios
                      </p>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleGuardar}
                        disabled={!form.tema || !form.compromiso || !form.observaciones || saving}
                        className="btn bg-primary-500 hover:bg-primary-600 text-white border-none flex-1 disabled:opacity-50"
                      >
                        {saving ? L.saving : L.save}
                      </button>
                      <button onClick={() => navigate('/tutor')} className="btn btn-outline flex-1">{t.common.cancel}</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Historial lateral - Por ahora vacío hasta tener el endpoint */}
          <div className="card bg-base-100 shadow-sm border border-base-200 h-fit">
            <div className="card-body p-0">
              <div className="px-4 py-3 border-b border-base-200">
                <h3 className="font-semibold text-gray-800 text-sm">Historial de tutorías</h3>
                <p className="text-xs text-gray-400 mt-0.5">Próximamente</p>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Sin tutorías previas</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default RegistrarTutoria