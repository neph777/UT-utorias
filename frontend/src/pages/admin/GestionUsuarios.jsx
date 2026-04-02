import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { usuarios } from '../../data/mockData'

const ROLES = [
  { value: 'alumno',  label: 'Alumno' },
  { value: 'maestro', label: 'Maestro / Tutor' },
  { value: 'admin',   label: 'Asesor / Director' },
]

const vacioForm = { nombre: '', email: '', rol: 'alumno' }

const GestionUsuarios = ({ user, onLogout }) => {
  const [lista, setLista]         = useState(usuarios)
  const [form, setForm]           = useState(vacioForm)
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [busqueda, setBusqueda]   = useState('')

  const abrirNuevo = () => {
    setForm(vacioForm)
    setEditandoId(null)
    setMostrarForm(true)
  }

  const abrirEditar = (u) => {
    setForm({ nombre: u.nombre, email: u.email, rol: u.rol })
    setEditandoId(u.id)
    setMostrarForm(true)
  }

  const guardar = () => {
    if (!form.nombre || !form.email) return
    if (editandoId) {
      setLista(lista.map(u => u.id === editandoId ? { ...u, ...form } : u))
    } else {
      setLista([...lista, { id: Date.now(), ...form, grupoId: null }])
    }
    setMostrarForm(false)
    setForm(vacioForm)
    setEditandoId(null)
  }

  const eliminar = (id) => {
    setLista(lista.filter(u => u.id !== id))
  }

  const filtrados = lista.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const rolBadge = (rol) => {
    const clases = { alumno: 'badge-info', maestro: 'badge-success', admin: 'badge-warning' }
    const labels = { alumno: 'Alumno', maestro: 'Maestro', admin: 'Admin' }
    return <span className={`badge badge-sm ${clases[rol]}`}>{labels[rol]}</span>
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p className="text-gray-500 mt-1">Administra los usuarios y sus roles en el sistema</p>
          </div>
          <button onClick={abrirNuevo} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">
            + Nuevo usuario
          </button>
        </div>

        {/* Formulario desplegable */}
        {mostrarForm && (
          <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">
                {editandoId ? 'Editar usuario' : 'Nuevo usuario'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                    placeholder="Ej. María García"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional</label>
                  <input
                    type="email"
                    className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                    placeholder="ejemplo@utn.edu.mx"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm({ ...form, rol: r.value })}
                        className={`py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          form.rol === r.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={guardar} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">
                  {editandoId ? 'Guardar cambios' : 'Crear usuario'}
                </button>
                <button onClick={() => setMostrarForm(false)} className="btn btn-outline">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full md:w-80 focus:border-primary-500 focus:outline-none"
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabla */}
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(u => (
                  <tr key={u.id} className="hover">
                    <td className="font-medium">{u.nombre}</td>
                    <td className="text-sm text-gray-500">{u.email}</td>
                    <td>{rolBadge(u.rol)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEditar(u)}
                          className="btn btn-xs btn-outline btn-primary"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(u.id)}
                          className="btn btn-xs btn-outline btn-error"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default GestionUsuarios