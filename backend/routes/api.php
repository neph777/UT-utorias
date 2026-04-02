<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UsuarioController;
use App\Http\Controllers\Api\Admin\GrupoController;
use App\Http\Controllers\Api\Admin\AlumnoController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [AuthController::class, 'perfil']);
    Route::post('/cambiar-password', [AuthController::class, 'cambiarPassword']);
    });

    // Rutas de administrador
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Usuarios
        Route::apiResource('usuarios', UsuarioController::class);
        
        // Grupos
        Route::apiResource('grupos', GrupoController::class);
        Route::post('/grupos/{id}/asignar-alumnos', [GrupoController::class, 'asignarAlumnos']);
        Route::get('/alumnos-disponibles', [GrupoController::class, 'alumnosDisponibles']);
        
        // Expediente de alumno
        Route::get('/alumnos/{id}/expediente', [AlumnoController::class, 'expediente']);
    });