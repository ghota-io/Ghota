<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\Community;
use App\Models\Membership;
use App\Models\Message;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommunitySeeder extends Seeder
{
    public function run(): void
    {
        $ana = User::firstOrCreate(['email' => 'ana@ghota.io'], ['name' => 'Ana Rita', 'password' => bcrypt('password')]);
        $mario = User::firstOrCreate(['email' => 'mario@ghota.io'], ['name' => 'Mário Carlos', 'password' => bcrypt('password')]);
        $joao = User::firstOrCreate(['email' => 'joao@ghota.io'], ['name' => 'João Pereira', 'password' => bcrypt('password')]);
        $sofia = User::firstOrCreate(['email' => 'sofia@ghota.io'], ['name' => 'Sofia Mendes', 'password' => bcrypt('password')]);
        $rui = User::firstOrCreate(['email' => 'rui@ghota.io'], ['name' => 'Rui Costa', 'password' => bcrypt('password')]);

        $this->makeCommunity([
            'owner' => $ana,
            'name' => 'Design Systems na Prática',
            'desc' => 'Nesta comunidade vamos explorar como construir e manter sistemas de design escaláveis. Partilhamos recursos, discutimos decisões de componentização e revemos padrões de UI/UX.',
            'plans' => [
                ['name' => 'Gratuito', 'price' => 0, 'is_free' => true, 'desc' => 'Acesso a canais públicos e recursos gratuitos'],
                ['name' => 'Apoiante', 'price' => 4.99, 'desc' => 'Acesso a canais exclusivos e eventos mensais'],
                ['name' => 'Pro', 'price' => 9.99, 'desc' => 'Tudo do Apoiante + mentorias e code reviews'],
            ],
            'members' => [$mario],
            'channels' => ['boas-vindas', 'geral', 'anúncios', 'dúvidas', 'partilhas'],
            'messages' => [
                [$ana, 'Olá a todos! 👋 Bem-vindos à comunidade Design Systems na Prática!'],
                [$mario, 'Obrigado! Finalmente uma comunidade focada em design systems em PT 🙌'],
                [$ana, 'Sim! A ideia é partilharmos recursos, dúvidas e projetos reais. Comecem por apresentar-se no canal #geral!'],
                [$mario, 'Já agora, alguém recomenda algum tooling para documentação de componentes?'],
                [$ana, 'Eu recomendo o Storybook + MDX. Mas também há o Style Dictionary se quiseres algo mais focado em tokens!'],
                [$mario, 'Boa dica! Vou explorar o Style Dictionary. Algum recurso para começar?'],
                [$ana, 'Sim, partilhei um link no canal #recursos. Dá uma olhada!'],
            ],
        ]);

        $this->makeCommunity([
            'owner' => $mario,
            'name' => 'DevOps na Vida Real',
            'desc' => 'Da teoria à prática: pipelines, infraestrutura como código, monitorização e tudo o que envolve o dia-a-dia de uma equipa de DevOps.',
            'plans' => [
                ['name' => 'Acesso Total', 'price' => 19.99, 'desc' => 'Acesso vitalício a todos os canais e recursos'],
            ],
            'members' => [$ana, $joao],
            'channels' => ['boas-vindas', 'geral', 'infra', 'ci-cd', 'monitoring'],
            'messages' => [
                [$mario, 'Bem-vindos ao DevOps na Vida Real! 🚀 Vamos transformar teoria em prática.'],
                [$ana, 'Excelente iniciativa! Uso Terraform + AWS no dia-a-dia, posso ajudar quem tiver dúvidas.'],
                [$joao, 'Alguém aqui já migrou de Jenkins para GitHub Actions? Vale a pena?'],
                [$mario, 'Sim! Fizemos essa migração no ano passado. Muito mais simples de manter.'],
                [$joao, 'E em termos de performance comparam como?'],
                [$mario, 'Para a maioria dos casos é equivalente. A grande vantagem é a integração nativa com o ecossistema GitHub.'],
            ],
        ]);

        $this->makeCommunity([
            'owner' => $ana,
            'name' => 'React Avançado',
            'desc' => 'Comunidade para developers React que querem ir além do básico. Padrões avançados, performance, arquitetura de componentes, estado global e muito mais.',
            'plans' => [
                ['name' => 'Mensal', 'price' => 9.99, 'desc' => 'Acesso mensal com cancelamento anytime'],
                ['name' => 'Anual', 'price' => 89.99, 'desc' => '2 meses grátis! Acesso anual completo'],
                ['name' => 'Vitalício', 'price' => 149.99, 'desc' => 'Acesso para sempre + ofertas exclusivas'],
            ],
            'members' => [$mario, $sofia],
            'channels' => ['boas-vindas', 'geral', 'padrões', 'performance', 'code-review'],
            'messages' => [
                [$ana, 'Bem-vindos ao React Avançado! 🎉 Vamos levar o React ao próximo nível.'],
                [$sofia, 'Adoro! Finalmente um sítio para discutir padrões sem ser "como fazer um fetch".'],
                [$mario, 'Alguém tem experiência com Server Components em produção?'],
                [$ana, 'Ainda é cedo para produção na minha opinião, mas estou a testar num side project.'],
                [$sofia, 'Também estou a explorar. O que acham do uso com estado global (Zustand)?'],
                [$ana, 'Funciona bem! A chave é manter os server components puros e usar client components apenas onde precisas de interatividade.'],
            ],
        ]);

        $this->makeCommunity([
            'owner' => $joao,
            'name' => 'Fotografia para Devs',
            'desc' => 'Uma comunidade para developers que querem aprender fotografia. Desde composição e iluminação a edição e equipamento.',
            'plans' => [
                ['name' => 'Gratuito', 'price' => 0, 'is_free' => true, 'desc' => 'Acesso a canais públicos e desafios semanais'],
                ['name' => 'Premium', 'price' => 5.99, 'desc' => 'Tutoriais exclusivos e críticas ao portfólio'],
            ],
            'members' => [$sofia, $rui],
            'channels' => ['boas-vindas', 'geral', 'equipamento', 'edição', 'desafios'],
            'messages' => [
                [$joao, 'Boas! 👋 Criei esta comunidade para juntar devs que gostam de fotografia. Partilhem os vossos clicks!'],
                [$sofia, 'Boa ideia! Comecei há pouco tempo com uma Sony A6400. Alguma dica para começar?'],
                [$rui, 'Ótima câmara! O meu conselho: gasta tempo a aprender composição antes de comprar mais equipamento.'],
                [$joao, 'Concordo! A "regra dos terços" e o uso de luz natural fazem toda a diferença.'],
                [$sofia, 'Vou pesquisar sobre isso. Algum canal no YouTube que recomendem?'],
                [$joao, 'Recomendo o Sean Tucker e o James Popsys. São excelentes para iniciados.'],
            ],
        ]);

        $this->makeCommunity([
            'owner' => $sofia,
            'name' => 'Product Design Weekly',
            'desc' => 'Discussões semanais sobre product design: research, prototipagem, design systems, testes de usabilidade e carreira.',
            'plans' => [
                ['name' => 'Gratuito', 'price' => 0, 'is_free' => true, 'desc' => 'Acesso às discussões semanais no canal público'],
                ['name' => 'Mentoria', 'price' => 14.99, 'desc' => 'Sessões de mentoria em grupo + feedback ao portfólio'],
            ],
            'members' => [$ana, $rui],
            'channels' => ['boas-vindas', 'geral', 'tema-da-semana', 'portfólio', 'vagas'],
            'messages' => [
                [$sofia, 'Olá pessoal! 🙌 Esta semana vamos discutir: "Figma vs Penpot — vale a pena migrar?"'],
                [$ana, 'Bom tema! Usei Penpot num projeto recente e surpreendeu-me pela positiva.'],
                [$rui, 'Ainda estou no Figma mas a Penpot tem evoluído muito. O que sentes mais falta?'],
                [$ana, 'Component variants e auto layout são melhores no Figma. Mas para projetos open source a Penpot é imbatível.'],
                [$sofia, 'Concordo. Acho que depende do contexto. Para equipas pequenas, a Penpot já serve perfeitamente.'],
                [$rui, 'Vou experimentar este fim-de-semana. Obrigado pelas dicas!'],
            ],
        ]);

        $this->command->info('5 comunidades mock criadas com planos customizáveis!');
        $this->command->info('Users: ana@ghota.io, mario@ghota.io, joao@ghota.io, sofia@ghota.io, rui@ghota.io — password');
    }

    private function makeCommunity(array $data): void
    {
        $slug = str($data['name'])->slug();
        $existing = Community::where('slug', $slug)->first();
        if ($existing) {
            return;
        }

        $community = Community::create([
            'owner_id' => $data['owner']->id,
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['desc'],
            'is_visible' => true,
        ]);

        Membership::create([
            'community_id' => $community->id,
            'user_id' => $data['owner']->id,
            'role' => 'owner',
        ]);

        foreach ($data['members'] as $member) {
            Membership::create([
                'community_id' => $community->id,
                'user_id' => $member->id,
                'role' => 'member',
            ]);
        }

        foreach ($data['plans'] as $i => $plan) {
            Plan::create([
                'community_id' => $community->id,
                'name' => $plan['name'],
                'price' => $plan['price'],
                'description' => $plan['desc'] ?? null,
                'is_free' => $plan['is_free'] ?? false,
                'sort_order' => $i + 1,
            ]);
        }

        $channels = collect();
        $category = \App\Models\Category::create([
            'community_id' => $community->id,
            'name' => 'Canais de texto',
            'order' => 0,
        ]);
        foreach ($data['channels'] as $i => $name) {
            $channels->push(Channel::create([
                'community_id' => $community->id,
                'category_id' => $category->id,
                'name' => $name,
                'type' => 'text',
                'order' => $i + 1,
            ]));
        }

        foreach ($data['messages'] as $j => [$user, $content]) {
            Message::create([
                'channel_id' => $channels[0]->id,
                'user_id' => $user->id,
                'content' => $content,
                'created_at' => now()->subHours(count($data['messages']) - $j),
            ]);
        }
    }
}
