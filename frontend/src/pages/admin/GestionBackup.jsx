import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { api } from '../../services/api'

const GestionBackup = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [backups, setBackups] = useState([])
  const [generando, setGenerando] = useState(false)
  const [exitoso, setExitoso] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({
    frecuencia: 'diario',
    hora: '02:00',
    retener: '30',
    activo: true,
  })

  useEffect(() => {
    cargarBackups()
    cargarConfiguracion()
  }, [])

  const cargarBackups = async () => {
    setLoading(true)
    try {
      const response = await api.getBackups()
      if (response.success) {
        setBackups(response.data || [])
      }
    } catch (error) {
      console.error('Error al cargar backups:', error)
      setError('Error al cargar el historial de backups')
    } finally {
      setLoading(false)
    }
  }

  const cargarConfiguracion = async () => {
    try {
      const response = await api.getBackupConfig()
      if (response.success && response.data) {
        setConfig(response.data)
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error)
    }
  }

  const generarBackupManual = async () => {
    setGenerando(true)
    setError('')
    
    try {
      const response = await api.crearBackup()
      
      if (response.success) {
        setExitoso(true)
        setTimeout(() => setExitoso(false), 3000)
        await cargarBackups() // Recargar la lista
      } else {
        setError(response.message || 'Error al generar el backup')
      }
    } catch (error) {
      console.error('Error al generar backup:', error)
      setError('Error al conectar con el servidor')
    } finally {
      setGenerando(false)
    }
  }

  const descargarBackup = async (id, nombre) => {
    try {
      const response = await api.descargarBackup(id)
      
      // Crear blob y descargar
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nombre
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al descargar backup:', error)
      setError('Error al descargar el backup')
    }
  }

  const eliminarBackup = async (id) => {
    if (!confirm('¿Eliminar este backup permanentemente?')) return
    
    try {
      const response = await api.eliminarBackup(id)
      
      if (response.success) {
        await cargarBackups()
      } else {
        setError(response.message || 'Error al eliminar el backup')
      }
    } catch (error) {
      console.error('Error al eliminar backup:', error)
      setError('Error al conectar con el servidor')
    }
  }

  const guardarConfiguracion = async () => {
    try {
      const response = await api.guardarBackupConfig(config)
      
      if (response.success) {
        alert('Configuración guardada exitosamente')
      } else {
        setError(response.message || 'Error al guardar configuración')
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error)
      setError('Error al conectar con el servidor')
    }
  }

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
          <div className="alert alert-success mb-6">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Backup generado exitosamente</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{error}</span>
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
                <button onClick={guardarConfiguracion} className="btn btn-outline btn-primary btn-sm w-full">
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
            {loading ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : (
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
                    {backups.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-gray-500">
                          No hay backups registrados
                        </td>
                      </tr>
                    ) : (
                      backups.map(b => (
                        <tr key={b.id} className="hover">
                          <td className="font-mono text-xs text-gray-600">{b.nombre}</td>
                          <td className="text-sm">{b.fecha}</td>
                          <td className="text-sm text-gray-500">{b.hora}</td>
                          <td className="text-sm">{b.tamaño || 'N/A'}</td>
                          <td>
                            <span className={`badge badge-sm ${b.tipo === 'manual' ? 'badge-info' : 'badge-ghost'}`}>
                              {b.tipo}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-sm ${b.estado === 'completado' ? 'badge-success' : 'badge-error'}`}>
                              {b.estado}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => descargarBackup(b.id, b.nombre)}
                                className="btn btn-xs btn-outline btn-primary"
                              >
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default GestionBackup