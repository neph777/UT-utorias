<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Alumno;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    /**
     * 
     */
    public function index(Request $request)
    {
        try {
            $search = $request->get('search');
            
            $query = Usuario::query();
            
            if ($search) {
                $query->where('nombre_completo', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            }
            
            $usuarios = $query->paginate(15);
            
            return response()->json($usuarios);
        } catch (\Exception $e) {
            Log::error('Error en index: ' . $e->getMessage());
            return response()->json(['message' => 'Error al cargar usuarios'], 500);
        }
    }
    
    /**
     * 
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255',
                'email' => 'required|email|unique:usuarios',
                'rol' => 'required|in:alumno,tutor,admin',
                'matricula' => 'nullable|string|unique:alumnos,matricula',
                'carrera' => 'nullable|string',
                'cuatrimestre' => 'nullable|integer',
                'numero_empleado' => 'nullable|string',
                'puesto' => 'nullable|string',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            $usuario = Usuario::create([
                'nombre_completo' => $request->nombre,
                'email' => $request->email,
                'password' => Hash::make('password123'),
                'rol' => $request->rol,
            ]);
            
            if ($request->rol === 'alumno') {
                Alumno::create([
                    'usuario_id' => $usuario->id,
                    'matricula' => $request->matricula ?? '',
                    'carrera' => $request->carrera ?? '',
                    'cuatrimestre' => $request->cuatrimestre ?? 1,
                    'promedio_general' => 0,
                ]);
            } elseif ($request->rol === 'tutor') {
                Tutor::create([
                    'usuario_id' => $usuario->id,
                    'numero_empleado' => $request->numero_empleado ?? '',
                    'especialidad' => $request->puesto ?? '',
                ]);
            }
            
            return response()->json($usuario, 201);
            
        } catch (\Exception $e) {
            Log::error('Error en store: ' . $e->getMessage());
            return response()->json(['message' => 'Error al crear usuario: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * 
     */
    public function show($id)
    {
        try {
            $usuario = Usuario::with('alumno', 'tutor')->findOrFail($id);
            return response()->json($usuario);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
    }
    
    /**
     * 
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Update usuario llamado', ['id' => $id, 'data' => $request->all()]);
            
            $usuario = Usuario::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'nombre' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:usuarios,email,' . $id,
                'rol' => 'sometimes|in:alumno,tutor,admin',
                'matricula' => 'nullable|string',
                'carrera' => 'nullable|string',
                'cuatrimestre' => 'nullable|integer',
                'numero_empleado' => 'nullable|string',
                'puesto' => 'nullable|string',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            // Actualizar usuario base
            if ($request->has('nombre')) {
                $usuario->nombre_completo = $request->nombre;
            }
            if ($request->has('email')) {
                $usuario->email = $request->email;
            }
            if ($request->has('rol')) {
                $usuario->rol = $request->rol;
            }
            $usuario->save();
            
            // Actualizar datos específicos según el rol
            if ($usuario->rol === 'alumno') {
                $alumno = Alumno::where('usuario_id', $usuario->id)->first();
                if ($alumno) {
                    if ($request->has('matricula')) {
                        $alumno->matricula = $request->matricula;
                    }
                    if ($request->has('carrera')) {
                        $alumno->carrera = $request->carrera;
                    }
                    if ($request->has('cuatrimestre')) {
                        $alumno->cuatrimestre = $request->cuatrimestre;
                    }
                    $alumno->save();
                }
            } elseif ($usuario->rol === 'tutor') {
                $tutor = Tutor::where('usuario_id', $usuario->id)->first();
                if ($tutor) {
                    if ($request->has('numero_empleado')) {
                        $tutor->numero_empleado = $request->numero_empleado;
                    }
                    if ($request->has('puesto')) {
                        $tutor->especialidad = $request->puesto;
                    }
                    $tutor->save();
                }
            }
            
            return response()->json($usuario);
            
        } catch (\Exception $e) {
            Log::error('Error en update: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error al actualizar usuario: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     *
     */
    public function destroy($id)
    {
        try {
            $usuario = Usuario::findOrFail($id);
            
            if ($usuario->rol === 'alumno') {
                Alumno::where('usuario_id', $id)->delete();
            } elseif ($usuario->rol === 'tutor') {
                Tutor::where('usuario_id', $id)->delete();
            }
            
            $usuario->delete();
            
            return response()->json(['message' => 'Usuario eliminado correctamente']);
            
        } catch (\Exception $e) {
            Log::error('Error en destroy: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar usuario'], 500);
        }
    }
}