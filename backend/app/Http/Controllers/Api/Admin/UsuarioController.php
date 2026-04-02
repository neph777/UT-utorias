<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Alumno;
use App\Models\Tutor;
use App\Models\Administrador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $query = Usuario::query();
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nombre_completo', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
        }
        
        $usuarios = $query->paginate(15);
        
        $usuarios->getCollection()->transform(function($usuario) {
            if ($usuario->rol === 'alumno' && $usuario->alumno) {
                $usuario->matricula = $usuario->alumno->matricula;
            } elseif ($usuario->rol === 'tutor' && $usuario->tutor) {
                $usuario->numero_empleado = $usuario->tutor->numero_empleado;
            } elseif ($usuario->rol === 'admin' && $usuario->administrador) {
                $usuario->puesto = $usuario->administrador->puesto;
            }
            return $usuario;
        });
        
        return response()->json($usuarios);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:200',
            'email' => 'required|email|unique:usuarios,email',
            'rol' => 'required|in:alumno,tutor,admin',
            'matricula' => 'required_if:rol,alumno|nullable|string|max:10|unique:alumnos,matricula',
            'numero_empleado' => 'required_if:rol,tutor|nullable|string|max:20|unique:tutores,numero_empleado',
            'puesto' => 'required_if:rol,admin|nullable|string|max:100',
            'carrera' => 'required_if:rol,alumno|nullable|string',
            'cuatrimestre' => 'required_if:rol,alumno|nullable|integer',
            'departamento' => 'nullable|string',
            'especialidad' => 'nullable|string',
            'nivel' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $password = match($request->rol) {
            'alumno' => 'alumno123',
            'tutor' => 'tutor123',
            'admin' => 'admin123',
            default => 'cambiar123'
        };
        
        $usuario = Usuario::create([
            'email' => $request->email,
            'password' => Hash::make($password),
            'rol' => $request->rol,
            'nombre_completo' => $request->nombre,
            'activo' => true
        ]);
        
        // Crear el registro específico según el rol
        if ($request->rol === 'alumno') {
            Alumno::create([
                'usuario_id' => $usuario->id,
                'matricula' => $request->matricula,
                'carrera' => $request->carrera,
                'cuatrimestre' => $request->cuatrimestre,
                'promedio_general' => 0,
                'telefono' => $request->telefono ?? null,
                'semaforo_color' => 'verde'
            ]);
        } elseif ($request->rol === 'tutor') {
            Tutor::create([
                'usuario_id' => $usuario->id,
                'numero_empleado' => $request->numero_empleado,
                'departamento' => $request->departamento ?? '',
                'especialidad' => $request->especialidad ?? ''
            ]);
        } elseif ($request->rol === 'admin') {
            Administrador::create([
                'usuario_id' => $usuario->id,
                'numero_empleado' => $request->numero_empleado ?? '',
                'puesto' => $request->puesto,
                'departamento' => $request->departamento ?? '',
                'nivel' => $request->nivel ?? 'coordinacion'
            ]);
        }
        
        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'usuario' => $usuario,
            'password' => $password  
        ], 201);
    }
}