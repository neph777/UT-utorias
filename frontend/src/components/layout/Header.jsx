import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../Hooks/useBreadcrumbs'
import CambiarPassword from '../common/CambiarPassword'

const ROLES = {
  alumno: 'Alumno',
  maestro: 'Tutor / Maestro',
  tutor: 'Tutor / Maestro',  // ← Agregar para coincidir con tu backend
  admin: 'Asesor / Director',
}

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const breadcrumbs = useBreadcrumbs(user)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const iniciales = user?.nombre_completo || user?.nombre
    ? (user.nombre_completo || user.nombre).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  // Determinar el rol para mostrar
  const rolMostrar = user?.rol === 'tutor' ? 'maestro' : user?.rol
  const rolLabel = ROLES[rolMostrar] || user?.rol || 'Usuario'

  return (
    <>
      <header className="bg-dark-500 border-b border-primary-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/imagenes/headerutnay.png" alt="Logo UTN" className="w-40" />
            </div>

            {/* Usuario + acciones — desktop */}
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {iniciales}
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium leading-tight">
                      {user.nombre_completo || user.nombre}
                    </p>
                    <p className="text-gray-400 text-xs leading-tight">{rolLabel}</p>
                  </div>
                </div>
                
                {/* Botón cambiar contraseña - desktop */}
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="btn btn-sm btn-outline text-white border-gray-600 hover:border-primary-500 hover:bg-primary-500/10"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Cambiar contraseña
                </button>
                
                <div className="w-px h-8 bg-primary-500/20" />
                <button
                  onClick={handleLogout}
                  className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}

            {/* Hamburguesa — móvil */}
            <button
              className="md:hidden text-white p-1"
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
            <div className="md:hidden py-4 border-t border-primary-500/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                  {iniciales}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.nombre_completo || user.nombre}</p>
                  <p className="text-gray-400 text-xs">{rolLabel}</p>
                </div>
              </div>
              
              {/* Botón cambiar contraseña - móvil */}
              <button
                onClick={() => {
                  setShowPasswordModal(true)
                  setIsMenuOpen(false)
                }}
                className="btn btn-sm btn-outline text-white border-gray-600 hover:border-primary-500 w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Cambiar contraseña
              </button>
              
              <button
                onClick={handleLogout}
                className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none w-full"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Breadcrumbs dinámicos */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="border-t border-primary-500/10 bg-dark-500/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
              <div className="breadcrumbs text-xs py-1">
                <ul>
                  <li>
                    <Link
                      to={user ? `/${user.rol}` : '/login'}
                      className="text-gray-400 hover:text-primary-400"
                    >
                      <svg className="w-3.5 h-3.5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Inicio
                    </Link>
                  </li>
                  {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.path || index}>
                      {crumb.isActive ? (
                        <span className="text-primary-400 font-medium">{crumb.label}</span>
                      ) : (
                        <Link to={crumb.path} className="text-gray-400 hover:text-white">
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modal de cambio de contraseña */}
      {showPasswordModal && (
        <CambiarPassword onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  )
}

export default Header