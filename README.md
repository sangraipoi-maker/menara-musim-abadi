# 🏮 Menara Musim Abadi

Game web **roguelike RPG berbasis teks** berbahasa Indonesia, dimainkan dari browser HP.
Seluruh cerita, nama, musuh, dan event adalah karya **original**.

**Main:** https://sangraipoi-maker.github.io/menara-musim-abadi/

## Cerita

Kamu adalah **Saka**, penjaga lentera terakhir Desa Bara. Musim dingin abadi menyelimuti negeri,
dan satu-satunya cara mengakhirinya adalah menaiki **Menara Sunyi** di ujung utara — 24 lantai,
3 Bab, 3 bos — dan menghadapi Ibu Musim, Penenun Salju Abadi, di puncaknya.

## Cara Bermain

- Pertarungan bergiliran: **Serang · Bertahan · Ramuan · Keahlian** (memakai Tenaga 🔋).
- Perhatikan **niat musuh**: ⚠️ berarti serangan besar datang giliran berikutnya.
- Sesudah menang, pilih 1 dari 3 upah. Event teks menyimpan tawaran berisiko — termasuk yang berharga darah.
- Singgah di peristirahatan dan lapak pedagang untuk bertahan lebih jauh.
- Mati = run berakhir. Namun **Ingatan Menara** (localStorage) menyimpan rekor, jumlah run,
  dan sifat awal baru yang terbuka dari pencapaian — plus autosave run yang sedang berjalan.

## Isi v1

- 3 Bab × 8 lantai = 24 lantai, masing-masing ditutup bos
- 24 musuh unik (15 biasa, 6 elite, 3 bos) · 15 event cerita bercabang
- 5 keahlian · 18 sifat (11 di tengah run + 7 sifat awal meta) · 5 senjata & 4 zirah berjenjang
- Pedagang, peristirahatan, jebakan/dadu keberuntungan, sifat awal yang bisa dibuka permanen

## v2 — Lapisan Visual Pixel Art

- **Potret karakter berbingkai kartu** di panggung di atas log cerita: Saka (kiri) dan
  potret musuh saat pertarungan (kanan; potret bos lebih besar + animasi "napas" CSS).
- **Animasi loop 2 frame digerakkan event** (paket original Kuas🎨, lihat
  `aset-pixel/MANIFES.md`): idle/kedip selalu berjalan; angguk untuk konfirmasi pilihan;
  senyum saat menang/hadiah; khawatir (berkas status "sedih") untuk pilihan berisiko &
  HP ≤30%; terluka saat kena pukul; menyerang saat aksi Serang/Keahlian; kalah berhenti
  di frame 2 saat run berakhir. Antrean animasi dimainkan berurutan (serang → terluka → senyum).
- **24 musuh game dipetakan ke 9 arketipe potret** (3 per Bab) + 3 potret bos khusus per Bab.
- **Latar adaptif ala menara**: berganti per Bab (kaki menara bersalju → aula batu →
  puncak aurora) dengan crossfade ±0,9 detik; nuansa bergeser per pita lantai
  (lantai 1–3 adegan dasar, 4–6 peredupan, 7–8 varian malam).
- Anggaran gambar: seluruh paket 114,0 KB; yang dimuat situs 47,7 KB (anggaran ±1,5 MB).
  Semua tampil `image-rendering: pixelated`. Lapisan visual ada di `visual.js`; bila sebuah
  berkas aset hilang, potretnya disembunyikan anggun — game tetap berjalan.

## Teknis

Situs statis murni (HTML/CSS/JS, tanpa backend), data-driven — encounter adalah data di
`data.js`, mesin di `engine.js`, UI di `game.js`, lapisan visual di `visual.js`.
Jalan offline sesudah termuat; progres tersimpan di localStorage peramban.
