const DashboardAlumno = () => {
  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-700">Mi Panel</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Mi Promedio</div>
              <div className="stat-value text-primary">85</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Tutorías Recibidas</div>
              <div className="stat-value text-success">4</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Próxima Tutoría</div>
              <div className="stat-value text-warning text-2xl">25 Mar</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary-700">Mi Historial de Tutorías</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Compromisos</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10/03/2026</td>
                    <td>Individual</td>
                    <td>Entregar tarea de matemáticas</td>
                    <td><span className="badge badge-success">Cumplido</span></td>
                  </tr>
                  <tr>
                    <td>01/03/2026</td>
                    <td>Grupal</td>
                    <td>Asistir a asesoría</td>
                    <td><span className="badge badge-success">Cumplido</span></td>
                  </tr>
                  <tr>
                    <td>20/02/2026</td>
                    <td>Individual</td>
                    <td>Estudiar para examen parcial</td>
                    <td><span className="badge badge-warning">Pendiente</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAlumno