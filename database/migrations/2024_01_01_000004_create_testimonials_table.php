<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestimonialsTable extends Migration
{
    public function up()
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('authorName')->nullable();
            // Livre (não é enum de banco) — validado só na aplicação, igual ao schema Prisma original.
            $table->string('type');
            $table->string('youtubeId')->nullable();
            $table->string('imageUrl')->nullable();
            $table->text('text')->nullable();
            $table->integer('rating')->nullable();
            $table->integer('order')->default(0);
            $table->timestamp('createdAt')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('testimonials');
    }
}
