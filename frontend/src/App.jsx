import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import Login from './pages/Login';
import DashboardAdmin from './pages/admin/DashboardAdmin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      cargarPerfil();
    } else {
      setLoading(false);
    }
  }, []);

  const cargarPerfil = async () => {
    try {
      const data = await api.getPerfil();
      setUser(data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      localStorage.removeItem('token');
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={`/${user.rol}`} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            user?.rol === 'admin' ? (
              <DashboardAdmin user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;