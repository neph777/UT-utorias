<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Grupo;
use App\Models\Alumno;
use App\Models\Tutor;

class GrupoSeeder extends Seeder
{
    public function run(): void
    {
        // Grupos por generación y cuatrimestre
        $grupos = [
            // Generación 31 - 9no cuatrimestre (activo)
            [
                'clave' => 'TIC-9A',
                'cuatrimestre' => 9,
                'turno' => 'matutino',
                'activo' => true,
                'carrera' => 'TIC',
                'generacion' => 31
            ],
            [
                'clave' => 'TIC-9B',
                'cuatrimestre' => 9,
                'turno' => 'vespertino',
                'activo' => true,
                'carrera' => 'TIC',
                'generacion' => 31
            ],
            // Generación 30 - 11vo cuatrimestre (activo)
            [
                'clave' => 'IND-11A',
                'cuatrimestre' => 11,
                'turno' => 'matutino',
                'activo' => true,
                'carrera' => 'Industrial',
                'generacion' => 30
            ],
            // Generación 32 - 5to cuatrimestre (activo)
            [
                'clave' => 'MEC-5A',
                'cuatrimestre' => 5,
                'turno' => 'matutino',
                'activo' => true,
                'carrera' => 'Mecatrónica',
                'generacion' => 32
            ],
            // Grupo histórico (inactivo) 
            [
                'clave' => 'TIC-7A',
                'cuatrimestre' => 7,
                'turno' => 'matutino',
                'activo' => false,
                'carrera' => 'TIC',
                'generacion' => 30
            ],
        ];
        
        foreach ($grupos as $grupo) {
            Grupo::create([
                'clave' => $grupo['clave'],
                'cuatrimestre' => $grupo['cuatrimestre'],
                'turno' => $grupo['turno'],
                'activo' => $grupo['activo']
            ]);
        }
        
        // Asignar alumnos a grupos según su matrícula y cuatrimestre
        $alumnos = Alumno::all();
        $gruposActivos = Grupo::where('activo', true)->get();
        
        foreach ($alumnos as $alumno) {
            $carreraMatricula = explode('-', $alumno->matricula)[0];
            
            $grupo = $gruposActivos->first(function ($g) use ($alumno, $carreraMatricula) {
                $grupoCarrera = explode('-', $g->clave)[0];
                return $grupoCarrera === strtoupper($carreraMatricula) 
                    && $g->cuatrimestre == $alumno->cuatrimestre;
            });
            
            if ($grupo) {
                $grupo->alumnos()->attach($alumno->id);
                $this->command->info("Alumno {$alumno->matricula} asignado a grupo {$grupo->clave}");
            } else {
                $this->command->warn("No se encontró grupo para {$alumno->matricula} (Carrera: {$carreraMatricula}, Cuatrimestre: {$alumno->cuatrimestre})");
            }
        }
        
        // Asignar tutores a grupos
        $tutores = Tutor::all();
        $gruposTIC = Grupo::where('clave', 'LIKE', 'TIC-%')->where('activo', true)->get();
        $gruposMEC = Grupo::where('clave', 'LIKE', 'MEC-%')->where('activo', true)->get();
        
        foreach ($gruposTIC as $grupo) {
            $grupo->tutores()->attach($tutores[0]->id); 
        
        foreach ($gruposMEC as $grupo) {
            if (isset($tutores[1])) {
                $grupo->tutores()->attach($tutores[1]->id);
            }
        }
        
        foreach ($gruposIND as $grupo) {
            if (isset($tutores[0])) {
                $grupo->tutores()->attach($tutores[0]->id);
            }
        }
        
        $this->command->info("Grupos creados y asignaciones completadas");
    }
}