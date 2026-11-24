# Portofolio - Astogiri

Website portofolio pribadi yang bisa dikirim ke siapa saja melalui link (contoh: `https://portofolio-astogiri.vercel.app`).

## Fitur

- Halaman portfolio responsif (mobile-friendly)
- Form kontak → pesan disimpan ke Firestore (Firebase)
- Data proyek & profil → diambil dari Firestore
- Fallback otomatis ke data contoh bila Firebase belum aktif / error / offline
- Desain dengan efek typing di hero

## Cara Deploy ke Vercel (website publik / bisa dikirim via link)

1. Push folder ini ke GitHub (sudah termasuk konfigurasi Vercel):
   ```bash
   git add .
   git commit -m "Update portofolio"
   git push origin main
   ```
2. Install Vercel CLI: `npm i -g vercel`
3. Jalankan: `vercel` di folder `portofolio/`
4. Deploy production: `vercel --prod`

Atau hubungkan repo GitHub `astogiri7708-gif/portfolio` lewat dashboard Vercel → import project → deploy.

## Struktur

```
portofolio/
├── index.html         # Halaman utama
├── style.css          # Gaya website
├── script.js          # Logic UI + integrasi Firebase
├── firebase-config.js # Konfigurasi Firebase (diisi dari console)
├── vercel.json        # Konfigurasi Vercel
└── README.md
```

## Struktur Firestore

### `profile/main` (dokumen)
```json
{
  "name": "Astogiri",
  "bio": "...",
  "about": "...",
  "biodata": { "Nama Lengkap": "Astogiri", "Email": "..." },
  "skills": ["Git", "Memasak"]
}
```

### `projects` (koleksi)
```json
{
  "title": "...",
  "description": "...",
  "tags": ["HTML", "CSS"],
  "link": "https://...",
  "image": "https://...",
  "createdAt": "<timestamp>"
}
```

### `messages` (koleksi, ditulis dari form)
```json
{
  "name": "...",
  "email": "...",
  "message": "...",
  "createdAt": "<timestamp>"
}
```
