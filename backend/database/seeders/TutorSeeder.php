<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tutor;
use App\Models\Usuario;

class TutorSeeder extends Seeder
{
    public function run(): void
    {
        $tutores = Usuario::where('rol', 'tutor')->get();
        
        $tutoresDatos = [
            ['numero_empleado' => 'EMP-001', 'departamento' => 'Ingeniería en Teconologías de la Información', 'especialidad' => 'Base de datos'],
            ['numero_empleado' => 'EMP-002', 'departamento' => 'Ingeniería en Tecnologías de la Información', 'especialidad' => 'Desarrollo web'],
        ];
        
        foreach ($tutores as $index => $tutor) {
            Tutor::create([
                'usuario_id' => $tutor->id,
                'numero_empleado' => $tutoresDatos[$index]['numero_empleado'],
                'departamento' => $tutoresDatos[$index]['departamento'],
                'especialidad' => $tutoresDatos[$index]['especialidad']
            ]);
        }
    }
}