# Panduan Deployment ke VPS Debian 12 (Docker + Nginx)

Dokumen ini berisi panduan untuk men-*deploy* Sistem Informasi Keuangan RT ke Virtual Private Server (VPS) bersistem operasi Debian 12.

## 1. Persiapan VPS
Pastikan Anda sudah login ke VPS Anda melalui SSH:
```bash
ssh root@ip_address_vps
```

## 2. Instalasi Docker dan Docker Compose
Jalankan perintah berikut untuk menginstal Docker:

```bash
# Update repository
apt update && apt upgrade -y

# Instal dependensi
apt install apt-transport-https ca-certificates curl software-properties-common -y

# Tambahkan GPG Key Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Tambahkan Repository Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update repository dan instal Docker
apt update
apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

# Verifikasi instalasi
docker --version
docker compose version
```

## 3. Clone Repository
Unggah kode sumber proyek ini ke VPS Anda, misalnya di direktori `/var/www/sistem-rt`.

```bash
mkdir -p /var/www/sistem-rt
cd /var/www/sistem-rt
# Clone atau copy file proyek ke dalam folder ini
```

## 4. Konfigurasi Environment (Penting!)
Pastikan Anda mengganti password database dan rahasia JWT sebelum *deploy* ke produksi. Buka file `docker-compose.yml` dan sesuaikan nilainya.

## 5. Build dan Jalankan Aplikasi
Jalankan perintah `docker compose` untuk mem-*build* dan menjalankan seluruh service (Database, Backend, Frontend).

```bash
docker compose up -d --build
```

Proses ini akan mengunduh *images* yang dibutuhkan dan mem-*build* aplikasi Backend dan Frontend.

## 6. Konfigurasi Database (Migrasi Prisma)
Setelah *container* menyala, kita perlu melakukan inisialisasi tabel database (Migrasi) dan Seeding data awal.

```bash
# Masuk ke container backend untuk menjalankan Prisma
docker compose exec backend npx prisma migrate deploy

# (Opsional) Jika Anda memiliki seed script:
docker compose exec backend npx prisma db seed
```

## 7. Setup Nginx Reverse Proxy (Opsional / Disarankan)
Jika Anda ingin menggunakan Nginx di *host* VPS (bukan dari dalam Docker) untuk mengatur domain (misalnya `keuangan-rt.com`), instal Nginx:

```bash
apt install nginx -y
```

Buat konfigurasi baru di `/etc/nginx/sites-available/keuangan-rt`:

```nginx
server {
    listen 80;
    server_name keuangan-rt.com www.keuangan-rt.com;

    location / {
        proxy_pass http://localhost:80; # Port frontend Docker
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:5000; # Port backend Docker
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
ln -s /etc/nginx/sites-available/keuangan-rt /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 8. Selesai
Aplikasi sekarang dapat diakses melalui IP address VPS atau nama domain yang telah Anda atur.
