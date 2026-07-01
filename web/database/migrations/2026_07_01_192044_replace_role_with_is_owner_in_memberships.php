<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("community_memberships", function (Blueprint $table) {
            $table->boolean("is_owner")->default(false)->after("user_id");
        });

        DB::statement("UPDATE community_memberships SET is_owner = true WHERE role = 'owner'");

        Schema::table("community_memberships", function (Blueprint $table) {
            $table->dropColumn("role");
        });
    }

    public function down(): void
    {
        Schema::table("community_memberships", function (Blueprint $table) {
            $table->string("role")->default("member")->after("user_id");
        });

        DB::statement("UPDATE community_memberships SET role = 'owner' WHERE is_owner = true");

        Schema::table("community_memberships", function (Blueprint $table) {
            $table->dropColumn("is_owner");
        });
    }
};
