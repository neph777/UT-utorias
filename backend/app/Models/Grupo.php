<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grupo extends Model
{
    use HasFactory;

    protected $fillable = [
        'clave',
        'cuatrimestre',
        'turno',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean'
    ];

    public function alumnos()
    {
        return $this->belongsToMany(Alumno::class, 'grupo_alumno');
    }

    public function tutores()
    {
        return $this->belongsToMany(Tutor::class, 'grupo_tutor');
    }
}