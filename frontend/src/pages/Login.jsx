import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLanguage();
  const L = t.login;

  const ROLES = [
    {
      value: 'alumno',
      label: L.roles.alumno.label,
      description: L.roles.alumno.description,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-3.5-2M12 20l-4-2.5" />
        </svg>
      ),
    },
    {
      value: 'tutor',
      label: L.roles.tutor.label,
      description: L.roles.tutor.description,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      value: 'admin',
      label: L.roles.admin.label,
      description: L.roles.admin.description,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const [rol, setRol] = useState('alumno');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.includes('@')) {
      setError(L.errors.invalidEmail);
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError(L.errors.shortPassword);
      setLoading(false);
      return;
    }

    const result = await api.login(email, password);

    if (result.success) {
      onLogin(result.user);
      switch (result.user.rol) {
        case 'admin': navigate('/admin'); break;
        case 'tutor': navigate('/tutor'); break;
        case 'alumno': navigate('/alumno'); break;
        default: navigate('/');
      }
    } else {
      setError(result.error || L.errors.generic);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-base-100">

      {/* ── Panel izquierdo — solo en desktop ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-500/30" />
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary-400/20" />

        <div className="relative z-10">
          <img src="/imagenes/logoutnay.png" alt="Logo UTN" className="w-48" />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            {L.heroTitle.split('\n')[0]}<br />
            <span className="text-primary-200">{L.heroTitle.split('\n')[1]}</span>
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed max-w-sm">
            {L.heroSubtitle}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '180+', label: L.stats.students },
              { value: '12',   label: L.stats.tutors },
              { value: '4',    label: L.stats.groups },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-primary-200 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-primary-300 text-sm">
          © {new Date().getFullYear()} Universidad Tecnológica de Nayarit
        </div>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

        {/* Botón de idioma */}
        <button
          onClick={toggleLang}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors shadow"
          title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <img
            src={lang === 'es' ? '/imagenes/banderaEU.svg' : '/imagenes/banderamex.png'}
            alt={lang === 'es' ? 'English' : 'Español'}
            className="w-6 h-4 object-cover rounded"
          />
          <span className="text-white text-xs font-medium">{lang === 'es' ? 'EN' : 'ES'}</span>
        </button>

        <div className="w-full max-w-md">

          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white text-xl font-bold">UT</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{L.mobileTitle}</h2>
            <p className="text-gray-400 text-sm mt-1">{L.mobileSubtitle}</p>
          </div>

          {/* Título del formulario */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{L.title}</h2>
            <p className="text-gray-400 text-sm mt-1">{L.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Selector de rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {L.userType}
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
              <p className="text-xs text-gray-400 mt-2 text-center">
                {ROLES.find(r => r.value === rol)?.description}
              </p>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {L.email}
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
                  placeholder={L.emailPlaceholder}
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
                  {L.password}
                </label>
                <a href="#" className="text-xs text-primary-500 hover:text-primary-600 transition-colors">
                  {L.forgotPassword}
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
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-primary-500 hover:bg-primary-600 text-white border-none disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  {L.loading}
                </span>
              ) : L.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            {L.helpText}{' '}
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