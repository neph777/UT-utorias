<?php

namespace App\Http\Controllers\Api\Alumno;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Tutoria;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

            // Marcar como atendidas las citas que ya pasaron
            Alerta::where('alumno_id', $alumno->id)
                ->where('tipo', 'academica')
                ->where('atendida', false)
                ->where('fecha', '<', now())
                ->update([
                    'atendida' => true
                ]);

            // Obtener solamente las citas pendientes
            $alertas = Alerta::where('alumno_id', $alumno->id)
                ->where('tipo', 'academica')
                ->where('atendida', false)
                ->with('tutor.usuario')
                ->orderBy('fecha')
                ->get();
                
            // Solicitudes de tutoría enviadas por el alumno
            $solicitudes = Alerta::where('alumno_id', $alumno->id)
                ->where('tipo', 'solicitud')
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
                'historial' => $historial->map(function ($tutoria) {
                    return [
                        'id' => $tutoria->id,
                        'fecha' => $tutoria->fecha->format('Y-m-d'),
                        'tipo' => $tutoria->tipo ?? 'Individual',
                        'compromiso' => $tutoria->compromiso,
                        'observaciones' => $tutoria->observaciones,
                        'estado' => $tutoria->estado,
                        'tutor' => $tutoria->tutor->usuario->nombre_completo
                    ];
                }),
                'alertas' => $alertas->map(function ($alerta) {
                    return [
                        'id' => $alerta->id,
                        'fecha' => $alerta->fecha ? $alerta->fecha->format('Y-m-d') : null,
                        'hora' => $alerta->hora,
                        'asunto' => $alerta->asunto,
                        'tipo' => $alerta->tipo,
                        'atendida' => (bool) $alerta->atendida,
                        'tutor' => $alerta->tutor && $alerta->tutor->usuario
                            ? $alerta->tutor->usuario->nombre_completo
                            : 'Tutor'
                    ];
                }),
                'solicitudes' => $solicitudes->map(function ($solicitud) {
                    return [
                        'id' => $solicitud->id,
                        'fecha' => $solicitud->fecha ? $solicitud->fecha->format('Y-m-d') : null,
                        'hora' => $solicitud->hora,
                        'asunto' => $solicitud->asunto,
                        'tipo' => $solicitud->tipo,
                        'estado' => $solicitud->estado,
                        'atendida' => (bool) $solicitud->atendida,
                        'tutor' => $solicitud->tutor && $solicitud->tutor->usuario
                            ? $solicitud->tutor->usuario->nombre_completo
                            : 'Tutor'
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

    public function solicitarTutoria(Request $request)
    {
    try {
        $validator = validator($request->all(), [
            'fecha' => 'required|date',
            'asunto' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $alumno = Alumno::where('usuario_id', $user->id)->first();

        if (!$alumno) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró el perfil de alumno'
            ], 404);
        }

        $tutor = DB::table('grupo_alumno as ga')
            ->join('grupo_tutor as gt', 'ga.grupo_id', '=', 'gt.grupo_id')
            ->where('ga.alumno_id', $alumno->id)
            ->where('gt.activo', 1)
            ->select('gt.tutor_id')
            ->orderByDesc('gt.id')
            ->first();

        if (!$tutor) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes un tutor asignado para enviar la solicitud'
            ], 404);
        }

        $pendiente = Alerta::where('alumno_id', $alumno->id)
            ->where('tipo', 'solicitud')
            ->where('estado', 'pendiente')
            ->exists();

        if ($pendiente) {
            return response()->json([
                'success' => false,
                'message' => 'Ya tienes una solicitud pendiente.'
            ], 422);
        }

        $fechaHora = \Carbon\Carbon::parse($request->fecha);

        $alerta = Alerta::create([
            'alumno_id' => $alumno->id,
            'tutor_id' => $tutor->tutor_id,
            'tipo' => 'solicitud',
            'estado' => 'pendiente',
            'asunto' => $request->asunto,
            'fecha' => $fechaHora->format('Y-m-d'),
            'hora' => $fechaHora->format('H:i:s'),
            'atendida' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solicitud de tutoría enviada correctamente',
            'data' => [
                'id' => $alerta->id,
                'fecha' => $alerta->fecha ? $alerta->fecha->format('Y-m-d') : null,
                'hora' => $alerta->hora,
                'asunto' => $alerta->asunto,
                'tipo' => $alerta->tipo,
                'estado' => $alerta->estado,
                'atendida' => (bool) $alerta->atendida
            ]
        ]);
    } catch (\Exception $e) {
        \Log::error('Error en solicitarTutoria: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Error al solicitar tutoría: ' . $e->getMessage()
        ], 500);
    }
}
}