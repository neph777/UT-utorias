<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SemaforoCategoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumno_id',
        'categoria',
        'color',
        'observacion'
    ];

    protected $casts = [
        'color' => 'string'
    ];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class);
    }

    // Colores disponibles
    public static function colores()
    {
        return ['verde', 'amarillo', 'rojo'];
    }

    // Categorías disponibles
    public static function categorias()
    {
        return ['academico', 'economico', 'personal', 'familiar'];
    }

    // Obtener el color más crítico (rojo > amarillo > verde)
    public static function getColorCritico($categorias)
    {
        $orden = ['rojo' => 0, 'amarillo' => 1, 'verde' => 2];
        $critico = 'verde';
        
        foreach ($categorias as $categoria) {
            if (isset($orden[$categoria->color]) && $orden[$categoria->color] < $orden[$critico]) {
                $critico = $categoria->color;
            }
        }
        
        return $critico;
    }
}