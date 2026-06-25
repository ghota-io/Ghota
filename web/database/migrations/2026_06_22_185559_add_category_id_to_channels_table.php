<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('channels', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->constrained()->cascadeOnDelete()->after('community_id');
        });

        // Create default categories for existing communities with channels
        $channels = DB::table('channels')->select('community_id', 'type')->distinct()->get();
        $grouped = $channels->groupBy('community_id');

        foreach ($grouped as $communityId => $types) {
            $order = 0;
            foreach ($types as $t) {
                $label = $t->type === 'page' ? 'Páginas' : 'Canais de texto';
                $catId = DB::table('categories')->insertGetId([
                    'community_id' => $communityId,
                    'name' => $label,
                    'order' => $order++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::table('channels')
                    ->where('community_id', $communityId)
                    ->where('type', $t->type)
                    ->whereNull('category_id')
                    ->update(['category_id' => $catId]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('channels', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
