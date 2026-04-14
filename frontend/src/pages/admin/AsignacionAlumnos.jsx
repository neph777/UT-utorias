import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'

const AsignacionAlumnos = ({ user, onLogout }) => {
  const { grupoId } = useParams()
  const navigate = useNavigate()
  
  const [grupo, setGrupo] = useState(null)
  const [asignados, setAsignados] = useState([])
  const [disponibles, setDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [grupoId])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const gruposData = await api.getGrupos()
      const grupoActual = gruposData.find(g => g.id === parseInt(grupoId))
      
      if (!grupoActual) {
        setError('Grupo no encontrado')
        setLoading(false)
        return
      }
      
      setGrupo(grupoActual)
      
      const alumnosDisponibles = await api.getAlumnosDisponibles()
      
      const alumnosAsignados = grupoActual.alumnos || []
      
      setAsignados(alumnosAsignados)
      setDisponibles(alumnosDisponibles.filter(
        alumno => !alumnosAsignados.some(a => a.id === alumno.id)
      ))
      
    } catch (error) {
      console.error('Error cargando datos:', error)
      setError('Error al cargar los datos. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const asignar = async (alumno) => {
    setSaving(true)
    try {
      const nuevosAlumnos = [...asignados, alumno]
      await api.asignarAlumnos(grupoId, nuevosAlumnos.map(a => a.id))
      
      setAsignados(nuevosAlumnos)
      setDisponibles(disponibles.filter(a => a.id !== alumno.id))
      
      console.log('Alumno asignado correctamente')
      
    } catch (error) {
      console.error('Error al asignar:', error)
      alert('Error al asignar el alumno. Por favor, intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const quitar = async (alumno) => {
    setSaving(true)
    try {
      const nuevosAlumnos = asignados.filter(a => a.id !== alumno.id)
      await api.asignarAlumnos(grupoId, nuevosAlumnos.map(a => a.id))
      
      setAsignados(nuevosAlumnos)
      setDisponibles([...disponibles, alumno])
      
      console.log('Alumno removido correctamente')
      
    } catch (error) {
      console.error('Error al quitar:', error)
      alert('Error al quitar el alumno. Por favor, intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const semaforoBadge = (semaforo) => {
    const clases = { 
      'rojo': 'badge-error', 
      'amarillo': 'badge-warning', 
      'verde': 'badge-success' 
    }
    return <span className={`badge badge-sm ${clases[semaforo] || 'badge-ghost'}`}>{semaforo}</span>
  }

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-gray-500">Cargando datos...</p>
        </div>
      </Layout>
    )
  }

  if (error || !grupo) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 text-center">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Grupo no encontrado'}</span>
          </div>
          <button onClick={() => navigate('/admin/grupos')} className="btn btn-primary mt-4">
            Volver a Grupos
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/admin/grupos')} 
            className="btn btn-sm btn-outline"
            disabled={saving}
          >
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Asignación de Alumnos</h1>
            <p className="text-gray-500 mt-1">
              Grupo: <span className="font-semibold text-primary-500">{grupo.nombre}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {grupo.grado && `Grado: ${grupo.grado} | `}
              {grupo.cuatrimestre && `Cuatrimestre: ${grupo.cuatrimestre}`}
            </p>
          </div>
        </div>

        {saving && (
          <div className="alert alert-info mb-4">
            <span className="loading loading-spinner loading-sm"></span>
            <span>Guardando cambios...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Alumnos asignados */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-0">
              <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">Alumnos Asignados</h2>
                <span className="badge badge-primary">{asignados.length}</span>
              </div>
              {asignados.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No hay alumnos asignados a este grupo
                </p>
              ) : (
                <div className="divide-y divide-base-200 max-h-[600px] overflow-y-auto">
                  {asignados.map(alumno => (
                    <div key={alumno.id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">
                          {alumno.nombre_completo || alumno.nombre}
                        </p>
                        <p className="text-xs text-gray-400">
                          Matrícula: {alumno.matricula || alumno.email}
                        </p>
                        {alumno.carrera && (
                          <p className="text-xs text-gray-400">
                            Carrera: {alumno.carrera}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {alumno.semaforo && semaforoBadge(alumno.semaforo)}
                        <button
                          onClick={() => quitar(alumno)}
                          className="btn btn-xs btn-outline btn-error"
                          disabled={saving}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alumnos disponibles */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-0">
              <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">Alumnos Disponibles</h2>
                <span className="badge badge-ghost">{disponibles.length}</span>
              </div>
              {disponibles.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No hay alumnos disponibles para asignar
                </p>
              ) : (
                <div className="divide-y divide-base-200 max-h-[600px] overflow-y-auto">
                  {disponibles.map(alumno => (
                    <div key={alumno.id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">
                          {alumno.nombre_completo || alumno.nombre}
                        </p>
                        <p className="text-xs text-gray-400">
                          Matrícula: {alumno.matricula || alumno.email}
                        </p>
                        {alumno.carrera && (
                          <p className="text-xs text-gray-400">
                            Carrera: {alumno.carrera}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {alumno.semaforo && semaforoBadge(alumno.semaforo)}
                        <button
                          onClick={() => asignar(alumno)}
                          className="btn btn-xs btn-outline btn-primary"
                          disabled={saving}
                        >
                          Asignar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Botón para guardar cambios masivos (opcional) */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => navigate('/admin/grupos')}
            className="btn btn-ghost"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={cargarDatos}
            className="btn btn-outline"
            disabled={saving}
          >
            Refrescar
          </button>
        </div>

      </div>
    </Layout>
  )
}

export default AsignacionAlumnos