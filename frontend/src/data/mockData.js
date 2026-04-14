export const usuarios = [
  { id: 1, nombre: 'María García',       email: 'maria@utn.edu.mx',      rol: 'alumno',  grupoId: 1 },
  { id: 2, nombre: 'Juan Pérez',         email: 'juan@utn.edu.mx',       rol: 'alumno',  grupoId: 1 },
  { id: 3, nombre: 'Ana López',          email: 'ana@utn.edu.mx',        rol: 'alumno',  grupoId: 2 },
  { id: 4, nombre: 'Carlos Ruiz',        email: 'carlos@utn.edu.mx',     rol: 'alumno',  grupoId: 2 },
  { id: 5, nombre: 'Laura Gómez',        email: 'laura@utn.edu.mx',      rol: 'alumno',  grupoId: 1 },
  { id: 6, nombre: 'Dr. López Martínez', email: 'lopez@utn.edu.mx',      rol: 'maestro', grupoId: null },
  { id: 7, nombre: 'Mtra. Sánchez',      email: 'sanchez@utn.edu.mx',    rol: 'maestro', grupoId: null },
  { id: 8, nombre: 'Director Ruiz',      email: 'direccion@utn.edu.mx',  rol: 'admin',   grupoId: null },
]

export const grupos = [
  { id: 1, nombre: 'IDGS-81', maestroId: 6, alumnos: [1, 2, 5] },
  { id: 2, nombre: 'IDGS-82', maestroId: 7, alumnos: [3, 4] },
  { id: 3, nombre: 'IDGS-83', maestroId: null, alumnos: [] },
]

export const alumnos = [
  { id: 1, nombre: 'María García', matricula: '12345', promedio: 68, semaforo: 'rojo',     grupoId: 1, ultimaTutoria: '2026-03-10' },
  { id: 2, nombre: 'Juan Pérez',   matricula: '12346', promedio: 75, semaforo: 'amarillo', grupoId: 1, ultimaTutoria: '2026-03-05' },
  { id: 3, nombre: 'Ana López',    matricula: '12347', promedio: 92, semaforo: 'verde',    grupoId: 2, ultimaTutoria: '2026-03-12' },
  { id: 4, nombre: 'Carlos Ruiz',  matricula: '12348', promedio: 55, semaforo: 'rojo',     grupoId: 2, ultimaTutoria: '2026-02-28' },
  { id: 5, nombre: 'Laura Gómez',  matricula: '12349', promedio: 82, semaforo: 'verde',    grupoId: 1, ultimaTutoria: '2026-03-08' },
]

export const citas = [
  { id: 1, alumnoId: 1, maestroId: 6, fecha: '2026-04-05', hora: '10:00', motivo: 'Seguimiento académico',   estado: 'pendiente' },
  { id: 2, alumnoId: 2, maestroId: 6, fecha: '2026-04-06', hora: '11:00', motivo: 'Revisión de compromisos', estado: 'pendiente' },
  { id: 3, alumnoId: 5, maestroId: 6, fecha: '2026-04-07', hora: '09:00', motivo: 'Alerta de promedio',      estado: 'pendiente' },
]

export const tutorias = [
  { id: 1, alumnoId: 1, maestroId: 6, fecha: '2026-03-10', tipo: 'individual', compromisos: 'Entregar tarea pendiente',    observaciones: 'Alumno en riesgo de reprobación', promedio: 68 },
  { id: 2, alumnoId: 2, maestroId: 6, fecha: '2026-03-05', tipo: 'grupal',     compromisos: 'Asistir a asesoría',          observaciones: 'Mejoró su asistencia',            promedio: 75 },
  { id: 3, alumnoId: 3, maestroId: 7, fecha: '2026-03-12', tipo: 'individual', compromisos: 'Mantener promedio',           observaciones: 'Alumno estable, buen desempeño',  promedio: 92 },
  { id: 4, alumnoId: 1, maestroId: 6, fecha: '2026-02-20', tipo: 'individual', compromisos: 'Entregar proyectos atrasados', observaciones: 'Faltó a clases la semana pasada', promedio: 65 },
]