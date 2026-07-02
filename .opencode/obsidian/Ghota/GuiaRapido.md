# Guia Rápido

> Setup completo para começar a desenvolver.

## 1. Iniciar Containers

```bash
docker compose up -d
```

## 2. Instalar Dependências

```bash
docker compose exec app composer install
docker compose exec app npm install
```

## 3. Configurar `.env`

```bash
cp .env.example .env
# editar .env com valores reais (Stripe keys, etc.)
```

## 4. Correr Migrations + Seeders

```bash
docker compose exec -u $(id -u):$(id -g) app php artisan migrate:fresh --seed
```

## 5. Dev Server (Vite HMR)

```bash
docker compose exec app npm run dev
```

Abrir `http://localhost:8080`.

## 6. Stripe Webhooks (Dev)

```bash
stripe listen --forward-to http://localhost:8080/stripe/webhook
```

## 7. Credenciais de Teste

| Email | Password | Role |
|---|---|---|
| ana@ghota.io | password | Owner (Design Systems, React) |
| mario@ghota.io | password | Owner (DevOps) |
| joao@ghota.io | password | Owner (Fotografia) |
| sofia@ghota.io | password | Owner (Product Design, Design Critique) |
| rui@ghota.io | password | Owner (Tech Founders) |

Todas as contas têm `stripe_connect_status: completed`.

## Comandos Úteis

```bash
# PHP
docker compose exec -u $(id -u):$(id -g) app php artisan tinker

# Queue
docker compose exec app php artisan queue:work

# Reverb (websockets)
docker compose exec app php artisan reverb:start

# Cache (obrigatório após alterar .env)
docker compose exec app php artisan config:clear

# Logs
docker compose logs -f app

# Migrations isoladas (sem seed)
docker compose exec -u $(id -u):$(id -g) app php artisan migrate

# Build para produção
docker compose exec app npm run build
```

## Notas

- Ficheiros criados dentro do container ficam `root:root` — usar `-u $(id -u):$(id -g)`.
- Cartão de teste Stripe: `4242 4242 4242 4242` (qualquer data/CVC).
- Após alterar `.env`, correr `php artisan config:clear`.
