<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Tutor; 
use App\Models\Tutoria;
use App\Models\Usuario;

class DashboardController extends Controller
{
    public function index()
    {
        $alumnos = Alumno::all();
        
        return response()->json([
            'total_alumnos' => $alumnos->count(),
            'total_tutores' => Tutor::count(),
            'total_tutorias' => Tutoria::count(),
            'semaforo' => [
                'rojo' => $alumnos->where('semaforo_color', 'rojo')->count(),
                'amarillo' => $alumnos->where('semaforo_color', 'amarillo')->count(),
                'verde' => $alumnos->where('semaforo_color', 'verde')->count(),
            ],
            'alumnos_por_generacion' => $alumnos->groupBy(function($alumno) {
                return substr($alumno->matricula, 4, 2);
            })->map->count()
        ]);
    }
}