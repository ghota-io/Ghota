#!/usr/bin/env bash
#set -euo pipefail

echo "=== Building and starting containers ==="
docker compose up -d --build

echo "=== Installing PHP dependencies ==="
docker compose exec app composer install --no-interaction

echo "=== Installing Node dependencies ==="
docker compose exec app npm install --legacy-peer-deps

echo "=== Building frontend ==="
docker compose exec app npm run build

echo "=== Generating app key ==="
docker compose exec app php artisan key:generate --force

echo "=== Running migrations ==="
docker compose exec app php artisan migrate --force

echo "=== Done! ==="
echo "App: http://localhost:8080"
