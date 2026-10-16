/* ============================================================
   MENARA MUSIM ABADI — lapisan UI (DOM)
   Mesin game ada di engine.js, data di data.js.
   ============================================================ */
(function () {
'use strict';
var D = window.GAMEDATA, E = window.ENGINE;
var QA = location.hash.indexOf('#qa=') === 0 ? location.hash.slice(4) : null;

/* ---------- penyimpanan ---------- */
var store = {
  get: function (k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
};
var K_META = 'mma_meta_v1', K_SAVE = 'mma_save_v1';

var meta = E.defaultMeta();
var tersimpan = store.get(K_META);
if (tersimpan) { Object.keys(tersimpan).forEach(function (k) { meta[k] = tersimpan[k]; }); }
var state = null;
var tampilCara = false;

function persist() {
  if (QA) return;
  store.set(K_META, meta);
  if (state && state.phase !== 'gameover' && state.phase !== 'victory') store.set(K_SAVE, state);
  else store.del(K_SAVE);
}

/* ---------- util ---------- */
function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d; }
function persen(x, y) { return Math.max(0, Math.round(x / y * 100)); }
function app() { return document.getElementById('app'); }

/* ---------- HUD ---------- */
function renderHud() {
  var hud = document.getElementById('hud');
  if (!state || state.phase === 'gameover' || state.phase === 'victory') { hud.className = 'tersembunyi'; return; }
  hud.className = '';
  var p = state.player;
  document.getElementById('hud-lantai').textContent = 'Lantai ' + state.floor + '/' + E.totalFloors();
  document.getElementById('hud-bab').textContent = D.ACTS[E.actOfFloor(Math.max(1, state.floor)) - 1].name.split(' — ')[0];
  document.getElementById('hud-emas').textContent = '💰 ' + p.gold;
  document.getElementById('hud-ramuan').textContent = '🧪 ' + p.potions;
  document.getElementById('hud-hp-isi').style.width = persen(p.hp, p.maxHp) + '%';
  document.getElementById('hud-hp-teks').textContent = '❤️ ' + p.hp + '/' + p.maxHp;
  document.getElementById('hud-atk').textContent = E.atkTotal(state);
  document.getElementById('hud-def').textContent = E.defTotal(state);
  document.getElementById('hud-tenaga').textContent = p.energy + '/' + p.energyMax;
  document.getElementById('hud-blok').textContent = (state.combat && state.combat.playerBlock > 0) ? '🛡️ Blok ' + state.combat.playerBlock : '';
  document.getElementById('hud-peralatan').textContent = '🗡️ ' + E.weaponOf(state).name + ' · 🥋 ' + E.armorOf(state).name;
}

/* ---------- log ---------- */
function logHtml() {
  var items = state.log.slice(-40).map(function (l) { return '<p class="' + l.cls + '">' + l.text + '</p>'; }).join('');
  return '<div id="log">' + items + '</div>';
}
function gulirLog() {
  requestAnimationFrame(function () { var l = document.getElementById('log'); if (l) l.scrollTop = l.scrollHeight; });
}

/* ---------- tas & sifat ---------- */
function tasHtml() {
  var p = state.player;
  var traits = p.traits.map(function (id) { var t = D.TRAITS[id]; return t ? '<div>· ' + t.icon + ' <b>' + t.name + '</b> — ' + t.desc + '</div>' : ''; }).join('');
  var start = D.TRAITS[p.startTrait];
  var skills = p.skills.map(function (id) { var s = D.SKILLS[id]; return '<div>· ' + s.icon + ' <b>' + s.name + '</b> (' + s.cost + '🔋) — ' + s.desc + '</div>'; }).join('');
  return '<details class="kartu"><summary>🎒 Tas, Sifat &amp; Keahlian</summary>' +
    '<div class="mini" style="margin-top:8px">' +
    '<div>· 🏮 Sifat awal: <b>' + (start ? start.name : '-') + '</b></div>' + traits + skills +
    '<div>· 🏆 Pertarungan dimenangkan: ' + state.combatsWon + ' · 💰 Emas terkumpul: ' + state.goldEarned + '</div>' +
    '</div></details>';
}

/* ---------- layar judul ---------- */
function renderTitle() {
  document.getElementById('hud').className = 'tersembunyi';
  var save = QA ? null : store.get(K_SAVE);
  var startIds = Object.keys(D.TRAITS).filter(function (id) { return D.TRAITS[id].kind === 'start'; });
  var pilihan = startIds.map(function (id) {
    var t = D.TRAITS[id], buka = E.traitUnlocked(meta, id);
    var cls = 'sifat-awal' + (meta.selectedStart === id ? ' terpilih' : '') + (buka ? '' : ' terkunci');
    var note = buka ? t.desc : ('🔒 ' + t.desc + ' · Syarat: ' + t.unlockDesc);
    return '<button class="' + cls + '" data-act="pilih-sifat" data-id="' + id + '" ' + (buka ? '' : 'disabled') + '>' +
      '<span class="nama">' + t.icon + ' ' + t.name + '</span><span class="desc">' + note + '</span></button>';
  }).join('');
  var cara = tampilCara ? '<div class="kartu cara"><b>Cara Bermain</b><ul>' +
    '<li>Naiki 24 lantai Menara Sunyi dalam 3 Bab. Setiap Bab ditutup pertarungan bos.</li>' +
    '<li>Pertarungan bergiliran: <b>Serang</b>, <b>Bertahan</b> (blok + tenaga), <b>Ramuan</b>, dan <b>Keahlian</b> (memakai Tenaga 🔋).</li>' +
    '<li>Perhatikan <b>niat musuh</b> di atas kartu musuh: ⚠️ berarti serangan besar datang giliran berikutnya — bertahanlah!</li>' +
    '<li>Sesudah menang, pilih 1 dari 3 upah untuk membangun kekuatanmu. Event teks menyimpan pilihan berisiko dan tawaran berdarah.</li>' +
    '<li>Mati berarti run berakhir (roguelike) — tetapi <b>Ingatan Menara</b> menyimpan rekor &amp; sifat awal baru untuk run berikutnya.</li></ul></div>' : '';
  app().innerHTML =
    '<div class="ikon-besar" style="margin-top:22px">🏮</div>' +
    '<h1 class="judul-game">' + D.GAME_TITLE + '</h1>' +
    '<p class="tagline">Sebuah roguelike teks tentang lentera terakhir dan musim yang enggan selesai.</p>' +
    '<div class="kartu"><p class="teks-cerita">' + D.HERO_STORY + '</p></div>' +
    (save ? '<button class="btn-utama" data-act="lanjut">▶️ Lanjutkan Pendakian — Lantai ' + save.floor + '</button>' : '') +
    '<button class="btn-utama" data-act="mulai">🕯️ Mulai Pendakian Baru</button>' +
    '<div class="rekor"><div><b>' + meta.highestFloor + '</b><span>Lantai Tertinggi</span></div>' +
    '<div><b>' + meta.runs + '</b><span>Total Run</span></div>' +
    '<div><b>' + meta.victories + '</b><span>Kemenangan</span></div>' +
    '<div><b>' + meta.deaths + '</b><span>Keguguran</span></div></div>' +
    '<div class="kartu"><p class="mini" style="margin-top:0">🔓 <b>Ingatan Menara</b> — pilih satu sifat awal. Sifat terkunci terbuka dari pencapaianmu dan menetap selamanya:</p>' + pilihan + '</div>' +
    '<button class="btn-aksi tengah" data-act="cara">📖 Cara Bermain</button>' + cara;
}

/* ---------- adegan-adegan run ---------- */
function sceneTravel() {
  var label = state.pendingVictory ? '🏆 Akhiri Pendakian' : '⬆️ Naik ke Lantai ' + (state.floor + 1);
  return '<div class="kartu tengah"><div class="ikon-besar">🗼</div>' +
    '<p class="teks-cerita">' + (state.pendingVictory ? 'Di atasmu, langit mulai retak oleh cahaya pagi.' : 'Tangga berikutnya menanjak ke dalam dingin. Lentera di tanganmu berdenyut, menunggu keputusanmu.') + '</p>' +
    '<button class="btn-utama" data-act="naik">' + label + '</button></div>';
}
function sceneCombat() {
  var c = state.combat, e = c.enemy, p = state.player;
  var intentCls = (c.intent.type === 'smash' || c.intent.type === 'charge') ? 'intent bahaya' : 'intent';
  var intentTxt = c.intent.label + (c.intent.dmg ? ' · ±' + c.intent.dmg + ' dmg' : '');
  var skillBtns = p.skills.map(function (id) {
    var s = D.SKILLS[id];
    return '<button class="btn-aksi" data-act="skill" data-id="' + id + '" ' + (p.energy < s.cost ? 'disabled' : '') + '>' + s.icon + ' ' + s.name + '<br><span class="mini">' + s.cost + ' 🔋</span></button>';
  }).join('');
  return '<div class="kartu">' +
    '<div class="ikon-besar">' + e.icon + '</div>' +
    '<h2 class="judul-adegan">' + e.name + (e.tier === 'boss' ? ' 👑' : e.tier === 'elite' ? ' ⭐' : '') + '</h2>' +
    '<div class="bar-musuh"><div style="width:' + persen(e.hp, e.maxHp) + '%"></div></div>' +
    '<p class="mini tengah">HP musuh ' + Math.max(0, e.hp) + '/' + e.maxHp + (e.block > 0 ? ' · 🛡️ Blok ' + e.block : '') + ' · ⚔️ ' + e.atk + ' · 🛡️ ' + e.def + '</p>' +
    '<div class="' + intentCls + '">Niat musuh: ' + intentTxt + '</div>' +
    '<div class="grid-aksi">' +
    '<button class="btn-aksi" data-act="serang">⚔️ Serang</button>' +
    '<button class="btn-aksi" data-act="bertahan">🛡️ Bertahan</button>' +
    '<button class="btn-aksi" data-act="ramuan" ' + (p.potions <= 0 ? 'disabled' : '') + '>🧪 Ramuan (' + p.potions + ')<br><span class="mini">pulih ' + E.potionHeal(state) + ' HP</span></button>' +
    skillBtns +
    '</div></div>';
}
function sceneReward() {
  var cards = state.rewards.map(function (r, i) {
    return '<button class="kartu-pilihan" data-act="hadiah" data-i="' + i + '"><span class="nama">' + r.icon + ' ' + r.name + '</span><span class="desc">' + r.desc + '</span></button>';
  }).join('');
  return '<div class="kartu"><h2 class="judul-adegan">🎁 Pilih Satu Upah</h2><p class="subjudul">Jalan ke atas hanya memberi satu. Pilih dengan bijak.</p>' + cards + '</div>';
}
function sceneEvent() {
  var ev = state.event;
  var btns = ev.choices.map(function (c, i) {
    var kurangEmas = c.fx && c.fx.gold < 0 && state.player.gold < -c.fx.gold;
    return '<button class="btn-pilihan" data-act="event" data-i="' + i + '" ' + (kurangEmas ? 'disabled' : '') + '>' + c.label +
      (c.hint ? '<span class="petunjuk">' + c.hint + '</span>' : '') + '</button>';
  }).join('');
  return '<div class="kartu"><div class="ikon-besar">' + ev.icon + '</div><h2 class="judul-adegan">' + ev.title + '</h2><p class="teks-cerita">' + ev.text + '</p>' + btns + '</div>';
}
function sceneRest() {
  return '<div class="kartu"><div class="ikon-besar">🔥</div><h2 class="judul-adegan">Ceruk Peristirahatan</h2>' +
    '<p class="teks-cerita">Angin tidak mencapai sudut ini. Kamu punya waktu sebentar — pakai dengan baik.</p>' +
    '<button class="btn-pilihan" data-act="istirahat" data-i="0">😴 Tidur sebentar<span class="petunjuk">Pulih 30% HP</span></button>' +
    '<button class="btn-pilihan" data-act="istirahat" data-i="1">⚔️ Berlatih tebasan<span class="petunjuk">+1 SERANGAN permanen</span></button>' +
    '<button class="btn-pilihan" data-act="istirahat" data-i="2">🧘 Bermeditasi dalam dingin<span class="petunjuk">+6 HP maksimum</span></button></div>';
}
function sceneMerchant() {
  var items = state.merchant.map(function (s, i) {
    var bisa = !s.sold && state.player.gold >= s.price;
    return '<button class="kartu-pilihan' + (s.sold ? ' terjual' : '') + '" data-act="beli" data-i="' + i + '" ' + (bisa ? '' : 'disabled') + '>' +
      '<span class="nama">' + s.icon + ' ' + s.name + ' — <span class="harga">' + (s.sold ? 'TERJUAL' : s.price + ' 💰') + '</span></span><span class="desc">' + s.desc + '</span></button>';
  }).join('');
  return '<div class="kartu"><div class="ikon-besar">🧕</div><h2 class="judul-adegan">Lapak Wulan, Sang Pedagang</h2>' +
    '<p class="subjudul">Emasmu: 💰 ' + state.player.gold + ' · "Tidak ada pengembalian. Yang naik tidak selalu turun, Nak."</p>' + items +
    '<button class="btn-utama" data-act="pergi">🚶 Pergi dari Lapak</button></div>';
}
function sceneEnd(menang) {
  var baru = state.newUnlocks || [];
  var unlockHtml = baru.length ? '<div class="kartu"><p class="teks-cerita tengah">🔓 <b>Ingatan Menara bertambah:</b><br>' + baru.map(function (id) { var t = D.TRAITS[id]; return t.icon + ' ' + t.name + ' — ' + t.desc; }).join('<br>') + '</p></div>' : '';
  var stats = '<div class="rekor"><div><b>' + state.floor + '</b><span>Lantai Dicapai</span></div>' +
    '<div><b>' + state.combatsWon + '</b><span>Pertarungan Menang</span></div>' +
    '<div><b>' + state.goldEarned + '</b><span>Emas Terkumpul</span></div></div>';
  if (menang) {
    return '<div class="ikon-besar" style="margin-top:24px">🌅</div><h1 class="judul-game">Musim Berganti</h1>' +
      '<div class="kartu"><p class="epilog">Ibu Musim menatap lenteramu lama sekali. Lalu, untuk pertama kalinya, ia tersenyum — dan meletakkan alat tenunnya.<br><br>"Bawalah apimu pulang, Penjaga kecil. Biarlah langit mengingat caranya mencair."<br><br>Salju terakhir turun sebagai hujan. Di bawah sana, Desa Bara menyalakan kembali perapiannya, satu demi satu, seperti bintang yang pulang ke bumi.</p></div>' +
      stats + unlockHtml + '<button class="btn-utama" data-act="judul">🏮 Kembali ke Layar Judul</button>';
  }
  return '<div class="ikon-besar" style="margin-top:24px">💀</div><h1 class="judul-game">Lentera Padam</h1>' +
    '<div class="kartu"><p class="epilog">Dingin mengambil langkahmu di lantai ' + state.floor + '.<br><br>Tapi dengarkan: di Desa Bara, seorang anak menemukan lentera ini kelak di tepi jalan salju — masih hangat. Ceritamu tidak selesai. Ia hanya berpindah tangan.</p></div>' +
    stats + unlockHtml + '<button class="btn-utama" data-act="judul">🏮 Kembali ke Layar Judul</button>';
}

function renderRun() {
  renderHud();
  var scene = '';
  if (state.phase === 'travel') scene = sceneTravel();
  else if (state.phase === 'combat') scene = sceneCombat();
  else if (state.phase === 'reward') scene = sceneReward();
  else if (state.phase === 'event') scene = sceneEvent();
  else if (state.phase === 'rest') scene = sceneRest();
  else if (state.phase === 'merchant') scene = sceneMerchant();
  app().innerHTML = scene + logHtml() + tasHtml();
  gulirLog();
}

function render() {
  if (!state) { renderTitle(); return; }
  if (state.phase === 'gameover' || state.phase === 'victory') {
    if (!state.metaApplied) {
      state.newUnlocks = E.finishRunMeta(meta, state);
      state.metaApplied = true;
      persist();
    }
    document.getElementById('hud').className = 'tersembunyi';
    app().innerHTML = sceneEnd(state.phase === 'victory');
    return;
  }
  renderRun();
}

/* ---------- tindakan ---------- */
function sesudah() { persist(); render(); }
function mulaiBaru() {
  meta.runs += 1;
  state = E.newRun(meta, meta.selectedStart, (Date.now() % 2147483647) || 12345);
  E.nextFloor(state);
  sesudah();
}
var aksi = {
  'mulai': function () { mulaiBaru(); },
  'lanjut': function () { var s = store.get(K_SAVE); if (s) { state = s; sesudah(); } },
  'pilih-sifat': function (b) { meta.selectedStart = b.getAttribute('data-id'); sesudah(); },
  'cara': function () { tampilCara = !tampilCara; render(); },
  'naik': function () { E.nextFloor(state); sesudah(); },
  'serang': function () { E.combatAction(state, { type: 'attack' }, meta); sesudah(); },
  'bertahan': function () { E.combatAction(state, { type: 'defend' }, meta); sesudah(); },
  'ramuan': function () { E.combatAction(state, { type: 'potion' }, meta); sesudah(); },
  'skill': function (b) { E.combatAction(state, { type: 'skill', skillId: b.getAttribute('data-id') }, meta); sesudah(); },
  'hadiah': function (b) { E.chooseReward(state, parseInt(b.getAttribute('data-i'), 10)); sesudah(); },
  'event': function (b) { E.eventChoice(state, parseInt(b.getAttribute('data-i'), 10)); sesudah(); },
  'istirahat': function (b) { E.restChoice(state, parseInt(b.getAttribute('data-i'), 10)); sesudah(); },
  'beli': function (b) { E.merchantBuy(state, parseInt(b.getAttribute('data-i'), 10)); sesudah(); },
  'pergi': function () { state.phase = 'travel'; sesudah(); },
  'judul': function () { state = null; sesudah(); }
};
document.getElementById('app').addEventListener('click', function (ev) {
  var b = ev.target.closest('[data-act]');
  if (!b || b.disabled) return;
  var fn = aksi[b.getAttribute('data-act')];
  if (fn) fn(b);
});

/* ---------- kait QA (tangkapan layar & uji) ---------- */
function qaSetup() {
  meta = E.defaultMeta();
  state = E.newRun(meta, 'pekerja-keras', 20261017);
  if (QA === 'start') { E.nextFloor(state); }
  else if (QA === 'event') {
    state.floor = 2; state.event = D.EVENTS[0]; state.phase = 'event';
    state.log.push({ text: state.event.icon + ' ' + state.event.title + ' — ' + state.event.text, cls: 'story' });
  } else if (QA === 'combat') {
    state.floor = 9; E.startCombat(state, 'ksatria-karat');
    state.combat.enemy.hp = 27; state.player.hp = 45; state.combat.turn = 3;
    state.log.push({ text: 'Kamu memukul Ksatria Berkarat sebesar 11.', cls: 'combat' });
    state.log.push({ text: 'Ksatria Berkarat menyerang mengenai kamu sebesar 6.', cls: 'bad' });
  } else if (QA === 'boss') {
    state.floor = 7; state.player.hp = 52; E.nextFloor(state);
  }
}
if (QA) { qaSetup(); render(); }
else render();
})();
