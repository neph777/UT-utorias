<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsuarioSeeder::class,
            TutorSeeder::class,
            AlumnoSeeder::class,
            GrupoSeeder::class,
            TutoriaSeeder::class,
        ]);
        
        $this->command->info('Todos los seeders ejecutados correctamente');
        $this->command->info('Datos de prueba cargados:');
        $this->command->info('- Usuarios: admin, tutores, alumnos');
        $this->command->info('- Alumnos con diferentes promedios y semáforos');
        $this->command->info('- Grupos activos e inactivos (historial)');
        $this->command->info('- Tutorías según nivel de riesgo');
    }
}