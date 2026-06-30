<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all()->keyBy('id');
        $communities = Community::with('plans')->get();

        if (Subscription::count() > 0) {
            $this->command->info('Subscriptions already exist — skipping.');
            return;
        }

        $seeds = [
            // Ana (1) — subscriber em várias comunidades
            ['user_email' => 'ana@ghota.io', 'community_name' => 'DevOps na Vida Real', 'plan_name' => 'Acesso Total'],
            ['user_email' => 'ana@ghota.io', 'community_name' => 'Tech Founders Club', 'plan_name' => 'Mensal'],
            ['user_email' => 'ana@ghota.io', 'community_name' => 'Fotografia para Devs', 'plan_name' => 'Premium'],

            // Mário (2)
            ['user_email' => 'mario@ghota.io', 'community_name' => 'Design Systems na Prática', 'plan_name' => 'Pro'],
            ['user_email' => 'mario@ghota.io', 'community_name' => 'React Avançado', 'plan_name' => 'Mensal'],
            ['user_email' => 'mario@ghota.io', 'community_name' => 'Design Critique Club', 'plan_name' => 'Pro'],

            // João (3)
            ['user_email' => 'joao@ghota.io', 'community_name' => 'DevOps na Vida Real', 'plan_name' => 'Acesso Total'],
            ['user_email' => 'joao@ghota.io', 'community_name' => 'Tech Founders Club', 'plan_name' => 'Mensal'],

            // Sofia (4)
            ['user_email' => 'sofia@ghota.io', 'community_name' => 'React Avançado', 'plan_name' => 'Anual'],
            ['user_email' => 'sofia@ghota.io', 'community_name' => 'Fotografia para Devs', 'plan_name' => 'Premium'],
            ['user_email' => 'sofia@ghota.io', 'community_name' => 'Product Design Weekly', 'plan_name' => 'Mentoria'],

            // Rui (5)
            ['user_email' => 'rui@ghota.io', 'community_name' => 'Design Critique Club', 'plan_name' => 'Pro'],
            ['user_email' => 'rui@ghota.io', 'community_name' => 'Product Design Weekly', 'plan_name' => 'Mentoria'],
        ];

        foreach ($seeds as $seed) {
            $user = $users->firstWhere('email', $seed['user_email']);
            $community = $communities->firstWhere('name', $seed['community_name']);
            if (!$user || !$community) {
                $this->command->warn("Skipping: user={$seed['user_email']} community={$seed['community_name']}");
                continue;
            }

            $plan = $community->plans->firstWhere('name', $seed['plan_name']);
            if (!$plan) {
                $this->command->warn("Plan '{$seed['plan_name']}' not found in '{$community->name}'");
                continue;
            }

            Subscription::create([
                'community_id' => $community->id,
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'plan_type' => $plan->is_free ? 'free' : 'paid',
                'status' => 'active',
                'stripe_session_id' => null,
                'stripe_subscription_id' => null,
                'starts_at' => now()->subDays(rand(1, 60)),
            ]);
        }

        $this->command->info('Seeded ' . Subscription::count() . ' subscriptions.');
    }
}
