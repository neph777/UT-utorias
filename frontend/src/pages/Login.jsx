import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Configuración de roles con iconos y descripciones
const ROLES = [
  {
    value: 'alumno',
    label: 'Alumno',
    description: 'Consulta tus tutorías y compromisos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-3.5-2M12 20l-4-2.5" />
      </svg>
    ),
  },
  {
    value: 'tutor', // Cambiado de 'maestro' a 'tutor' para coincidir con el backend
    label: 'Maestro / Tutor',
    description: 'Gestiona el seguimiento de tus grupos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    value: 'admin',
    label: 'Asesor / Director',
    description: 'Supervisión general del programa',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [rol, setRol] = useState('alumno');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manejar el envío del formulario con autenticación real
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORMULARIO ENVIADO ===');
    console.log('Email:', email);
    console.log('Password:', password ? '****' : 'vacío');
    
    setError('');
    setLoading(true);

    // Validación básica antes de enviar
    if (!email.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      setLoading(false);
      return;
    }
    
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      setLoading(false);
      return;
    }

    console.log('Llamando a api.login...');
    
    // Llamar a la API real
    const result = await api.login(email, password);
    
    console.log('Resultado del login:', result);
    
    if (result.success) {
      console.log('Login exitoso, usuario:', result.user);
      onLogin(result.user);
      
      // Redirigir según el rol
      switch (result.user.rol) {
        case 'admin':
          navigate('/admin');
          break;
        case 'tutor':
          navigate('/tutor');
          break;
        case 'alumno':
          navigate('/alumno');
          break;
        default:
          navigate('/');
      }
    } else {
      console.log('Error en login:', result.error);
      setError(result.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-base-100">

      {/* ── Panel izquierdo — solo en desktop ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden flex-col justify-between p-12">
        {/* Patrón geométrico decorativo */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Círculos decorativos */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-500/30" />
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary-400/20" />

        {/* Logo */}
        <div className="relative z-10">
          <img src="/imagenes/logoutnay.png" alt="Logo UTN" className="w-48" />
        </div>

        {/* Texto central */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Sistema de<br />
            <span className="text-primary-200">Tutorías UTN</span>
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed max-w-sm">
            Seguimiento académico integral para alumnos, tutores y directivos de la Universidad Tecnológica de Nayarit.
          </p>

          {/* Estadísticas decorativas */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '180+', label: 'Alumnos' },
              { value: '12',   label: 'Tutores' },
              { value: '4',    label: 'Grupos' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-primary-200 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pie del panel */}
        <div className="relative z-10 text-primary-300 text-sm">
          © {new Date().getFullYear()} Universidad Tecnológica de Nayarit
        </div>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white text-xl font-bold">UT</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Sistema de Tutorías</h2>
            <p className="text-gray-400 text-sm mt-1">Universidad Tecnológica de Nayarit</p>
          </div>

          {/* Título del formulario */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
            <p className="text-gray-400 text-sm mt-1">Ingresa con tu cuenta institucional</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Selector de rol — tarjetas visuales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de usuario
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRol(r.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                      rol === r.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={rol === r.value ? 'text-primary-500' : 'text-gray-400'}>
                      {r.icon}
                    </span>
                    <span className="text-xs font-medium leading-tight">{r.label}</span>
                  </button>
                ))}
              </div>
              {/* Descripción del rol seleccionado */}
              <p className="text-xs text-gray-400 mt-2 text-center">
                {ROLES.find(r => r.value === rol)?.description}
              </p>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo institucional
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="ejemplo@utn.edu.mx"
                  className="input input-bordered w-full pl-9 focus:border-primary-500 focus:outline-none"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-primary-500 hover:text-primary-600 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-9 pr-10 focus:border-primary-500 focus:outline-none"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                  autoComplete="current-password"
                />
                {/* Toggle mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-primary-500 hover:bg-primary-600 text-white border-none disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Verificando...
                </span>
              ) : (
                'Ingresar al sistema'
              )}
            </button>
          </form>

          {/* Ayuda */}
          <p className="mt-6 text-center text-xs text-gray-400">
            ¿Problemas para acceder?{' '}
            <a href="mailto:soporte@utn.edu.mx" className="text-primary-500 hover:underline">
              soporte@utn.edu.mx
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;