<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminUsersTable extends Migration
{
    public function up()
    {
        Schema::create('admin_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('passwordHash');
            $table->string('name')->nullable();
            $table->enum('role', ['SUPER_ADMIN', 'EDITOR'])->default('EDITOR');
            $table->boolean('active')->default(true);
            $table->timestamp('createdAt')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('admin_users');
    }
}
