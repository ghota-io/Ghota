Para Laravel + Google Cloud, o caminho mais direto:
Pacote: spatie/laravel-google-cloud-storage (usa o league/flysystem-google-cloud-storage por baixo)
docker compose exec app composer require spatie/laravel-google-cloud-storage
Setup:
1. Cria um bucket no Cloud Storage (região mais próxima, classe Standard)
2. Gera uma Service Account (IAM → Service Accounts) com papel Storage Object Admin
3. Descarrega a JSON key e mete em storage/app/google-cloud-key.json
4. No .env:
FILESYSTEM_DISK=gcs
GOOGLE_CLOUD_PROJECT=teu-projeto-id
GOOGLE_CLOUD_KEY_FILE=/app/storage/app/google-cloud-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=teu-bucket
GOOGLE_CLOUD_STORAGE_PATH=dev  # prefixo opcional
Uso no código — igual ao local disk, abstraído pelo Laravel:
Storage::put('comunidades/1/foto.jpg', $file);
Storage::url('comunidades/1/foto.jpg');
Para desenvolvimento — se quiseres evitar custos e latência da cloud enquanto estás a fazer debug, podes alternar entre local e gcs só mudando o .env. O código não precisa de alterações porque ambos usam a mesma Storage facade.
Queres que trate desta integração? Posso instalar o pacote e configurar o disk.