<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alumno extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'matricula',
        'carrera',
        'cuatrimestre',
        'promedio_general',
        'telefono',
        'tutor_actual_id',
        'ultima_tutoria_fecha',
        'semaforo_color',
        'semaforo_razon',
        'semaforo_manual',
        'semaforo_observacion'
    ];

    protected $casts = [
        'promedio_general' => 'decimal:2',
        'ultima_tutoria_fecha' => 'date',
        'semaforo_manual' => 'boolean'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function tutor()
    {
        return $this->belongsTo(Tutor::class, 'tutor_actual_id');
    }

    public function tutorias()
    {
        return $this->hasMany(Tutoria::class);
    }

    public function grupos()
    {
        return $this->belongsToMany(Grupo::class, 'grupo_alumno');
    }

    public function alertas()
    {
        return $this->hasMany(Alerta::class);
    }

    public function semaforoLogs()
    {
        return $this->hasMany(SemaforoLog::class);
    }

    public function calcularSemaforoAutomatico()
    {
        $diasDesdeUltimaTutoria = $this->ultima_tutoria_fecha 
            ? now()->diffInDays($this->ultima_tutoria_fecha) 
            : 999;

        // Rojo: promedio bajo o mucho tiempo sin tutoría
        if ($this->promedio_general < 70) {
            return [
                'color' => 'rojo',
                'razon' => "Promedio bajo: {$this->promedio_general}"
            ];
        }
        
        if ($diasDesdeUltimaTutoria > 60) {
            return [
                'color' => 'rojo',
                'razon' => "Más de 60 días sin tutoría"
            ];
        }
        
        if ($this->promedio_general < 80) {
            return [
                'color' => 'amarillo',
                'razon' => "Promedio en riesgo: {$this->promedio_general}"
            ];
        }
        
        if ($diasDesdeUltimaTutoria > 30) {
            return [
                'color' => 'amarillo',
                'razon' => "Más de 30 días sin tutoría"
            ];
        }
        
        return [
            'color' => 'verde',
            'razon' => "Todo en orden - Promedio: {$this->promedio_general}"
        ];
    }

    public function actualizarSemaforo($tutorId = null, $manual = false, $nuevoColor = null, $observacion = null)
    {
        $colorAnterior = $this->semaforo_color;
        
        if ($manual && $nuevoColor) {
            $this->semaforo_color = $nuevoColor;
            $this->semaforo_razon = $observacion;
            $this->semaforo_manual = true;
            $this->semaforo_observacion = $observacion;
            $origen = 'manual';
            $razon = "Cambio manual: {$observacion}";
        } else {
            $semaforoAuto = $this->calcularSemaforoAutomatico();
            
            if ($this->semaforo_manual && $this->semaforo_color === 'rojo') {
                return $this;
            }
            
            $this->semaforo_color = $semaforoAuto['color'];
            $this->semaforo_razon = $semaforoAuto['razon'];
            $this->semaforo_manual = false;
            $origen = 'automatico';
            $razon = $semaforoAuto['razon'];
        }
        
        $this->save();
        
        if ($colorAnterior !== $this->semaforo_color) {
            \App\Models\SemaforoLog::create([
                'alumno_id' => $this->id,
                'tutor_id' => $tutorId,
                'color_anterior' => $colorAnterior,
                'color_nuevo' => $this->semaforo_color,
                'razon_cambio' => $razon,
                'origen' => $origen
            ]);
        }
        
        return $this;
    }
}