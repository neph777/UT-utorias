<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tutor extends Model
{
    use HasFactory;

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

    public function grupos()
    {
        return $this->belongsToMany(Grupo::class, 'grupo_tutor');
    }

    public function semaforoLogs()
    {
        return $this->hasMany(SemaforoLog::class);
    }

    public function alumnosEnRiesgo()
    {
        return $this->alumnos()->where('semaforo_color', 'rojo')->get();
    }
}