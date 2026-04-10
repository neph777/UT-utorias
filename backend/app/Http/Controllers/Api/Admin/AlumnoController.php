<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Tutoria;
use Illuminate\Http\Request;

class AlumnoController extends Controller
{
    public function expediente($id)
    {
        // 
        $alumno = Alumno::where('id', $id)
            ->orWhere('usuario_id', $id)
            ->with('usuario', 'tutor.usuario', 'grupos')
            ->firstOrFail();
        
        $historial = Tutoria::where('alumno_id', $alumno->id)
            ->with('tutor.usuario')
            ->orderBy('fecha', 'desc')
            ->get();
        
        return response()->json([
            'alumno' => [
                'id' => $alumno->id,
                'usuario_id' => $alumno->usuario_id,
                'nombre' => $alumno->usuario->nombre_completo,
                'nombre_completo' => $alumno->usuario->nombre_completo,
                'email' => $alumno->usuario->email,
                'matricula' => $alumno->matricula,
                'carrera' => $alumno->carrera,
                'cuatrimestre' => $alumno->cuatrimestre,
                'promedio' => $alumno->promedio_general,
                'promedio_general' => $alumno->promedio_general,
                'semaforo_color' => $alumno->semaforo_color,
                'semaforo' => $alumno->semaforo_color,
                'semaforo_razon' => $alumno->semaforo_razon,
                'ultima_tutoria_fecha' => $alumno->ultima_tutoria_fecha,
                'ultima_tutoria' => $alumno->ultima_tutoria_fecha,
                'grupos' => $alumno->grupos,
                'tutor' => $alumno->tutor ? [
                    'nombre' => $alumno->tutor->usuario->nombre_completo,
                    'nombre_completo' => $alumno->tutor->usuario->nombre_completo,
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

    public function update(Request $request, $id)
    {
        $alumno = Alumno::where('id', $id)->orWhere('usuario_id', $id)->firstOrFail();
        
        $alumno->promedio_general = $request->promedio ?? $alumno->promedio_general;
        $alumno->semaforo_color = $request->semaforo_color ?? $alumno->semaforo_color;
        $alumno->semaforo_razon = $request->semaforo_razon ?? $alumno->semaforo_razon;
        $alumno->semaforo_observacion = $request->observaciones ?? $alumno->semaforo_observacion;
        $alumno->semaforo_manual = true;
        $alumno->save();
        
        return response()->json(['message' => 'Expediente actualizado correctamente', 'alumno' => $alumno]);
    }
}