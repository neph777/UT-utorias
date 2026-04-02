import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { alumnos, grupos } from '../../data/mockData'

const ORDEN = { rojo: 0, amarillo: 1, verde: 2 }

const SemaforoGeneral = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [filtroGrupo, setFiltroGrupo] = useState('todos')
  const [filtroSemaforo, setFiltroSemaforo] = useState('todos')

  const filtrados = alumnos
    .filter(a => filtroGrupo === 'todos' || a.grupoId === Number(filtroGrupo))
    .filter(a => filtroSemaforo === 'todos' || a.semaforo === filtroSemaforo)
    .sort((a, b) => ORDEN[a.semaforo] - ORDEN[b.semaforo])

  const semaforoEstilo = {
    rojo:     { badge: 'badge-error',   fila: 'border-l-4 border-red-400',    texto: 'Prioridad alta' },
    amarillo: { badge: 'badge-warning', fila: 'border-l-4 border-yellow-400', texto: 'Seguimiento' },
    verde:    { badge: 'badge-success', fila: 'border-l-4 border-green-400',  texto: 'Estable' },
  }

  const conteo = (color) => alumnos.filter(a => a.semaforo === color).length

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Semáforo General</h1>
          <p className="text-gray-500 mt-1">Alumnos ordenados por nivel de atención requerida</p>
        </div>

        {/* Resumen rápido */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { color: 'rojo',     label: 'Prioridad alta',  badge: 'border-red-500',    text: 'text-red-500'    },
            { color: 'amarillo', label: 'Seguimiento',     badge: 'border-yellow-500', text: 'text-yellow-500' },
            { color: 'verde',    label: 'Estable',         badge: 'border-green-500',  text: 'text-green-500'  },
          ].map(item => (
            <button
              key={item.color}
              onClick={() => setFiltroSemaforo(filtroSemaforo === item.color ? 'todos' : item.color)}
              className={`stats shadow bg-base-100 border-l-4 ${item.badge} cursor-pointer hover:shadow-md transition-shadow w-full ${filtroSemaforo === item.color ? 'ring-2 ring-offset-1' : ''}`}
            >
              <div className="stat py-4">
                <div className="stat-title">{item.label}</div>
                <div className={`stat-value ${item.text}`}>{conteo(item.color)}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            className="select select-bordered select-sm focus:border-primary-500 focus:outline-none"
            value={filtroGrupo}
            onChange={e => setFiltroGrupo(e.target.value)}
          >
            <option value="todos">Todos los grupos</option>
            {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
          </select>
          <select
            className="select select-bordered select-sm focus:border-primary-500 focus:outline-none"
            value={filtroSemaforo}
            onChange={e => setFiltroSemaforo(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="rojo">Prioridad alta</option>
            <option value="amarillo">Seguimiento</option>
            <option value="verde">Estable</option>
          </select>
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
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Matrícula</th>
                  <th>Grupo</th>
                  <th>Promedio</th>
                  <th>Estado</th>
                  <th>Última tutoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(a => {
                  const grupo = grupos.find(g => g.id === a.grupoId)
                  const estilo = semaforoEstilo[a.semaforo]
                  return (
                    <tr key={a.id} className={`hover ${estilo.fila}`}>
                      <td className="font-medium">{a.nombre}</td>
                      <td className="font-mono text-sm text-gray-500">{a.matricula}</td>
                      <td>{grupo?.nombre || '—'}</td>
                      <td className="font-semibold">{a.promedio}</td>
                      <td><span className={`badge badge-sm ${estilo.badge}`}>{estilo.texto}</span></td>
                      <td className="text-sm text-gray-500">{a.ultimaTutoria}</td>
                      <td>
                        <button
                          onClick={() => navigate(`/admin/expediente/${a.id}`)}
                          className="btn btn-xs btn-outline btn-primary"
                        >
                          Ver expediente
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default SemaforoGeneral