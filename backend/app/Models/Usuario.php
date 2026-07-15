<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    
    protected $table = 'usuarios';
    
    protected $fillable = [
        'email',
        'password',
        'nombre_completo',
        'rol'
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // ============================================
    // RELACIONES AGREGADAS
    // ============================================
    
    /**
     * Relación con el perfil de tutor (si el usuario es tutor)
     */
    public function tutor()
    {
        return $this->hasOne(Tutor::class);
    }

    /**
     * Relación con el perfil de alumno (si el usuario es alumno)
     */
    public function alumno()
    {
        return $this->hasOne(Alumno::class);
    }

    /**
     * Relación con el perfil de administrador (si el usuario es admin)
     */
    public function administrador()
    {
        return $this->hasOne(Administrador::class);
    }
}