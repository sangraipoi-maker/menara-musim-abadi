/* ============================================================
   MENARA MUSIM ABADI — mesin game (logika murni, tanpa DOM)
   State adalah JSON murni (termasuk state RNG) → autosave dan
   uji otomatis tinggal serialisasi/deserialisasi.
   ============================================================ */
(function () {
'use strict';
var D = (typeof window !== 'undefined' && window.GAMEDATA) ? window.GAMEDATA
      : (typeof module !== 'undefined' ? require('./data.js') : null);

/* ---------------- RNG (mulberry32, state di dalam state game) ---------------- */
function rand(st) {
  st.rngState = (st.rngState + 0x6D2B79F5) | 0;
  var t = st.rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randInt(st, min, max) { return min + Math.floor(rand(st) * (max - min + 1)); }
function pick(st, arr) { return arr[Math.floor(rand(st) * arr.length)]; }
function shuffle(st, arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand(st) * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function roll20(st) { return randInt(st, 1, 20); }

/* ---------------- Meta-progresi ---------------- */
function defaultMeta() {
  return { highestFloor: 0, highestAct: 1, runs: 0, victories: 0, deaths: 0, boss1: false, boss2: false, boss3: false, unlockedStarts: ['pekerja-keras', 'tangan-mantap'], selectedStart: 'pekerja-keras' };
}
function traitUnlocked(meta, id) { return meta.unlockedStarts.indexOf(id) >= 0; }
function checkUnlocks(meta) {
  var baru = [];
  Object.keys(D.TRAITS).forEach(function (id) {
    var t = D.TRAITS[id];
    if (t.kind !== 'start' || !t.unlock || traitUnlocked(meta, id)) return;
    var u = t.unlock, ok = false;
    if (u.type === 'beatBoss' && meta['boss' + u.act]) ok = true;
    if (u.type === 'reachAct' && meta.highestAct >= u.act) ok = true;
    if (u.type === 'deaths' && meta.deaths >= u.n) ok = true;
    if (u.type === 'win' && meta.victories >= 1) ok = true;
    if (ok) { meta.unlockedStarts.push(id); baru.push(id); }
  });
  return baru;
}

/* ---------------- Turunan statistik ---------------- */
function hasTrait(st, id) { return st.player.traits.indexOf(id) >= 0; }
function weaponOf(st) { return D.WEAPONS[st.player.weaponIdx]; }
function armorOf(st) { return D.ARMORS[st.player.armorIdx]; }
function atkTotal(st) {
  var v = st.player.atk + weaponOf(st).atk;
  if (hasTrait(st, 'otot-penebang')) v += 2;
  if (hasTrait(st, 'sentuhan-musim')) v += 3;
  return v;
}
function defTotal(st) {
  var v = st.player.def + armorOf(st).def;
  if (hasTrait(st, 'kulit-badai')) v += 2;
  if (hasTrait(st, 'sentuhan-musim')) v -= 1;
  return Math.max(0, v);
}
function critChance(st) {
  var v = 0.15;
  if (hasTrait(st, 'mata-serigala')) v += 0.10;
  if (hasTrait(st, 'mata-badai')) v += 0.12;
  return v;
}
function potionHeal(st) { return Math.floor(st.player.maxHp * (hasTrait(st, 'ahli-ramuan') ? 0.60 : 0.40)); }

function log(st, text, cls) { st.log.push({ text: text, cls: cls || '' }); if (st.log.length > 120) st.log.splice(0, st.log.length - 120); }

/* ---------------- Run baru ---------------- */
var FLOORS_PER_ACT = 8;
function totalFloors() { return FLOORS_PER_ACT * 3; }
function actOfFloor(floor) { return Math.floor((floor - 1) / FLOORS_PER_ACT) + 1; }

function buildActPlan(st, act) {
  var tengah = shuffle(st, ['combat', 'combat', 'elite', 'event', 'event', pick(st, ['rest', 'merchant'])]);
  return ['combat'].concat(tengah, ['boss']);
}

function newRun(meta, startTraitId, seed) {
  var st = {
    version: 1, rngState: (seed >>> 0) || 1, floor: 0, phase: 'travel',
    plans: {}, combatsWon: 0, goldEarned: 0, revived: false,
    player: {
      hp: 64, maxHp: 64, atk: 9, def: 2, gold: 20, potions: 2,
      energy: 3, energyMax: 5, weaponIdx: 0, armorIdx: 0,
      skills: ['tebasan-lentera'], traits: [], startTrait: startTraitId
    },
    combat: null, event: null, merchant: null, rewards: null, pendingVictory: false,
    log: []
  };
  // terapkan sifat awal (meta) — datanya statis, sebagian berupa angka dasar
  if (startTraitId === 'pekerja-keras') { st.player.maxHp += 6; st.player.hp += 6; }
  if (startTraitId === 'tangan-mantap') { st.player.atk += 1; }
  if (startTraitId === 'bekas-luka') { st.player.def += 2; }
  if (startTraitId === 'paru-baja') { st.player.energyMax += 1; st.player.energy += 1; }
  if (startTraitId === 'mata-badai' || startTraitId === 'keras-kepala' || startTraitId === 'jantung-lentera') {
    st.player.traits.push(startTraitId); // efek dibaca lewat hasTrait
  }
  for (var a = 1; a <= 3; a++) st.plans[a] = buildActPlan(st, a);
  log(st, D.HERO_STORY, 'story');
  return st;
}

function floorType(st, floor) {
  var act = actOfFloor(floor);
  var idx = (floor - 1) % FLOORS_PER_ACT;
  return st.plans[act][idx];
}

/* ---------------- Efek (dari event / hadiah / pedagang) ---------------- */
function applyFx(st, fx) {
  if (!fx) return;
  var p = st.player;
  if (fx.maxHp) { p.maxHp = Math.max(10, p.maxHp + fx.maxHp); p.hp = Math.min(p.hp, p.maxHp); }
  if (fx.hp) { p.hp = Math.max(1, Math.min(p.maxHp, p.hp + fx.hp)); } // efek event tidak membunuh
  if (fx.healPct) { var h = Math.floor(p.maxHp * fx.healPct / 100); p.hp = Math.min(p.maxHp, p.hp + h); }
  if (fx.atk) p.atk += fx.atk;
  if (fx.def) p.def += fx.def;
  if (fx.gold) { p.gold = Math.max(0, p.gold + fx.gold); if (fx.gold > 0) st.goldEarned += fx.gold; }
  if (fx.potion) p.potions = Math.max(0, p.potions + fx.potion);
  if (fx.energyMax) { p.energyMax += fx.energyMax; p.energy = p.energyMax; }
  if (fx.trait && !hasTrait(st, fx.trait)) { p.traits.push(fx.trait); log(st, 'Sifat baru: ' + D.TRAITS[fx.trait].icon + ' ' + D.TRAITS[fx.trait].name + ' — ' + D.TRAITS[fx.trait].desc, 'good'); }
  if (fx.skill && p.skills.indexOf(fx.skill) < 0) { p.skills.push(fx.skill); log(st, 'Keahlian baru: ' + D.SKILLS[fx.skill].icon + ' ' + D.SKILLS[fx.skill].name + ' — ' + D.SKILLS[fx.skill].desc, 'good'); }
  if (typeof fx.weapon === 'number' && fx.weapon > p.weaponIdx) { p.weaponIdx = fx.weapon; log(st, 'Senjata baru: ' + D.WEAPONS[fx.weapon].name + ' (SERANGAN +' + D.WEAPONS[fx.weapon].atk + ')', 'good'); }
  if (typeof fx.armor === 'number' && fx.armor > p.armorIdx) { p.armorIdx = fx.armor; log(st, 'Zirah baru: ' + D.ARMORS[fx.armor].name + ' (PERTAHANAN +' + D.ARMORS[fx.armor].def + ')', 'good'); }
  if (p.hp <= 0) p.hp = 1;
}

/* ---------------- Alur lantai ---------------- */
function startFloor(st) {
  st.floor += 1;
  var act = actOfFloor(st.floor);
  var type = floorType(st, st.floor);
  st.currentType = type;
  var actInfo = D.ACTS[act - 1];
  if ((st.floor - 1) % FLOORS_PER_ACT === 0) {
    log(st, '— ' + actInfo.name + ': ' + actInfo.sub + ' —', 'act');
    log(st, actInfo.intro, 'story');
  }
  log(st, 'Lantai ' + st.floor + ' dari ' + totalFloors() + '. ' + D.INTROS[type], 'story');
  if (type === 'combat' || type === 'elite') {
    var tierCari = (type === 'combat') ? 'normal' : 'elite';
    var pool = D.ENEMIES.filter(function (e) { return e.act === act && e.tier === tierCari; });
    startCombat(st, pick(st, pool).id);
  } else if (type === 'boss') {
    var boss = D.ENEMIES.filter(function (e) { return e.act === act && e.tier === 'boss'; })[0];
    startCombat(st, boss.id);
  } else if (type === 'event') {
    var evs = D.EVENTS.filter(function (e) { return e.act === act; });
    st.event = pick(st, evs);
    st.phase = 'event';
    log(st, st.event.icon + ' ' + st.event.title + ' — ' + st.event.text, 'story');
  } else if (type === 'rest') {
    st.phase = 'rest';
  } else if (type === 'merchant') {
    st.phase = 'merchant';
    st.merchant = buildMerchant(st);
    log(st, '"Penjaga lentera! Tamu langka," sapa pedagang itu. "Aku Wulan. Aku menjual apa yang ditinggalkan mereka yang tidak sampai — dengan harga yang jujur, tentu saja."', 'story');
  }
  return st;
}

function nextFloor(st) {
  st.combat = null; st.event = null; st.merchant = null; st.rewards = null;
  if (st.pendingVictory) { st.phase = 'victory'; return st; }
  st.phase = 'travel';
  return startFloor(st);
}

/* ---------------- Pedagang ---------------- */
function buildMerchant(st) {
  var p = st.player, stock = [];
  stock.push({ kind: 'potion', name: 'Ramuan Lentera', icon: '🧪', desc: 'Pulihkan ' + potionHeal(st) + ' HP saat diminum dalam pertarungan.', price: 25 });
  stock.push({ kind: 'fullheal', name: 'Perban & Sup Hangat', icon: '🍲', desc: 'Pulihkan HP sampai penuh, sekarang juga.', price: 60 });
  if (p.weaponIdx < D.WEAPONS.length - 1) { var w = D.WEAPONS[p.weaponIdx + 1]; stock.push({ kind: 'weapon', idx: p.weaponIdx + 1, name: w.name, icon: '🗡️', desc: 'SERANGAN +' + w.atk, price: w.price }); }
  if (p.armorIdx < D.ARMORS.length - 1) { var ar = D.ARMORS[p.armorIdx + 1]; stock.push({ kind: 'armor', idx: p.armorIdx + 1, name: ar.name, icon: '🥋', desc: 'PERTAHANAN +' + ar.def, price: ar.price }); }
  var traitPool = Object.keys(D.TRAITS).filter(function (id) { return D.TRAITS[id].kind === 'pool' && !hasTrait(st, id); });
  if (traitPool.length) { var tid = pick(st, traitPool); stock.push({ kind: 'trait', id: tid, name: 'Berkah: ' + D.TRAITS[tid].name, icon: D.TRAITS[tid].icon, desc: D.TRAITS[tid].desc, price: 85 }); }
  stock.forEach(function (s) { s.sold = false; });
  return stock;
}
function merchantBuy(st, i) {
  var s = st.merchant && st.merchant[i];
  if (!s || s.sold || st.player.gold < s.price) return st;
  st.player.gold -= s.price; s.sold = true;
  if (s.kind === 'potion') { st.player.potions += 1; log(st, 'Kamu membeli Ramuan Lentera.', 'good'); }
  if (s.kind === 'fullheal') { st.player.hp = st.player.maxHp; log(st, 'Hangat sup Wulan menjalar ke seluruh tubuh. HP penuh.', 'good'); }
  if (s.kind === 'weapon') applyFx(st, { weapon: s.idx });
  if (s.kind === 'armor') applyFx(st, { armor: s.idx });
  if (s.kind === 'trait') applyFx(st, { trait: s.id });
  return st;
}

/* ---------------- Istirahat ---------------- */
function restChoice(st, i) {
  if (i === 0) { var h = Math.floor(st.player.maxHp * 0.30); st.player.hp = Math.min(st.player.maxHp, st.player.hp + h); log(st, 'Kamu tidur bersandar pada lentera. Pulih ' + h + ' HP.', 'good'); }
  if (i === 1) { st.player.atk += 1; log(st, 'Kamu berlatih tebasan sampai tanganmu hafal. +1 SERANGAN permanen.', 'good'); }
  if (i === 2) { st.player.maxHp += 6; st.player.hp += 6; log(st, 'Kamu bermeditasi dalam dingin. Tubuhmu belajar menahan lebih banyak. +6 HP maksimum.', 'good'); }
  st.phase = 'travel';
  return st;
}

/* ---------------- Event ---------------- */
function eventChoice(st, i) {
  var ev = st.event; if (!ev) return st;
  var c = ev.choices[i]; if (!c) return st;
  st.event = null;
  if (c.fx) applyFx(st, c.fx);
  if (c.roll) {
    var roll = roll20(st);
    var bonus = c.roll.bonus || 0;
    var ok = (roll + bonus) >= c.roll.dc;
    log(st, '🎲 Dadu: ' + roll + (bonus ? ' +' + bonus : '') + ' vs ' + c.roll.dc + ' — ' + (ok ? 'BERHASIL' : 'GAGAL') + '.', ok ? 'good' : 'bad');
    var r = ok ? c.roll.ok : c.roll.fail;
    var outText = ok ? c.roll.okOut : c.roll.failOut;
    if (r && r.fight) { if (outText) log(st, outText, 'story'); startCombat(st, r.fight); return st; }
    if (r) applyFx(st, r);
    if (outText) log(st, outText, 'story');
  } else {
    if (c.out) log(st, c.out, 'story');
    if (c.fx && c.fx.fight) { startCombat(st, c.fx.fight); return st; }
  }
  st.phase = 'travel';
  return st;
}

/* ---------------- Pertarungan ---------------- */
function startCombat(st, enemyId) {
  var base = D.ENEMIES.filter(function (e) { return e.id === enemyId; })[0];
  var e = JSON.parse(JSON.stringify(base));
  e.maxHp = e.hp; e.block = 0; e.patternPos = 0; e.charged = false; e.weaken = 0; e.phase2 = false;
  st.combat = { enemy: e, turn: 1, playerBlock: hasTrait(st, 'perisai-awal') ? 8 : 0, dodgeNext: false, critNext: false, intent: null };
  st.player.energy = Math.min(st.player.energyMax, st.player.energy + 1);
  decideIntent(st);
  st.phase = 'combat';
  log(st, e.icon + ' ' + e.name + ' menghadangmu. ' + e.desc, 'combat');
  return st;
}
function decideIntent(st) {
  var c = st.combat, e = c.enemy;
  if (e.charged) { c.intent = { type: 'smash', label: '💥 SERANGAN BESAR!', dmg: Math.round((e.atk + 3) * 1.6) }; return; }
  var step = e.pattern[e.patternPos % e.pattern.length];
  e.patternPos += 1;
  if (step === 'A') c.intent = { type: 'attack', label: '⚔️ Menyerang', dmg: e.atk - (e.weaken > 0 ? e.weaken : 0) };
  else if (step === 'C') c.intent = { type: 'charge', label: '⚠️ Mengumpulkan kekuatan…' };
  else if (step === 'B') c.intent = { type: 'block', label: '🛡️ Memasang perisai' };
  else if (step === 'U') c.intent = { type: 'buff', label: '🔺 Memperkuat diri' };
  else if (step === 'D') c.intent = { type: 'drain', label: '🩸 Menghisap kehangatan', dmg: Math.max(2, e.atk - 2) };
  else c.intent = { type: 'attack', label: '⚔️ Menyerang', dmg: e.atk };
}
function damageEnemy(st, raw, opts) {
  opts = opts || {};
  var c = st.combat, e = c.enemy;
  var crit = opts.forceCrit || rand(st) < critChance(st);
  var dmg = Math.round(raw * (0.9 + rand(st) * 0.2));
  if (crit) dmg = Math.round(dmg * 1.6);
  dmg = Math.max(1, dmg - e.def);
  var absorbed = Math.min(e.block, dmg); e.block -= absorbed; dmg -= absorbed;
  e.hp -= dmg;
  log(st, 'Kamu memukul ' + e.name + ' sebesar ' + dmg + (crit ? ' — KRITIKAL!' : '') + (absorbed ? ' (' + absorbed + ' tertahan bloknya)' : '') + '.', crit ? 'good' : 'combat');
  return dmg;
}
function enemyAct(st) {
  var c = st.combat, e = c.enemy, p = st.player;
  var intent = c.intent;
  function hitPlayer(baseDmg, label) {
    if (c.dodgeNext) { c.dodgeNext = false; log(st, 'Kamu menghilang dari ' + label + ' — langkah bayanganmu bekerja!', 'good'); return; }
    if (hasTrait(st, 'langkah-ringan') && rand(st) < 0.15) { log(st, 'Langkah ringanmu membuat ' + label + ' meleset!', 'good'); return; }
    var dmg = Math.max(1, Math.round(baseDmg * (0.9 + rand(st) * 0.2)) - defTotal(st));
    var absorbed = Math.min(c.playerBlock, dmg); c.playerBlock -= absorbed; dmg -= absorbed;
    p.hp -= dmg;
    log(st, e.name + ' ' + label + ' mengenai kamu sebesar ' + dmg + (absorbed ? ' (' + absorbed + ' tertahan blok)' : '') + '.', 'bad');
    if (intent.type === 'drain' && dmg > 0) { e.hp = Math.min(e.maxHp, e.hp + dmg); log(st, e.name + ' memulihkan diri sebesar ' + dmg + ' dari kehangatanmu.', 'bad'); }
  }
  if (intent.type === 'attack' || intent.type === 'drain') hitPlayer(intent.dmg, intent.type === 'drain' ? 'menghisapmu' : 'menyerang');
  else if (intent.type === 'charge') { e.charged = true; log(st, e.name + ' mengumpulkan kekuatan. Giliran berikutnya akan menyakitkan.', 'bad'); }
  else if (intent.type === 'smash') { hitPlayer(intent.dmg, 'menghantam dengan seluruh kekuatan'); e.charged = false; }
  else if (intent.type === 'block') { e.block += 8; log(st, e.name + ' memasang perisai (Blok +8).', 'combat'); }
  else if (intent.type === 'buff') { e.atk += 2; log(st, e.name + ' memperkuat diri! SERANGAN-nya naik 2.', 'bad'); }
  if (e.weaken > 0) e.weakenTurns = (e.weakenTurns || 0) + 1;
  if (e.weakenTurns >= 2) { e.weaken = 0; e.weakenTurns = 0; }
  // fase 2 bos terakhir
  if (e.phase2 && !e.phase2On && e.hp <= e.maxHp / 2 && e.hp > 0) {
    e.phase2On = true; e.atk += 3;
    log(st, '❄️ Ibu Musim membuka matanya. "Baiklah," katanya. "Kita menari lebih cepat." SERANGAN-nya naik!', 'bad');
  }
}
function checkDeath(st, meta) {
  var p = st.player;
  if (p.hp > 0) return false;
  if (hasTrait(st, 'keras-kepala') && !st.revived) {
    st.revived = true; p.hp = Math.floor(p.maxHp * 0.25);
    log(st, '🔥 Keras kepalamu menolak padam. Kamu bangkit kembali dengan ' + p.hp + ' HP!', 'good');
    return false;
  }
  st.phase = 'gameover';
  if (meta) { meta.deaths += 1; meta.highestFloor = Math.max(meta.highestFloor, st.floor); }
  return true;
}
function winCombat(st, meta) {
  var c = st.combat, e = c.enemy, p = st.player;
  var gold = randInt(st, e.gold[0], e.gold[1]);
  if (hasTrait(st, 'penambang-emas')) gold = Math.round(gold * 1.35);
  p.gold += gold; st.goldEarned += gold; st.combatsWon += 1;
  log(st, '🏆 ' + e.name + ' tumbang. +' + gold + ' emas.', 'good');
  if (hasTrait(st, 'haus-darah')) { p.hp = Math.min(p.maxHp, p.hp + 4); log(st, 'Haus darahmu terpuaskan. Pulih 4 HP.', 'good'); }
  if (hasTrait(st, 'lentera-hangat')) { p.hp = Math.min(p.maxHp, p.hp + 6); }
  if (hasTrait(st, 'jantung-lentera')) { p.hp = Math.min(p.maxHp, p.hp + 8); }
  st.combat = null;
  if (meta) {
    meta.highestFloor = Math.max(meta.highestFloor, st.floor);
    meta.highestAct = Math.max(meta.highestAct || 1, actOfFloor(st.floor));
    if (e.tier === 'boss') meta['boss' + e.act] = true;
  }
  if (e.tier === 'boss' && e.act === 3) {
    st.pendingVictory = true; st.phase = 'travel';
    log(st, 'Kamu mengangkat lentera tinggi-tinggi. Untuk pertama kalinya dalam puluhan tahun, salju yang turun berubah menjadi hujan.', 'story');
    return st;
  }
  st.rewards = genRewards(st, e.tier);
  st.phase = 'reward';
  return st;
}
function combatAction(st, action, meta) {
  var c = st.combat; if (!c || st.phase !== 'combat') return st;
  var p = st.player, e = c.enemy;
  c.playerBlock = (action.type === 'defend') ? c.playerBlock : Math.floor(c.playerBlock / 2);
  if (action.type === 'attack') {
    damageEnemy(st, atkTotal(st), { forceCrit: c.critNext }); c.critNext = false;
  } else if (action.type === 'defend') {
    var b = defTotal(st) + 6; c.playerBlock += b; p.energy = Math.min(p.energyMax, p.energy + 1);
    log(st, 'Kamu bertahan di balik lentera. Blok +' + b + ', +1 Tenaga.', 'combat');
  } else if (action.type === 'potion') {
    if (p.potions <= 0) { log(st, 'Ramuanmu habis!', 'bad'); return st; }
    p.potions -= 1; var h = potionHeal(st); p.hp = Math.min(p.maxHp, p.hp + h);
    log(st, 'Kamu meneguk ramuan. Pulih ' + h + ' HP.', 'good');
  } else if (action.type === 'skill') {
    var sk = D.SKILLS[action.skillId];
    if (!sk || p.skills.indexOf(action.skillId) < 0 || p.energy < sk.cost) { log(st, 'Keahlian itu tidak bisa dipakai sekarang.', 'bad'); return st; }
    p.energy -= sk.cost;
    if (action.skillId === 'tebasan-lentera') damageEnemy(st, atkTotal(st) * 1.6, {});
    else if (action.skillId === 'perisai-cahaya') { var b2 = defTotal(st) + 14; c.playerBlock += b2; log(st, 'Perisai cahaya menyelimutimu. Blok +' + b2 + '.', 'good'); }
    else if (action.skillId === 'semburan-bara') { damageEnemy(st, atkTotal(st) * 1.2, {}); e.weaken = 3; e.weakenTurns = 0; log(st, 'Bara menyembur! Serangan ' + e.name + ' melemah selama 2 giliran.', 'good'); }
    else if (action.skillId === 'langkah-bayangan') { c.dodgeNext = true; c.critNext = true; log(st, 'Kamu melebur ke bayangan. Serangan musuh berikutnya akan meleset; seranganmu berikutnya pasti kritikal.', 'good'); }
    else if (action.skillId === 'suar-penyembuh') { var h2 = Math.floor(p.maxHp * 0.22); p.hp = Math.min(p.maxHp, p.hp + h2); log(st, 'Cahaya lentera menenangkan lukamu. Pulih ' + h2 + ' HP.', 'good'); }
  }
  if (e.hp <= 0) return winCombat(st, meta);
  enemyAct(st);
  if (checkDeath(st, meta)) return st;
  c.turn += 1;
  p.energy = Math.min(p.energyMax, p.energy + 1);
  decideIntent(st);
  return st;
}

/* ---------------- Hadiah sesudah pertarungan ---------------- */
function genRewards(st, tier) {
  var p = st.player, pool = [];
  pool.push({ kind: 'fx', icon: '⚔️', name: 'Asah Senjata', desc: '+2 SERANGAN permanen.', fx: { atk: 2 } });
  pool.push({ kind: 'fx', icon: '❤️', name: 'Latihan Napas', desc: '+10 HP maksimum dan pulih 10.', fx: { maxHp: 10, hp: 10 } });
  pool.push({ kind: 'fx', icon: '🛡️', name: 'Perkuat Zirah', desc: '+1 PERTAHANAN permanen.', fx: { def: 1 } });
  pool.push({ kind: 'fx', icon: '🏮', name: 'Isi Ulang Lentera', desc: 'Pulih 35% HP.', fx: { healPct: 35 } });
  pool.push({ kind: 'fx', icon: '🧪', name: 'Ramuan Cadangan', desc: '+1 Ramuan.', fx: { potion: 1 } });
  pool.push({ kind: 'fx', icon: '💰', name: 'Kantong Tambahan', desc: '+30 emas.', fx: { gold: 30 } });
  if (p.energyMax < 8) pool.push({ kind: 'fx', icon: '🔋', name: 'Inti Uap Kecil', desc: '+1 Tenaga maksimum.', fx: { energyMax: 1 } });
  var skillPool = Object.keys(D.SKILLS).filter(function (id) { return p.skills.indexOf(id) < 0; });
  skillPool.forEach(function (id) { pool.push({ kind: 'fx', icon: D.SKILLS[id].icon, name: 'Keahlian: ' + D.SKILLS[id].name, desc: D.SKILLS[id].desc, fx: { skill: id } }); });
  var traitPool = Object.keys(D.TRAITS).filter(function (id) { return D.TRAITS[id].kind === 'pool' && !hasTrait(st, id) && id !== 'sentuhan-musim'; });
  traitPool.forEach(function (id) { pool.push({ kind: 'fx', icon: D.TRAITS[id].icon, name: 'Sifat: ' + D.TRAITS[id].name, desc: D.TRAITS[id].desc, fx: { trait: id } }); });
  if (p.weaponIdx < D.WEAPONS.length - 1) pool.push({ kind: 'fx', icon: '🗡️', name: D.WEAPONS[p.weaponIdx + 1].name, desc: 'Senjata baru: SERANGAN +' + D.WEAPONS[p.weaponIdx + 1].atk, fx: { weapon: p.weaponIdx + 1 } });
  if (p.armorIdx < D.ARMORS.length - 1) pool.push({ kind: 'fx', icon: '🥋', name: D.ARMORS[p.armorIdx + 1].name, desc: 'Zirah baru: PERTAHANAN +' + D.ARMORS[p.armorIdx + 1].def, fx: { armor: p.armorIdx + 1 } });
  var shuffled = shuffle(st, pool);
  var n = tier === 'boss' ? 3 : 3;
  return shuffled.slice(0, n);
}
function chooseReward(st, i) {
  var r = st.rewards && st.rewards[i]; if (!r) return st;
  applyFx(st, r.fx);
  log(st, 'Kamu memilih: ' + r.icon + ' ' + r.name + '.', 'good');
  st.rewards = null;
  st.phase = 'travel';
  return st;
}

/* ---------------- Akhir run ---------------- */
function finishRunMeta(meta, st) {
  meta.highestFloor = Math.max(meta.highestFloor, st.floor);
  meta.highestAct = Math.max(meta.highestAct || 1, actOfFloor(Math.max(1, st.floor)));
  if (st.phase === 'victory') meta.victories += 1;
  return checkUnlocks(meta);
}

var ENGINE = {
  rand: rand, randInt: randInt, pick: pick, roll20: roll20,
  defaultMeta: defaultMeta, checkUnlocks: checkUnlocks, traitUnlocked: traitUnlocked,
  newRun: newRun, startFloor: startFloor, nextFloor: nextFloor, floorType: floorType,
  actOfFloor: actOfFloor, totalFloors: totalFloors, FLOORS_PER_ACT: FLOORS_PER_ACT,
  startCombat: startCombat, combatAction: combatAction,
  eventChoice: eventChoice, restChoice: restChoice, merchantBuy: merchantBuy, chooseReward: chooseReward,
  atkTotal: atkTotal, defTotal: defTotal, potionHeal: potionHeal, hasTrait: hasTrait,
  weaponOf: weaponOf, armorOf: armorOf, finishRunMeta: finishRunMeta, applyFx: applyFx
};
if (typeof window !== 'undefined') window.ENGINE = ENGINE;
if (typeof module !== 'undefined' && module.exports) module.exports = ENGINE;
})();
