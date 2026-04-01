<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Semaforo extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumno_id',
        'tutor_id',
        'color_anterior',
        'color_nuevo',
        'razon_cambio',
        'origen'
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