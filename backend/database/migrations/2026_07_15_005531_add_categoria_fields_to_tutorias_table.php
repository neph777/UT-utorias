<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tutorias', function (Blueprint $table) {
            $table->enum('categoria_academico', ['verde', 'amarillo', 'rojo'])->nullable();
            $table->enum('categoria_economico', ['verde', 'amarillo', 'rojo'])->nullable();
            $table->enum('categoria_personal', ['verde', 'amarillo', 'rojo'])->nullable();
            $table->enum('categoria_familiar', ['verde', 'amarillo', 'rojo'])->nullable();

            $table->text('observacion_academico')->nullable();
            $table->text('observacion_economico')->nullable();
            $table->text('observacion_personal')->nullable();
            $table->text('observacion_familiar')->nullable();

            $table->decimal('promedio_tutoria', 5, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('tutorias', function (Blueprint $table) {
            $table->dropColumn([
                'categoria_academico',
                'categoria_economico',
                'categoria_personal',
                'categoria_familiar',
                'observacion_academico',
                'observacion_economico',
                'observacion_personal',
                'observacion_familiar',
                'promedio_tutoria'
            ]);
        });
    }
};