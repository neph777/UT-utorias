import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <header className="bg-dark-500 border-b border-primary-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center gap-3">
            <img src="/imagenes/headerutnay.png" alt="Logo UTN" className="w-40" />
          </div>


          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none"
            >
              Cerrar Sesión
            </button>
          </div>


          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>


        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500/20">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none w-full"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header