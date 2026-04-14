<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $usuario = $request->user();
        
        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        
        if (!in_array($usuario->rol, $roles)) {
            return response()->json(['message' => 'No autorizado para esta acción'], 403);
        }
        
        return $next($request);
    }
}