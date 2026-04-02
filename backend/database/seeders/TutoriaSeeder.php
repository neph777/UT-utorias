<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tutoria;
use App\Models\Alumno;
use App\Models\Tutor;

class TutoriaSeeder extends Seeder
{
    public function run(): void
    {
        $alumnos = Alumno::all();
        $tutores = Tutor::all();
        
        foreach ($alumnos as $alumno) {
            // Registrar tutorías según el semáforo del alumno
            $tutor = $tutores->first();
            
            if ($alumno->semaforo_color === 'rojo') {
                // Alumnos en rojo: más tutorías registradas
                Tutoria::create([
                    'alumno_id' => $alumno->id,
                    'tutor_id' => $tutor->id,
                    'fecha' => now()->subDays(30),
                    'tema' => 'Seguimiento académico urgente',
                    'compromiso' => 'Mejorar calificaciones y asistencia',
                    'observaciones' => 'Alumno con bajo rendimiento, se requiere seguimiento semanal',
                    'estado' => 'completada'
                ]);
                
                Tutoria::create([
                    'alumno_id' => $alumno->id,
                    'tutor_id' => $tutor->id,
                    'fecha' => now()->subDays(15),
                    'tema' => 'Revisión de avances',
                    'compromiso' => 'Entregar tareas pendientes',
                    'observaciones' => 'Muestra mejoría pero aún requiere atención',
                    'estado' => 'completada'
                ]);
            } elseif ($alumno->semaforo_color === 'amarillo') {
                // Alumnos en amarillo: tutoría reciente
                Tutoria::create([
                    'alumno_id' => $alumno->id,
                    'tutor_id' => $tutor->id,
                    'fecha' => now()->subDays(20),
                    'tema' => 'Seguimiento académico',
                    'compromiso' => 'Estudiar 2 horas diarias',
                    'observaciones' => 'Alumno con rendimiento aceptable pero puede mejorar',
                    'estado' => 'completada'
                ]);
            } else {
                // Alumnos en verde: tutoría reciente y positiva
                Tutoria::create([
                    'alumno_id' => $alumno->id,
                    'tutor_id' => $tutor->id,
                    'fecha' => now()->subDays(10),
                    'tema' => 'Revisión de calificaciones',
                    'compromiso' => 'Mantener promedio',
                    'observaciones' => 'Alumno con excelente rendimiento',
                    'estado' => 'completada'
                ]);
            }
        }
        
        $this->command->info("Tutorías creadas para todos los alumnos");
    }
}