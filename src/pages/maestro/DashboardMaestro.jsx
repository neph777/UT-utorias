import { useState } from 'react'
import Layout from '../../components/layout/Layout'

const DashboardMaestro = ({ user, onLogout }) => {
  const [selectedGroup, setSelectedGroup] = useState('IDGS-81')
  const [showCitarModal, setShowCitarModal] = useState(false)
  const [showReporteModal, setShowReporteModal] = useState(false)
  const [showRegistroModal, setShowRegistroModal] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [selectedAlumnosReporte, setSelectedAlumnosReporte] = useState([])

  const grupos = [
    { id: 1, nombre: 'IDGS-81', alumnos: 24, tutoriasPendientes: 5 },
    { id: 2, nombre: 'IDGS-82', alumnos: 22, tutoriasPendientes: 3 },
    { id: 3, nombre: 'IDGS-83', alumnos: 26, tutoriasPendientes: 4 },
    { id: 4, nombre: 'IDGS-84', alumnos: 21, tutoriasPendientes: 2 },
  ]

  const alumnos = [
    { id: 1, nombre: 'María García', matricula: '12345', promedio: 68, semaforo: 'rojo', ultimaTutoria: '2026-03-10' },
    { id: 2, nombre: 'Juan Pérez', matricula: '12346', promedio: 75, semaforo: 'amarillo', ultimaTutoria: '2026-03-05' },
    { id: 3, nombre: 'Ana López', matricula: '12347', promedio: 92, semaforo: 'verde', ultimaTutoria: '2026-03-12' },
    { id: 4, nombre: 'Carlos Ruiz', matricula: '12348', promedio: 55, semaforo: 'rojo', ultimaTutoria: '2026-02-28' },
    { id: 5, nombre: 'Laura Gómez', matricula: '12349', promedio: 82, semaforo: 'verde', ultimaTutoria: '2026-03-08' },
  ]

  const [registroTutoria, setRegistroTutoria] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tipo: 'individual',
    compromisos: '',
    observaciones: ''
  })

  const getSemaforoColor = (color) => {
    const colors = {
      rojo: 'bg-red-500 text-white',
      amarillo: 'bg-yellow-500 text-black',
      verde: 'bg-green-500 text-white'
    }
    return colors[color] || 'bg-gray-500'
  }

  const getSemaforoTexto = (color) => {
    const textos = {
      rojo: 'Prioridad Alta',
      amarillo: 'Seguimiento Preventivo',
      verde: 'Estable'
    }
    return textos[color] || color
  }

  const generarReporteWord = () => {
    const alumnosSeleccionados = selectedAlumnosReporte.length > 0 
      ? alumnos.filter(a => selectedAlumnosReporte.includes(a.id))
      : alumnos

    const contenido = `
      UNIVERSIDAD TECNOLÓGICA DE NAYARIT
      SISTEMA DE TUTORÍAS
      
      REPORTE DE SEGUIMIENTO ACADÉMICO
      
      Grupo: ${selectedGroup}
      Fecha de generación: ${new Date().toLocaleDateString()}
      Tutor: ${user?.nombre}
      
      ================================================
      
      ESTADÍSTICAS GENERALES
      
      • Total de alumnos en el grupo: ${alumnos.length}
      • Alumnos reportados: ${alumnosSeleccionados.length}
      • Alumnos en prioridad alta (rojo): ${alumnosSeleccionados.filter(a => a.semaforo === 'rojo').length}
      • Alumnos en seguimiento (amarillo): ${alumnosSeleccionados.filter(a => a.semaforo === 'amarillo').length}
      • Alumnos estables (verde): ${alumnosSeleccionados.filter(a => a.semaforo === 'verde').length}
      
      ================================================
      
      LISTADO DE ALUMNOS
      
      ${alumnosSeleccionados.map(a => `
      ────────────────────────────────────────────────
      Alumno: ${a.nombre}
      Matrícula: ${a.matricula}
      Promedio: ${a.promedio}
      Nivel de atención: ${a.semaforo.toUpperCase()}
      Última tutoría: ${a.ultimaTutoria}
      ────────────────────────────────────────────────
      `).join('')}
      
      ================================================
      
      Este reporte fue generado automáticamente por el Sistema de Tutorías UTN.
      Para cualquier aclaración, contactar a la Coordinación Académica.
    `
    
    const blob = new Blob([contenido], { type: 'application/msword' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Reporte_Tutorias_${selectedGroup}_${new Date().toISOString().split('T')[0]}.doc`
    link.click()
    URL.revokeObjectURL(link.href)
    
    setShowReporteModal(false)
    setSelectedAlumnosReporte([])
  }

  const registrarTutoria = () => {
    alert(`Tutoría registrada para ${selectedAlumno?.nombre}\n\n Fecha: ${registroTutoria.fecha}\n Hora: ${registroTutoria.hora}\n Tipo: ${registroTutoria.tipo === 'individual' ? 'Individual' : 'Grupal'}\n Compromisos: ${registroTutoria.compromisos || 'No especificados'}\n Observaciones: ${registroTutoria.observaciones || 'No especificadas'}`)
    setShowRegistroModal(false)
    setSelectedAlumno(null)
    setRegistroTutoria({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: 'individual',
      compromisos: '',
      observaciones: ''
    })
  }

  const citarAlumnos = () => {
    alert(`Se han enviado citatorios a los alumnos seleccionados.`)
    setShowCitarModal(false)
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mis Tutorías</h1>
            <p className="text-gray-500 mt-1">Gestiona el seguimiento académico de tus alumnos</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCitarModal(true)}
              className="btn bg-primary-500 hover:bg-primary-600 text-white border-none"
            >
              Citar Alumnos
            </button>
            <button 
              onClick={() => setShowReporteModal(true)}
              className="btn bg-primary-500 hover:bg-primary-600 text-white border-none"
            >
              Generar Reporte
            </button>
          </div>
        </div>

        {/* Tarjetas de resumen con borde lateral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white shadow-md border-l-4 border-primary-500">
            <div className="card-body p-6">
              <div className="stat">
                <div className="stat-title text-gray-500">Total Alumnos</div>
                <div className="stat-value text-primary-500">{alumnos.length}</div>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-md border-l-4 border-yellow-500">
            <div className="card-body p-6">
              <div className="stat">
                <div className="stat-title text-gray-500">Tutorías Pendientes</div>
                <div className="stat-value text-yellow-500">{grupos.find(g => g.nombre === selectedGroup)?.tutoriasPendientes || 0}</div>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-md border-l-4 border-green-500">
            <div className="card-body p-6">
              <div className="stat">
                <div className="stat-title text-gray-500">Tutorías Realizadas</div>
                <div className="stat-value text-green-500">34</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de grupos */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {grupos.map(grupo => (
            <button
              key={grupo.id}
              onClick={() => setSelectedGroup(grupo.nombre)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedGroup === grupo.nombre
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {grupo.nombre}
              <span className="ml-2 text-xs opacity-80">({grupo.alumnos})</span>
            </button>
          ))}
        </div>

        {/* Tabla de alumnos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Matrícula</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Promedio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nivel de Atención</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Última Tutoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alumnos.map(alumno => (
                  <tr key={alumno.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{alumno.matricula}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{alumno.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{alumno.promedio}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSemaforoColor(alumno.semaforo)}`}>
                        {getSemaforoTexto(alumno.semaforo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{alumno.ultimaTutoria}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          setSelectedAlumno(alumno)
                          setShowRegistroModal(true)
                        }}
                        className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                      >
                        Registrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para citar alumnos */}
      {showCitarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Citar Alumnos a Tutoría</h2>
              <button onClick={() => setShowCitarModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">Selecciona los alumnos que deseas citar</p>
            <div className="space-y-2 max-h-96 overflow-y-auto border-t border-gray-100 pt-3">
              {alumnos.map(alumno => (
                <label key={alumno.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">{alumno.nombre}</span>
                    <span className="text-xs text-gray-400 ml-2">{alumno.matricula}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSemaforoColor(alumno.semaforo)}`}>
                    {alumno.semaforo === 'rojo'}
                    {alumno.semaforo === 'amarillo'}
                    {alumno.semaforo === 'verde'}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={citarAlumnos} className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Enviar Citatorios
              </button>
              <button onClick={() => setShowCitarModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para generar reporte */}
      {showReporteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Generar Reporte</h2>
              <button onClick={() => setShowReporteModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                X
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label text-sm font-medium text-gray-700 mb-1 block">Grupo</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  value={selectedGroup} 
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  {grupos.map(g => <option key={g.id}>{g.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-sm font-medium text-gray-700 mb-1 block">Seleccionar alumnos (opcional)</label>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto p-2">
                  {alumnos.map(alumno => (
                    <label key={alumno.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={selectedAlumnosReporte.includes(alumno.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAlumnosReporte([...selectedAlumnosReporte, alumno.id])
                          } else {
                            setSelectedAlumnosReporte(selectedAlumnosReporte.filter(id => id !== alumno.id))
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{alumno.nombre}</span>
                      <span className="text-xs text-gray-400 ml-auto">{alumno.matricula}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Deja vacío para incluir a todos los alumnos</p>
              </div>
              <div>
                <label className="label text-sm font-medium text-gray-700 mb-1 block">Formato</label>
                <select className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
                  <option>Microsoft Word (.doc)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={generarReporteWord} className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Descargar Reporte
              </button>
              <button onClick={() => setShowReporteModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para registrar tutoría */}
      {showRegistroModal && selectedAlumno && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Registrar Tutoría</h2>
              <button onClick={() => setShowRegistroModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                X
              </button>
            </div>
            
            <div className="bg-primary-50 p-3 rounded-lg mb-4">
              <p className="font-medium text-primary-700">{selectedAlumno.nombre}</p>
              <p className="text-sm text-primary-600">Matrícula: {selectedAlumno.matricula}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha</label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    value={registroTutoria.fecha}
                    onChange={(e) => setRegistroTutoria({...registroTutoria, fecha: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Hora</label>
                  <input 
                    type="time" 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    value={registroTutoria.hora}
                    onChange={(e) => setRegistroTutoria({...registroTutoria, hora: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de Tutoría</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  value={registroTutoria.tipo}
                  onChange={(e) => setRegistroTutoria({...registroTutoria, tipo: e.target.value})}
                >
                  <option value="individual">Individual</option>
                  <option value="grupal">Grupal</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Compromisos del Alumno</label>
                <textarea 
                  rows="2"
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="Ej: Entregar tarea pendiente, asistir a asesoría..."
                  value={registroTutoria.compromisos}
                  onChange={(e) => setRegistroTutoria({...registroTutoria, compromisos: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Observaciones del Tutor</label>
                <textarea 
                  rows="2"
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="Aspectos relevantes de la sesión..."
                  value={registroTutoria.observaciones}
                  onChange={(e) => setRegistroTutoria({...registroTutoria, observaciones: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={registrarTutoria} className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Guardar Registro
              </button>
              <button onClick={() => setShowRegistroModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default DashboardMaestro