<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('respaldo_logs', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');                    
            $table->dateTime('fecha');                   
            $table->enum('tipo', ['manual', 'automatico']); 
            $table->enum('estado', ['completado', 'fallido'])->default('completado');
            $table->text('observacion')->nullable();    
            $table->foreignId('usuario_id')->nullable() 
                  ->constrained('usuarios')
                  ->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respaldo');
    }
};
