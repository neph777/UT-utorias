<?php

namespace App\Http\Controllers\Api\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Alumno;
use App\Models\Grupo;
use App\Models\Tutoria;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardTutorController extends Controller
{
    /**
     * Obtener grupos del tutor
     */
public function getGrupos()
{
    try {
        $user = auth()->user();
        
        // Obtener el tutor_id directamente
        $tutor = DB::table('tutores')->where('usuario_id', $user->id)->first();
        
        if (!$tutor) {
            return response()->json(['success' => false, 'message' => 'Tutor no encontrado'], 404);
        }
        
        // Consulta directa con JOIN
        $grupos = DB::table('grupo_tutor as gt')
            ->join('grupos as g', 'gt.grupo_id', '=', 'g.id')
            ->where('gt.tutor_id', $tutor->id)
            ->where('gt.activo', 1)
            ->select('g.id', 'g.clave', 'g.cuatrimestre', 'g.turno')
            ->get();
        
        foreach ($grupos as $grupo) {
            // Obtener alumnos del grupo
            $alumnos = DB::table('grupo_alumno as ga')
                ->join('alumnos as a', 'ga.alumno_id', '=', 'a.id')
                ->join('usuarios as u', 'a.usuario_id', '=', 'u.id')
                ->where('ga.grupo_id', $grupo->id)
                ->select(
                    'a.id',
                    'a.matricula',
                    'a.promedio_general as promedio',
                    'a.semaforo_color as semaforo',
                    'a.ultima_tutoria_fecha as ultima_tutoria',
                    'u.nombre_completo as nombre',
                    'u.email'
                )
                ->get();
            
            $grupo->alumnos = $alumnos;
            $grupo->alumnos_count = $alumnos->count();
        }
        
        return response()->json([
            'success' => true,
            'data' => $grupos
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false, 
            'message' => $e->getMessage()
        ], 500);
    }
}
    
    /**
     * Obtener alumnos de un grupo específico
     */
    public function getAlumnosByGrupo($grupoId)
    {
        try {
            $grupo = Grupo::with('alumnos.usuario')->findOrFail($grupoId);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'grupo' => [
                        'id' => $grupo->id,
                        'clave' => $grupo->clave
                    ],
                    'alumnos' => $grupo->alumnos->map(function($alumno) {
                        return [
                            'id' => $alumno->id,
                            'usuario_id' => $alumno->usuario_id,
                            'nombre' => $alumno->usuario->nombre_completo,
                            'matricula' => $alumno->matricula,
                            'promedio' => $alumno->promedio_general,
                            'semaforo' => $alumno->semaforo_color,
                            'ultima_tutoria' => $alumno->ultima_tutoria_fecha
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    
    /**
 * Registrar una tutoría
 */
public function registrarTutoria(Request $request)
{
    try {
        $validator = validator($request->all(), [
            'alumno_id' => 'required|exists:alumnos,id',
            'fecha' => 'required|date',
            'tema' => 'required|string',
            'compromiso' => 'required|string',
            'observaciones' => 'required|string',
            'promedio' => 'nullable|numeric'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }
        
        // Obtener el tutor desde el usuario
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no autenticado'], 401);
        }
        
        $tutor = $user->tutor;
        
        if (!$tutor) {
            $tutor = \App\Models\Tutor::where('usuario_id', $user->id)->first();
            
            if (!$tutor) {
                return response()->json([
                    'success' => false, 
                    'message' => 'No tienes un perfil de tutor asignado'
                ], 404);
            }
        }
        
        $alumno = \App\Models\Alumno::findOrFail($request->alumno_id);
        
        // Actualizar promedio del alumno si se proporcionó
        if ($request->has('promedio') && $request->promedio) {
            $alumno->promedio_general = $request->promedio;
            $alumno->save();
        }
        
        // Registrar tutoría
        $tutoria = \App\Models\Tutoria::create([
            'alumno_id' => $request->alumno_id,
            'tutor_id' => $tutor->id,
            'fecha' => $request->fecha,
            'tema' => $request->tema,
            'compromiso' => $request->compromiso,
            'observaciones' => $request->observaciones,
            'estado' => 'completada'
        ]);
        
        // Actualizar última fecha de tutoría del alumno
        $alumno->ultima_tutoria_fecha = $request->fecha;
        $alumno->save();
        
        // Actualizar semáforo automáticamente
        $alumno->actualizarSemaforo($tutor->id);
        
        return response()->json([
            'success' => true,
            'message' => 'Tutoría registrada exitosamente',
            'data' => $tutoria
        ]);
    } catch (\Exception $e) {
        \Log::error('Error en registrarTutoria: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}
    
/**
 * Generar cita (alerta) para un alumno
 */
public function generarCita(Request $request)
{
    try {
        $validator = validator($request->all(), [
            'alumno_id' => 'required|exists:alumnos,id',
            'fecha' => 'required|date',
            'asunto' => 'required|string',
            'observaciones' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }
        
        // Obtener el tutor desde el usuario autenticado
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no autenticado'], 401);
        }
        
        // Buscar el tutor por usuario_id
        $tutor = \App\Models\Tutor::where('usuario_id', $user->id)->first();
        
        if (!$tutor) {
            return response()->json([
                'success' => false, 
                'message' => 'No tienes un perfil de tutor asignado. Contacta al administrador.'
            ], 404);
        }
        
        // Verificar que el alumno pertenece a un grupo del tutor
        $pertenece = \DB::table('grupo_tutor as gt')
            ->join('grupo_alumno as ga', 'gt.grupo_id', '=', 'ga.grupo_id')
            ->where('gt.tutor_id', $tutor->id)
            ->where('ga.alumno_id', $request->alumno_id)
            ->exists();
        
        if (!$pertenece) {
            return response()->json([
                'success' => false, 
                'message' => 'No tienes permiso para generar citas para este alumno'
            ], 403);
        }
        
        
        // 
        $alerta = \App\Models\Alerta::create([
            'alumno_id' => $request->alumno_id,
            'tutor_id' => $tutor->id,
            'tipo' => 'academica',
            'asunto' => $request->asunto,
            'fecha' => $request->fecha,
            'atendida' => false
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Cita generada exitosamente',
            'data' => $alerta
        ]);
        
    } catch (\Exception $e) {
        \Log::error('Error en generarCita: ' . $e->getMessage());
        return response()->json([
            'success' => false, 
            'message' => 'Error al generar la cita: ' . $e->getMessage()
        ], 500);
    }
}
    
    /**
     * Obtener estadísticas del dashboard
     */
public function getStats()
{
    try {
        $user = auth()->user();
        
        $tutor = DB::table('tutores')->where('usuario_id', $user->id)->first();
        
        if (!$tutor) {
            return response()->json(['success' => false, 'message' => 'Tutor no encontrado'], 404);
        }
        
        // Total de alumnos del tutor
        $totalAlumnos = DB::table('grupo_tutor as gt')
            ->join('grupo_alumno as ga', 'gt.grupo_id', '=', 'ga.grupo_id')
            ->where('gt.tutor_id', $tutor->id)
            ->where('gt.activo', 1)
            ->distinct('ga.alumno_id')
            ->count('ga.alumno_id');
        
        // Alumnos en rojo
        $alumnosRojo = DB::table('grupo_tutor as gt')
            ->join('grupo_alumno as ga', 'gt.grupo_id', '=', 'ga.grupo_id')
            ->join('alumnos as a', 'ga.alumno_id', '=', 'a.id')
            ->where('gt.tutor_id', $tutor->id)
            ->where('gt.activo', 1)
            ->where('a.semaforo_color', 'rojo')
            ->distinct('ga.alumno_id')
            ->count('ga.alumno_id');
        
        // Tutorías realizadas
        $tutoriasRealizadas = DB::table('tutorias')
            ->where('tutor_id', $tutor->id)
            ->count();
        
        // Total de grupos
        $totalGrupos = DB::table('grupo_tutor')
            ->where('tutor_id', $tutor->id)
            ->where('activo', 1)
            ->count();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_alumnos' => $totalAlumnos,
                'alumnos_rojo' => $alumnosRojo,
                'tutorias_realizadas' => $tutoriasRealizadas,
                'total_grupos' => $totalGrupos
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}
}