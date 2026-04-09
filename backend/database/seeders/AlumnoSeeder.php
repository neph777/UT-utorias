<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alumno;
use App\Models\Usuario;
use App\Models\Tutor;
use App\Models\SemaforoLog;

class AlumnoSeeder extends Seeder
{
    public function run(): void
    {
        $alumnosUsuarios = Usuario::where('rol', 'alumno')->get();
        $tutores = Tutor::all();
        
        // Datos de alumnos según sus matrículas
        $alumnosData = [
            'tic-310054' => [
                'carrera' => 'Ingeniería en TIC',
                'generacion' => 31,
                'cuatrimestre' => 9,
                'promedio' => 98.5,
                'telefono' => '3111234567'
            ],
        ];
        
        foreach ($alumnosUsuarios as $index => $alumnoUsuario) {
            // Extraer matrícula del email (formato: tic-310054@alumnos.utnay.edu.mx)
            $emailParts = explode('@', $alumnoUsuario->email);
            $matricula = $emailParts[0];
            
            // Buscar datos del alumno por matrícula
            $data = $alumnosData[$matricula] ?? [
                'carrera' => 'Ingeniería en TIC',
                'generacion' => 31,
                'cuatrimestre' => 9,
                'promedio' => 80.0,
                'telefono' => '3111234000'
            ];
            
            // Determinar última tutoría según el promedio
            $ultimaTutoria = null;
            if ($data['promedio'] < 70) {
                $ultimaTutoria = now()->subDays(70); // Rojo: mucho tiempo
            } elseif ($data['promedio'] < 80) {
                $ultimaTutoria = now()->subDays(40); // Amarillo: tiempo considerable
            } else {
                $ultimaTutoria = now()->subDays(10); // Verde: reciente
            }
            
            $alumno = Alumno::updateOrCreate(
                ['matricula' => $matricula],
                [
                    'usuario_id' => $alumnoUsuario->id,
                    'carrera' => $data['carrera'],
                    'cuatrimestre' => $data['cuatrimestre'],
                    'promedio_general' => $data['promedio'],
                    'telefono' => $data['telefono'],
                    'tutor_actual_id' => $tutores[$index % count($tutores)]->id,
                    'ultima_tutoria_fecha' => $ultimaTutoria
                ]
            );
            
            $alumno->actualizarSemaforo();
            
            $this->command->info("Alumno creado: {$matricula} - {$data['carrera']} - Semáforo: {$alumno->semaforo_color}");
        }
    }
}