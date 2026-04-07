import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'

const BACKUPS_MOCK = [
  { id: 1, nombre: 'backup_2026_03_01.sql',       fecha: '2026-03-01', hora: '02:00', tamaño: '2.4 MB', tipo: 'automatico', estado: 'completado' },
  { id: 2, nombre: 'backup_2026_03_15.sql',       fecha: '2026-03-15', hora: '02:00', tamaño: '2.6 MB', tipo: 'automatico', estado: 'completado' },
  { id: 3, nombre: 'backup_manual_2026_03_20.sql', fecha: '2026-03-20', hora: '10:34', tamaño: '2.7 MB', tipo: 'manual',     estado: 'completado' },
  { id: 4, nombre: 'backup_2026_04_01.sql',       fecha: '2026-04-01', hora: '02:00', tamaño: '2.9 MB', tipo: 'automatico', estado: 'completado' },
]

const GestionBackup = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [backups, setBackups]     = useState(BACKUPS_MOCK)
  const [generando, setGenerando] = useState(false)
  const [exitoso, setExitoso]     = useState(false)
  const [config, setConfig]       = useState({
    frecuencia: 'diario',
    hora: '02:00',
    retener: '30',
    activo: true,
  })

  const generarBackupManual = async () => {
    setGenerando(true)
    await new Promise(r => setTimeout(r, 2000))
    const nuevo = {
      id: Date.now(),
      nombre: `backup_manual_${new Date().toISOString().split('T')[0]}.sql`,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tamaño: '3.0 MB',
      tipo: 'manual',
      estado: 'completado',
    }
    setBackups([nuevo, ...backups])
    setGenerando(false)
    setExitoso(true)
    setTimeout(() => setExitoso(false), 3000)
  }

  const eliminarBackup = (id) => setBackups(backups.filter(b => b.id !== id))

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-5xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/admin')} className="btn btn-sm btn-outline">
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Backup</h1>
            <p className="text-gray-500 mt-1">Respaldos manuales y automáticos de la base de datos</p>
          </div>
        </div>

        {exitoso && (
          <div role="alert" className="alert alert-success mb-6">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Backup generado exitosamente</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Backup manual */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title">Backup manual</h2>
              <p className="text-gray-500 text-sm">Genera un respaldo inmediato de toda la base de datos</p>
              <div className="mt-4 p-4 bg-base-200 rounded-lg space-y-1">
                <p className="text-xs text-gray-500">Último backup manual:</p>
                <p className="text-sm font-medium text-gray-800">
                  {backups.find(b => b.tipo === 'manual')?.fecha || 'Sin backups manuales'}
                </p>
              </div>
              <div className="card-actions mt-4">
                <button
                  onClick={generarBackupManual}
                  disabled={generando}
                  className="btn bg-primary-500 hover:bg-primary-600 text-white border-none w-full disabled:opacity-70"
                >
                  {generando ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm" />
                      Generando backup...
                    </span>
                  ) : 'Generar backup ahora'}
                </button>
              </div>
            </div>
          </div>

          {/* Backup automático */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Backup automático</h2>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={config.activo}
                  onChange={e => setConfig({ ...config, activo: e.target.checked })}
                />
              </div>
              <p className="text-gray-500 text-sm">Configura respaldos programados</p>
              <div className="space-y-3 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                  <select
                    className="select select-bordered select-sm w-full focus:border-primary-500 focus:outline-none"
                    value={config.frecuencia}
                    onChange={e => setConfig({ ...config, frecuencia: e.target.value })}
                    disabled={!config.activo}
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora de ejecución</label>
                  <input
                    type="time"
                    className="input input-bordered input-sm w-full focus:border-primary-500 focus:outline-none"
                    value={config.hora}
                    onChange={e => setConfig({ ...config, hora: e.target.value })}
                    disabled={!config.activo}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retener backups (días)</label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    className="input input-bordered input-sm w-full focus:border-primary-500 focus:outline-none"
                    value={config.retener}
                    onChange={e => setConfig({ ...config, retener: e.target.value })}
                    disabled={!config.activo}
                  />
                </div>
              </div>
              <div className="card-actions mt-4">
                <button className="btn btn-outline btn-primary btn-sm w-full">
                  Guardar configuración
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Historial */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-0">
            <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Historial de backups</h2>
              <span className="badge badge-ghost">{backups.length} respaldos</span>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Archivo</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tamaño</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map(b => (
                    <tr key={b.id} className="hover">
                      <td className="font-mono text-xs text-gray-600">{b.nombre}</td>
                      <td className="text-sm">{b.fecha}</td>
                      <td className="text-sm text-gray-500">{b.hora}</td>
                      <td className="text-sm">{b.tamaño}</td>
                      <td>
                        <span className={`badge badge-sm ${b.tipo === 'manual' ? 'badge-info' : 'badge-ghost'}`}>
                          {b.tipo}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success badge-sm">{b.estado}</span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-xs btn-outline btn-primary">
                            Descargar
                          </button>
                          <button
                            onClick={() => eliminarBackup(b.id)}
                            className="btn btn-xs btn-outline btn-error"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default GestionBackup