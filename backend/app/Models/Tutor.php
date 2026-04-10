<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tutor extends Model
{
    use HasFactory;

    protected $table = 'tutores';

    protected $fillable = [
        'usuario_id',
        'numero_empleado',
        'departamento',
        'especialidad'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function grupos()
    {
        return $this->belongsToMany(Grupo::class, 'grupo_tutor', 'tutor_id', 'grupo_id')
                    ->withPivot('activo')
                    ->withTimestamps();
    }

    // Grupos activos
    public function gruposActivos()
    {
        return $this->belongsToMany(Grupo::class, 'grupo_tutor', 'tutor_id', 'grupo_id')
                    ->wherePivot('activo', true)
                    ->withTimestamps();
    }

    public function alumnos()
    {
        return $this->hasMany(Alumno::class, 'tutor_actual_id');
    }

    public function tutorias()
    {
        return $this->hasMany(Tutoria::class);
    }

    public function alertas()
    {
        return $this->hasMany(Alerta::class);
    }

    public function semaforoLogs()
    {
        return $this->hasMany(SemaforoLog::class);
    }
}