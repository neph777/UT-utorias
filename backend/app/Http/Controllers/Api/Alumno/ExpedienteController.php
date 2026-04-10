<?php

namespace App\Http\Controllers\Api\Alumno;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Tutoria;
use Illuminate\Http\Request;

class ExpedienteController extends Controller
{
    public function show()
    {
        try {
            $user = auth()->user();
            
            // Buscar el alumno por usuario_id
            $alumno = Alumno::where('usuario_id', $user->id)
                ->with('usuario', 'grupos')
                ->first();
            
            if (!$alumno) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró el perfil de alumno'
                ], 404);
            }
            
            // Obtener historial de tutorías del alumno
            $historial = Tutoria::where('alumno_id', $alumno->id)
                ->with('tutor.usuario')
                ->orderBy('fecha', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'alumno' => [
                    'id' => $alumno->id,
                    'nombre_completo' => $alumno->usuario->nombre_completo,
                    'email' => $alumno->usuario->email,
                    'matricula' => $alumno->matricula,
                    'carrera' => $alumno->carrera,
                    'cuatrimestre' => $alumno->cuatrimestre,
                    'promedio' => $alumno->promedio_general,
                    'semaforo_color' => $alumno->semaforo_color,
                    'ultima_tutoria_fecha' => $alumno->ultima_tutoria_fecha,
                    'grupo' => $alumno->grupos->first()
                ],
                'historial' => $historial->map(function($tutoria) {
                    return [
                        'id' => $tutoria->id,
                        'fecha' => $tutoria->fecha->format('Y-m-d'),
                        'tipo' => $tutoria->tipo ?? 'Individual',
                        'compromiso' => $tutoria->compromiso,
                        'observaciones' => $tutoria->observaciones,
                        'estado' => $tutoria->estado,
                        'tutor' => $tutoria->tutor->usuario->nombre_completo
                    ];
                })
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error en expediente alumno: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}