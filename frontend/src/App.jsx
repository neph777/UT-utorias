import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { api } from './services/api';
import Login from './pages/Login';

//Admin
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionGrupos from './pages/admin/GestionGrupos';
import AsignacionAlumnos from './pages/admin/AsignacionAlumnos';
import ExpedienteAlumno from './pages/admin/ExpedienteAlumno';
import SemaforoGeneral from './pages/admin/SemaforoGeneral';
import GestionBackup from './pages/admin/GestionBackup';
// Tutor
import DashboardMaestro from './pages/maestro/DashboardMaestro';
import GenerarCita from './pages/maestro/GenerarCita';
import RegistrarTutoria from './pages/maestro/RegistrarTutoria';
import SemaforoMaestro from './pages/maestro/SemaforoMaestro';


// Componente principal que usa useNavigate
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- AGREGADO

  const protect = (rol, component) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.rol !== rol) return <Navigate to={`/${user.rol}`} replace />;
    return component;
  }
  // Función para verificar si el token expiró
  const tokenExpirado = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Modifica tu useEffect en AppContent
  useEffect(() => {
    const checkAuth = async () => {
      console.log('1. Iniciando checkAuth');
      const token = localStorage.getItem('token');
      console.log('2. Token encontrado:', token ? 'Sí existe' : 'No existe');
      
      if (!token || tokenExpirado(token)) {
        console.log('3. Token inválido o expirado, redirigiendo a login');
        localStorage.removeItem('token');
        navigate('/login');
        setLoading(false);
        return;
      }
      
      console.log('4. Token válido, cargando perfil...');
      await cargarPerfil();
    };
    
    checkAuth();
  }, []);

  const cargarPerfil = async () => {
    console.log('5. Ejecutando cargarPerfil');
    try {
      const data = await api.getPerfil();
      console.log('6. Perfil cargado exitosamente:', data);
      setUser(data);
    } catch (error) {
      console.error('7. Error en cargarPerfil:', error);
      console.error('8. Detalles del error:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    console.log('Login exitoso:', userData);
    setUser(userData);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
      
 

  return (
    <Routes>
      <Route path="/login" element={
        user
          ? <Navigate to={`/${user.rol}`} replace />
          : <Login onLogin={handleLogin} />
      } />

      {/* Admin */}
      <Route path="/admin"                   element={protect('admin', <DashboardAdmin user={user} onLogout={handleLogout} />)} />
      <Route path="/admin/usuarios"          element={protect('admin', <GestionUsuarios user={user} onLogout={handleLogout} />)} />
      <Route path="/admin/grupos"            element={protect('admin', <GestionGrupos user={user} onLogout={handleLogout} />)} />
      <Route path="/admin/grupos/:grupoId"   element={protect('admin', <AsignacionAlumnos user={user} onLogout={handleLogout} />)} />
      <Route path="/admin/alumnos/:alumnoId" element={protect('admin', <ExpedienteAlumno user={user} onLogout={handleLogout} />)} />
      <Route path="/admin/semaforo"          element={protect('admin', <SemaforoGeneral user={user} onLogout={handleLogout} />)} />
      <Route path="/admin/backup"            element={protect('admin', <GestionBackup user={user} onLogout={handleLogout} />)} />

      {/* Tutor */}
      <Route path="/tutor"                    element={protect('tutor', <DashboardMaestro user={user} onLogout={handleLogout} />)} />
      <Route path="/tutor/cita/:alumnoId"     element={protect('tutor', <GenerarCita user={user} onLogout={handleLogout} />)} />
      <Route path="/tutor/tutoria/:alumnoId"  element={protect('tutor', <RegistrarTutoria user={user} onLogout={handleLogout} />)} />
      <Route path="/tutor/semaforo"           element={protect('tutor', <SemaforoMaestro user={user} onLogout={handleLogout} />)} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Componente App principal que envuelve con BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;