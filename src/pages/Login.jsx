import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ setUser }) => {
  const [rol, setRol] = useState('alumno')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    const mockUser = {
      alumno: { id: 1, nombre: 'María García', rol: 'alumno', email: 'maria@utn.edu.mx' },
      maestro: { id: 1, nombre: 'Dr. Juan Pérez', rol: 'maestro', email: 'juan.perez@utn.edu.mx' },
      admin: { id: 1, nombre: 'Director Carrera', rol: 'admin', email: 'direccion@utn.edu.mx' }
    }
    setUser(mockUser[rol])
    navigate(`/${rol}`)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
          <img src="/imagenes/logoutnay.png" alt="Logo UTN" className="w-100" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-base-100 p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">UT</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Sistema de Tutorías</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Tipo de Usuario</span>
              </label>
              <select 
                className="select select-bordered focus:border-primary-500 focus:outline-none"
                value={rol} 
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="alumno"> Alumno</option>
                <option value="maestro"> Maestro / Tutor</option>
                <option value="admin"> Asesor / Director</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Correo Institucional</span>
              </label>
              <input 
                type="email" 
                placeholder="ejemplo@utn.edu.mx" 
                className="input input-bordered focus:border-primary-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Contraseña</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered focus:border-primary-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label justify-end">
                <a href="#" className="label-text-alt link link-primary text-primary-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn w-full bg-primary-500 hover:bg-primary-600 text-white border-none"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            ¿Problemas para acceder? Contacta a soporte@utn.edu.mx
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login