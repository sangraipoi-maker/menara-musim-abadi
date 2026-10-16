# Generator aset pixel art "Menara Musim Abadi" — Kuas, Divisi Ilustrasi.
# Semua karakter & latar ORIGINAL, digambar prosedural (PIL) piksel demi piksel.
# Palet terbatas, resolusi asli kecil -> ditampilkan pixel-perfect oleh situs.
import math, os, random
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
def P(*a): return os.path.normpath(os.path.join(ROOT, *a))

# ---------- palet ----------
HOOD_D, HOOD_M, HOOD_L = (46,74,90), (62,99,115), (87,128,142)
CLOAK_D, CLOAK_M, CLOAK_L = (40,66,79), (51,80,95), (35,56,67)
SKIN, SKIN_S = (232,195,158), (201,155,114)
HAIR = (74,52,40)
EYE = (34,48,58)
SCARF, SCARF_D = (168,85,47), (126,62,33)
LEATHER = (90,70,50)
GOLD, GOLD_D = (201,162,39), (138,109,31)
METAL = (58,63,68)
GLOW_C, GLOW_M = (255,227,161), (245,184,76)
MOUTH = (138,90,60)
TEAR = (168,200,216)
BLUSH = (220,165,121)

def new(w,h): return Image.new("RGBA",(w,h),(0,0,0,0))
def ell(d,box,fill): d.ellipse(box,fill=fill)
def halo(img,cx,cy,r,alpha=34,col=GLOW_M):
    ov = new(img.width,img.height); od = ImageDraw.Draw(ov)
    od.ellipse([cx-r,cy-r,cx+r,cy+r],fill=col+(alpha,))
    od.ellipse([cx-r//2,cy-r//2,cx+r//2,cy+r//2],fill=GLOW_C+(alpha+14,))
    img.alpha_composite(ov)

# ---------- HERO: Penjaga Lentera (64x80) ----------
def hero(expr="netral", head_dy=0, body_dy=0, arm="down", flare=False, impact=False, flat_hood=False):
    img = new(64,80); d = ImageDraw.Draw(img)
    dy = body_dy
    # --- jubah ---
    d.polygon([(21,36+dy),(43,36+dy),(53,79),(11,79)], fill=CLOAK_M)
    d.polygon([(38,36+dy),(43,36+dy),(53,79),(44,79)], fill=CLOAK_D)            # bayangan kanan
    d.line([(21,36+dy),(11,79)], fill=HOOD_L, width=1)                          # rim kiri
    d.rectangle([11,74,53,79], fill=CLOAK_L)                                    # ujung bawah gelap
    for fx in (26,38):
        d.line([(fx,44+dy),(fx-1,73)], fill=CLOAK_D, width=1)                   # lipatan
    # --- sabuk ---
    d.rectangle([18,55+dy,46,58+dy], fill=LEATHER)
    d.rectangle([30,55+dy,34,58+dy], outline=GOLD, fill=GOLD_D)
    # --- syal ---
    d.rectangle([24,33+dy,40,37+dy], fill=SCARF)
    d.rectangle([24,36+dy,40,37+dy], fill=SCARF_D)
    d.polygon([(38,37+dy),(42,37+dy),(41,48+dy),(37,46+dy)], fill=SCARF)        # ekor syal
    d.polygon([(40,37+dy),(42,37+dy),(41,48+dy),(39,47+dy)], fill=SCARF_D)
    # --- lengan kiri ---
    d.polygon([(23,37+dy),(27,37+dy),(21,60+dy),(16,58+dy)], fill=CLOAK_D)
    d.rectangle([16,58+dy,19,61+dy], fill=SKIN)
    # --- lentera & lengan kanan ---
    if arm == "down":
        halo(img, 54, 62+dy, 11)
        d.polygon([(41,37+dy),(45,37+dy),(52,52+dy),(48,54+dy)], fill=CLOAK_D)
        d.rectangle([49,52+dy,52,55+dy], fill=SKIN)
        d.line([(53,55+dy),(53,57+dy)], fill=METAL, width=1)
        _lantern(d, 49, 57+dy, lit=True)
    elif arm == "up":
        d.polygon([(41,37+dy),(45,37+dy),(55,33+dy),(56,37+dy)], fill=CLOAK_D)
        d.rectangle([53,31+dy,56,34+dy], fill=SKIN)
        halo(img, 54, 25+dy, 13, alpha=40)
        _lantern(d, 50, 18+dy, lit=True)
        if flare:
            for (x1,y1,x2,y2) in [(44,12,41,8),(64-44,12,64-41,8),(40,25,35,25),(59,25,63,25),(47,8,45,3),(58,8,60,3)]:
                d.line([(x1,y1+dy),(x2,y2+dy)], fill=GLOW_C, width=1)
            d.point((54,25+dy), fill=(255,255,255))
    elif arm == "ground":  # kalah: lentera jatuh, padam
        d.polygon([(41,37+dy),(45,37+dy),(50,50+dy),(46,52+dy)], fill=CLOAK_D)
        _lantern(d, 47, 68, lit=False)
    # --- kepala (grup bergeser utk angguk/kalah) ---
    hy = head_dy
    if flat_hood:
        ell(d,[13,4+hy,51,36+hy],HOOD_D)
    else:
        ell(d,[15,2+hy,49,34+hy],HOOD_D)
        d.polygon([(32,0+hy),(26,7+hy),(38,7+hy)], fill=HOOD_D)                 # ujung tudung
    d.arc([15,2+hy,49,34+hy],180,305,fill=HOOD_L)                               # rim tudung
    ell(d,[22,10+hy,42,32+hy],SKIN)                                             # wajah
    d.rectangle([24,25+hy,25,26+hy], fill=BLUSH); d.rectangle([39,25+hy,40,26+hy], fill=BLUSH)
    # poni rambut
    for x in range(24,41):
        if x % 3 != 2: d.rectangle([x,10+hy,x,12+hy], fill=HAIR)
    # lipatan tudung pembingkai wajah
    d.polygon([(15,10+hy),(23,6+hy),(24,30+hy),(18,34+hy)], fill=HOOD_M)
    d.polygon([(49,10+hy),(41,6+hy),(40,30+hy),(46,34+hy)], fill=HOOD_M)
    d.rectangle([21,5+hy,43,9+hy], fill=HOOD_M)
    _face(d, expr, hy)
    if impact:  # bintang benturan + keringat
        for (x,y) in [(10,10),(8,14),(12,15),(10,18)]:
            d.point((x,y+hy), fill=GLOW_C)
        d.rectangle([45,13+hy,46,16+hy], fill=TEAR)
    return img

def _lantern(d, x, y, lit):
    d.rectangle([x,y,x+9,y+1], fill=METAL)                    # tutup
    if lit:
        d.rectangle([x+1,y+2,x+8,y+8], fill=GLOW_M)
        d.rectangle([x+3,y+3,x+6,y+7], fill=GLOW_C)
    else:
        d.rectangle([x+1,y+2,x+8,y+8], fill=(107,124,134))
    d.rectangle([x,y,x,y+10], fill=METAL); d.rectangle([x+9,y,x+9,y+10], fill=METAL)
    d.rectangle([x,y+9,x+9,y+10], fill=METAL)                 # alas

def _eye_open(d,cx,y,spark=True):
    d.rectangle([cx-1,y,cx+1,y+3], fill=EYE)
    if spark: d.point((cx,y), fill=(255,255,255))
def _eye_line(d,cx,y):
    d.line([(cx-1,y+1),(cx+1,y+1)], fill=EYE)
def _eye_happy(d,cx,y):
    d.point((cx-1,y+1), fill=EYE); d.point((cx,y), fill=EYE); d.point((cx+1,y+1), fill=EYE)
def _eye_hurt(d,cx,y,side):
    if side<0: pts=[(cx+1,y-1),(cx,y),(cx+1,y+1),(cx-1,y)]
    else:      pts=[(cx-1,y-1),(cx,y),(cx-1,y+1),(cx+1,y)]
    for (x,yy) in pts: d.point((x,yy), fill=EYE)

def _face(d, expr, hy):
    L,R,Y = 27,37,20
    by = 15+hy
    def brow(style):
        if style=="netral":
            d.line([(25,by),(29,by)],fill=HAIR); d.line([(35,by),(39,by)],fill=HAIR)
        elif style=="tekad":
            d.line([(25,by),(29,by+2)],fill=HAIR); d.line([(39,by),(35,by+2)],fill=HAIR)
        elif style=="khawatir":
            d.line([(25,by+2),(29,by)],fill=HAIR); d.line([(39,by+2),(35,by)],fill=HAIR)
        elif style=="sakit":
            d.line([(25,by-1),(29,by+1)],fill=HAIR); d.line([(39,by-1),(35,by+1)],fill=HAIR)
    my = 28+hy
    if expr=="netral":
        brow("netral"); _eye_open(d,L,Y+hy); _eye_open(d,R,Y+hy)
        d.line([(30,my),(33,my)], fill=MOUTH)
    elif expr=="kedip":
        brow("netral"); _eye_line(d,L,Y+hy); _eye_line(d,R,Y+hy)
        d.line([(30,my),(33,my)], fill=MOUTH)
    elif expr=="senyum":
        brow("netral"); _eye_open(d,L,Y+hy); _eye_open(d,R,Y+hy)
        for (x,y) in [(30,my),(31,my+1),(32,my+1),(33,my)]: d.point((x,y), fill=MOUTH)
    elif expr=="senyum2":
        brow("netral"); _eye_happy(d,L,Y+hy); _eye_happy(d,R,Y+hy)
        for (x,y) in [(30,my),(31,my+1),(32,my+1),(33,my)]: d.point((x,y), fill=MOUTH)
        d.point((31,my), fill=MOUTH); d.point((32,my), fill=MOUTH)
    elif expr=="sedih":
        brow("khawatir"); _eye_open(d,L,Y+hy,spark=False); _eye_open(d,R,Y+hy,spark=False)
        d.point((L+1,Y+3+hy), fill=TEAR); d.point((R-1,Y+3+hy), fill=TEAR)
        for (x,y) in [(30,my+1),(31,my),(32,my),(33,my+1)]: d.point((x,y), fill=MOUTH)
    elif expr=="sakit":
        brow("sakit"); _eye_hurt(d,L,Y+hy,-1); _eye_hurt(d,R,Y+hy,1)
        d.rectangle([30,my-1,32,my+1], outline=MOUTH)
    elif expr=="tekad":
        brow("tekad"); _eye_open(d,L,Y+hy); _eye_open(d,R,Y+hy)
        d.line([(29,my),(34,my)], fill=MOUTH)
    elif expr=="tutup":
        brow("netral"); _eye_line(d,L,Y+hy); _eye_line(d,R,Y+hy)
        d.line([(30,my+1),(32,my+1)], fill=MOUTH)
    d.point((32,24+hy), fill=SKIN_S)  # hidung

# keadaan animasi hero: (nama status, [(kwargs frame), ...])
HERO_STATES = [
    ("idle",    [dict(expr="netral"), dict(expr="kedip")]),
    ("angguk",  [dict(expr="netral"), dict(expr="tutup", head_dy=2)]),
    ("senyum",  [dict(expr="senyum"), dict(expr="senyum2")]),
    ("sedih",   [dict(expr="sedih"),  dict(expr="sedih", head_dy=1)]),
    ("terluka", [dict(expr="sakit"),  dict(expr="sakit", head_dy=1, impact=True)]),
    ("serang",  [dict(expr="tekad", arm="down"), dict(expr="tekad", arm="up", flare=True)]),
    ("kalah",   [dict(expr="tutup", arm="ground", body_dy=4, head_dy=5, flat_hood=True),
                 dict(expr="tutup", arm="ground", body_dy=5, head_dy=6, flat_hood=True)]),
]

def build_hero():
    frames = []  # (status, idx, img)
    for name, variants in HERO_STATES:
        for i, kw in enumerate(variants, 1):
            frames.append((name, i, hero(**kw)))
    # frame individual
    for name, i, im in frames:
        im.save(P("hero","frame",f"hero-{name}-{i}.png"))
    # sprite sheet: semua frame berjajar satu baris
    sheet = new(64*len(frames), 80)
    for j,(name,i,im) in enumerate(frames):
        sheet.alpha_composite(im, (64*j, 0))
    sheet.save(P("hero","hero-sheet.png"))
    # potret utama (idle frame 1) ukuran dobel utk kartu profil
    frames[0][2].save(P("hero","hero-potret.png"))
    return frames

# ---------- MUSUH (48x48) & BOS (80x80) ----------
ICE_L, ICE_M, ICE_D = (190,220,235), (140,180,205), (95,135,170)
STONE_L, STONE_M, STONE_D = (150,155,165), (105,110,120), (70,75,85)
FUR_L, FUR_M, FUR_D = (225,233,240), (175,195,210), (130,150,170)
EMBER_L, EMBER_M, EMBER_D = (255,214,120), (245,150,60), (190,90,35)
AUR_G, AUR_T, AUR_V = (90,225,170), (60,190,200), (150,120,220)

def shadow(img, cx, cy, rx, ry=3):
    ov = new(img.width, img.height); od = ImageDraw.Draw(ov)
    od.ellipse([cx-rx,cy-ry,cx+rx,cy+ry], fill=(0,0,0,80))
    img.alpha_composite(ov)

def serigala_salju():
    img = new(48,48); d = ImageDraw.Draw(img); shadow(img,24,44,17)
    d.polygon([(30,14),(33,4),(36,13)], fill=FUR_M)                      # telinga
    d.polygon([(38,15),(42,6),(43,16)], fill=FUR_M)
    ell(d,[6,18,36,34],FUR_L)                                           # badan
    d.polygon([(6,22),(0,16),(2,28)], fill=FUR_M)                        # ekor
    ell(d,[28,10,45,26],FUR_L)                                          # kepala
    d.polygon([(40,20),(47,23),(40,26)], fill=FUR_M)                    # moncong
    d.point((46,22), fill=(30,35,45))
    d.rectangle([34,16,36,18], fill=(35,70,85))                          # mata teal
    d.point((35,16), fill=(255,255,255))
    for lx in (12,20,28):                                               # kaki
        d.rectangle([lx,32,lx+3,42], fill=FUR_M)
        d.rectangle([lx,41,lx+4,43], fill=FUR_D)
    d.line([(8,22),(34,20)], fill=FUR_M, width=1)
    return img

def golem_es():
    img = new(48,48); d = ImageDraw.Draw(img); shadow(img,24,45,15)
    d.polygon([(14,16),(34,16),(38,34),(10,34)], fill=ICE_M)            # torso bongkahan
    d.polygon([(14,16),(24,16),(22,34),(10,34)], fill=ICE_L)
    d.polygon([(18,4),(30,4),(33,14),(15,14)], fill=ICE_L)               # kepala
    d.rectangle([20,9,22,10], fill=(30,50,80)); d.rectangle([27,9,29,10], fill=(30,50,80))
    for (x,y) in [(16,0),(24,-2),(31,1)]:                                # duri es di kepala
        d.polygon([(x,6),(x+3,6),(x+1,y+4)], fill=ICE_L)
    d.polygon([(10,16),(4,20),(6,36),(12,34)], fill=ICE_D)               # lengan kiri
    d.polygon([(38,16),(44,20),(42,36),(36,34)], fill=ICE_D)             # lengan kanan
    d.rectangle([14,34,20,44], fill=ICE_D); d.rectangle([28,34,34,44], fill=ICE_D)  # kaki
    d.line([(17,20),(30,30)], fill=ICE_D, width=1)                       # retakan
    return img

def hantu_salju():
    img = new(48,48); d = ImageDraw.Draw(img)
    d.polygon([(24,3),(36,12),(38,30),(34,42),(30,36),(26,43),(21,37),(17,43),(13,37),(10,30),(12,12)], fill=(215,228,240))
    d.polygon([(24,3),(36,12),(38,30),(34,42),(30,36),(27,40),(26,20)], fill=(185,205,222))
    ell(d,[17,10,31,24],(52,66,84))                                     # lubang wajah gelap
    d.rectangle([20,15,22,17], fill=(150,225,255)); d.rectangle([26,15,28,17], fill=(150,225,255))
    d.polygon([(31,20),(42,16),(38,24),(31,25)], fill=(185,205,222))    # lengan melambai
    d.line([(12,26),(36,26)], fill=(168,85,47), width=2)                # bekas syal compang
    return img

def ksatria_patung():
    img = new(48,48); d = ImageDraw.Draw(img); shadow(img,24,45,14)
    d.rectangle([10,14,20,40], fill=STONE_D)                            # perisai
    d.rectangle([12,16,18,38], outline=STONE_L)
    d.point((15,26), fill=AUR_T)
    ell(d,[19,4,33,16],STONE_M)                                         # helm
    d.rectangle([19,10,33,12], fill=STONE_D)
    d.polygon([(26,4),(30,-2),(31,5)], fill=(46,110,106))               # jambul lumut
    d.rectangle([21,13,31,15], fill=(25,28,34))                          # celah mata
    d.point((24,14), fill=(150,225,255)); d.point((29,14), fill=(150,225,255))
    d.polygon([(20,16),(32,16),(34,34),(18,34)], fill=STONE_M)          # torso zirah
    d.line([(20,24),(33,24)], fill=STONE_D, width=1)
    d.polygon([(32,16),(37,20),(36,38),(33,34)], fill=STONE_D)          # lengan pedang
    d.rectangle([35,36,37,45], fill=(200,205,215))                      # pedang ke bawah
    d.rectangle([20,34,25,45], fill=STONE_D); d.rectangle([27,34,32,45], fill=STONE_D)
    d.line([(22,20),(24,30)], fill=(70,140,110), width=1)               # retak berlumut
    return img

def kelelawar_gua():
    img = new(48,48); d = ImageDraw.Draw(img)
    d.polygon([(20,20),(2,10),(4,26),(10,22),(12,30),(17,25)], fill=(95,90,130))   # sayap kiri
    d.polygon([(28,20),(46,10),(44,26),(38,22),(36,30),(31,25)], fill=(95,90,130))  # sayap kanan
    d.polygon([(20,20),(6,14),(8,24),(17,24)], fill=(70,65,105))
    d.polygon([(28,20),(42,14),(40,24),(31,24)], fill=(70,65,105))
    ell(d,[18,16,30,32],(120,112,150))                                  # badan
    d.polygon([(19,16),(17,8),(22,14)], fill=(120,112,150))             # telinga
    d.polygon([(29,16),(31,8),(26,14)], fill=(120,112,150))
    d.rectangle([21,20,22,21], fill=(255,120,120)); d.rectangle([26,20,27,21], fill=(255,120,120))
    d.polygon([(22,26),(23,29),(24,26)], fill=(240,240,240))            # taring
    d.polygon([(26,26),(25,29),(24,26)], fill=(240,240,240))
    d.point((24,24), fill=(60,30,40))
    d.rectangle([21,32,22,35], fill=(70,65,105)); d.rectangle([26,32,27,35], fill=(70,65,105))
    return img

def roh_perapian():
    img = new(48,48); d = ImageDraw.Draw(img)
    d.polygon([(24,6),(30,14),(34,22),(33,34),(28,40),(20,40),(15,34),(14,22),(18,14)], fill=EMBER_M)
    d.polygon([(24,12),(28,18),(29,26),(27,34),(21,34),(19,26),(20,18)], fill=EMBER_L)
    d.polygon([(24,20),(26,24),(25,29),(23,29),(22,24)], fill=(255,240,190))
    d.rectangle([20,22,21,24], fill=(90,45,20)); d.rectangle([27,22,28,24], fill=(90,45,20))
    d.point((24,27), fill=(90,45,20))
    d.polygon([(15,26),(8,30),(14,32)], fill=EMBER_D)                   # lengan bara
    d.polygon([(33,26),(40,30),(34,32)], fill=EMBER_D)
    for (x,y) in [(12,8),(36,6),(40,16),(8,18)]:                        # percik
        d.point((x,y), fill=EMBER_L); d.point((x,y-1), fill=EMBER_M)
    ell(d,[19,40,29,43],(90,60,50))                                     # pangkal bara/abu
    return img

def burung_hantu_aurora():
    img = new(48,48); d = ImageDraw.Draw(img); shadow(img,24,44,13)
    ell(d,[12,8,36,40],(70,120,130))                                    # badan
    ell(d,[16,12,32,34],(110,170,170))
    d.polygon([(13,10),(10,2),(18,7)], fill=(70,120,130))               # jambul telinga
    d.polygon([(35,10),(38,2),(30,7)], fill=(70,120,130))
    ell(d,[16,11,24,21],(235,245,240)); ell(d,[24,11,32,21],(235,245,240))  # cakram wajah
    d.rectangle([19,14,21,17], fill=(30,40,50)); d.rectangle([27,14,29,17], fill=(30,40,50))
    d.point((20,14), fill=(255,255,255)); d.point((28,14), fill=(255,255,255))
    d.polygon([(23,18),(25,18),(24,21)], fill=GOLD)                     # paruh
    d.polygon([(12,16),(7,26),(13,32)], fill=AUR_T)                     # sayap kiri corak aurora
    d.polygon([(36,16),(41,26),(35,32)], fill=AUR_T)
    for (x,y) in [(18,26),(24,29),(29,25),(21,33)]:                     # bintik bintang di dada
        d.point((x,y), fill=(220,255,240))
    d.rectangle([19,40,21,43], fill=GOLD_D); d.rectangle([27,40,29,43], fill=GOLD_D)
    return img

def peri_aurora():
    img = new(48,48); d = ImageDraw.Draw(img)
    d.polygon([(18,18),(8,10),(10,22),(17,24)], fill=(190,240,225))     # sayap kiri
    d.polygon([(30,18),(40,10),(38,22),(31,24)], fill=(190,240,225))
    ell(d,[20,8,28,16],SKIN)                                            # kepala
    d.rectangle([20,6,28,9], fill=AUR_V)                                # rambut ungu
    d.point((22,12), fill=EYE); d.point((26,12), fill=EYE)
    d.polygon([(24,16),(30,20),(32,36),(28,38),(24,34),(20,38),(16,36),(18,20)], fill=AUR_G)  # gaun
    d.polygon([(24,16),(30,20),(32,36),(28,38),(25,30)], fill=AUR_T)
    d.line([(29,20),(38,12)], fill=GOLD, width=1)                       # tongkat
    for (x,y) in [(38,9),(40,12),(38,14),(36,11)]: d.point((x,y), fill=(255,255,220))
    for (x,y) in [(14,36),(34,40),(24,44)]: d.point((x,y), fill=AUR_G)  # jejak cahaya
    return img

def pecahan_bintang():
    img = new(48,48); d = ImageDraw.Draw(img)
    halo(img, 24, 23, 13, alpha=26, col=AUR_T)
    d.polygon([(24,6),(30,18),(27,30),(24,38),(20,29),(17,17)], fill=(165,150,225))  # kristal utama
    d.polygon([(24,6),(30,18),(27,30),(24,38),(23,20)], fill=(195,185,240))
    d.polygon([(24,14),(27,21),(24,28),(21,21)], fill=(255,245,200))    # inti bercahaya
    d.polygon([(8,14),(12,18),(10,24),(6,20)], fill=AUR_V)              # pecahan pengorbit
    d.polygon([(38,10),(41,15),(37,18),(35,13)], fill=AUR_V)
    d.polygon([(36,32),(40,35),(37,39),(33,36)], fill=(140,200,230))
    for (x,y) in [(14,8),(34,22),(12,32),(42,26)]: d.point((x,y), fill=(255,255,255))
    return img

ENEMIES = [
    ("bab1-serigala-salju", "Serigala Salju", 1, serigala_salju),
    ("bab1-golem-es", "Golem Es", 1, golem_es),
    ("bab1-hantu-salju", "Hantu Salju", 1, hantu_salju),
    ("bab2-ksatria-patung", "Ksatria Patung", 2, ksatria_patung),
    ("bab2-kelelawar-gua", "Kelelawar Gua", 2, kelelawar_gua),
    ("bab2-roh-perapian", "Roh Perapian", 2, roh_perapian),
    ("bab3-burung-hantu-aurora", "Burung Hantu Aurora", 3, burung_hantu_aurora),
    ("bab3-peri-aurora", "Peri Aurora", 3, peri_aurora),
    ("bab3-pecahan-bintang", "Pecahan Bintang", 3, pecahan_bintang),
]

def build_enemies():
    out = []
    for slug, name, bab, fn in ENEMIES:
        f1 = fn()
        f2 = new(48,48); f2.alpha_composite(f1, (0,1))                 # frame idle 2: bob 1px
        f1.save(P("musuh", f"{slug}-1.png")); f2.save(P("musuh", f"{slug}-2.png"))
        sheet = new(96,48); sheet.alpha_composite(f1,(0,0)); sheet.alpha_composite(f2,(48,0))
        sheet.save(P("musuh", f"{slug}-sheet.png"))
        out.append((slug, name, bab, f1))
    return out

# ---------- BOS (80x80) ----------
def bos_beruang_es():
    img = new(80,80); d = ImageDraw.Draw(img); shadow(img,40,74,30,5)
    ell(d,[10,26,70,68],FUR_L)                                          # badan raksasa
    ell(d,[14,30,50,64],FUR_M)
    ell(d,[44,14,74,44],FUR_L)                                          # kepala
    d.polygon([(48,16),(45,6),(53,12)], fill=FUR_M)                     # telinga
    d.polygon([(66,14),(68,4),(72,13)], fill=FUR_M)
    for i,x in enumerate((50,58,66)):                                    # mahkota es
        h = 10 - (i%2)*3
        d.polygon([(x,14),(x+5,14),(x+2,14-h)], fill=ICE_L)
    d.polygon([(62,32),(74,36),(62,40)], fill=FUR_D)                    # moncong
    d.point((73,35), fill=(25,30,40))
    d.rectangle([52,24,55,27], fill=(30,45,60)); d.point((53,24), fill=(255,255,255))
    d.line([(58,20),(66,18)], fill=FUR_D, width=2)                      # bekas luka
    d.line([(60,22),(67,20)], fill=(200,120,120), width=1)
    for lx in (18,32,54):                                               # kaki + cakar
        d.rectangle([lx,60,lx+8,72], fill=FUR_M)
        for cx in range(3):
            d.point((lx+1+cx*3,73), fill=(240,245,250))
    d.line([(14,36),(40,32)], fill=FUR_M, width=2)
    return img

def bos_golem_perapian():
    img = new(80,80); d = ImageDraw.Draw(img); shadow(img,40,75,30,5)
    d.rectangle([16,10,28,22], fill=STONE_D)                            # cerobong bahu
    d.rectangle([52,10,64,22], fill=STONE_D)
    for (x,y) in [(20,6),(24,3),(57,5),(61,2)]: d.point((x,y), fill=(160,160,170))
    d.polygon([(20,20),(60,20),(66,58),(14,58)], fill=STONE_M)          # torso tungku
    d.polygon([(20,20),(40,20),(38,58),(14,58)], fill=STONE_L)
    ell(d,[30,6,50,22],STONE_M)                                         # kepala
    d.rectangle([34,12,46,15], fill=(30,20,15))
    d.point((37,13), fill=EMBER_L); d.point((43,13), fill=EMBER_L)
    d.rectangle([28,32,52,52], fill=(45,40,38))                         # pintu tungku
    d.rectangle([30,34,50,50], outline=STONE_D)
    d.polygon([(40,36),(44,42),(42,48),(38,48),(36,42)], fill=EMBER_M)  # api inti
    d.polygon([(40,40),(42,43),(41,47),(39,47),(38,43)], fill=EMBER_L)
    for gx in range(32,50,5): d.line([(gx,34),(gx,50)], fill=(45,40,38), width=1)  # jeruji
    d.polygon([(14,24),(6,30),(8,52),(16,50)], fill=STONE_D)            # lengan
    d.polygon([(66,24),(74,30),(72,52),(64,50)], fill=STONE_D)
    ell(d,[4,48,18,60],STONE_D); ell(d,[62,48,76,60],STONE_D)           # kepalan
    d.rectangle([22,58,34,74], fill=STONE_D); d.rectangle([46,58,58,74], fill=STONE_D)
    d.line([(24,28),(36,40)], fill=(70,140,110), width=1)               # retak lumut
    return img

def bos_naga_aurora():
    img = new(80,80); d = ImageDraw.Draw(img)
    d.polygon([(40,44),(14,10),(30,34),(8,30),(26,48),(44,52)], fill=AUR_V)        # sayap kiri
    d.polygon([(44,44),(70,8),(54,34),(76,28),(56,48),(46,52)], fill=AUR_V)        # sayap kanan
    d.polygon([(40,46),(22,20),(34,38),(46,46)], fill=(120,95,190))
    ell(d,[30,34,56,62],AUR_T)                                          # badan
    ell(d,[36,38,52,58],(140,230,215))
    d.polygon([(46,36),(58,22),(64,24),(56,38),(50,42)], fill=AUR_T)    # leher+kepala
    d.polygon([(56,22),(52,12),(60,18)], fill=(230,220,255))            # tanduk
    d.polygon([(62,24),(70,26),(62,30)], fill=(120,200,190))            # rahang
    d.point((68,26), fill=(255,255,255))
    d.rectangle([56,25,57,26], fill=(255,210,90))                        # mata emas
    d.polygon([(50,40),(66,52),(60,56),(48,48)], fill=AUR_G)            # ekor melengkung
    d.polygon([(66,52),(72,48),(70,56)], fill=(230,220,255))
    for (x,y) in [(36,44),(44,40),(40,52),(48,50)]:                     # sisik bintang
        d.point((x,y), fill=(255,255,240))
    for lx in (34,48):                                                 # kaki depan + cakar
        d.rectangle([lx,58,lx+4,68], fill=AUR_T)
        for cx in range(3): d.point((lx+cx*2,69), fill=(240,240,255))
    for (x,y) in [(10,6),(70,4),(24,2),(58,12)]: d.point((x,y), fill=(255,255,255))
    return img

BOSSES = [
    ("bos-bab1-raja-beruang-es", "Raja Beruang Es", 1, bos_beruang_es),
    ("bos-bab2-golem-perapian-raksasa", "Golem Perapian Raksasa", 2, bos_golem_perapian),
    ("bos-bab3-naga-aurora", "Naga Aurora", 3, bos_naga_aurora),
]

def build_bosses():
    out = []
    for slug, name, bab, fn in BOSSES:
        im = fn(); im.save(P("bos", f"{slug}.png"))
        out.append((slug, name, bab, im))
    return out

# ---------- LATAR (192x108, opak) ----------
W, H = 192, 108
def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))
def vgrad(img, stops):
    d = ImageDraw.Draw(img)
    Hh = img.height
    for yy in range(0, Hh, 3):
        t = yy/(Hh-1)
        col = stops[-1][1]
        for i in range(len(stops)-1):
            p0,c0 = stops[i]; p1,c1 = stops[i+1]
            if p0 <= t <= p1:
                col = lerp(c0,c1,(t-p0)/max(p1-p0,0.001)); break
        d.rectangle([0,yy,img.width-1,min(yy+2,Hh-1)], fill=col)

def bg_bab1():
    img = Image.new("RGB",(W,H)); vgrad(img,[(0,(38,53,94)),(0.55,(110,85,112)),(0.78,(201,123,90)),(0.8,(220,232,242)),(1,(185,204,222))])
    d = ImageDraw.Draw(img)
    ell(d,[138,48,162,72],(232,176,126))                                # matahari senja redup
    d.polygon([(0,78),(40,58),(80,78)], fill=(46,58,85))                # pegunungan jauh
    d.polygon([(120,78),(160,54),(192,78)], fill=(46,58,85))
    d.polygon([(86,80),(90,0),(106,0),(112,80)], fill=(35,44,66))       # menara raksasa
    d.polygon([(90,0),(106,0),(104,14),(92,14)], fill=(28,36,54))
    for (x,y) in [(96,20),(100,34),(95,48),(101,60)]: d.point((x,y), fill=(255,217,138))
    for tx in (8,20,168,180):                                           # pinus
        for s in range(3):
            d.polygon([(tx-7+s*2,66-s*8),(tx+7-s*2,66-s*8),(tx,52-s*8)], fill=(30,42,56))
        d.rectangle([tx-1,66,tx+1,74], fill=(40,34,30))
    d.line([(60,96),(132,96)], fill=(169,190,210), width=1)             # jejak jalan setapak
    d.line([(70,102),(122,102)], fill=(169,190,210), width=1)
    rng = random.Random(42)
    for _ in range(110):                                                # salju jatuh
        x,y = rng.randrange(W), rng.randrange(80)
        d.point((x,y), fill=(255,255,255) if rng.random()<0.6 else (201,216,232))
    return img

def bg_bab2():
    img = Image.new("RGB",(W,H)); vgrad(img,[(0,(52,56,66)),(0.72,(59,64,72)),(0.73,(46,51,59)),(1,(34,38,45))])
    d = ImageDraw.Draw(img)
    for y in range(8,76,9): d.line([(0,y),(W,y)], fill=(43,47,55))      # garis bata samar
    for win_x in (28,132):                                              # jendela lengkung es
        d.rectangle([win_x,22,win_x+32,72], fill=(150,185,205))
        ell(d,[win_x,8,win_x+32,36],(150,185,205))
        for yy in range(14,72,3):
            c = lerp((185,214,228),(127,163,184),(yy-14)/58)
            d.rectangle([win_x+2,yy,win_x+30,yy+1], fill=c)
        d.rectangle([win_x,22,win_x+32,72], outline=(34,39,46), width=2)
        d.ellipse([win_x,8,win_x+32,36], outline=(34,39,46), width=2)
        d.line([(win_x+16,12),(win_x+16,72)], fill=(34,39,46), width=2)
        d.line([(win_x,44),(win_x+32,44)], fill=(34,39,46), width=2)
        for (fx,fy) in [(win_x+3,16),(win_x+26,60),(win_x+5,64)]: d.point((fx,fy), fill=(240,248,252))  # embun beku
        ell(d,[win_x-4,88,win_x+36,100],(74,85,99))                     # genangan cahaya di lantai
    for cx in (4,178):                                                  # kolom
        d.rectangle([cx,0,cx+10,107], fill=(40,44,52))
        d.rectangle([cx,10,cx+10,14], fill=(30,34,40)); d.rectangle([cx,92,cx+10,96], fill=(30,34,40))
    d.polygon([(88,4),(104,4),(102,26),(90,26)], fill=(46,110,106))    # panji teal
    d.polygon([(96,10),(100,16),(96,22),(92,16)], outline=(201,162,39))
    rng = random.Random(7)
    for _ in range(26): d.point((rng.randrange(W), rng.randrange(20,80)), fill=(168,200,216))
    return img

def bg_bab3():
    img = Image.new("RGB",(W,H)); vgrad(img,[(0,(10,20,38)),(0.6,(16,32,56)),(0.8,(22,40,63)),(1,(18,32,48))])
    d = ImageDraw.Draw(img)
    rng = random.Random(99)
    for _ in range(120): d.point((rng.randrange(W), rng.randrange(70)), fill=(255,255,255) if rng.random()<0.7 else (170,220,255))
    ov = new(W,H); od = ImageDraw.Draw(ov)                              # aurora: pita sinus bertumpuk
    for (base,amp,fq,ph,col,hgt) in [(26,5,2.2,0.0,(57,217,138),13),(34,6,1.8,1.3,(43,182,115),11),(18,4,2.6,2.1,(138,111,214),9)]:
        for x in range(W):
            cy = base + amp*math.sin((x/W)*math.pi*fq + ph)
            for t in range(-hgt//2, hgt//2):
                if (x+t) % 2 == 0 and abs(t) > hgt//4: continue        # tepi larut dither
                a = int(120*(1-abs(t)/(hgt/2)))
                od.point((x,int(cy+t)), fill=col+(a,))
    img.paste(Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB"), (0,0))
    d = ImageDraw.Draw(img)
    d.polygon([(0,92),(36,74),(66,90),(100,72),(140,90),(168,78),(192,92),(192,108),(0,108)], fill=(22,40,63))  # punggungan salju
    for (x,y) in [(30,78),(96,76),(164,82)]: d.polygon([(x-6,y+4),(x+6,y+4),(x,y-3)], fill=(220,232,242))
    d.rectangle([0,96,W,107], fill=(35,43,56))                          # parapet puncak menara
    for mx in range(4, W, 18): d.rectangle([mx,90,mx+9,97], fill=(35,43,56))
    d.line([(0,96),(W,96)], fill=(232,241,248), width=1)                # salju di bibir batu
    d.line([(170,64),(170,90)], fill=(24,28,36), width=2)               # tiang panji
    d.polygon([(170,64),(184,68),(170,73)], fill=(46,110,106))
    d.rectangle([14,86,17,89], fill=(255,217,138))                      # titik lentera hangat jauh
    return img

def nightify(img, moon=False):
    img = img.convert("RGB")
    lut = []
    for i in range(256):
        lut += [int(i*0.52)]
    img = img.point(lut*3)
    img = Image.eval(img, lambda v: v)  # jaga format
    px = img.load()
    for y in range(img.height):                                         # geser ke biru malam
        for x in range(img.width):
            r,g,b = px[x,y]; px[x,y] = (int(r*0.85), int(g*0.95), min(255,int(b*1.18)))
    if moon:
        d = ImageDraw.Draw(img)
        ell(d,[22,10,34,22],(232,238,245)); ell(d,[27,9,37,20],(20,28,48))
    return img

BACKGROUNDS = [("latar-bab1-kaki-menara", bg_bab1, True),
               ("latar-bab2-aula-batu", bg_bab2, False),
               ("latar-bab3-puncak-aurora", bg_bab3, False)]

def build_backgrounds():
    out = []
    for slug, fn, moon in BACKGROUNDS:
        im = fn(); im.save(P("latar", f"{slug}.png"))
        nm = nightify(im, moon=moon); nm.save(P("latar", f"{slug}-malam.png"))
        out.append((slug, im))
    return out

# ---------- BINGKAI KARTU (80x100, tengah transparan; potret 64x80 di offset 8,10) ----------
def build_frame():
    img = new(80,100); d = ImageDraw.Draw(img)
    d.rectangle([0,0,79,99], fill=(26,31,39,255))
    d.rectangle([2,2,77,97], fill=(44,51,61,255))
    rng = random.Random(3)                                              # bintik batu
    for _ in range(46):
        x,y = rng.randrange(80), rng.randrange(100)
        if 8 <= x <= 71 and 8 <= y <= 91: continue
        d.point((x,y), fill=(57,66,78,255))
    d.rectangle([4,4,75,95], outline=(127,168,188,255), width=2)         # pita es
    d.rectangle([6,6,73,93], outline=(201,162,39,255), width=1)          # garis emas
    d.rectangle([8,8,71,91], fill=(0,0,0,0))                            # lubang potret
    for (cx,cy) in [(7,7),(72,7),(7,92),(72,92)]:                       # permata sudut pirus
        d.polygon([(cx,cy-4),(cx+4,cy),(cx,cy+4),(cx-4,cy)], fill=(87,199,184,255))
        d.point((cx,cy), fill=(255,255,255,255))
    for i,tx in enumerate((34,40,46)):                                  # es menggantung di atas
        ln = 5 - abs(i-1)*2
        d.polygon([(tx,0),(tx+4,0),(tx+2,ln)], fill=(168,200,216,255))
    img.save(P("ui","bingkai-kartu.png"))
    return img

# ---------- CONTACT SHEET ----------
def contact_sheet(hero_frames, enemies, bosses, bgs, frame_img):
    CW = 1024; bgc = (16,20,27)
    rows = []
    def scaled(im, f):
        return im.resize((im.width*f, im.height*f), Image.NEAREST)
    sheet_h = 200 + 170 + 120 + 200 + 2*140 + 60
    img = Image.new("RGB",(CW, sheet_h), bgc); d = ImageDraw.Draw(img)
    try: font = ImageFont.load_default(size=16)
    except TypeError: font = ImageFont.load_default()
    def title(y, txt): d.text((12,y), txt, fill=(220,230,240), font=font); return y+24
    def panel(x,y,w,h): d.rectangle([x,y,x+w,y+h], fill=(28,34,44))
    y = title(8, "MENARA MUSIM ABADI - PAKET ASET PIXEL (Kuas)")
    # hero: 14 frame x2, 7 per baris
    y0 = y
    for j,(name,i,im) in enumerate(hero_frames):
        cx = 12 + (j%7)*144; cy = y0 + (j//7)*164
        panel(cx,cy,132,162); img.paste(scaled(im,2), (cx+2,cy+1), scaled(im,2))
    y = y0 + 2*164 + 6
    y = title(y, "MUSUH (Bab 1-3)")
    for j,(slug,name,bab,im) in enumerate(enemies):
        cx = 12 + j*110; panel(cx,y,100,100); img.paste(scaled(im,2), (cx+2,y+2), scaled(im,2))
    y += 108
    y = title(y, "BOS per Bab  +  BINGKAI KARTU (potret di dalamnya)")
    for j,(slug,name,bab,im) in enumerate(bosses):
        cx = 12 + j*170; panel(cx,y,164,164); img.paste(scaled(im,2), (cx+2,y+2), scaled(im,2))
    comp = new(80,100); comp.alpha_composite(hero_frames[0][2], (8,10)); comp.alpha_composite(frame_img, (0,0))
    img.paste(scaled(comp,1), (540,y), scaled(comp,1))
    img.paste(scaled(frame_img,1), (640,y), scaled(frame_img,1))
    y += 172
    y = title(y, "LATAR per Bab (atas: utama - bawah: varian malam)")
    for j,(slug,im) in enumerate(bgs):
        img.paste(im, (12 + j*200, y))
    y += 112
    for j,(slug,im) in enumerate(bgs):
        nm = Image.open(P("latar", f"{slug}-malam.png"))
        img.paste(nm, (12 + j*200, y))
    y += 112
    img = img.crop((0,0,CW,y+8))
    img.save(P("pratinjau","contact-sheet.png"))
    return img

# ---------- MAIN ----------
if __name__ == "__main__":
    hf = build_hero()
    en = build_enemies()
    bo = build_bosses()
    bg = build_backgrounds()
    fr = build_frame()
    contact_sheet(hf, en, bo, bg, fr)
    total = 0
    for dirpath, _, files in os.walk(P()):
        for f in files:
            if f.endswith(".png"):
                s = os.path.getsize(os.path.join(dirpath,f)); total += s
                print(f"{os.path.relpath(os.path.join(dirpath,f), P())}\t{s}")
    print(f"TOTAL PNG: {total} byte = {total/1024:.1f} KB")
    print(f"Frame hero: {len(hf)} | Musuh: {len(en)} | Bos: {len(bo)} | Latar: {len(bg)*2}")
