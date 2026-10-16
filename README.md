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

## Teknis

Situs statis murni (HTML/CSS/JS, tanpa backend), data-driven — encounter adalah data di
`data.js`, mesin di `engine.js`, UI di `game.js`. Jalan offline sesudah termuat;
progres tersimpan di localStorage peramban.
