<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BackupConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'frecuencia',
        'hora',
        'retener_dias',
        'activo',
        'ultima_ejecucion'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'ultima_ejecucion' => 'datetime'
    ];
}