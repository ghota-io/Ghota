#!/bin/bash
set -e

php artisan route:cache
php artisan config:cache
php-fpm -D
nginx -g 'daemon off;'
