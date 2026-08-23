<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactSubmissionsTable extends Migration
{
    public function up()
    {
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->string('isPatient')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->boolean('read')->default(false);
            $table->timestamp('createdAt')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contact_submissions');
    }
}
