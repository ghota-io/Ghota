# Artisan Commands

> Localização: `app/Console/Commands/`

## `ArchiveOldMessages.php`

```
php artisan messages:archive
```

**Função:** Move mensagens com mais de 30 dias da tabela `messages` para `message_archives`.

**Agendamento:** Diário no `Kernel.php`:
```php
Schedule::command('messages:archive')->daily();
```

## Comandos Úteis (Dev)

```bash
# Migrations
php artisan migrate
php artisan migrate:fresh --seed

# Cache
php artisan config:clear       # necessário após alterar .env
php artisan cache:clear
php artisan route:clear

# Queue
php artisan queue:work

# Reverb
php artisan reverb:start

# Horizon (monitorização)
php artisan horizon

# Tinker
php artisan tinker
```
