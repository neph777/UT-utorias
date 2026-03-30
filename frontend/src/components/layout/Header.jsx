import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const BREADCRUMBS = {
  '/alumno': [{ label: 'Mi Panel' }],
  '/maestro': [{ label: 'Mis Tutorías' }],
  '/admin': [{ label: 'Panel de Control' }],
}

const ROLES = {
  alumno: 'Alumno',
  maestro: 'Tutor / Maestro',
  admin: 'Asesor / Director',
}

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const breadcrumbs = BREADCRUMBS[location.pathname] || []
  const iniciales = user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <header className="bg-dark-500 border-b border-primary-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/imagenes/headerutnay.png" alt="Logo UTN" className="w-40" />
          </div>

          {/* Usuario + logout (desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Avatar con iniciales */}
                <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                  {iniciales}
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium leading-tight">{user.nombre}</p>
                  <p className="text-gray-400 text-xs leading-tight">{ROLES[user.rol] || user.rol}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-primary-500/20" />
              <button
                onClick={handleLogout}
                className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none"
              >
                Cerrar Sesión
              </button>
            </div>
          )}

          {/* Hamburguesa móvil */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-primary-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                {iniciales}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user.nombre}</p>
                <p className="text-gray-400 text-xs">{ROLES[user.rol] || user.rol}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none w-full"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Breadcrumbs — barra secundaria */}
      {breadcrumbs.length > 0 && (
        <div className="bg-dark-500/80 border-t border-primary-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <nav className="flex items-center gap-2 text-xs text-gray-400">
              <span
                className="hover:text-primary-400 cursor-pointer transition-colors"
                onClick={() => navigate(`/${user?.rol}`)}
              >
                Inicio
              </span>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="text-gray-600">/</span>
                  <span className={i === breadcrumbs.length - 1 ? 'text-primary-400 font-medium' : 'hover:text-white cursor-pointer'}>
                    {crumb.label}
                  </span>
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header