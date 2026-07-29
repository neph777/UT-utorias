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
    Schema::table('alertas', function (Blueprint $table) {

        $table->time('hora')->nullable()->after('fecha');

        $table->string('lugar')->nullable()->after('hora');

        $table->text('mensaje')->nullable()->after('lugar');

    });
}

public function down(): void
{
    Schema::table('alertas', function (Blueprint $table) {

        $table->dropColumn([
            'hora',
            'lugar',
            'mensaje'
        ]);

    });
}
};
