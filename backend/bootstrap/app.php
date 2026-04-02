<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Configurar CORS
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
        
        // Registrar middleware de roles
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
        
        // Configurar Sanctum
        $middleware->statefulApi();
        
        // EXCLUIR CSRF PARA LAS RUTAS API
        $middleware->validateCsrfTokens(except: [
            'api/*',  // Todas las rutas que empiezan con api/
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();