<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('backup_configs', function (Blueprint $table) {
            $table->id();
            $table->enum('frecuencia', ['diario', 'semanal', 'mensual']);
            $table->string('hora', 5); // formato HH:MM
            $table->integer('retener_dias')->default(30);
            $table->boolean('activo')->default(true);
            $table->timestamp('ultima_ejecucion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backup_configs');
    }
};