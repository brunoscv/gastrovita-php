<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactInfosTable extends Migration
{
    public function up()
    {
        // Tratada como singleton pela aplicação (sempre a primeira linha) — sem
        // constraint de banco impedindo múltiplas linhas, igual ao Prisma original.
        Schema::create('contact_infos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('hours')->nullable();
            $table->timestamp('updatedAt')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contact_infos');
    }
}
