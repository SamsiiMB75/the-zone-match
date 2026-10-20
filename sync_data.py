import os
import json
import urllib.request
import urllib.error

# Rutas Raw del repositorio alpha123/uma-tools (Global + Datos maestros)
URLS = {
    "course_data": "https://raw.githubusercontent.com/alpha123/uma-tools/master/umalator-global/course_data.json",
    "tracknames": "https://raw.githubusercontent.com/alpha123/uma-tools/master/umalator-global/tracknames.json",
    "skill_data": "https://raw.githubusercontent.com/alpha123/uma-tools/master/umalator-global/skill_data.json",
    "skillnames": "https://raw.githubusercontent.com/alpha123/uma-tools/master/umalator-global/skillnames.json",
    "umas": "https://raw.githubusercontent.com/alpha123/uma-tools/master/umalator-global/umas.json"
}

DATA_DIR = "data"

def fetch_json(url, name):
    print(f"⏳ Descargando {name} desde GitHub...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"⚠️ No se pudo descargar {name}: {e}")
        return None

def build_database():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"📁 Carpeta '{DATA_DIR}/' creada.")

    # 1. Descargar archivos crudos
    raw_courses = fetch_json(URLS["course_data"], "Geometría de Pistas")
    raw_tracknames = fetch_json(URLS["tracknames"], "Nombres de Hipódromos")
    raw_skills = fetch_json(URLS["skill_data"], "Matemáticas de Habilidades")
    raw_skillnames = fetch_json(URLS["skillnames"], "Nombres de Habilidades (Global)")
    raw_umas = fetch_json(URLS["umas"], "Catálogo de Umas (Global)")

    # 2. Procesar y limpiar Pistas (tracks.json)
    tracks_clean = []
    SurfaceMap = {1: "Turf", 2: "Dirt"}
    
    if raw_courses and raw_tracknames:
        for cid, cdata in raw_courses.items():
            track_id = str(cdata.get("raceTrackId", ""))
            track_name = raw_tracknames.get(track_id, ["Unknown", f"Track {track_id}"])[1] if isinstance(raw_tracknames.get(track_id), list) else raw_tracknames.get(track_id, f"Track {track_id}")
            dist = cdata.get("distance", 2000)
            surface = SurfaceMap.get(cdata.get("surface", 1), "Turf")
            
            tracks_clean.append({
                "id": cid,
                "trackId": track_id,
                "name": f"{track_name} {dist}m ({surface})",
                "trackName": track_name,
                "distance": dist,
                "surface": surface,
                "turn": cdata.get("turn", 1),
                "courseSetStatus": cdata.get("courseSetStatus", []),
                "corners": cdata.get("corners", []),
                "straights": cdata.get("straights", []),
                "slopes": cdata.get("slopes", [])
            })
        tracks_clean.sort(key=lambda x: (x["trackName"], x["distance"]))
        with open(os.path.join(DATA_DIR, "tracks.json"), "w", encoding="utf-8") as f:
            json.dump(tracks_clean, f, ensure_ascii=False, indent=2)
        print(f"✅ Guardado data/tracks.json ({len(tracks_clean)} circuitos)")

    # 3. Procesar y cruzar Habilidades (skills.json)
    skills_clean = []
    if raw_skills and raw_skillnames:
        for sid, sdata in raw_skills.items():
            names = raw_skillnames.get(sid)
            if not names:
                continue
            en_name = names[0] if isinstance(names, list) and len(names) > 0 else str(names)
            
            # Extraer efectos del primer bloque de alternativas de umalator
            alternatives = sdata.get("alternatives", [{}])
            first_alt = alternatives[0] if alternatives else {}
            effects = first_alt.get("effects", [])
            
            target_speed = 0.0
            accel = 0.0
            heal = 0.0
            for eff in effects:
                etype = eff.get("type")
                modifier = eff.get("modifier", 0) / 10000.0
                if etype in (27, 31): # Target Speed
                    target_speed = modifier
                elif etype == 28:     # Acceleration
                    accel = modifier
                elif etype == 9:      # Stamina Recovery
                    heal = modifier

            rarity = sdata.get("rarity", 1)
            cat = "unique" if rarity >= 3 else ("gold" if rarity == 2 else "white")
            if heal > 0:
                cat = "heal"

            skills_clean.append({
                "id": sid,
                "name": en_name,
                "rarity": rarity,
                "category": cat,
                "duration": first_alt.get("baseDuration", 30000) / 10000.0,
                "condition": first_alt.get("condition", ""),
                "targetSpeed": round(target_speed, 4),
                "accel": round(accel, 4),
                "heal": round(heal, 4)
            })
        
        with open(os.path.join(DATA_DIR, "skills.json"), "w", encoding="utf-8") as f:
            json.dump(skills_clean, f, ensure_ascii=False, indent=2)
        print(f"✅ Guardado data/skills.json ({len(skills_clean)} habilidades de Global)")

    # 4. Procesar Umas (umas.json)
    if raw_umas:
        with open(os.path.join(DATA_DIR, "umas.json"), "w", encoding="utf-8") as f:
            json.dump(raw_umas, f, ensure_ascii=False, indent=2)
        print(f"✅ Guardado data/umas.json")

    print("\n🚀 ¡Sincronización completada! Ahora puedes hacer git add, commit y push.")

if __name__ == "__main__":
    build_database()