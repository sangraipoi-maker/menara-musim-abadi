/* ============================================================
   MENARA MUSIM ABADI — lapisan visual v2
   Potret karakter pixel art berbingkai + animasi loop 2 frame
   yang digerakkan event game + latar pixel art adaptif
   (berganti per Bab dan bergeser nuansa per pita lantai).

   Semua berkas gambar berasal dari paket aset original Kuas🎨
   di folder aset-pixel/ (lihat aset-pixel/MANIFES.md).
   Berkas yang belum ada TIDAK pernah ditampilkan sebagai gambar
   rusak: potret/latar yang gagal dimuat disembunyikan anggun.
   ============================================================ */
(function () {
'use strict';
var E = window.ENGINE;

/* ---------------- Peta aset (satu-satunya tempat jalur ditulis) ---------------- */
var DASAR = 'aset-pixel/';
var HERO_DIR = DASAR + 'hero/frame/';
var MUSUH_DIR = DASAR + 'musuh/';
var BOS_DIR = DASAR + 'bos/';
var LATAR_DIR = DASAR + 'latar/';

/* Nama status di berkas Kuas: hero-<status>-<i>.png (i = 1..2).
   Keadaan "khawatir" memakai berkas status "sedih" (alis cemas + air mata).
   Frame idle ke-2 adalah frame kedip (mata tertutup) — kedip adalah
   bagian dari loop idle, bukan berkas terpisah. */
var HERO_STATUS = { idle: 'idle', angguk: 'angguk', senyum: 'senyum', khawatir: 'sedih', terluka: 'terluka', serang: 'serang', kalah: 'kalah' };
/* Durasi tampil tiap frame (ms): idle asimetris agar frame kedip terbaca sebagai kedipan. */
var HERO_DURASI = { idle: [1500, 170], angguk: [300, 300], senyum: [430, 430], khawatir: [560, 560], terluka: [380, 380], serang: [240, 300], kalah: [900, 900] };
function heroUrl(keadaan, i) { return HERO_DIR + 'hero-' + HERO_STATUS[keadaan] + '-' + (i + 1) + '.png'; }
/* Peta potret musuh: 24 musuh game dipetakan ke 9 arketipe visual Kuas
   (3 per Bab, dipilih yang siluet/temanya paling dekat). Bos memakai
   potret besar khusus per Bab. Lihat aset-pixel/MANIFES.md. */
var MUSUH_VISUAL = {
  'serigala-salju': 'bab1-serigala-salju', 'gagak-es': 'bab1-hantu-salju', 'boneka-salju': 'bab1-golem-es',
  'penjarah-makam': 'bab1-hantu-salju', 'landak-es': 'bab1-golem-es', 'serigala-alfa': 'bab1-serigala-salju',
  'patung-penjaga': 'bab1-golem-es',
  'golem-uap': 'bab2-roh-perapian', 'tikus-bara': 'bab2-kelelawar-gua', 'ksatria-karat': 'bab2-ksatria-patung',
  'lumpur-oli': 'bab2-roh-perapian', 'burung-besi': 'bab2-kelelawar-gua', 'algojo-menara': 'bab2-ksatria-patung',
  'kembar-katup': 'bab2-roh-perapian',
  'bayangan-beku': 'bab3-peri-aurora', 'pendeta-musim': 'bab3-peri-aurora', 'cermin-lapar': 'bab3-pecahan-bintang',
  'anjing-akhir': 'bab3-burung-hantu-aurora', 'penenun-muda': 'bab3-peri-aurora', 'raja-tanpa-wajah': 'bab3-peri-aurora',
  'penjaga-gugur': 'bab3-peri-aurora'
};
var BOS_VISUAL = { 1: 'bos-bab1-raja-beruang-es', 2: 'bos-bab2-golem-perapian-raksasa', 3: 'bos-bab3-naga-aurora' };
function musuhUrl(musuh, i) {
  if (musuh.tier === 'boss') return BOS_DIR + BOS_VISUAL[musuh.act] + '.png'; // 1 pose statis per bos
  return MUSUH_DIR + MUSUH_VISUAL[musuh.id] + '-' + (i + 1) + '.png';
}
/* Latar per Bab (slug MANIFES); pita 3 memakai varian malam,
   pita 2 adegan yang sama dengan peredupan nuansa dari CSS. */
var LATAR_SLUG = { 1: 'kaki-menara', 2: 'aula-batu', 3: 'puncak-aurora' };
function latarUrl(bab, pita) { return LATAR_DIR + 'latar-bab' + bab + '-' + LATAR_SLUG[bab] + (pita === 3 ? '-malam' : '') + '.png'; }

/* ---------------- Keadaan internal ---------------- */
var hilang = {};            // url -> true bila gagal dimuat
var pernahMuat = false;     // ada aset apa pun yang berhasil dimuat
var dasar = 'idle';         // keadaan dasar (dari fase game)
var antrean = [];           // keadaan sesaat: [{nama, sampai}]
var frameIdx = 0;
var giliranTerakhir = 0;
var musuhKini = null;       // {id, tier} yang potretnya tampil
var musuhFrame = 0;
var musuhGiliran = 0;
var latarKunci = '';        // "bab-pita" yang sedang tampil
var latarDepan = 'a';       // lapisan latar yang sedang terlihat

function $(id) { return document.getElementById(id); }
function bolehTampil(url) { return !hilang[url]; }

function muat(url) {
  var im = new Image();
  im.onload = function () { pernahMuat = true; segarkanPanggung(); };
  im.onerror = function () { hilang[url] = true; segarkanPanggung(); };
  im.src = url;
  return im;
}
function panaskan(url) { if (!hilang[url]) muat(url); }

/* ---------------- Panggung & latar ---------------- */
function pitaDariLantai(lantai) {
  var idx = (Math.max(1, lantai) - 1) % E.FLOORS_PER_ACT; // 0..7 dalam Bab
  return idx <= 2 ? 1 : (idx <= 5 ? 2 : 3);
}
function aturLatar(bab, pita) {
  var kunci = bab + '-' + pita;
  if (kunci === latarKunci) return;
  var url = latarUrl(bab, pita);
  var panggung = $('panggung');
  if (panggung) panggung.className = panggung.className.replace(/\bbab-\d\b/g, '').replace(/\bpita-\d\b/g, '').trim() + ' bab-' + bab + ' pita-' + pita;
  if (!bolehTampil(url)) { latarKunci = kunci; return; }
  var im = new Image();
  im.onload = function () {
    pernahMuat = true;
    var belakang = $(latarDepan === 'a' ? 'latar-b' : 'latar-a');
    var depan = $(latarDepan === 'a' ? 'latar-a' : 'latar-b');
    if (!belakang || !depan) return;
    belakang.style.backgroundImage = 'url("' + url + '")';
    belakang.classList.add('tampak');
    depan.classList.remove('tampak');
    latarDepan = latarDepan === 'a' ? 'b' : 'a';
    latarKunci = kunci;
    segarkanPanggung();
  };
  im.onerror = function () { hilang[url] = true; latarKunci = kunci; };
  im.src = url;
  // panaskan pita berikutnya dalam Bab yang sama + Bab berikutnya
  if (pita < 3) panaskan(latarUrl(bab, pita + 1));
  else if (bab < 3) panaskan(latarUrl(bab + 1, 1));
}
function segarkanPanggung() {
  var p = $('panggung');
  if (!p) return;
  if (!pernahMuat) p.classList.add('kosong');
  else p.classList.remove('kosong');
}

/* ---------------- Potret ---------------- */
function pasangImg(img, url) {
  if (!img) return false;
  if (!bolehTampil(url)) { img.removeAttribute('src'); return false; }
  if (img.getAttribute('src') !== url) {
    img.onerror = function () { hilang[url] = true; img.removeAttribute('src'); sembunyikanBilaKosong(); };
    img.onload = function () { pernahMuat = true; segarkanPanggung(); };
    img.src = url;
  }
  return true;
}
function sembunyikanBilaKosong() {
  var b = $('bingkai-pahlawan');
  if (b && !$('img-pahlawan').getAttribute('src')) b.classList.add('tersembunyi');
  var m = $('bingkai-musuh');
  if (m && !$('img-musuh').getAttribute('src')) m.classList.add('tersembunyi');
}
function keadaanAktif(now) {
  while (antrean.length && now >= antrean[0].sampai) antrean.shift();
  return antrean.length ? antrean[0].nama : dasar;
}

/* Detak animasi: loop 2 frame; durasi per frame mengikuti HERO_DURASI
   (idle asimetris — frame ke-2 adalah kedipan singkat). */
setInterval(function () {
  var imgP = $('img-pahlawan');
  if (!imgP) return;
  var now = Date.now();
  var nama = keadaanAktif(now);
  var durasi = (HERO_DURASI[nama] || [420, 420])[frameIdx % 2];
  if (now - giliranTerakhir >= durasi) {
    if (!(nama === 'kalah' && frameIdx === 1)) frameIdx = (frameIdx + 1) % 2; // kalah berhenti di frame 2 (MANIFES)
    giliranTerakhir = now;
  }
  var bingkai = $('bingkai-pahlawan');
  if (pasangImg(imgP, heroUrl(nama, frameIdx))) { if (bingkai) bingkai.classList.remove('tersembunyi'); }
  else if (bingkai) bingkai.classList.add('tersembunyi');
  // goyangan singkat pada potret musuh mengikuti frame-nya sendiri
  var imgM = $('img-musuh');
  if (imgM && musuhKini && now - musuhGiliran >= 480) {
    musuhFrame = (musuhFrame + 1) % 2; musuhGiliran = now;
    pasangImg(imgM, musuhUrl(musuhKini, musuhFrame));
  }
}, 90);

/* ---------------- API untuk game.js ---------------- */
var VIS = {
  /* Mainkan keadaan sesaat (mengantre sesudah yang sedang berjalan). */
  mainkan: function (nama, durasiMs) {
    if (!HERO_STATUS[nama]) return;
    var mulai = antrean.length ? antrean[antrean.length - 1].sampai : Date.now();
    antrean.push({ nama: nama, sampai: Math.max(Date.now(), mulai) + (durasiMs || 800) });
    if (antrean.length > 4) antrean.splice(0, antrean.length - 4);
    frameIdx = 0; giliranTerakhir = 0;
  },
  /* Sinkronkan keadaan dasar + latar + potret musuh dengan state game. */
  sinkron: function (state) {
    var panggung = $('panggung');
    if (!panggung) return;
    if (!state) { // layar judul: kaki menara + Saka siaga
      dasar = 'idle';
      musuhKini = null;
      $('bingkai-musuh').classList.add('tersembunyi');
      panggung.classList.remove('tersembunyi');
      aturLatar(1, 1);
      Object.keys(HERO_STATUS).forEach(function (k) { panaskan(heroUrl(k, 0)); panaskan(heroUrl(k, 1)); });
      return;
    }
    panggung.classList.remove('tersembunyi');
    var p = state.player;
    if (state.phase === 'gameover') dasar = 'kalah';
    else if (state.phase === 'victory') dasar = 'senyum';
    else if (p.hp > 0 && p.hp <= Math.ceil(p.maxHp * 0.30)) dasar = 'khawatir';
    else dasar = 'idle';

    var lantai = Math.max(1, state.floor || 1);
    aturLatar(E.actOfFloor(lantai), pitaDariLantai(lantai));

    var bingkaiM = $('bingkai-musuh');
    if (state.phase === 'combat' && state.combat && state.combat.enemy) {
      var e = state.combat.enemy;
      if (!musuhKini || musuhKini.id !== e.id) {
        musuhKini = { id: e.id, tier: e.tier, act: e.act };
        musuhFrame = 0; musuhGiliran = 0;
        panaskan(musuhUrl(musuhKini, 0)); panaskan(musuhUrl(musuhKini, 1));
        $('nama-musuh').textContent = e.name;
        $('img-musuh').alt = e.name;
      }
      bingkaiM.classList.toggle('bos', e.tier === 'boss');
      if (pasangImg($('img-musuh'), musuhUrl(musuhKini, musuhFrame))) bingkaiM.classList.remove('tersembunyi');
    } else {
      musuhKini = null;
      bingkaiM.classList.add('tersembunyi');
    }
  },
  /* Untuk uji otomatis: potret keadaan mesin visual saat ini. */
  _debug: function () {
    return {
      dasar: dasar,
      aktif: keadaanAktif(Date.now()),
      antrean: antrean.map(function (a) { return a.nama; }),
      latar: latarKunci,
      musuh: musuhKini ? musuhKini.id : null,
      pernahMuat: pernahMuat,
      hilang: Object.keys(hilang)
    };
  }
};
window.VIS = VIS;
})();
