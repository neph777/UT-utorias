import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const GestionGrupos = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const L = t.gestionGrupos;
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ clave: '', cuatrimestre: '', turno: 'matutino' });
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    try {
      setLoading(true);
      const data = await api.getGrupos();
      setLista(data);
    } catch (err) {
      setError('Error al cargar grupos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const abrirNuevo = () => {
    setForm({ clave: '', cuatrimestre: '', turno: 'matutino' });
    setEditandoId(null);
    setMostrarForm(true);
  };

  const abrirEditar = (g) => {
    setForm({ clave: g.clave, cuatrimestre: g.cuatrimestre, turno: g.turno });
    setEditandoId(g.id);
    setMostrarForm(true);
  };

  const guardar = async () => {
    if (!form.clave) return;
    try {
      if (editandoId) {
        await api.actualizarGrupo(editandoId, form);
      } else {
        await api.crearGrupo(form);
      }
      setMostrarForm(false);
      setForm({ clave: '', cuatrimestre: '', turno: 'matutino' });
      setEditandoId(null);
      cargarGrupos();
    } catch (err) {
      setError('Error al guardar grupo');
    }
  };

  const eliminar = async (id) => {
    if (confirm('¿Eliminar este grupo?')) {
      try {
        await api.eliminarGrupo(id);
        cargarGrupos();
      } catch (err) {
        setError('Error al eliminar grupo');
      }
    }
  };

  const turnoBadge = (turno) => {
    const clases = { matutino: 'badge-info', vespertino: 'badge-warning', mixto: 'badge-success' };
    const labels = { matutino: 'Matutino', vespertino: 'Vespertino', mixto: 'Mixto' };
    return <span className={`badge badge-sm ${clases[turno]}`}>{labels[turno]}</span>;
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
            <h1 className="text-3xl font-bold text-gray-800">{L.title}</h1>
            <p className="text-gray-500 mt-1">{t.common.loading === 'Cargando...' ? 'Crea grupos y asigna tutores responsables' : 'Create groups and assign responsible tutors'}</p>
          </div>
          <button onClick={abrirNuevo} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">
            + {L.newGroup}
          </button>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {mostrarForm && (
          <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">{editandoId ? 'Editar grupo' : 'Nuevo grupo'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Clave (ej: TIC-5A)" className="input input-bordered" value={form.clave} onChange={e => setForm({ ...form, clave: e.target.value })} />
                <input type="number" placeholder="Cuatrimestre" className="input input-bordered" value={form.cuatrimestre} onChange={e => setForm({ ...form, cuatrimestre: e.target.value })} />
                <select className="select select-bordered" value={form.turno} onChange={e => setForm({ ...form, turno: e.target.value })}>
                  <option value="matutino">Matutino</option>
                  <option value="vespertino">Vespertino</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={guardar} className="btn bg-primary-500 hover:bg-primary-600 text-white border-none">{t.common.save}</button>
                <button onClick={() => setMostrarForm(false)} className="btn btn-outline">{t.common.cancel}</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lista.map(g => (
            <div key={g.id} className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-primary-500">{g.clave}</h2>
                  {turnoBadge(g.turno)}
                </div>
                <p className="text-sm text-gray-500">Cuatrimestre: {g.cuatrimestre}</p>
                <p className="text-sm text-gray-500">Alumnos: {g.alumnos?.length || 0}</p>
                <div className="card-actions justify-end mt-4 flex-wrap gap-2">
                  <button onClick={() => navigate(`/admin/grupos/${g.id}`)} className="btn btn-sm btn-outline btn-primary">{L.viewStudents}</button>
                  <button onClick={() => abrirEditar(g)} className="btn btn-sm btn-outline">{t.common.edit}</button>
                  <button onClick={() => eliminar(g.id)} className="btn btn-sm btn-outline btn-error">{t.common.delete}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lista.length === 0 && (
          <div className="text-center text-gray-500 py-12">No hay grupos registrados</div>
        )}
      </div>
    </Layout>
  );
};

export default GestionGrupos;