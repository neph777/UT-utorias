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
        'asunto',  
        'fecha',
        'atendida'
    ];

    protected $casts = [
        'fecha' => 'date',
        'atendida' => 'boolean'
    ];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class);
    }

    public function tutor()
    {
        return $this->belongsTo(Tutor::class);
    }
}