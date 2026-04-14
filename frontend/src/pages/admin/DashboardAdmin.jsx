import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const DashboardAdmin = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const L = t.dashboardAdmin;
  const Ls = t.semaforo;
  const [stats, setStats] = useState({
    total_alumnos: 0,
    total_tutores: 0,
    total_tutorias: 0,
    semaforo: { rojo: 0, amarillo: 0, verde: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardAdmin();
      setStats(data);
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="p-6 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{L.title}</h1>
          <p className="text-gray-500 mt-1">{t.common.loading !== 'Loading...' ? 'Bienvenido' : 'Welcome'}, {user?.nombre_completo}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow bg-base-100 border-l-4 border-primary-500">
            <div className="stat">
              <div className="stat-title">{t.common.loading === 'Cargando...' ? 'Total Alumnos' : 'Total Students'}</div>
              <div className="stat-value text-primary-500">{stats.total_alumnos}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-info">
            <div className="stat">
              <div className="stat-title">{t.common.loading === 'Cargando...' ? 'Tutores Activos' : 'Active Tutors'}</div>
              <div className="stat-value text-info">{stats.total_tutores}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-success">
            <div className="stat">
              <div className="stat-title">{t.dashboardMaestro.tutoriasCompleted}</div>
              <div className="stat-value text-success">{stats.total_tutorias}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-error">
            <div className="stat">
              <div className="stat-title">{t.common.loading === 'Cargando...' ? 'Alumnos en Rojo' : 'High Priority Students'}</div>
              <div className="stat-value text-error">{stats.semaforo?.rojo || 0}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Semáforo */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <h2 className="card-title">{t.common.loading === 'Cargando...' ? 'Estado general de alumnos' : 'Students Overview'}</h2>
                <button
                  onClick={() => navigate('/admin/semaforo')}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  {t.common.loading === 'Cargando...' ? 'Ver detalle' : 'View details'}
                </button>
              </div>
              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{Ls.rojo}</span>
                    <span className="text-sm font-bold">{stats.semaforo?.rojo || 0}</span>
                  </div>
                  <progress className="progress progress-error w-full" value={stats.semaforo?.rojo || 0} max={stats.total_alumnos || 1} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{Ls.amarillo}</span>
                    <span className="text-sm font-bold">{stats.semaforo?.amarillo || 0}</span>
                  </div>
                  <progress className="progress progress-warning w-full" value={stats.semaforo?.amarillo || 0} max={stats.total_alumnos || 1} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{Ls.verde}</span>
                    <span className="text-sm font-bold">{stats.semaforo?.verde || 0}</span>
                  </div>
                  <progress className="progress progress-success w-full" value={stats.semaforo?.verde || 0} max={stats.total_alumnos || 1} />
                </div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title mb-2">{t.common.loading === 'Cargando...' ? 'Acciones rápidas' : 'Quick Actions'}</h2>
              <div className="space-y-3">
                <button onClick={() => navigate('/admin/usuarios')} className="btn btn-outline btn-primary w-full justify-start">
                  {L.manageUsers}
                </button>
                <button onClick={() => navigate('/admin/grupos')} className="btn btn-outline btn-primary w-full justify-start">
                  {L.manageGroups}
                </button>
                <button onClick={() => navigate('/admin/semaforo')} className="btn btn-outline btn-primary w-full justify-start">
                  {L.viewSemaforo}
                </button>
                <button onClick={() => navigate('/admin/backup')} className="btn btn-outline btn-primary w-full justify-start">
                  {L.manageBackup}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;