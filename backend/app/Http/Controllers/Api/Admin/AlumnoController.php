<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Tutoria;

class AlumnoController extends Controller
{
    public function expediente($id)
    {
        $alumno = Alumno::with('usuario', 'tutor.usuario', 'grupos')->findOrFail($id);
        
        $historial = Tutoria::where('alumno_id', $id)
            ->with('tutor.usuario')
            ->orderBy('fecha', 'desc')
            ->get();
        
        return response()->json([
            'alumno' => [
                'id' => $alumno->id,
                'nombre' => $alumno->usuario->nombre_completo,
                'matricula' => $alumno->matricula,
                'carrera' => $alumno->carrera,
                'cuatrimestre' => $alumno->cuatrimestre,
                'promedio' => $alumno->promedio_general,
                'semaforo_color' => $alumno->semaforo_color,
                'semaforo_razon' => $alumno->semaforo_razon,
                'ultima_tutoria' => $alumno->ultima_tutoria_fecha,
                'grupos' => $alumno->grupos,
                'tutor' => $alumno->tutor ? [
                    'nombre' => $alumno->tutor->usuario->nombre_completo,
                    'numero_empleado' => $alumno->tutor->numero_empleado,
                    'especialidad' => $alumno->tutor->especialidad
                ] : null
            ],
            'historial' => $historial->map(function($tutoria) {
                return [
                    'id' => $tutoria->id,
                    'fecha' => $tutoria->fecha->format('Y-m-d'),
                    'tema' => $tutoria->tema,
                    'compromiso' => $tutoria->compromiso,
                    'observaciones' => $tutoria->observaciones,
                    'tutor' => $tutoria->tutor->usuario->nombre_completo
                ];
            })
        ]);
    }
}