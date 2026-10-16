/* ============================================================
   MENARA MUSIM ABADI — data game
   Seluruh nama, teks cerita, musuh, dan event di berkas ini
   adalah karya ORIGINAL berbahasa Indonesia.
   ============================================================ */
(function () {
'use strict';

var ACTS = [
  { n: 1, name: 'Bab I — Akar Menara', sub: 'Hutan yang Membeku',
    intro: 'Salju di sini tidak pernah mencair. Pohon-pohon berdiri seperti tiang kapal karam, dan di antara batangnya, Menara Sunyi menjulang menembus awan kelabu. Lentera di tanganmu berdenyut pelan — satu-satunya api yang tersisa di negeri ini.' },
  { n: 2, name: 'Bab II — Perut Menara', sub: 'Aula Uap dan Besi',
    intro: 'Di dalam menara, dingin berganti dengung mesin. Pipa-pipa tembaga bernafas uap, roda gigi berputar tanpa ada yang menggerakkan. Seseorang — atau sesuatu — pernah tinggal di sini dan membiarkan jantung besinya berdetak sendirian.' },
  { n: 3, name: 'Bab III — Mahkota Menara', sub: 'Takhta Musim Abadi',
    intro: 'Udara menipis. Tangga terakhir dilapisi es hitam yang tidak memantulkan wajahmu. Di atas sana, kata para penjaga yang gugur, duduklah yang menenun salju dari langit: Ibu Musim sendiri.' }
];

var ENEMIES = [
  /* ---------- BAB I ---------- */
  { id:'serigala-salju', act:1, tier:'normal', name:'Serigala Salju', icon:'🐺', hp:22, atk:7, def:0, gold:[8,16], pattern:['A','A','B'],
    desc:'Matanya kuning pucat. Ia tidak menggonggong — serigala yang lapar tidak membuang tenaga.' },
  { id:'gagak-es', act:1, tier:'normal', name:'Gagak Es', icon:'🦅', hp:16, atk:8, def:0, gold:[6,14], pattern:['A','A','A'],
    desc:'Paruhnya dilapisi es. Ia memekik seperti kaca yang retak.' },
  { id:'boneka-salju', act:1, tier:'normal', name:'Boneka Salju Hampa', icon:'⛄', hp:27, atk:6, def:1, gold:[8,15], pattern:['A','B','A','U'],
    desc:'Seseorang membentuknya bertahun-tahun lalu dan tidak pernah kembali. Di dalam dadanya ada ruang kosong berbentuk hati.' },
  { id:'penjarah-makam', act:1, tier:'normal', name:'Penjarah Makam Lapar', icon:'🧟', hp:24, atk:8, def:0, gold:[12,22], pattern:['A','D','A'],
    desc:'Dulu ia menggali kubur orang lain. Sekarang ia menggali apa pun yang masih hangat.' },
  { id:'landak-es', act:1, tier:'normal', name:'Landak Berduri Es', icon:'🦔', hp:20, atk:6, def:2, gold:[7,13], pattern:['B','A','A'],
    desc:'Duri-durinya bukan duri — melainkan pecahan es yang tumbuh dari punggungnya.' },
  { id:'serigala-alfa', act:1, tier:'elite', name:'Alfa Kawanan Kelabu', icon:'🐺', hp:44, atk:10, def:1, gold:[24,38], pattern:['A','A','C'],
    desc:'Parut di moncongnya lebih tua dari musim dingin ini. Kawanannya menonton dari balik pepohonan.' },
  { id:'patung-penjaga', act:1, tier:'elite', name:'Patung Penjaga Patah', icon:'🗿', hp:50, atk:9, def:3, gold:[22,36], pattern:['B','A','C'],
    desc:'Setengah wajahnya hilang dimakan es. Separuhnya lagi masih mengawasimu.' },
  { id:'beruang-penjaga', act:1, tier:'boss', name:'Beruang Putih Tua, Penjaga Gerbang', icon:'🐻‍❄️', hp:82, atk:12, def:2, gold:[55,80], pattern:['A','A','C','A','U'],
    desc:'Ia menjaga gerbang menara sejak sebelum ada yang ingat kenapa. Di kalung besinya tergantung kunci sebesar lenganmu.' },
  /* ---------- BAB II ---------- */
  { id:'golem-uap', act:2, tier:'normal', name:'Golem Uap', icon:'🤖', hp:40, atk:11, def:2, gold:[14,24], pattern:['A','B','A'],
    desc:'Tubuhnya ketel dan pipa. Ia menyerang bukan karena benci, tapi karena begitu ia diprogram sebelum dunia membeku.' },
  { id:'tikus-bara', act:2, tier:'normal', name:'Tikus Bara', icon:'🐀', hp:30, atk:12, def:0, gold:[10,20], pattern:['A','A','A'],
    desc:'Ekornya menyala seperti sumbu. Ia memakan arang dan mimpi buruk penghuni menara.' },
  { id:'ksatria-karat', act:2, tier:'normal', name:'Ksatria Berkarat', icon:'🛡️', hp:47, atk:10, def:3, gold:[16,26], pattern:['B','A','A'],
    desc:'Zirahnya masih berdiri tegak. Yang di dalamnya sudah lama menjadi debu dan kewajiban.' },
  { id:'lumpur-oli', act:2, tier:'normal', name:'Lumpur Oli Hidup', icon:'🫧', hp:45, atk:10, def:1, gold:[12,22], pattern:['A','D','A'],
    desc:'Tumpahan oli mesin yang belajar bergerak. Ia lapar pada kehangatan apa pun.' },
  { id:'burung-besi', act:2, tier:'normal', name:'Burung Besi Pengintai', icon:'🦉', hp:34, atk:13, def:0, gold:[14,24], pattern:['A','A','C'],
    desc:'Matanya lensa kuningan. Seseorang di lantai atas mungkin sedang menonton lewat matanya.' },
  { id:'algojo-menara', act:2, tier:'elite', name:'Algojo Menara', icon:'🪓', hp:64, atk:13, def:2, gold:[30,46], pattern:['A','C','A'],
    desc:'Kapaknya lebih bersih dari apa pun di menara ini. Ia merawatnya seperti orang merawat doa.' },
  { id:'kembar-katup', act:2, tier:'elite', name:'Si Kembar Katup', icon:'👥', hp:58, atk:12, def:2, gold:[28,44], pattern:['A','U','A','B'],
    desc:'Dua boneka mekanik berbagi satu jantung uap. Melukai satu membuat yang lain berteriak.' },
  { id:'jantung-uap', act:2, tier:'boss', name:'Jantung Uap, Mesin Penjaga Menara', icon:'❤️‍🔥', hp:120, atk:14, def:3, gold:[70,100], pattern:['A','C','A','U','B'],
    desc:'Sebuah jantung sebesar rumah, berdetak di dalam sangkar tembaga. Setiap detaknya menghembuskan salju ke seluruh negeri.' },
  /* ---------- BAB III ---------- */
  { id:'bayangan-beku', act:3, tier:'normal', name:'Bayangan yang Membeku', icon:'👤', hp:56, atk:15, def:1, gold:[18,30], pattern:['A','A','D'],
    desc:'Bayangan seorang penjelajah yang tidak pernah sampai. Ia menyerang bayanganmu lebih dulu.' },
  { id:'pendeta-musim', act:3, tier:'normal', name:'Pendeta Musim Dingin', icon:'🕯️', hp:50, atk:14, def:2, gold:[18,30], pattern:['U','A','A'],
    desc:'Ia berdoa agar salju tidak pernah berhenti. Baginya, musim dingin adalah surga yang jujur.' },
  { id:'cermin-lapar', act:3, tier:'normal', name:'Cermin yang Lapar', icon:'🪞', hp:60, atk:13, def:2, gold:[20,32], pattern:['B','A','C'],
    desc:'Ia menunjukkan wajahmu yang lebih tua, lebih lelah, dan sudah menyerah. Lalu wajah itu melangkah keluar.' },
  { id:'anjing-akhir', act:3, tier:'normal', name:'Anjing Penjaga Akhir', icon:'🐺', hp:58, atk:16, def:1, gold:[18,30], pattern:['A','A','A'],
    desc:'Anjing terakhir di ujung dunia. Kerah kulitnya bertuliskan nama yang sudah tidak ada yang memanggil.' },
  { id:'penenun-muda', act:3, tier:'normal', name:'Penenun Salju Muda', icon:'🕷️', hp:52, atk:15, def:1, gold:[20,34], pattern:['A','C','A'],
    desc:'Tangannya enam, semuanya cekatan menenun kepingan salju dari udara kosong.' },
  { id:'raja-tanpa-wajah', act:3, tier:'elite', name:'Raja Tanpa Wajah', icon:'👑', hp:86, atk:16, def:3, gold:[40,60], pattern:['A','C','U'],
    desc:'Ia pernah memerintah negeri yang hangat. Es menghapus wajahnya lebih dulu, baru kemudian namanya.' },
  { id:'penjaga-gugur', act:3, tier:'elite', name:'Penjaga Lentera yang Gugur', icon:'🏮', hp:80, atk:17, def:2, gold:[38,58], pattern:['A','A','C'],
    desc:'Lenteranya masih menyala, tergantung di leher jasad yang tidak mau berbaring. Dulu, ia seperti kamu.' },
  { id:'ibu-musim', act:3, tier:'boss', name:'Ibu Musim, Penenun Salju Abadi', icon:'👸', hp:168, atk:17, def:4, gold:[120,160], pattern:['A','A','C','U','A'], phase2:true,
    desc:'Ia duduk di takhta es hitam, menenun salju dari cahaya bintang. "Satu lentera lagi," katanya tanpa membuka mata. "Selalu ada satu lentera lagi."' }
];

var WEAPONS = [
  { id:'belati',        name:'Belati Penjaga',    atk:0,  price:0 },
  { id:'pedang-lentera',name:'Pedang Lentera',    atk:4,  price:70 },
  { id:'kapak-badai',   name:'Kapak Badai Salju', atk:8,  price:130 },
  { id:'tombak-fajar',  name:'Tombak Fajar Beku', atk:12, price:210 },
  { id:'pedang-ibu',    name:'Pedang Ibu Musim',  atk:17, price:340 }
];

var ARMORS = [
  { id:'jubah-wol',      name:'Jubah Wol Tebal',    def:0, price:0 },
  { id:'zirah-serigala', name:'Zirah Kulit Serigala', def:2, price:60 },
  { id:'zirah-uap',      name:'Zirah Uap Tembaga',  def:4, price:120 },
  { id:'zirah-es-hitam', name:'Zirah Es Hitam',     def:7, price:200 }
];

var SKILLS = {
  'tebasan-lentera': { name:'Tebasan Lentera', icon:'🔥', cost:2, desc:'Serangan 160% yang membawa api lentera.' },
  'perisai-cahaya':  { name:'Perisai Cahaya',  icon:'🌟', cost:2, desc:'Blok besar sebesar PERTAHANAN + 14.' },
  'semburan-bara':   { name:'Semburan Bara',   icon:'💥', cost:3, desc:'Serangan 120% dan serangan musuh melemah 3 selama 2 giliran.' },
  'langkah-bayangan':{ name:'Langkah Bayangan',icon:'🌫️', cost:2, desc:'Menghindar dari serangan musuh berikutnya; seranganmu berikutnya pasti kritikal.' },
  'suar-penyembuh':  { name:'Suar Penyembuh',  icon:'💛', cost:3, desc:'Memulihkan 22% HP maksimum dari cahaya lentera.' }
};

var TRAITS = {
  /* sifat yang bisa didapat di tengah run */
  'kulit-badai':    { name:'Kulit Badai',    icon:'🌪️', kind:'pool', desc:'+2 PERTAHANAN.' },
  'otot-penebang':  { name:'Otot Penebang',  icon:'🪓', kind:'pool', desc:'+2 SERANGAN.' },
  'jantung-besar':  { name:'Jantung Besar',  icon:'❤️', kind:'pool', desc:'+12 HP maksimum.' },
  'mata-serigala':  { name:'Mata Serigala',  icon:'👁️', kind:'pool', desc:'+10% peluang kritikal.' },
  'langkah-ringan': { name:'Langkah Ringan', icon:'🍃', kind:'pool', desc:'15% peluang menghindar dari serangan musuh.' },
  'lentera-hangat': { name:'Lentera Hangat', icon:'🏮', kind:'pool', desc:'Pulih 6 HP setiap memenangkan pertarungan.' },
  'penambang-emas': { name:'Penambang Emas', icon:'💰', kind:'pool', desc:'+35% emas dari pertarungan.' },
  'ahli-ramuan':    { name:'Ahli Ramuan',    icon:'⚗️', kind:'pool', desc:'Ramuan memulihkan 60% HP (dari 40%).' },
  'perisai-awal':   { name:'Perisai Awal',   icon:'🛡️', kind:'pool', desc:'Memulai setiap pertarungan dengan Blok 8.' },
  'haus-darah':     { name:'Haus Darah',     icon:'🩸', kind:'pool', desc:'Pulih 4 HP setiap mengalahkan musuh.' },
  'sentuhan-musim': { name:'Sentuhan Musim', icon:'❄️', kind:'pool', desc:'+3 SERANGAN, tetapi −1 PERTAHANAN. Dingin memberimu kekuatan dan mengambil kehangatanmu.' },
  /* sifat awal (meta-progresi "Ingatan Menara") */
  'pekerja-keras':  { name:'Pekerja Keras',  icon:'💪', kind:'start', desc:'+6 HP maksimum.' },
  'tangan-mantap':  { name:'Tangan Mantap',  icon:'✋', kind:'start', desc:'+1 SERANGAN.' },
  'bekas-luka':     { name:'Bekas Luka Tua', icon:'🩹', kind:'start', desc:'+2 PERTAHANAN.', unlock:{ type:'beatBoss', act:1 }, unlockDesc:'Kalahkan bos Bab I' },
  'paru-baja':      { name:'Paru-Paru Baja', icon:'🫁', kind:'start', desc:'+1 Tenaga maksimum.', unlock:{ type:'reachAct', act:2 }, unlockDesc:'Capai Bab II' },
  'mata-badai':     { name:'Mata Badai',     icon:'🌩️', kind:'start', desc:'+12% peluang kritikal.', unlock:{ type:'reachAct', act:3 }, unlockDesc:'Capai Bab III' },
  'keras-kepala':    { name:'Keras Kepala',   icon:'🔥', kind:'start', desc:'Sekali dalam satu run: saat HP habis, bangkit kembali dengan 25% HP.', unlock:{ type:'deaths', n:3 }, unlockDesc:'Gugur 3 kali' },
  'jantung-lentera':{ name:'Jantung Lentera',icon:'💛', kind:'start', desc:'Pulih 8 HP setiap memenangkan pertarungan.', unlock:{ type:'win' }, unlockDesc:'Tuntaskan pendakian (menang)' }
};

/* Efek (fx) yang dikenali mesin:
   hp, maxHp, atk, def, gold, potion, energyMax, healPct (persen maxHp),
   trait, skill, weapon (indeks WEAPONS), armor (indeks ARMORS), fight (id musuh) */
var EVENTS = [
  /* ---------- BAB I ---------- */
  { id:'ev-patung-menangis', act:1, icon:'🗿', title:'Patung yang Menangis',
    text:'Di tepi jalan setapak, sebuah patung penjaga menangis — air matanya membeku sebelum jatuh. Di telapak tangannya yang terbuka tertulis: "Berikan darahmu, ambil kekuatanku."',
    choices:[
      { label:'Berikan darah (−12 HP maks)', hint:'+3 SERANGAN, permanen', fx:{ maxHp:-12, hp:-12, atk:3 }, out:'Kamu menggores telapak tanganmu. Patung itu berhenti menangis. Ada kekuatan baru yang dingin mengalir di lenganmu — dan tubuhmu terasa sedikit lebih ringan, untuk selamanya.' },
      { label:'Lap air matanya, lalu pergi', hint:'Aman', fx:{}, out:'Kamu mengelap es dari pipi patung itu. Entah kenapa, langkahmu terasa lebih ringan sesudahnya.' }
    ]},
  { id:'ev-sumur-beku', act:1, icon:'🪣', title:'Sumur Beku',
    text:'Sebuah sumur tua, airnya jernih di bawah lapisan es tipis. Orang-orang desa dulu percaya air sumur di kaki menara bisa menyembuhkan — atau membekukanmu dari dalam.',
    choices:[
      { label:'Pecahkan es dan minum', hint:'Dadu keberuntungan', roll:{ dc:11, ok:{ healPct:35 }, okOut:'Airnya manis seperti madu cair. Hangat menyebar dari perutmu ke ujung jari. Luka-lukamu menutup.', fail:{ hp:-10 }, failOut:'Dingin yang salah merayap naik dari tenggorokanmu. Air ini sudah terlalu lama bertetangga dengan menara.' } },
      { label:'Isi botol untuk nanti', hint:'+1 Ramuan', fx:{ potion:1 }, out:'Kamu mengisi botol kosongmu. Kalaupun tidak menyembuhkan, air tetaplah air.' },
      { label:'Pergi', hint:'Aman', fx:{}, out:'Kamu membiarkan sumur itu dengan rahasianya.' }
    ]},
  { id:'ev-bangkai-karavan', act:1, icon:'🛒', title:'Karavan yang Ditinggalkan',
    text:'Gerobak karavan terbalik, separuh terkubur salju. Kuda-kudanya tidak ada. Peti-peti masih terkunci — dan dari balik gerobak terdengar bunyi garukan pelan.',
    choices:[
      { label:'Buka peti-peti itu', hint:'Mungkin emas. Mungkin bukan.', roll:{ dc:12, ok:{ gold:45 }, okOut:'Emas dagang dan perbekalan! Karavan ini tidak akan membutuhkannya lagi.', fail:{ fight:'penjarah-makam' }, failOut:'Garukan itu berhenti. Lalu sesuatu yang dulu manusia bangkit dari balik gerobak, iri pada kehangatanmu.' } },
      { label:'Bakar gerobaknya untuk menghormati mereka', hint:'Pulih 15% HP di dekat api', fx:{ healPct:15 }, out:'Api dari kayu gerobak menerangi salju sebentar. Kamu duduk sampai apinya kecil, mengenang orang-orang yang tidak kamu kenal.' },
      { label:'Jangan ganggu yang sudah pergi', hint:'Aman', fx:{}, out:'Kamu menunduk singkat dan melanjutkan perjalanan.' }
    ]},
  { id:'ev-gagak-pembawa', act:1, icon:'🦅', title:'Gagak Pembawa Kabar',
    text:'Seekor gagak hitam hinggap di dahan mati dan menatap lenteramu. Di paruhnya: kunci kuningan kecil. Ia memiringkan kepala, menunggu — gagak menara terkenal suka berdagang.',
    choices:[
      { label:'Beri ia sepotong bekal (−10 emas)', hint:'Tukar dengan kuncinya', fx:{ gold:-10, trait:'mata-serigala' }, out:'Gagak itu menjatuhkan kuncinya — ternyata bukan kunci, melainkan lensa kuningan. Memandang melaluinya, dunia terlihat lebih tajam. Matamu berubah selamanya.' },
      { label:'Usir dia', hint:'Aman', fx:{}, out:'Ia terbang sambil memaki dalam bahasa gagak.' }
    ]},
  { id:'ev-pondok-penebang', act:1, icon:'🛖', title:'Pondok Penebang Kosong',
    text:'Pondok kecil, pintunya berderit. Di dalam: tungku dingin, dipan, dan kapak yang masih tajam tertancap di tunggul. Tidak ada tanda kekerasan. Penghuninya seperti baru saja keluar dan lupa jalan pulang.',
    choices:[
      { label:'Beristirahat di dipan', hint:'Pulih 25% HP', fx:{ healPct:25 }, out:'Kamu tidur tanpa mimpi — kemewahan langka di negeri ini.' },
      { label:'Geledah pondok', hint:'Dadu keberuntungan', roll:{ dc:10, ok:{ weapon:1 }, okOut:'Di bawah lantai yang longgar: sebilah Pedang Lentera, dibungkus kain berminyak, menunggu pemilik baru.', fail:{ fight:'landak-es' }, failOut:'Di lemari hanya ada sarang landak berduri es — dan ia tidak suka dibangunkan.' } },
      { label:'Ambil kapaknya saja', hint:'+1 SERANGAN', fx:{ atk:1 }, out:'Bukan senjata pahlawan, tapi kapak penebang yang jujur. Tanganmu mengingat beratnya.' }
    ]},
  /* ---------- BAB II ---------- */
  { id:'ev-mesin-doa', act:2, icon:'🙏', title:'Mesin Doa Otomatis',
    text:'Sebuah mesin kuningan setinggi manusia, penuh tuas dan lonceng kecil. Plakatnya berbunyi: "MASUKKAN KOIN. DOA ANDA AKAN DITERUSKAN KE LANTAI ATAS."',
    choices:[
      { label:'Masukkan 20 emas', hint:'Dadu keberuntungan', fx:{ gold:-20 }, roll:{ dc:10, ok:{ trait:'perisai-awal' }, okOut:'Lonceng berdenting merdu. Cahaya hangat melingkupi bahumu dan menetap di sana seperti jubah tipis.', fail:{}, failOut:'Mesin itu menelan koinmu, bersendawa uap, dan membunyikan lonceng yang salah nada. Tidak terjadi apa-apa.' } },
      { label:'Bongkar mesinnya', hint:'+30 emas dari suku cadang', fx:{ gold:30 }, out:'Di dalamnya tidak ada dewa. Hanya roda gigi, pegas, dan segenggam koin orang-orang yang pernah berharap.' },
      { label:'Biarkan saja', hint:'Aman', fx:{}, out:'Kamu meninggalkan mesin itu menunggu pendoa berikutnya.' }
    ]},
  { id:'ev-koki-uap', act:2, icon:'🍲', title:'Koki Terakhir',
    text:'Di dapur uap yang berdenyut, sesosok juru masak mekanik masih setia mengaduk panci sebesar bak mandi. "Sup hari ini," katanya dengan suara seperti sendok di atas panci, "sup setiap hari. Duduk."',
    choices:[
      { label:'Makan supnya', hint:'Dadu keberuntungan', roll:{ dc:10, ok:{ healPct:40, energyMax:0 }, okOut:'Rasanya seperti rumah yang sudah lama kamu lupakan. Tenagamu kembali penuh dan perutmu hangat.', fail:{ hp:-8 }, failOut:'Ada baut di dalam supnya. Dan sesuatu yang mungkin dulunya jamur. Perutmu memberontak.' } },
      { label:'Beli bekal darinya (−25 emas)', hint:'+2 Ramuan', fx:{ gold:-25, potion:2 }, out:'Ia membungkus dua botol ramuan dengan sangat rapi, seperti kado. "Untuk jalan naik," katanya. "Selalu untuk jalan naik."' },
      { label:'Pamit dengan sopan', hint:'Aman', fx:{}, out:'"Tidak ada yang naik dengan perut kosong selamanya," katanya pada punggungmu.' }
    ]},
  { id:'ev-jantung-cadangan', act:2, icon:'🫀', title:'Jantung Cadangan',
    text:'Di ruang perawatan mesin, sebuah jantung uap cadangan berdetak di dalam cairan hijau. Labelnya: "DAYA TAHAN EKSTRA — TUKARKAN DENGAN DAYA TAHAN ANDA." Mesin menara memang punya selera humor yang buruk.',
    choices:[
      { label:'Lakukan pertukaran (−15 HP maks)', hint:'Dapatkan Semburan Bara', fx:{ maxHp:-15, hp:-15, skill:'semburan-bara' }, out:'Prosesnya singkat dan mengerikan. Sesudahnya, dari ujung jarimu bisa menyembur bara yang sesungguhnya — tapi dadamu terasa lebih sempit dari sebelumnya.' },
      { label:'Jangan. Tubuhmu bukan suku cadang.', hint:'Aman', fx:{}, out:'Kamu menutup pintu ruang itu pelan-pelan.' }
    ]},
  { id:'ev-cermin-uap', act:2, icon:'🪞', title:'Cermin Berembun',
    text:'Cermin besar berembun uap. Saat kamu mengelapnya, bayanganmu tidak ikut bergerak. Ia menatapmu, lalu menulis dengan jari di embun dari sisi dalamnya: "TUKAR TEMPAT?"',
    choices:[
      { label:'Tolak dan pecahkan cerminnya', hint:'+20 emas dari bingkai perak', fx:{ gold:20 }, out:'Bingkainya perak murni. Bayanganmu sempat terlihat sangat kecewa sebelum cermin itu pecah.' },
      { label:'Sentuh permukaannya (−10 HP)', hint:'Dapatkan Langkah Bayangan', fx:{ hp:-10, skill:'langkah-bayangan' }, out:'Dingin menggigit jarimu sampai ke tulang. Tapi sesudahnya, bayanganmu tertinggal setengah langkah di belakangmu — dan itu ternyata berguna.' },
      { label:'Pergi tanpa menoleh', hint:'Aman', fx:{}, out:'Di belakangmu, terdengar helaan napas yang sangat panjang.' }
    ]},
  { id:'ev-peti-zirah', act:2, icon:'🧰', title:'Peti Zirah Berkarat',
    text:'Peti besi berkarat, gemboknya sebesar kepalan tangan. Dari celahnya mengintip kilau kulit zirah yang masih bagus. Gembok ini bisa dipaksa — dengan risiko membangunkan seisi lorong.',
    choices:[
      { label:'Paksa buka', hint:'Uji kekuatan (dadu)', roll:{ dc:12, ok:{ armor:1 }, okOut:'Gemboknya menyerah. Di dalam: Zirah Kulit Serigala, kering dan utuh.', fail:{ fight:'ksatria-karat' }, failOut:'Gemboknya memang menyerah — tapi bunyinya membangunkan penjaga lama lorong ini.' } },
      { label:'Cari kuncinya di sekitar', hint:'Aman, tidak dapat apa-apa', fx:{}, out:'Tidak ada kunci. Hanya debu dan tulisan di dinding: "KUNCI ADA DI LANTAI ATAS. —P"' }
    ]},
  /* ---------- BAB III ---------- */
  { id:'ev-perpustakaan-abu', act:3, icon:'📚', title:'Perpustakaan Abu',
    text:'Ruang terakhir yang hangat di menara ini adalah perpustakaannya — dan seseorang membakarnya dengan sangat teliti, rak demi rak. Tersisa satu buku utuh di atas podium, sampulnya dari kulit yang tidak terbakar.',
    choices:[
      { label:'Baca buku itu (−8 HP, udara berasap)', hint:'Dapatkan Suar Penyembuh', fx:{ hp:-8, skill:'suar-penyembuh' }, out:'Buku itu berisi catatan para penjaga lentera sebelum kamu. Halaman terakhir mengajarkan cara mengubah cahaya menjadi penawar. Air matamu menguap sebelum jatuh.' },
      { label:'Bakar podium untuk menghangatkan diri', hint:'Pulih 30% HP', fx:{ healPct:30 }, out:'Kadang bertahan hidup berarti memilih api kecil hari ini daripada ilmu besar besok. Kamu memilih api.' },
      { label:'Tutup pintunya dan hormati abu ini', hint:'Aman', fx:{}, out:'Beberapa hal lebih baik tetap menjadi abu.' }
    ]},
  { id:'ev-ibu-membeku', act:3, icon:'🧊', title:'Perempuan di Dalam Es',
    text:'Di dinding es hitam, membeku seorang perempuan berbaju penjaga — pendahulumu, mungkin. Matanya terbuka. Di tangannya yang terulur: mahkota kecil dari es yang tembus cahaya.',
    choices:[
      { label:'Lelehkan esnya dengan lentera (−12 HP)', hint:'Bebaskan dia', fx:{ hp:-12 }, roll:{ dc:9, ok:{ trait:'lentera-hangat' }, okOut:'Es itu mencair seperti musim semi yang dipaksa datang. Ia terbatuk, tersenyum lemah, dan meniup lenteramu sekali — apinya kini tidak pernah benar-benar padam di hatimu. Lalu ia pergi menuruni tangga, pulang.', fail:{ fight:'bayangan-beku' }, failOut:'Esnya mencair — tapi yang bangun bukan lagi dia. Dingin menara sudah terlalu lama memakai wajahnya.' } },
      { label:'Ambil mahkota esnya', hint:'+50 emas, tapi dingin menggigit (−10 HP)', fx:{ gold:50, hp:-10 }, out:'Mahkota itu berat dan indah dan salah. Kamu menjualnya nanti, kalau ada nanti.' },
      { label:'Biarkan ia beristirahat', hint:'Aman', fx:{}, out:'Kamu membacakan doa penjaga untuknya, yang pendek itu, lalu naik.' }
    ]},
  { id:'ev-takhta-kecil', act:3, icon:'🪑', title:'Takhta Kecil',
    text:'Di anak tangga terakhir sebelum puncak, ada takhta kecil dari es — untuk anak, atau untuk orang yang menyerah pada ukuran mimpinya. Di atasnya selembar kertas: "DUDUKLAH. KAMU SUDAH JAUH. TIDAK ADA YANG AKAN TAHU."',
    choices:[
      { label:'Duduk sebentar (−1 PERTAHANAN, +3 SERANGAN)', hint:'Kutukan ambisi', fx:{ def:-1, atk:3, trait:'sentuhan-musim' }, out:'Takhta itu pas sekali. Terlalu pas. Saat kamu berdiri lagi, dingin sudah menjadi bagian dari caramu memukul.' },
      { label:'Robek kertasnya dan lanjut naik', hint:'Pulih 10% HP (lega)', fx:{ healPct:10 }, out:'Menolak menyerah ternyata menghangatkan. Siapa sangka.' }
    ]},
  { id:'ev-sumur-bintang', act:3, icon:'🌌', title:'Sumur Bintang',
    text:'Di mahkota menara, lantai terbuka ke langit: sebuah sumur tanpa dasar yang memantulkan bintang-bintang dari masa sebelum musim dingin. Konon sumur ini mengabulkan keinginan — dengan caranya sendiri.',
    choices:[
      { label:'Lempar koin dan berharap (−15 emas)', hint:'Dadu keberuntungan besar', fx:{ gold:-15 }, roll:{ dc:11, ok:{ trait:'jantung-besar' }, okOut:'Koinmu jatuh selamanya. Tapi dari sumur itu naik cahaya bintang yang masuk ke dadamu dan menetap. Jantungmu berdetak lebih besar sekarang.', fail:{ hp:-12 }, failOut:'Sumur itu mengembalikan koinmu — dalam bentuk es yang menggigit tanganmu saat menangkapnya. Ia punya selera humor juga, rupanya.' } },
      { label:'Cukup memandang bintang', hint:'Pulih 15% HP', fx:{ healPct:15 }, out:'Kamu duduk lama. Di atas sana, bintang-bintang tidak peduli pada musim dingin — dan ketidakpedulian itu, anehnya, menenangkan.' }
    ]},
  { id:'ev-pintu-berbisik', act:3, icon:'🚪', title:'Pintu yang Berbisik',
    text:'Pintu terakhir sebelum takhta tidak punya gagang. Ia berbisik dengan suara semua penjaga yang gugur: "Kami membuka untuk darah penjaga. Selalu darah penjaga."',
    choices:[
      { label:'Bayar dengan darah (−15 HP)', hint:'Pintu terbuka, +2 SERANGAN dari tekad', fx:{ hp:-15, atk:2 }, out:'Pintu itu minum dari lukamu dan terbuka tanpa suara. Para penjaga di dalam bisikannya terdengar... lega.' },
      { label:'Dorong dengan seluruh berat badan', hint:'Uji kekuatan (dadu)', roll:{ dc:13, ok:{}, okOut:'Engsel esnya retak seperti guntur kecil. Pintu menyerah pada orang yang menolak membayar.', fail:{ fight:'raja-tanpa-wajah' }, failOut:'Pintu itu terbuka — dan di baliknya, penghuni lama menara sudah menunggumu.' } }
    ]}
];

var INTROS = {
  combat:'Langkahmu bergema. Ada yang bergerak di depan sana.',
  elite:'Udara berubah. Yang menunggumu kali ini bukan lawan biasa.',
  boss:'Tanah bergetar pelan. Inilah penjaga lantai ini.',
  event:'Sesuatu menarik perhatianmu di perjalanan.',
  rest:'Sebuah ceruk yang aman dari angin. Lentera bisa bernapas di sini.',
  merchant:'Di tikungan tangga, seseorang menggelar lapak di atas peti tua.'
};

var GAME_TITLE = 'Menara Musim Abadi';
var HERO_NAME = 'Saka';
var HERO_STORY = 'Kamu adalah Saka, penjaga lentera terakhir Desa Bara. Ketika rombongan penjelajah yang kamu pandu musnah diterjang badai salju tiga hari lalu, hanya kamu dan lentera pusaka ini yang tersisa. Kini kamu berjalan ke utara — ke Menara Sunyi, sumber musim dingin abadi — untuk menaikinya sampai puncak dan mengakhiri musim yang tidak pernah mau selesai.';

var DATA = { ACTS:ACTS, ENEMIES:ENEMIES, WEAPONS:WEAPONS, ARMORS:ARMORS, SKILLS:SKILLS, TRAITS:TRAITS, EVENTS:EVENTS, INTROS:INTROS, GAME_TITLE:GAME_TITLE, HERO_NAME:HERO_NAME, HERO_STORY:HERO_STORY };
if (typeof window !== 'undefined') window.GAMEDATA = DATA;
if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})();
