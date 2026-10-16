# MANIFES ASET PIXEL — "Menara Musim Abadi"

Dibuat oleh: **Kuas🎨** (Kepala Divisi Ilustrasi) · 2026-10-17
Metode: pixel art prosedural (digambar piksel demi piksel, palet terbatas) — **semua karakter, musuh, bos, dan latar 100% ORIGINAL**. Referensi dari Arkasha dipakai HANYA untuk gaya rendering (potret setengah badan, shading lembut palet terbatas, rasa bingkai kartu); desain karakter referensi TIDAK ditiru.

**Total paket: 54 berkas PNG = 114,0 KB** (anggaran ±1,5 MB — terpakai <8%). Semua karakter/musuh/bos PNG transparan; latar opak. Skrip sumber: `_sumber/buat_aset.py` (seluruh paket bisa di-generate ulang dari nol).

---

## 1. HERO — Sang Penjaga Lentera (original)

Sosok bertudung palet biru-abu/teal redup, syal karat, membawa lentera menyala; wajah terlihat & ekspresif. Kanvas 64×80 px per frame.

| Berkas | Isi | Ukuran | Dipakai untuk |
|---|---|---|---|
| `hero/hero-sheet.png` | Sprite sheet 14 frame berjajar (896×80) | 5.228 B | Sumber utama animasi hero di situs |
| `hero/hero-potret.png` | Potret utama (= idle frame 1) | 1.308 B | Kartu profil/dialog hero |
| `hero/frame/hero-*.png` | 14 frame individual (di bawah) | ±1,1–1,4 KB/frame | Alternatif bila situs tak pakai sheet |

**Urutan frame pada sheet (indeks 0–13, tiap frame 64 px, offset x = indeks×64):**

| Indeks | Berkas frame | Keadaan animasi |
|---|---|---|
| 0–1 | `hero-idle-1/2.png` | **idle/kedip** — 2 frame: mata terbuka → berkedip |
| 2–3 | `hero-angguk-1/2.png` | **mengangguk** — 2 frame: tegak → kepala turun 2px, mata tertutup |
| 4–5 | `hero-senyum-1/2.png` | **senyum** — 2 frame: senyum mata terbuka → senyum mata gembira (∧ ∧) |
| 6–7 | `hero-sedih-1/2.png` | **khawatir/sedih** — 2 frame: alis khawatir, mulut cemberut, kilau air mata; frame 2 kepala menunduk 1px |
| 8–9 | `hero-terluka-1/2.png` | **terluka** — 2 frame: mata > <, mulut ternganga; frame 2 + bintang benturan & keringat, kepala bergeser |
| 10–11 | `hero-serang-1/2.png` | **menyerang** — 2 frame: sikap tekad lentera di bawah → lentera terangkat dengan semburan cahaya (flare) |
| 12–13 | `hero-kalah-1/2.png` | **kalah/pingsan** — 2 frame: tubuh merosot, tudung lemas, mata tertutup, lentera jatuh & PADAM di tanah; frame 2 merosot 1px lebih dalam |

Animasi hemat sesuai permintaan: putar 2 frame bergantian (loop untuk idle; sekali jalan untuk angguk/senyum/terluka/serang; berhenti di frame 2 untuk kalah).

## 2. MUSUH — 9 potret (3 per Bab), kanvas 48×48

Tiap musuh: 2 frame idle (frame 2 = bob naik-turun 1px) + 1 sheet gabungan 96×48.

| Berkas (sheet) | Musuh | Bab | Ukuran sheet | Catatan siluet |
|---|---|---|---|---|
| `musuh/bab1-serigala-salju-sheet.png` | Serigala Salju | 1 — kaki menara | 772 B | Serigala putih salju, mata teal |
| `musuh/bab1-golem-es-sheet.png` | Golem Es | 1 | 709 B | Bongkahan es berduri, mata gelap menyala |
| `musuh/bab1-hantu-salju-sheet.png` | Hantu Salju | 1 | 683 B | Jubah putih melayang, wajah gelap, sisa syal karat |
| `musuh/bab2-ksatria-patung-sheet.png` | Ksatria Patung | 2 — interior batu | 757 B | Patung ksatria berzirah, perisai, retak berlumut |
| `musuh/bab2-kelelawar-gua-sheet.png` | Kelelawar Gua | 2 | 747 B | Sayap lebar ungu-abu, bertaring |
| `musuh/bab2-roh-perapian-sheet.png` | Roh Perapian | 2 | 713 B | Roh api oranye (aksen hangat di aula dingin) |
| `musuh/bab3-burung-hantu-aurora-sheet.png` | Burung Hantu Aurora | 3 — puncak | 945 B | Burung hantu teal, bintik bintang di dada |
| `musuh/bab3-peri-aurora-sheet.png` | Peri Aurora | 3 | 751 B | Peri bersayap, gaun hijau aurora, tongkat berkilau |
| `musuh/bab3-pecahan-bintang-sheet.png` | Pecahan Bintang | 3 | 805 B | Kristal melayang berinti cahaya + pecahan pengorbit |

Frame individual: `musuh/<slug>-1.png` & `-2.png` (±510–680 B per berkas).

## 3. BOS — 3 potret besar, kanvas 80×80 (±950–1.060 B per berkas)

| Berkas | Bos | Bab | Isi |
|---|---|---|---|
| `bos/bos-bab1-raja-beruang-es.png` | Raja Beruang Es | 1 | Beruang es raksasa bermahkota taring es, bekas luka di wajah, cakar terlihat |
| `bos/bos-bab2-golem-perapian-raksasa.png` | Golem Perapian Raksasa | 2 | Golem batu bertubuh tungku: pintu perapian menyala di perut, cerobong bahu berasap |
| `bos/bos-bab3-naga-aurora.png` | Naga Aurora | 3 | Naga bersisik teal-hijau aurora, sayap ungu, tanduk pucat, mata emas |

## 4. LATAR ADAPTIF — 192×108 (resolusi asli kecil, tampilkan `image-rendering: pixelated`)

Satu adegan per Bab + 1 varian malam per Bab (untuk transisi waktu/cuaca di dalam Bab).

| Berkas | Adegan | Ukuran |
|---|---|---|
| `latar/latar-bab1-kaki-menara.png` | Kaki menara: badai salju senja, siluet menara raksasa, matahari redup, pinus, padang salju | 2.565 B |
| `latar/latar-bab1-kaki-menara-malam.png` | Varian malam Bab 1 (biru malam + bulan sabit) | 2.672 B |
| `latar/latar-bab2-aula-batu.png` | Interior: aula batu, 2 jendela lengkung ber-es dengan cahaya pucat, kolom, panji teal | 2.392 B |
| `latar/latar-bab2-aula-batu-malam.png` | Varian malam Bab 2 (aula menggelap, jendela redup) | 2.237 B |
| `latar/latar-bab3-puncak-aurora.png` | Puncak menara di bawah aurora (pita hijau & ungu), bintang, parapet berpanji, titik lentera hangat | 3.647 B |
| `latar/latar-bab3-puncak-aurora-malam.png` | Varian malam Bab 3 (aurora lebih dalam, langit lebih pekat) | 3.633 B |

Tinggi adegan naik per Bab: tanah bersalju (Bab 1) → ruang tertutup (Bab 2) → atap di atas awan bintang (Bab 3) — rasa "makin tinggi" terbaca dari palet & elemen langitnya.

## 5. UI — Bingkai Kartu

| Berkas | Isi | Ukuran | Cara pakai |
|---|---|---|---|
| `ui/bingkai-kartu.png` | Bingkai kartu berhias original tema es/batu: pita es biru, garis emas, permata pirus di 4 sudut, es menggantung di sisi atas; tengah TRANSPARAN, kanvas 80×100 | 764 B | Tumpuk DI ATAS potret 64×80 yang digeser ke offset (8, 10) — potret pas di lubang bingkai |

## 6. Pratinjau

| Berkas | Isi |
|---|---|
| `pratinjau/contact-sheet.png` | Satu gambar berisi: hero 14 frame, 9 musuh, 3 bos, contoh bingkai terpasang, 3 latar + 3 varian malam (54.395 B — hanya untuk pratinjau, TIDAK perlu dimuat situs) |

## Catatan keterbatasan (jujur)

- Animasi memang disederhanakan demi anggaran & permintaan Arkasha: semua keadaan 2 frame (kalah 2 frame), tanpa frame antara. Gerakan terbaca sebagai pergantian pose, bukan animasi mulus.
- Musuh hanya punya idle bob 1px (bukan animasi serangan/kalah sendiri); bos 1 pose statis per ekor — efek tempur (goyang, kedip merah, dsb.) lebih hemat dilakukan dari sisi situs (CSS/JS) di atas aset ini.
- Bingkai dibuat sebagai aset terpisah (bukan dibakar ke potret) supaya satu bingkai melayani semua karakter; konsekuensinya situs perlu menumpuk 2 gambar — tetap ringan (764 B).
- Varian malam latar dibuat dari transformasi palet adegan utama (+ bulan di Bab 1), bukan lukisan ulang penuh — cukup untuk transisi, bukan adegan baru.
