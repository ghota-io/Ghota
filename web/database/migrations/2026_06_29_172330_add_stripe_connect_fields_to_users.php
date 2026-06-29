<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("users", function (Blueprint $table) {
            $table->string("stripe_connect_id")->nullable()->unique()->after("stripe_customer_id");
            $table->string("stripe_connect_status")->nullable()->after("stripe_connect_id");
        });
    }

    public function down(): void
    {
        Schema::table("users", function (Blueprint $table) {
            $table->dropColumn(["stripe_connect_id", "stripe_connect_status"]);
        });
    }
};
