import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { alumnos, tutorias } from '../../data/mockData'

const RegistrarTutoria = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()
  const alumno = alumnos.find(a => a.id === Number(alumnoId))
  const historial = tutorias.filter(t => t.alumnoId === Number(alumnoId))

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tipo: 'individual',
    promedio: alumno?.promedio || '',
    compromisos: '',
    observaciones: ''
  })
  const [guardado, setGuardado] = useState(false)

  if (!alumno) return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 text-center text-gray-500">Alumno no encontrado</div>
    </Layout>
  )

  const handleGuardar = () => {
    if (!form.compromisos || !form.observaciones) return
    setGuardado(true)
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/tutor')} className="btn btn-sm btn-outline">
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Registrar Tutoría</h1>
            <p className="text-gray-500 mt-1">Documenta la sesión de tutoría del alumno</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Formulario */}
          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">

                {/* Info alumno */}
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold shrink-0">
                    {alumno.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-primary-700">{alumno.nombre}</p>
                    <p className="text-sm text-primary-600">Matrícula: {alumno.matricula}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-primary-400">Promedio actual</p>
                    <p className="text-xl font-bold text-primary-600">{alumno.promedio}</p>
                  </div>
                </div>

                {guardado ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Tutoría registrada</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      La sesión quedó guardada en el expediente de {alumno.nombre}
                    </p>
                    <div className="flex gap-3 mt-6 justify-center">
                      <button onClick={() => setGuardado(false)} className="btn btn-outline btn-sm">
                        Registrar otra
                      </button>
                      <button
                        onClick={() => navigate('/tutor')}
                        className="btn btn-sm bg-primary-500 hover:bg-primary-600 text-white border-none"
                      >
                        Volver al dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                          type="date"
                          className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                          value={form.fecha}
                          onChange={e => setForm({ ...form, fecha: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                        <input
                          type="time"
                          className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                          value={form.hora}
                          onChange={e => setForm({ ...form, hora: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de tutoría</label>
                        <select
                          className="select select-bordered w-full focus:border-primary-500 focus:outline-none"
                          value={form.tipo}
                          onChange={e => setForm({ ...form, tipo: e.target.value })}
                        >
                          <option value="individual">Individual</option>
                          <option value="grupal">Grupal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promedio en esta sesión</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                          value={form.promedio}
                          onChange={e => setForm({ ...form, promedio: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compromisos del alumno <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows="2"
                        className="textarea textarea-bordered w-full focus:border-primary-500 focus:outline-none"
                        placeholder="Ej: Entregar tarea pendiente, asistir a asesoría..."
                        value={form.compromisos}
                        onChange={e => setForm({ ...form, compromisos: e.target.value })}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones del tutor <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows="2"
                        className="textarea textarea-bordered w-full focus:border-primary-500 focus:outline-none"
                        placeholder="Aspectos relevantes de la sesión..."
                        value={form.observaciones}
                        onChange={e => setForm({ ...form, observaciones: e.target.value })}
                      />
                    </div>

                    {(!form.compromisos || !form.observaciones) && (
                      <p className="text-xs text-red-400 mt-2">
                        Los campos marcados con * son obligatorios
                      </p>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleGuardar}
                        disabled={!form.compromisos || !form.observaciones}
                        className="btn bg-primary-500 hover:bg-primary-600 text-white border-none flex-1 disabled:opacity-50"
                      >
                        Guardar registro
                      </button>
                      <button onClick={() => navigate('/tutor')} className="btn btn-outline flex-1">
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Historial lateral */}
          <div className="card bg-base-100 shadow-sm border border-base-200 h-fit">
            <div className="card-body p-0">
              <div className="px-4 py-3 border-b border-base-200">
                <h3 className="font-semibold text-gray-800 text-sm">Historial de tutorías</h3>
                <p className="text-xs text-gray-400 mt-0.5">{historial.length} sesiones previas</p>
              </div>
              {historial.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">Sin tutorías previas</p>
              ) : (
                <div className="divide-y divide-base-200">
                  {historial.map(t => (
                    <div key={t.id} className="px-4 py-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-mono text-gray-500">{t.fecha}</p>
                        <span className="badge badge-ghost badge-xs">{t.tipo}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-700">Promedio: {t.promedio}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t.compromisos}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default RegistrarTutoria