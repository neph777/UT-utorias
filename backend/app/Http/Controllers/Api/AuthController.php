<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Log para saber que entró al método
        Log::info('Login method called');
        
        try {
            Log::info('Request data: ', $request->all());
            
            $validator = validator($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string'
            ]);
            
            if ($validator->fails()) {
                Log::error('Validation failed: ', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Datos inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            Log::info('Looking for user: ' . $request->email);
            
            $usuario = Usuario::where('email', $request->email)->first();
            
            Log::info('User found: ' . ($usuario ? 'Yes' : 'No'));
            
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }
            
            Log::info('Checking password...');
            
            if (!Hash::check($request->password, $usuario->password)) {
                Log::warning('Wrong password for user: ' . $request->email);
                return response()->json([
                    'success' => false,
                    'message' => 'Contraseña incorrecta'
                ], 401);
            }
            
            Log::info('Generating token...');
            
            $token = $usuario->createToken('auth_token')->plainTextToken;
            
            Log::info('Token generated successfully');
            
            return response()->json([
                'success' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $usuario->id,
                    'email' => $usuario->email,
                    'nombre_completo' => $usuario->nombre_completo,
                    'rol' => $usuario->rol
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            Log::error('File: ' . $e->getFile() . ' Line: ' . $e->getLine());
            
            return response()->json([
                'success' => false,
                'message' => 'Error interno: ' . $e->getMessage(),
                'file' => basename($e->getFile()),
                'line' => $e->getLine()
            ], 500);
        }
    }
    
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada'
            ]);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión'
            ], 500);
        }
    }
    
    public function perfil(Request $request)
    {
        try {
            return response()->json($request->user());
        } catch (\Exception $e) {
            Log::error('Perfil error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener perfil'
            ], 500);
        }
    }
}