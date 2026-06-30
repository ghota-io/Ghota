<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('login_token', 64);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            $table->unique('user_id');
            $table->index('login_token');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_accounts');
    }
};
