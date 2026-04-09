import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'

const ORDEN = { rojo: 0, amarillo: 1, verde: 2 }

const SemaforoGeneral = ({ user, onLogout }) => {
  const navigate = useNavigate()
  
  const [alumnos, setAlumnos] = useState([])
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroGrupo, setFiltroGrupo] = useState('todos')
  const [filtroSemaforo, setFiltroSemaforo] = useState('todos')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Cargando datos para semáforo...')
      
      // Cargar grupos
      const gruposData = await api.getGrupos()
      console.log('Grupos recibidos:', gruposData)
      const gruposArray = Array.isArray(gruposData) ? gruposData : 
                          (gruposData.data ? gruposData.data : [])
      setGrupos(gruposArray)
      
      // Cargar usuarios y filtrar solo alumnos
      const usuariosData = await api.getUsuarios()
      console.log('Usuarios recibidos:', usuariosData)
      
      let usuariosArray = []
      if (Array.isArray(usuariosData)) {
        usuariosArray = usuariosData
      } else if (usuariosData.data && Array.isArray(usuariosData.data)) {
        usuariosArray = usuariosData.data
      }
      
      // Filtrar solo alumnos
      const alumnosData = usuariosArray.filter(u => u.rol === 'alumno')
      console.log('Alumnos encontrados:', alumnosData.length)
      
      setAlumnos(alumnosData)
      
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setError('Error al cargar los datos del semáforo')
    } finally {
      setLoading(false)
    }
  }

  const getGrupoNombre = (grupoId) => {
    if (!grupoId) return 'Sin grupo'
    const grupo = grupos.find(g => g.id === grupoId)
    return grupo ? (grupo.clave || grupo.nombre) : 'Sin grupo'
  }

  const getAlumnosFiltrados = () => {
    let filtrados = [...alumnos]
    
    // Filtrar por grupo
    if (filtroGrupo !== 'todos') {
      filtrados = filtrados.filter(a => a.grupo_id === parseInt(filtroGrupo))
    }
    
    // Filtrar por semáforo
    if (filtroSemaforo !== 'todos') {
      filtrados = filtrados.filter(a => a.semaforo === filtroSemaforo)
    }
    
    // Ordenar por semáforo (rojo > amarillo > verde)
    filtrados.sort((a, b) => ORDEN[a.semaforo] - ORDEN[b.semaforo])
    
    return filtrados
  }

  const semaforoEstilo = {
    rojo:     { badge: 'badge-error',   fila: 'border-l-4 border-red-400',    texto: 'Prioridad alta' },
    amarillo: { badge: 'badge-warning', fila: 'border-l-4 border-yellow-400', texto: 'Seguimiento' },
    verde:    { badge: 'badge-success', fila: 'border-l-4 border-green-400',  texto: 'Estable' },
  }

  const conteo = (color) => {
    return alumnos.filter(a => a.semaforo === color).length
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No registrada'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const alumnosFiltrados = getAlumnosFiltrados()

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-gray-500">Cargando semáforo general...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Semáforo General</h1>
          <p className="text-gray-500 mt-1">
            Alumnos ordenados por nivel de atención requerida
            <span className="ml-2 text-xs text-gray-400">
              (Total: {alumnos.length} alumnos)
            </span>
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={cargarDatos} className="btn btn-sm btn-ghost">Reintentar</button>
          </div>
        )}

        {/* Resumen rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { color: 'rojo',     label: 'Prioridad alta',  badge: 'border-red-500',    text: 'text-red-500' },
            { color: 'amarillo', label: 'Seguimiento',     badge: 'border-yellow-500', text: 'text-yellow-500' },
            { color: 'verde',    label: 'Estable',         badge: 'border-green-500',  text: 'text-green-500' },
          ].map(item => (
            <button
              key={item.color}
              onClick={() => setFiltroSemaforo(filtroSemaforo === item.color ? 'todos' : item.color)}
              className={`stats shadow bg-base-100 border-l-4 ${item.badge} cursor-pointer hover:shadow-md transition-all w-full ${
                filtroSemaforo === item.color ? 'ring-2 ring-offset-2 ring-' + item.color.replace('border-', '') : ''
              }`}
            >
              <div className="stat py-3">
                <div className="stat-title text-sm">{item.label}</div>
                <div className={`stat-value text-2xl ${item.text}`}>{conteo(item.color)}</div>
                <div className="stat-desc text-xs">
                  {alumnos.length > 0 ? Math.round((conteo(item.color) / alumnos.length) * 100) : 0}% del total
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Grupo:</label>
            <select
              className="select select-bordered select-sm focus:border-primary-500 focus:outline-none"
              value={filtroGrupo}
              onChange={e => setFiltroGrupo(e.target.value)}
            >
              <option value="todos">Todos los grupos</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>
                  {g.clave || g.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Estado:</label>
            <select
              className="select select-bordered select-sm focus:border-primary-500 focus:outline-none"
              value={filtroSemaforo}
              onChange={e => setFiltroSemaforo(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="rojo"> Prioridad alta</option>
              <option value="amarillo"> Seguimiento</option>
              <option value="verde"> Estable</option>
            </select>
          </div>
          
          {(filtroGrupo !== 'todos' || filtroSemaforo !== 'todos') && (
            <button
              onClick={() => { setFiltroGrupo('todos'); setFiltroSemaforo('todos') }}
              className="btn btn-sm btn-ghost"
            >
              Limpiar filtros
            </button>
          )}
          
        </div>

        {/* Lista de alumnos */}
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-base-200">
                <tr>
                  <th>Alumno</th>
                  <th>Matrícula / Correo</th>
                  <th>Grupo</th>
                  <th>Promedio</th>
                  <th>Estado</th>
                  <th>Última tutoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No hay alumnos que coincidan con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  alumnosFiltrados.map(alumno => {
                    const estilo = semaforoEstilo[alumno.semaforo] || semaforoEstilo.verde
                    return (
                      <tr key={alumno.id} className={`hover ${estilo.fila}`}>
                        <td className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{estilo.icono}</span>
                            <span>{alumno.nombre_completo || 'Sin nombre'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="font-mono text-xs text-gray-500">
                            {alumno.email || 'Sin correo'}
                          </div>
                        </td>
                        <td>
                          <span className="text-sm">
                            {getGrupoNombre(alumno.grupo_id)}
                          </span>
                        </td>
                        <td className="font-semibold">
                          {alumno.promedio || 'N/A'}
                        </td>
                        <td>
                          <span className={`badge badge-sm ${estilo.badge}`}>
                            {estilo.texto}
                          </span>
                        </td>
                        <td className="text-sm text-gray-500">
                          {alumno.ultima_tutoria ? formatDate(alumno.ultima_tutoria) : 'Sin tutorías'}
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/admin/alumnos/${alumno.alumno_id || alumno.id}`)}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            Ver expediente
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen de filtros */}
        {alumnosFiltrados.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Mostrando {alumnosFiltrados.length} de {alumnos.length} alumnos
          </div>
        )}

      </div>
    </Layout>
  )
}

export default SemaforoGeneral