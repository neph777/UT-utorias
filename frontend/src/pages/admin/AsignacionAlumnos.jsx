import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { grupos, alumnos } from '../../data/mockData'

const AsignacionAlumnos = ({ user, onLogout }) => {
  const { grupoId } = useParams()
  const navigate = useNavigate()
  const grupo = grupos.find(g => g.id === Number(grupoId))

  const [asignados, setAsignados]       = useState(
    alumnos.filter(a => grupo?.alumnos.includes(a.id))
  )
  const [disponibles, setDisponibles]   = useState(
    alumnos.filter(a => !grupo?.alumnos.includes(a.id))
  )

  if (!grupo) return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 text-center text-gray-500">Grupo no encontrado</div>
    </Layout>
  )

  const asignar = (alumno) => {
    setAsignados([...asignados, alumno])
    setDisponibles(disponibles.filter(a => a.id !== alumno.id))
  }

  const quitar = (alumno) => {
    setDisponibles([...disponibles, alumno])
    setAsignados(asignados.filter(a => a.id !== alumno.id))
  }

  const semaforoBadge = (s) => {
    const clases = { rojo: 'badge-error', amarillo: 'badge-warning', verde: 'badge-success' }
    return <span className={`badge badge-sm ${clases[s]}`}>{s}</span>
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/admin/grupos')} className="btn btn-sm btn-outline">
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Asignación de Alumnos</h1>
            <p className="text-gray-500 mt-1">Grupo: <span className="font-semibold text-primary-500">{grupo.nombre}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Alumnos asignados */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-0">
              <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">En este grupo</h2>
                <span className="badge badge-primary">{asignados.length}</span>
              </div>
              {asignados.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Sin alumnos asignados</p>
              ) : (
                <div className="divide-y divide-base-200">
                  {asignados.map(a => (
                    <div key={a.id} className="flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{a.nombre}</p>
                        <p className="text-xs text-gray-400">{a.matricula}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {semaforoBadge(a.semaforo)}
                        <button
                          onClick={() => quitar(a)}
                          className="btn btn-xs btn-outline btn-error"
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
                <h2 className="font-semibold text-gray-800">Disponibles</h2>
                <span className="badge badge-ghost">{disponibles.length}</span>
              </div>
              {disponibles.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No hay alumnos disponibles</p>
              ) : (
                <div className="divide-y divide-base-200">
                  {disponibles.map(a => (
                    <div key={a.id} className="flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{a.nombre}</p>
                        <p className="text-xs text-gray-400">{a.matricula}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {semaforoBadge(a.semaforo)}
                        <button
                          onClick={() => asignar(a)}
                          className="btn btn-xs btn-outline btn-primary"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default AsignacionAlumnos