<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        // Administrador principal
        Usuario::updateOrCreate(
            ['email' => 'lupita@utnay.edu.mx'],
            [
                'password' => Hash::make('admin123'),
                'rol' => 'admin',
                'nombre_completo' => 'Lupita Rodríguez',
                'activo' => true
            ]
        );

        // Tutores
        $tutores = [
            [
                'email' => 'juan.tovar@utnay.edu.mx', 
                'nombre' => 'Juan Manuel Tovar Sanchez'
            ],
            [
                'email' => 'silvia.castrejon@utnay.edu.mx', 
                'nombre' => 'Silvia Sofia Castrejón Zarate'
            ],
        ];

        foreach ($tutores as $tutor) {
            Usuario::updateOrCreate(
                ['email' => $tutor['email']],
                [
                    'password' => Hash::make('tutor123'),
                    'rol' => 'tutor',
                    'nombre_completo' => $tutor['nombre'],
                    'activo' => true
                ]
            );
        }

        // Alumnos
        $alumnos = [
            [
                'email' => 'tic-310054@alumnos.utnay.edu.mx', 
                'nombre' => 'Nephtis Adonahi Cañedo Segura'
            ],
        ];

        foreach ($alumnos as $alumno) {
            Usuario::updateOrCreate(
                ['email' => $alumno['email']],
                [
                    'password' => Hash::make('alumno123'),
                    'rol' => 'alumno',
                    'nombre_completo' => $alumno['nombre'],
                    'activo' => true
                ]
            );
        }
    }
}