<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semaforo_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_id')->constrained('alumnos')->onDelete('cascade');
            $table->foreignId('tutor_id')->nullable()->constrained('tutores')->onDelete('set null');
            $table->enum('color_anterior', ['rojo', 'amarillo', 'verde'])->nullable();
            $table->enum('color_nuevo', ['rojo', 'amarillo', 'verde']);
            $table->text('razon_cambio')->nullable();
            $table->enum('origen', ['automatico', 'manual'])->default('automatico');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('semaforo_logs');
    }
};