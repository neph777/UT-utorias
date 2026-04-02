<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grupo;
use App\Models\Alumno;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GrupoController extends Controller
{
    public function index()
    {
        $grupos = Grupo::with('tutores', 'alumnos')->get();
        
        return response()->json($grupos);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clave' => 'required|string|max:10|unique:grupos,clave',
            'cuatrimestre' => 'required|integer',
            'turno' => 'required|in:matutino,vespertino,mixto'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $grupo = Grupo::create([
            'clave' => $request->clave,
            'cuatrimestre' => $request->cuatrimestre,
            'turno' => $request->turno,
            'activo' => true
        ]);
        
        return response()->json(['message' => 'Grupo creado', 'grupo' => $grupo], 201);
    }
    
    public function update(Request $request, $id)
    {
        $grupo = Grupo::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'clave' => 'required|string|max:10|unique:grupos,clave,' . $id,
            'cuatrimestre' => 'required|integer',
            'turno' => 'required|in:matutino,vespertino,mixto',
            'activo' => 'sometimes|boolean'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $grupo->update($request->all());
        
        return response()->json(['message' => 'Grupo actualizado', 'grupo' => $grupo]);
    }
    
    public function destroy($id)
    {
        $grupo = Grupo::findOrFail($id);
        $grupo->delete();
        
        return response()->json(['message' => 'Grupo eliminado']);
    }
    
    public function asignarAlumnos(Request $request, $id)
    {
        $grupo = Grupo::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'alumnos' => 'required|array',
            'alumnos.*' => 'exists:alumnos,id'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $grupo->alumnos()->sync($request->alumnos);
        
        return response()->json(['message' => 'Alumnos asignados correctamente']);
    }
    
    public function alumnosDisponibles()
    {
        $alumnos = Alumno::with('usuario')->get();
        
        return response()->json($alumnos);
    }
}