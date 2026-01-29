# Info Banjir Bekasi

Aplikasi Next.js untuk pelaporan banjir realtime wilayah Bekasi menggunakan Firebase Auth + Firestore dan peta interaktif.

## Persiapan

1. Buat project Firebase dan aktifkan **Authentication (Email/Password)** + **Cloud Firestore**.
2. Salin konfigurasi web Firebase ke environment variables berikut:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

3. Jalankan aplikasi:

```
npm install
npm run dev
```

## Struktur utama

- `app/page.tsx` — Halaman utama dengan peta, legenda level banjir, dan daftar laporan.
- `components` — Komponen UI (login, form laporan, peta, daftar laporan).
- `lib/firebase.ts` — Inisialisasi Firebase.
