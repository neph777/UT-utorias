import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import DashboardAlumno from './pages/alumno/DashboardAlumno'
import DashboardMaestro from './pages/maestro/DashboardMaestro'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import GestionUsuarios from './pages/admin/GestionUsuarios'
import GestionGrupos from './pages/admin/GestionGrupos'
import AsignacionAlumnos from './pages/admin/AsignacionAlumnos'
import ExpedienteAlumno from './pages/admin/ExpedienteAlumno'
import SemaforoGeneral from './pages/admin/SemaforoGeneral'

// Componente guardián de rutas
const PrivateRoute = ({ user, rolRequerido, children }) => {
  if (!user) return <Navigate to="/login" replace />
  if (rolRequerido && user.rol !== rolRequerido) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [user, setUser] = useState(null)

  const adminRoute = (children) => (
    <PrivateRoute user={user} rolRequerido="admin">{children}</PrivateRoute>
  )

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

        <Route path="/admin" element={adminRoute(<DashboardAdmin user={user} onLogout={() => setUser(null)} />)} />
        <Route path="/admin/usuarios" element={adminRoute(<GestionUsuarios user={user} onLogout={() => setUser(null)} />)} />
        <Route path="/admin/grupos" element={adminRoute(<GestionGrupos user={user} onLogout={() => setUser(null)} />)} />
        <Route path="/admin/grupos/:grupoId" element={adminRoute(<AsignacionAlumnos user={user} onLogout={() => setUser(null)} />)} />
        <Route path="/admin/expediente/:alumnoId" element={adminRoute(<ExpedienteAlumno user={user} onLogout={() => setUser(null)} />)} />
        <Route path="/admin/semaforo" element={adminRoute(<SemaforoGeneral user={user} onLogout={() => setUser(null)} />)} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App