import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { grupos, usuarios } from '../../data/mockData'

const GestionGrupos = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const maestros = usuarios.filter(u => u.rol === 'maestro')

  const [lista, setLista]           = useState(grupos)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm]             = useState({ nombre: '', maestroId: '' })
  const [editandoId, setEditandoId] = useState(null)

  const abrirNuevo = () => {
    setForm({ nombre: '', maestroId: '' })
    setEditandoId(null)
    setMostrarForm(true)
  }

  const abrirEditar = (g) => {
    setForm({ nombre: g.nombre, maestroId: g.maestroId || '' })
    setEditandoId(g.id)
    setMostrarForm(true)
  }

  const guardar = () => {
    if (!form.nombre) return
    if (editandoId) {
      setLista(lista.map(g => g.id === editandoId
        ? { ...g, nombre: form.nombre, maestroId: form.maestroId || null }
        : g
      ))
    } else {
      setLista([...lista, { id: Date.now(), nombre: form.nombre, maestroId: form.maestroId || null, alumnos: [] }])
    }
    setMostrarForm(false)
    setEditandoId(null)
  }

  const eliminar = (id) => setLista(lista.filter(g => g.id !== id))

  const nombreMaestro = (maestroId) => {
    const m = maestros.find(m => m.id === maestroId)
    return m ? m.nombre : 'Sin asignar'
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Grupos</h1>
            <p className="text-gray-500 mt-1">Crea grupos y asigna tutores responsables</p>
          </div>
          <button onClick={abrirNuevo} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">
            + Nuevo grupo
          </button>
        </div>

        {/* Formulario desplegable */}
        {mostrarForm && (
          <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">
                {editandoId ? 'Editar grupo' : 'Nuevo grupo'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del grupo</label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                    placeholder="Ej. IDGS-81"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tutor asignado</label>
                  <select
                    className="select select-bordered w-full focus:border-primary-500 focus:outline-none"
                    value={form.maestroId}
                    onChange={e => setForm({ ...form, maestroId: Number(e.target.value) })}
                  >
                    <option value="">Sin asignar</option>
                    {maestros.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={guardar} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">
                  {editandoId ? 'Guardar cambios' : 'Crear grupo'}
                </button>
                <button onClick={() => setMostrarForm(false)} className="btn btn-outline">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tarjetas de grupos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lista.map(g => (
            <div key={g.id} className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-primary-500">{g.nombre}</h2>
                  <span className="badge badge-ghost">{g.alumnos.length} alumnos</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Tutor: <span className="font-medium text-gray-700">{nombreMaestro(g.maestroId)}</span>
                </p>
                <div className="card-actions justify-end mt-4 flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/admin/grupos/${g.id}`)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Asignar alumnos
                  </button>
                  <button
                    onClick={() => abrirEditar(g)}
                    className="btn btn-sm btn-outline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(g.id)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  )
}

export default GestionGrupos