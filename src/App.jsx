import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import DashboardAlumno from './pages/alumno/DashboardAlumno'
import DashboardMaestro from './pages/maestro/DashboardMaestro'
import DashboardAdmin from './pages/admin/DashboardAdmin'

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/alumno" element={<DashboardAlumno user={user} onLogout={() => setUser(null)} />} />
        <Route path="/maestro" element={<DashboardMaestro user={user} onLogout={() => setUser(null)} />} />
        <Route path="/admin" element={<DashboardAdmin user={user} onLogout={() => setUser(null)} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App