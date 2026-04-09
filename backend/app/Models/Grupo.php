<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grupo extends Model
{
    use HasFactory;

    protected $table = 'grupos';

    protected $fillable = [
        'clave',
        'cuatrimestre',
        'turno',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean'
    ];

    // CORREGIR: Relación con alumnos
    public function alumnos()
    {
        return $this->belongsToMany(Alumno::class, 'grupo_alumno', 'grupo_id', 'alumno_id')
                    ->withTimestamps();
    }

    // CORREGIR: Relación con tutores
    public function tutores()
    {
        return $this->belongsToMany(Tutor::class, 'grupo_tutor', 'grupo_id', 'tutor_id')
                    ->withPivot('activo')
                    ->withTimestamps();
    }
}