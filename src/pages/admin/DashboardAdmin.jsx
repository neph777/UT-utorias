const DashboardAdmin = () => {
  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">Panel de Control</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Total Alumnos</div>
              <div className="stat-value text-primary">180</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Tutores Activos</div>
              <div className="stat-value text-primary">12</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Tutorías Realizadas</div>
              <div className="stat-value text-success">156</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Alumnos en Rojo</div>
              <div className="stat-value text-error">8</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-primary-700">Estado General de Alumnos</h2>
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span> Rojo (Urgente)</span>
                  <span>8</span>
                </div>
                <progress className="progress progress-error w-full" value="8" max="180"></progress>
                <div className="flex justify-between mt-3 mb-1">
                  <span> Amarillo (Seguimiento)</span>
                  <span>24</span>
                </div>
                <progress className="progress progress-warning w-full" value="24" max="180"></progress>
                <div className="flex justify-between mt-3 mb-1">
                  <span> Verde (Estable)</span>
                  <span>148</span>
                </div>
                <progress className="progress progress-success w-full" value="148" max="180"></progress>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-primary-700">Acciones Rápidas</h2>
              <div className="flex flex-col gap-3 mt-2">
                <button className="btn btn-outline btn-primary">Generar Reporte General</button>
                <button className="btn btn-outline btn-primary">Gestionar Grupos</button>
                <button className="btn btn-outline btn-primary">Asignar Tutores</button>
                <button className="btn btn-outline btn-primary">Ver Estadísticas por Grupo</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin