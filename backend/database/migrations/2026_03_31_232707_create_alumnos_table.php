<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumnos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('matricula', 10)->unique();
            $table->string('carrera', 100);  
            $table->integer('cuatrimestre'); 
            $table->decimal('promedio_general', 5, 2)->default(0);
            $table->string('telefono', 15)->nullable();
            $table->foreignId('tutor_actual_id')->nullable()->constrained('tutores');  
            $table->date('ultima_tutoria_fecha')->nullable();  
            $table->enum('semaforo_color', ['rojo', 'amarillo', 'verde'])->default('verde');
            $table->text('semaforo_razon')->nullable(); //Calificaciones o cuestiones personales
            $table->boolean('semaforo_manual')->default(false); //Indica si el cambio fue manual o por sistema
            $table->text('semaforo_observacion')->nullable(); //Habla más a fondo de la sitaución del alumno para dar el seguimiento apropiado (orientación psicologica, medica, )
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumnos');
    }
};