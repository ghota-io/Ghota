<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("community_roles", function (Blueprint $table) {
            $table->boolean("is_default")->default(false)->after("name");
        });

        Schema::table("community_memberships", function (Blueprint $table) {
            $table->foreignId("community_role_id")->nullable()->after("role")->constrained("community_roles")->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table("community_memberships", function (Blueprint $table) {
            $table->dropConstrainedForeignId("community_role_id");
        });

        Schema::table("community_roles", function (Blueprint $table) {
            $table->dropColumn("is_default");
        });
    }
};
