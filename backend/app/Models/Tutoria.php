<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tutoria extends Model
{
    use HasFactory;


    protected $table = 'tutorias';
    
    protected $fillable = [
        'alumno_id',
        'tutor_id',
        'fecha',
        'tema',
        'compromiso',
        'observaciones',
        'estado'
    ];

    protected $casts = [
        'fecha' => 'date'
    ];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class);
    }

    public function tutor()
    {
        return $this->belongsTo(Tutor::class);
    }

    protected static function booted()
    {
        static::created(function ($tutoria) {
            if ($tutoria->estado === 'completada') {
                $tutoria->alumno->update([
                    'ultima_tutoria_fecha' => $tutoria->fecha
                ]);
                $tutoria->alumno->actualizarSemaforo();
            }
        });
    }
}