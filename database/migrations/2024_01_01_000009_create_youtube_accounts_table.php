<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateYoutubeAccountsTable extends Migration
{
    public function up()
    {
        // Singleton: a cada reconexão a aplicação apaga todas as linhas e cria uma nova.
        Schema::create('youtube_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('channelId');
            $table->string('channelTitle')->nullable();
            $table->text('refreshToken');
            $table->timestamp('connectedAt')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('youtube_accounts');
    }
}
