<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semaforo_categorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
            $table->enum('categoria', ['academico', 'conductual', 'personal', 'asistencia']);
            $table->enum('color', ['verde', 'amarillo', 'rojo'])->default('verde');
            $table->text('observacion')->nullable();
            $table->timestamps();
            
            $table->unique(['alumno_id', 'categoria']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('semaforo_categorias');
    }
};