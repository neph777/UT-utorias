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
        'rol',
        'nombre_completo',
        'activo'  // ← Quitamos fecha_nacimiento
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'activo' => 'boolean'
    ];

    // Relaciones
    public function alumno()
    {
        return $this->hasOne(Alumno::class);
    }

    public function tutor()
    {
        return $this->hasOne(Tutor::class);
    }

    public function administrador()
    {
        return $this->hasOne(Administrador::class);
    }

    public function respaldos()
    {
        return $this->hasMany(RespaldoLog::class);
    }

    public function esAdmin()
    {
        return $this->rol === 'admin';
    }

    public function esTutor()
    {
        return $this->rol === 'tutor';
    }

    public function esAlumno()
    {
        return $this->rol === 'alumno';
    }
}