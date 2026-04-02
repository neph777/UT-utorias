<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Respaldo extends Model
{
    use HasFactory;

    protected $table = 'respaldo_logs';

    protected $fillable = [
        'nombre',
        'fecha',
        'tipo',
        'estado',
        'observacion',
        'usuario_id'
    ];

    protected $casts = [
        'fecha' => 'datetime'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}