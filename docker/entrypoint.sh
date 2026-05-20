#!/bin/bash
set -e

cd /var/www/backend

# Ejecutar migraciones automáticamente al arrancar
php artisan migrate --force
#php artisan db:seed --force        # Solo si tienes seeders de datos de prueba
php artisan storage:link --force   # Necesario para imágenes y QR
php artisan config:cache
php artisan route:cache

exec "$@"
