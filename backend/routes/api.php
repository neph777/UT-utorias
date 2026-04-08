<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UsuarioController;
use App\Http\Controllers\Api\Admin\GrupoController;
use App\Http\Controllers\Api\Admin\AlumnoController;
use App\Http\Controllers\Api\Admin\BackupController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [AuthController::class, 'perfil']);
    Route::post('/cambiar-password', [AuthController::class, 'cambiarPassword']);
    
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
        Route::put('/alumnos/{id}/expediente', [AlumnoController::class, 'update']);

        //Backup
        Route::apiResource('backups', BackupController::class);
        Route::get('/backups/config', [BackupController::class, 'getConfig']);
        Route::post('/backups/config', [BackupController::class, 'saveConfig']);
        Route::get('/backups/{id}/download', [BackupController::class, 'download']);
    });
}); // <-- CIERRA EL PRIMER GROUP