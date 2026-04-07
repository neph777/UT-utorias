import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { alumnos } from '../../data/mockData'

const GenerarCita = ({ user, onLogout }) => {
  const { alumnoId } = useParams()
  const navigate = useNavigate()
  const alumno = alumnos.find(a => a.id === Number(alumnoId))

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: '10:00',
    motivo: '',
    observaciones: ''
  })
  const [enviado, setEnviado] = useState(false)

  const semaforoEstilo = {
    rojo:     'badge-error',
    amarillo: 'badge-warning',
    verde:    'badge-success',
  }

  if (!alumno) return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 text-center text-gray-500">Alumno no encontrado</div>
    </Layout>
  )

  const handleGuardar = () => {
    if (!form.motivo) return
    setEnviado(true)
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-2xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/tutor')} className="btn btn-sm btn-outline">
            ← Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Generar Cita</h1>
            <p className="text-gray-500 mt-1">Agenda una cita de tutoría con el alumno</p>
          </div>
        </div>

        {enviado ? (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body items-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Cita agendada correctamente</h2>
              <p className="text-gray-500 mt-1">
                Se notificará a <span className="font-medium">{alumno.nombre}</span>
              </p>
              <div className="mt-4 bg-base-200 rounded-lg p-4 text-left w-full max-w-sm space-y-1">
                <p className="text-sm text-gray-600"><span className="font-medium">Alumno:</span> {alumno.nombre}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Fecha:</span> {form.fecha}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Hora:</span> {form.hora}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Motivo:</span> {form.motivo}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEnviado(false)} className="btn btn-outline">
                  Nueva cita
                </button>
                <button
                  onClick={() => navigate('/tutor')}
                  className="btn bg-primary-500 hover:bg-primary-600 text-white border-none"
                >
                  Volver al dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">

              {/* Info del alumno */}
              <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {alumno.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{alumno.nombre}</p>
                  <p className="text-sm text-gray-500">Matrícula: {alumno.matricula}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Promedio</p>
                  <p className="text-2xl font-bold text-primary-500">{alumno.promedio}</p>
                </div>
                <span className={`badge ${semaforoEstilo[alumno.semaforo]}`}>
                  {alumno.semaforo}
                </span>
              </div>

              {/* Formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de la cita <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-primary-500 focus:outline-none"
                  placeholder="Ej: Seguimiento académico, revisión de compromisos..."
                  value={form.motivo}
                  onChange={e => setForm({ ...form, motivo: e.target.value })}
                />
                {!form.motivo && (
                  <p className="text-xs text-red-400 mt-1">El motivo es obligatorio</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones adicionales
                </label>
                <textarea
                  rows="3"
                  className="textarea textarea-bordered w-full focus:border-primary-500 focus:outline-none"
                  placeholder="Información relevante para la cita..."
                  value={form.observaciones}
                  onChange={e => setForm({ ...form, observaciones: e.target.value })}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGuardar}
                  disabled={!form.motivo}
                  className="btn bg-primary-500 hover:bg-primary-600 text-white border-none flex-1 disabled:opacity-50"
                >
                  Agendar cita
                </button>
                <button onClick={() => navigate('/tutor')} className="btn btn-outline flex-1">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default GenerarCita