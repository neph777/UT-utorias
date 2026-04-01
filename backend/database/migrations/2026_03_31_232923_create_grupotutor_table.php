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
        Schema::create('grupo_tutor', function (Blueprint $table) {  // ← CORREGIDO nombre
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos')->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('tutores')->onDelete('cascade');
            $table->boolean('activo')->default(true);  
            $table->timestamps();
            $table->unique(['grupo_id', 'tutor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grupotutor');
    }
};
