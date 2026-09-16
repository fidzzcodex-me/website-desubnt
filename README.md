# Web Design Inspector

Web app untuk membaca struktur desain sebuah website dari URL: warna, tipografi, motion, layout signals, stack tebakan, dan assets. Dibangun dengan React (Next.js) dan Tailwind CSS.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Struktur halaman

- `/` — landing page yang menjelaskan seluruh sistem dan fitur.
- `/analyzer` — form input URL dan hasil laporan analisis.
- `/api/analyze` — endpoint POST `{ url }` yang melakukan fetch server-side, parsing, dan deteksi.
- `404` — halaman kustom untuk path yang tidak ada, tanpa membocorkan struktur file.

## Deploy ke Vercel

1. Push project ini ke repository GitHub/GitLab/Bitbucket.
2. Buka [vercel.com/new](https://vercel.com/new) dan import repository tersebut.
3. Framework preset otomatis terdeteksi sebagai **Next.js**, biarkan default build command (`next build`) dan output.
4. Klik **Deploy**.

Atau lewat CLI:

```bash
npm install -g vercel
vercel
```

## Catatan teknis

- Deteksi warna, font, motion, stack, dan layout berbasis parsing HTML/CSS statis (cheerio), bukan hasil render penuh browser — sehingga animasi yang murni dikendalikan JavaScript runtime mungkin tidak terbaca.
- Endpoint `/api/analyze` membatasi ukuran respons (3MB), waktu tunggu fetch (13 detik), dan memblokir target ke alamat internal/localhost sebagai proteksi dasar.
- Riwayat scan disimpan di `localStorage` browser pengguna, tidak dikirim ke server.
- Cache hasil analisis disimpan sementara di memori server (TTL 20 menit) untuk mengurangi fetch berulang pada URL yang sama.
