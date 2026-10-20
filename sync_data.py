import json
import os
import urllib.request
import shutil

print("🔄 Descargando iconos oficiales reales...")

os.makedirs("data", exist_ok=True)
os.makedirs("assets/icons", exist_ok=True)

# Cabeceras para simular un navegador y evitar bloqueos
opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
urllib.request.install_opener(opener)

UMAS_DATA = {
    "102001": {"name": ["Seiun Sky", "Seiun Sky (Original)"]},
    "100502": {"name": ["Maruzensky", "Maruzensky (Summer)"]},
    "100401": {"name": ["Oguri Cap", "Oguri Cap (Original)"]},
    "103401": {"name": ["Narita Taishin", "Narita Taishin (Original)"]},
    "102701": {"name": ["Mejiro Ryan", "Mejiro Ryan (Original)"]},
    "100701": {"name": ["Gold Ship", "Gold Ship (Original)"]},
    "100101": {"name": ["Special Week", "Special Week (Original)"]},
    "101701": {"name": ["Symboli Rudolf", "Symboli Rudolf (Original)"]}
}

TRACKS_DATA = [
    {"id": "10606", "trackName": "Tokyo", "name": "Tokyo 2400m (Turf) - Japanese Derby / Japan Cup", "distance": 2400, "surface": "Turf"},
    {"id": "10506", "trackName": "Nakayama", "name": "Nakayama 2500m (Turf) - Arima Kinen", "distance": 2500, "surface": "Turf"},
    {"id": "10903", "trackName": "Hanshin", "name": "Hanshin 1600m (Turf) - Mile Championship / Oka Sho", "distance": 1600, "surface": "Turf"}
]

SKILLS_DATA = [
    {"id": "1001", "name": "Angling and Scheming (Seiun Unique)", "category": "unique", "targetSpeed": 0.0, "accel": 0.40, "heal": 0},
    {"id": "1002", "name": "Let's Pump Some Iron! (Ryan Unique)", "category": "unique", "targetSpeed": 0.0, "accel": 0.40, "heal": 0},
    {"id": "2001", "name": "Professor of Curvature (Gold)", "category": "gold", "targetSpeed": 0.35, "accel": 0.0, "heal": 0},
    {"id": "2002", "name": "Swinging Maestro (Gold Heal)", "category": "heal", "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055}
]

# Guardar JSONs
with open("data/umas.json", "w", encoding="utf-8") as f:
    json.dump(UMAS_DATA, f, ensure_ascii=False, indent=2)
with open("data/tracks.json", "w", encoding="utf-8") as f:
    json.dump(TRACKS_DATA, f, ensure_ascii=False, indent=2)
with open("data/skills.json", "w", encoding="utf-8") as f:
    json.dump(SKILLS_DATA, f, ensure_ascii=False, indent=2)

print("[OK] Ficheros JSON guardados.")

# Descarga de iconos reales con múltiples espejos de respaldo
descargados = 0
for uid in UMAS_DATA.keys():
    icon_id = str(uid).strip()
    if len(icon_id) == 4:
        icon_id += "01"
        
    dest_path = f"assets/icons/{icon_id}.png"
    
    # Fuentes alternativas oficiales de assets
    urls = [
        f"https://gametora.com/images/umamusume/characters/icons/chara_{icon_id}.png",
        f"https://uma.tools/images/icons/chara_{icon_id}.png",
        f"https://raw.githubusercontent.com/Furious/UmaMusume-Asset-Rip/main/icons/chara_{icon_id}.png"
    ]
    
    exito = False
    for url in urls:
        try:
            urllib.request.urlretrieve(url, dest_path)
            exito = True
            break
        except:
            continue
            
    if exito:
        print(f"✅ Icono oficial descargado: {icon_id}.png")
        descargados += 1
    else:
        # Si todo falla, mantiene temporalmente la plantilla para no romper la web
        if os.path.exists("assets/umas.jpg") and not os.path.exists(dest_path):
            shutil.copy("assets/umas.jpg", dest_path)
        print(f"⚠️ Usando respaldo para: {icon_id}.png")

print(f"\n✨ Proceso finalizado. Iconos listos: {descargados}/{len(UMAS_DATA)}")