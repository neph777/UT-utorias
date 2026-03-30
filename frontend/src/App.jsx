import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import DashboardAlumno from './pages/alumno/DashboardAlumno'
import DashboardMaestro from './pages/maestro/DashboardMaestro'
import DashboardAdmin from './pages/admin/DashboardAdmin'

// Componente guardián de rutas
const PrivateRoute = ({ user, rolRequerido, children }) => {
  if (!user) return <Navigate to="/login" replace />
  if (rolRequerido && user.rol !== rolRequerido) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/alumno" element={
          <PrivateRoute user={user} rolRequerido="alumno">
            <DashboardAlumno user={user} onLogout={() => setUser(null)} />
          </PrivateRoute>
        } />
        <Route path="/maestro" element={
          <PrivateRoute user={user} rolRequerido="maestro">
            <DashboardMaestro user={user} onLogout={() => setUser(null)} />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute user={user} rolRequerido="admin">
            <DashboardAdmin user={user} onLogout={() => setUser(null)} />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App