<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alerta extends Model
{
    use HasFactory;

    protected $table = 'alertas';

    protected $fillable = [
        'alumno_id',
        'tutor_id',
        'tipo',
        'estado',
        'asunto',
        'fecha',
        'hora',
        'lugar',
        'mensaje',
        'atendida'
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'atendida' => 'boolean'
    ];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'alumno_id');
    }

    public function tutor()
    {
        return $this->belongsTo(Tutor::class, 'tutor_id');
    }
}