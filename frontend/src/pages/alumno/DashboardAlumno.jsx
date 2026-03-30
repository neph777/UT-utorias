import Layout from '../../components/layout/Layout'

const DashboardAlumno = ({ user, onLogout }) => {
  const tutorías = [
    { fecha: '10/03/2026', tipo: 'Individual', compromisos: 'Entregar tarea de matemáticas', estado: 'cumplido' },
    { fecha: '01/03/2026', tipo: 'Grupal', compromisos: 'Asistir a asesoría', estado: 'cumplido' },
    { fecha: '20/02/2026', tipo: 'Individual', compromisos: 'Estudiar para examen parcial', estado: 'pendiente' },
  ]

  const estadoBadge = (estado) =>
    estado === 'cumplido'
      ? 'bg-green-100 text-green-700 border border-green-200'
      : 'bg-yellow-100 text-yellow-700 border border-yellow-200'

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {user?.nombre?.split(' ')[0] || 'Alumno'}
          </h1>
          <p className="text-gray-500 mt-1">Aquí puedes consultar tu historial y próximas tutorías</p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white shadow-sm border-l-4 border-primary-500">
            <div className="card-body p-6">
              <p className="text-sm text-gray-500 mb-1">Mi Promedio</p>
              <p className="text-4xl font-bold text-primary-500">85</p>
              <p className="text-xs text-gray-400 mt-1">Ciclo actual</p>
            </div>
          </div>
          <div className="card bg-white shadow-sm border-l-4 border-green-500">
            <div className="card-body p-6">
              <p className="text-sm text-gray-500 mb-1">Tutorías Recibidas</p>
              <p className="text-4xl font-bold text-green-500">4</p>
              <p className="text-xs text-gray-400 mt-1">Este semestre</p>
            </div>
          </div>
          <div className="card bg-white shadow-sm border-l-4 border-yellow-500">
            <div className="card-body p-6">
              <p className="text-sm text-gray-500 mb-1">Próxima Tutoría</p>
              <p className="text-3xl font-bold text-yellow-500">25 Mar</p>
              <p className="text-xs text-gray-400 mt-1">10:00 AM — Individual</p>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Historial de Tutorías</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Compromisos</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tutorías.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{t.fecha}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.compromisos}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge(t.estado)}`}>
                        {t.estado === 'cumplido' ? 'Cumplido' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardAlumno