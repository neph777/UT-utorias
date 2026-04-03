import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { api } from '../../services/api';

const DashboardAdmin = ({ user, onLogout }) => {
  const navigate = useNavigate();
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
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 mt-1">Bienvenido, {user?.nombre_completo}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow bg-base-100 border-l-4 border-primary-500">
            <div className="stat">
              <div className="stat-title">Total Alumnos</div>
              <div className="stat-value text-primary-500">{stats.total_alumnos}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-info">
            <div className="stat">
              <div className="stat-title">Tutores Activos</div>
              <div className="stat-value text-info">{stats.total_tutores}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-success">
            <div className="stat">
              <div className="stat-title">Tutorías Realizadas</div>
              <div className="stat-value text-success">{stats.total_tutorias}</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100 border-l-4 border-error">
            <div className="stat">
              <div className="stat-title">Alumnos en Rojo</div>
              <div className="stat-value text-error">{stats.semaforo?.rojo || 0}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Semáforo */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <h2 className="card-title">Estado general de alumnos</h2>
                <button
                  onClick={() => navigate('/admin/semaforo')}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Ver detalle
                </button>
              </div>
              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Prioridad alta (Rojo)</span>
                    <span className="text-sm font-bold">{stats.semaforo?.rojo || 0}</span>
                  </div>
                  <progress className="progress progress-error w-full" value={stats.semaforo?.rojo || 0} max={stats.total_alumnos || 1} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Seguimiento (Amarillo)</span>
                    <span className="text-sm font-bold">{stats.semaforo?.amarillo || 0}</span>
                  </div>
                  <progress className="progress progress-warning w-full" value={stats.semaforo?.amarillo || 0} max={stats.total_alumnos || 1} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Estable (Verde)</span>
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
              <h2 className="card-title mb-2">Acciones rápidas</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/usuarios')}
                  className="btn btn-outline btn-primary w-full justify-start"
                >
                  Gestionar usuarios y roles
                </button>
                <button
                  onClick={() => navigate('/admin/grupos')}
                  className="btn btn-outline btn-primary w-full justify-start"
                >
                  Gestionar grupos
                </button>
                <button
                  onClick={() => navigate('/admin/semaforo')}
                  className="btn btn-outline btn-primary w-full justify-start"
                >
                   Ver semáforo general
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