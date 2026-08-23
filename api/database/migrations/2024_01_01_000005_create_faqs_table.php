<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFaqsTable extends Migration
{
    public function up()
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('question');
            $table->text('answer');
            $table->integer('order')->default(0);
        });
    }

    public function down()
    {
        Schema::dropIfExists('faqs');
    }
}
