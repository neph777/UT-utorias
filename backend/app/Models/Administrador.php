<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Administrador extends Model
{
    use HasFactory;

    protected $table = 'administradores';

    protected $fillable = [
        'usuario_id',
        'numero_empleado',
        'puesto',
        'departamento',
        'nivel'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}