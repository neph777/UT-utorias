import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { api } from '../../services/api';

const ROLES = [
  { value: 'alumno', label: 'Alumno' },
  { value: 'tutor', label: 'Tutor / Maestro' },
  { value: 'admin', label: 'Administrador' },
];

const vacioForm = { nombre: '', email: '', rol: 'alumno', matricula: '', carrera: '', cuatrimestre: '', numero_empleado: '', puesto: '' };

const GestionUsuarios = ({ user, onLogout }) => {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(vacioForm);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await api.getUsuarios(busqueda);
      // La API devuelve un objeto paginado con { data: [], current_page, ... }
      setLista(data.data || []);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    cargarUsuarios();
  };

  const abrirNuevo = () => {
    setForm(vacioForm);
    setEditandoId(null);
    setMostrarForm(true);
  };

  const abrirEditar = (u) => {
    setForm({
      nombre: u.nombre_completo,
      email: u.email,
      rol: u.rol,
      matricula: u.matricula || '',
      carrera: u.carrera || '',
      cuatrimestre: u.cuatrimestre || '',
      numero_empleado: u.numero_empleado || '',
      puesto: u.puesto || ''
    });
    setEditandoId(u.id);
    setMostrarForm(true);
  };

  const guardar = async () => {
    if (!form.nombre || !form.email) return;
    try {
      if (editandoId) {
        await api.actualizarUsuario(editandoId, form);
      } else {
        await api.crearUsuario(form);
      }
      setMostrarForm(false);
      setForm(vacioForm);
      setEditandoId(null);
      cargarUsuarios();
    } catch (err) {
      setError('Error al guardar usuario');
      console.error(err);
    }
  };

  const eliminar = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
      try {
        await api.eliminarUsuario(id);
        cargarUsuarios();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  const rolBadge = (rol) => {
    const clases = { alumno: 'badge-info', tutor: 'badge-success', admin: 'badge-warning' };
    const labels = { alumno: 'Alumno', tutor: 'Tutor', admin: 'Admin' };
    return <span className={`badge badge-sm ${clases[rol]}`}>{labels[rol]}</span>;
  };

  if (loading) return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
    </Layout>
  );

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p className="text-gray-500 mt-1">Administra los usuarios y sus roles en el sistema</p>
          </div>
          <button onClick={abrirNuevo} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">
            + Nuevo usuario
          </button>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {mostrarForm && (
          <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">{editandoId ? 'Editar usuario' : 'Nuevo usuario'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Nombre completo" className="input input-bordered" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                <input type="email" placeholder="Correo institucional" className="input input-bordered" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <select className="select select-bordered" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                {form.rol === 'alumno' && (
                  <>
                    <input type="text" placeholder="Matrícula" className="input input-bordered" value={form.matricula} onChange={e => setForm({ ...form, matricula: e.target.value })} />
                    <input type="text" placeholder="Carrera" className="input input-bordered" value={form.carrera} onChange={e => setForm({ ...form, carrera: e.target.value })} />
                    <input type="number" placeholder="Cuatrimestre" className="input input-bordered" value={form.cuatrimestre} onChange={e => setForm({ ...form, cuatrimestre: e.target.value })} />
                  </>
                )}
                {form.rol === 'tutor' && (
                  <input type="text" placeholder="Número de empleado" className="input input-bordered" value={form.numero_empleado} onChange={e => setForm({ ...form, numero_empleado: e.target.value })} />
                )}
                {form.rol === 'admin' && (
                  <input type="text" placeholder="Puesto" className="input input-bordered" value={form.puesto} onChange={e => setForm({ ...form, puesto: e.target.value })} />
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={guardar} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">Guardar</button>
                <button onClick={() => { setMostrarForm(false); setEditandoId(null); }} className="btn btn-outline">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <input type="text" className="input input-bordered w-full md:w-80" placeholder="Buscar por nombre o correo..." value={busqueda} onChange={handleBusqueda} />
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(u => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.nombre_completo}</td>
                    <td className="text-sm text-gray-500">{u.email}</td>
                    <td>{rolBadge(u.rol)}</td>
                    <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      <button onClick={() => abrirEditar(u)} className="btn btn-xs btn-primary mr-2">Editar</button>
                      <button onClick={() => eliminar(u.id)} className="btn btn-xs btn-error">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GestionUsuarios;