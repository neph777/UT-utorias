<?php

namespace App\Http\Controllers\Api\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\SemaforoCategoria;
use App\Models\Tutoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TutorAlumnoController extends Controller
{
    // Obtener expediente completo del alumno
    public function expediente($id)
    {
        try {
            $user = auth()->user();
            
            // Log para depuración
            \Log::info('Usuario autenticado:', ['user_id' => $user->id, 'email' => $user->email, 'rol' => $user->rol]);
            
            // Obtener el tutor de varias formas
            $tutor = $user->tutor;
            
            if (!$tutor) {
                // Intentar obtener por usuario_id directamente
                $tutor = \App\Models\Tutor::where('usuario_id', $user->id)->first();
            }
            
            if (!$tutor) {
                \Log::error('Tutor no encontrado para usuario:', ['user_id' => $user->id]);
                return response()->json([
                    'success' => false, 
                    'message' => 'No tienes un perfil de tutor asignado. Contacta al administrador.'
                ], 404);
            }
            
            \Log::info('Tutor encontrado:', ['tutor_id' => $tutor->id]);
            
            // Verificar que el alumno pertenece al tutor
            $pertenece = DB::table('grupo_tutor as gt')
                ->join('grupo_alumno as ga', 'gt.grupo_id', '=', 'ga.grupo_id')
                ->where('gt.tutor_id', $tutor->id)
                ->where('ga.alumno_id', $id)
                ->exists();
            
            if (!$pertenece) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }
            
            // ============================================
            // AQUÍ FALTA EL RESTO DEL CÓDIGO - LO AGREGO
            // ============================================
            
            $alumno = Alumno::with('usuario', 'semaforoCategorias', 'grupos')->findOrFail($id);
            
            // Obtener historial de tutorías
            $historial = Tutoria::where('alumno_id', $id)
                ->with('tutor.usuario')
                ->orderBy('fecha', 'desc')
                ->get();
            
            // Obtener categorías con colores
            $categorias = $alumno->getCategoriasConColor();
            $colorCritico = SemaforoCategoria::getColorCritico($categorias);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'alumno' => [
                        'id' => $alumno->id,
                        'nombre_completo' => $alumno->usuario->nombre_completo,
                        'email' => $alumno->usuario->email,
                        'matricula' => $alumno->matricula,
                        'carrera' => $alumno->carrera,
                        'promedio' => $alumno->promedio_general,
                        'semaforo_color' => $colorCritico,
                        'grupos' => $alumno->grupos
                    ],
                    'categorias' => $categorias->map(function($cat) {
                        return [
                            'id' => $cat->id,
                            'categoria' => $cat->categoria,
                            'color' => $cat->color,
                            'observacion' => $cat->observacion
                        ];
                    }),
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
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error en expediente tutor:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    
    // Actualizar categorías del semáforo
    public function actualizarCategorias(Request $request, $id)
    {
        try {
            $tutor = auth()->user()->tutor;
            
            if (!$tutor) {
                $tutor = \App\Models\Tutor::where('usuario_id', auth()->id())->first();
            }
            
            if (!$tutor) {
                return response()->json(['success' => false, 'message' => 'Tutor no encontrado'], 404);
            }
            
            // Verificar que el alumno pertenece al tutor
            $pertenece = DB::table('grupo_tutor as gt')
                ->join('grupo_alumno as ga', 'gt.grupo_id', '=', 'ga.grupo_id')
                ->where('gt.tutor_id', $tutor->id)
                ->where('ga.alumno_id', $id)
                ->exists();
            
            if (!$pertenece) {
                return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
            }
            
            $validator = validator($request->all(), [
                'categorias' => 'required|array',
                'categorias.*.id' => 'required|exists:semaforo_categorias,id',
                'categorias.*.color' => 'required|in:verde,amarillo,rojo',
                'categorias.*.observacion' => 'nullable|string'
            ]);
            
            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }
            
            foreach ($request->categorias as $categoriaData) {
                $categoria = SemaforoCategoria::find($categoriaData['id']);
                if ($categoria) {
                    $categoria->color = $categoriaData['color'];
                    $categoria->observacion = $categoriaData['observacion'] ?? null;
                    $categoria->save();
                }
            }
            
            // Actualizar semáforo general del alumno
            $alumno = Alumno::find($id);
            if ($alumno) {
                $nuevoColor = $alumno->calcularSemaforoPorCategorias();
                $alumno->semaforo_color = $nuevoColor;
                $alumno->semaforo_manual = true;
                $alumno->save();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Categorías actualizadas correctamente',
                'data' => [
                    'semaforo_general' => $nuevoColor ?? 'verde',
                    'categorias' => $alumno ? $alumno->semaforoCategorias : []
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error en actualizarCategorias:', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}