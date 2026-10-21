import json
import os
import glob

print("🚀 Iniciando constructor de Base de Datos de Uma Musume (Corte: Kitasan NY - 21 Oct 2026)...")

os.makedirs("data", exist_ok=True)
os.makedirs("assets/icons", exist_ok=True)

# ==============================================================================
# 1. CATÁLOGO DE UMAS HASTA KITASAN BLACK (NEW YEAR) - ORDENADO ALFABÉTICAMENTE
# ==============================================================================
RAW_UMAS_LIST = [
    ("101901", "Agnes Digital", "Agnes Digital (Original)"),
    ("103201", "Agnes Tachyon", "Agnes Tachyon (Original)"),
    ("101801", "Air Groove", "Air Groove (Original)"),
    ("101802", "Air Groove", "Air Groove (Wedding)"),
    ("107101", "Mejiro Ardan", "Mejiro Ardan (Original)"),
    ("105301", "Bambooo Memory", "Bamboo Memory (Original)"),
    ("102301", "Biwa Hayahide", "Biwa Hayahide (Original)"),
    ("102302", "Biwa Hayahide", "Biwa Hayahide (Christmas)"),
    ("103801", "Curren Chan", "Curren Chan (Original)"),
    ("100901", "Daiwa Scarlet", "Daiwa Scarlet (Original)"),
    ("106401", "Eishin Flash", "Eishin Flash (Original)"),
    ("101401", "El Condor Pasa", "El Condor Pasa (Original)"),
    ("101402", "El Condor Pasa", "El Condor Pasa (Fantasy)"),
    ("103501", "Fine Motion", "Fine Motion (Original)"),
    ("100601", "Fuji Kiseki", "Fuji Kiseki (Original)"),
    ("104001", "Gold City", "Gold City (Original)"),
    ("104002", "Gold City", "Gold City (Festival)"),
    ("100701", "Gold Ship", "Gold Ship (Original)"),
    ("101101", "Grass Wonder", "Grass Wonder (Original)"),
    ("101102", "Grass Wonder", "Grass Wonder (Fantasy)"),
    ("105201", "Haru Urara", "Haru Urara (Original)"),
    ("105202", "Haru Urara", "Haru Urara (New Year)"),
    ("101201", "Hishi Amazon", "Hishi Amazon (Original)"),
    ("102801", "Hishi Akebono", "Hishi Akebono (Original)"),
    ("103101", "Ines Fujin", "Ines Fujin (Original)"),
    ("103901", "Kawakami Princess", "Kawakami Princess (Original)"),
    ("106101", "King Halo", "King Halo (Original)"),
    ("106801", "Kitasan Black", "Kitasan Black (Original)"),
    ("106802", "Kitasan Black", "Kitasan Black (New Year)"),
    ("102501", "Manhattan Cafe", "Manhattan Cafe (Original)"),
    ("100501", "Maruzensky", "Maruzensky (Original)"),
    ("100502", "Maruzensky", "Maruzensky (Summer)"),
    ("105601", "Matikanefukukitaru", "Matikanefukukitaru (Original)"),
    ("105602", "Matikanefukukitaru", "Matikanefukukitaru (Full Armor)"),
    ("106201", "Matikanetannhauser", "Matikanetannhauser (Original)"),
    ("102401", "Mayano Top Gun", "Mayano Top Gun (Original)"),
    ("102402", "Mayano Top Gun", "Mayano Top Gun (Wedding)"),
    ("107401", "Mejiro Bright", "Mejiro Bright (Original)"),
    ("105901", "Mejiro Dober", "Mejiro Dober (Original)"),
    ("101301", "Mejiro McQueen", "Mejiro McQueen (Original)"),
    ("101302", "Mejiro McQueen", "Mejiro McQueen (Anime Collab)"),
    ("106402", "Mejiro Palmer", "Mejiro Palmer (Original)"),
    ("102701", "Mejiro Ryan", "Mejiro Ryan (Original)"),
    ("105801", "Meisho Doto", "Meisho Doto (Original)"),
    ("102601", "Mihono Bourbon", "Mihono Bourbon (Original)"),
    ("102602", "Mihono Bourbon", "Mihono Bourbon (Valentine)"),
    ("101601", "Narita Brian", "Narita Brian (Original)"),
    ("103401", "Narita Taishin", "Narita Taishin (Original)"),
    ("106001", "Nice Nature", "Nice Nature (Original)"),
    ("105101", "Nishino Flower", "Nishino Flower (Original)"),
    ("100401", "Oguri Cap", "Oguri Cap (Original)"),
    ("100402", "Oguri Cap", "Oguri Cap (Christmas)"),
    ("103001", "Rice Shower", "Rice Shower (Original)"),
    ("103002", "Rice Shower", "Rice Shower (Halloween)"),
    ("104101", "Sakura Bakushin O", "Sakura Bakushin O (Original)"),
    ("106901", "Sakura Chiyono O", "Sakura Chiyono O (Original)"),
    ("106701", "Satono Diamond", "Satono Diamond (Original)"),
    ("106702", "Satono Diamond", "Satono Diamond (New Year)"),
    ("102001", "Seiun Sky", "Seiun Sky (Original)"),
    ("104801", "Shinko Windy", "Shinko Windy (Original)"),
    ("100201", "Silence Suzuka", "Silence Suzuka (Original)"),
    ("104601", "Smart Falcon", "Smart Falcon (Original)"),
    ("100101", "Special Week", "Special Week (Original)"),
    ("100102", "Special Week", "Special Week (Summer)"),
    ("104501", "Super Creek", "Super Creek (Original)"),
    ("104502", "Super Creek", "Super Creek (Halloween)"),
    ("104401", "Sweep Tosho", "Sweep Tosho (Original)"),
    ("101701", "Symboli Rudolf", "Symboli Rudolf (Original)"),
    ("101702", "Symboli Rudolf", "Symboli Rudolf (Festival)"),
    ("101501", "T.M. Opera O", "T.M. Opera O (Original)"),
    ("101502", "T.M. Opera O", "T.M. Opera O (New Year)"),
    ("101001", "Taiki Shuttle", "Taiki Shuttle (Original)"),
    ("102101", "Tamamo Cross", "Tamamo Cross (Original)"),
    ("100301", "Tokai Teio", "Tokai Teio (Original)"),
    ("100302", "Tokai Teio", "Tokai Teio (Anime Collab)"),
    ("104701", "Tosen Jordan", "Tosen Jordan (Original)"),
    ("100801", "Vodka", "Vodka (Original)"),
    ("103601", "Winning Ticket", "Winning Ticket (Original)"),
    ("107201", "Yaeno Muteki", "Yaeno Muteki (Original)"),
    ("102901", "Yukino Bijin", "Yukino Bijin (Original)")
]

# Ordenar alfabéticamente por el nombre completo para que el selector quede impecable
RAW_UMAS_LIST.sort(key=lambda x: x[2].lower())

UMAS_DATA = {
    uid: {"name": [short_name, full_name]}
    for uid, short_name, full_name in RAW_UMAS_LIST
}

# ==============================================================================
# 2. HIPÓDROMOS OFICIALES DE CHAMPIONS MEETING (ORDENADOS POR DISTANCIA)
# ==============================================================================
TRACKS_DATA = [
    {"id": "10701", "trackName": "Chukyo", "name": "Chukyo 1200m (Turf) - Takamatsunomiya Kinen", "distance": 1200, "surface": "Turf",
     "corners": [{"start": 300, "length": 450}], "straights": [{"start": 0, "end": 300}, {"start": 750, "end": 1200}], "slopes": [{"start": 820, "length": 160, "slope": 200}]},
    {"id": "10501", "trackName": "Nakayama", "name": "Nakayama 1200m (Turf) - Sprinters Stakes", "distance": 1200, "surface": "Turf",
     "corners": [{"start": 280, "length": 480}], "straights": [{"start": 0, "end": 280}, {"start": 760, "end": 1200}], "slopes": [{"start": 980, "length": 180, "slope": 220}]},
    {"id": "10902", "trackName": "Hanshin", "name": "Hanshin 1400m (Turf) - Hanshin Cup", "distance": 1400, "surface": "Turf",
     "corners": [{"start": 450, "length": 480}], "straights": [{"start": 0, "end": 450}, {"start": 930, "end": 1400}], "slopes": [{"start": 1150, "length": 150, "slope": 190}]},
    {"id": "10602", "trackName": "Tokyo", "name": "Tokyo 1600m (Turf) - Yasuda Kinen / Victoria Mile", "distance": 1600, "surface": "Turf",
     "corners": [{"start": 550, "length": 520}], "straights": [{"start": 0, "end": 550}, {"start": 1070, "end": 1600}], "slopes": [{"start": 1150, "length": 200, "slope": 190}]},
    {"id": "10903", "trackName": "Hanshin", "name": "Hanshin 1600m (Turf) - Mile Championship / Oka Sho", "distance": 1600, "surface": "Turf",
     "corners": [{"start": 650, "length": 470}], "straights": [{"start": 0, "end": 650}, {"start": 1120, "end": 1600}], "slopes": [{"start": 1350, "length": 150, "slope": 180}]},
    {"id": "10803", "trackName": "Kyoto", "name": "Kyoto 1600m (Turf) - Mile Championship", "distance": 1600, "surface": "Turf",
     "corners": [{"start": 700, "length": 500}], "straights": [{"start": 0, "end": 700}, {"start": 1200, "end": 1600}], "slopes": [{"start": 800, "length": 150, "slope": 150}]},
    {"id": "10611", "trackName": "Tokyo", "name": "Tokyo 1600m (Dirt) - February Stakes", "distance": 1600, "surface": "Dirt",
     "corners": [{"start": 600, "length": 500}], "straights": [{"start": 0, "end": 600}, {"start": 1100, "end": 1600}], "slopes": [{"start": 1150, "length": 200, "slope": 180}]},
    {"id": "10711", "trackName": "Chukyo", "name": "Chukyo 1800m (Dirt) - Champions Cup", "distance": 1800, "surface": "Dirt",
     "corners": [{"start": 300, "length": 400}, {"start": 1050, "length": 410}], "straights": [{"start": 0, "end": 300}, {"start": 700, "end": 1050}, {"start": 1460, "end": 1800}], "slopes": [{"start": 1500, "length": 160, "slope": 200}]},
    {"id": "10604", "trackName": "Tokyo", "name": "Tokyo 2000m (Turf) - Tenno Sho (Autumn)", "distance": 2000, "surface": "Turf",
     "corners": [{"start": 150, "length": 300}, {"start": 950, "length": 520}], "straights": [{"start": 0, "end": 150}, {"start": 450, "end": 950}, {"start": 1470, "end": 2000}], "slopes": [{"start": 1550, "length": 200, "slope": 200}]},
    {"id": "10504", "trackName": "Nakayama", "name": "Nakayama 2000m (Turf) - Satsuki Sho", "distance": 2000, "surface": "Turf",
     "corners": [{"start": 400, "length": 450}, {"start": 1250, "length": 440}], "straights": [{"start": 0, "end": 400}, {"start": 850, "end": 1250}, {"start": 1690, "end": 2000}], "slopes": [{"start": 1780, "length": 180, "slope": 220}]},
    {"id": "11001", "trackName": "Ooi", "name": "Ooi 2000m (Dirt) - Tokyo Daishoten / Teio Sho", "distance": 2000, "surface": "Dirt",
     "corners": [{"start": 350, "length": 450}, {"start": 1200, "length": 420}], "straights": [{"start": 0, "end": 350}, {"start": 800, "end": 1200}, {"start": 1620, "end": 2000}], "slopes": []},
    {"id": "10905", "trackName": "Hanshin", "name": "Hanshin 2200m (Turf) - Takarazuka Kinen", "distance": 2200, "surface": "Turf",
     "corners": [{"start": 500, "length": 450}, {"start": 1350, "length": 500}], "straights": [{"start": 0, "end": 500}, {"start": 950, "end": 1350}, {"start": 1850, "end": 2200}], "slopes": [{"start": 1980, "length": 150, "slope": 200}]},
    {"id": "10606", "trackName": "Tokyo", "name": "Tokyo 2400m (Turf) - Japanese Derby / Japan Cup", "distance": 2400, "surface": "Turf",
     "corners": [{"start": 350, "length": 400}, {"start": 1400, "length": 450}], "straights": [{"start": 0, "end": 350}, {"start": 750, "end": 1400}, {"start": 1850, "end": 2400}], "slopes": [{"start": 1900, "length": 200, "slope": 200}]},
    {"id": "10506", "trackName": "Nakayama", "name": "Nakayama 2500m (Turf) - Arima Kinen", "distance": 2500, "surface": "Turf",
     "corners": [{"start": 300, "length": 400}, {"start": 1550, "length": 640}], "straights": [{"start": 0, "end": 300}, {"start": 700, "end": 1550}, {"start": 2190, "end": 2500}], "slopes": [{"start": 2250, "length": 180, "slope": 220}]},
    {"id": "10808", "trackName": "Kyoto", "name": "Kyoto 3000m (Turf) - Kikuka Sho", "distance": 3000, "surface": "Turf",
     "corners": [{"start": 400, "length": 500}, {"start": 2100, "length": 500}], "straights": [{"start": 0, "end": 400}, {"start": 900, "end": 2100}, {"start": 2600, "end": 3000}], "slopes": [{"start": 2000, "length": 200, "slope": 180}]},
    {"id": "10809", "trackName": "Kyoto", "name": "Kyoto 3200m (Turf) - Tenno Sho (Spring)", "distance": 3200, "surface": "Turf",
     "corners": [{"start": 500, "length": 500}, {"start": 2300, "length": 500}], "straights": [{"start": 0, "end": 500}, {"start": 1000, "end": 2300}, {"start": 2800, "end": 3200}], "slopes": [{"start": 2200, "length": 200, "slope": 200}]}
]

# ==============================================================================
# 3. BASE DE SKILLS COMPETITIVAS (INCLUYE KITASAN NY Y SATONO NY)
# ==============================================================================
SKILLS_DATA = [
    # --- UNIQUES (HABILIDADES ÚNICAS DE PERSONAJES) ---
    {"id": "1001", "name": "Angling and Scheming (Seiun Sky Unique)", "category": "unique", "duration": 4.0, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [1, 1]},
    {"id": "1002", "name": "Let's Pump Some Iron! (Mejiro Ryan Unique)", "category": "unique", "duration": 4.0, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [6, 6]},
    {"id": "1003", "name": "Red Shift / LP1211-M (Maruzensky Unique)", "category": "unique", "duration": 4.0, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [1, 5]},
    {"id": "1004", "name": "Shooting for Victory! (Taiki Shuttle Unique)", "category": "unique", "duration": 4.0, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [3, 5]},
    {"id": "1005", "name": "Triumphant Pulse (Oguri Cap Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.45, "accel": 0.0, "heal": 0, "phase": "final200", "reqRank": [2, 5]},
    {"id": "1006", "name": "Behold Thine Emperor's Divine Might (Rudolf Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.45, "accel": 0.0, "heal": 0, "phase": "final200", "reqRank": [1, 9]},
    {"id": "1007", "name": "Warning Shot! (Gold Ship Unique)", "category": "unique", "duration": 6.0, "targetSpeed": 0.25, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [5, 9]},
    {"id": "1008", "name": "Victoria por Plancha ☆ (El Condor Pasa Unique)", "category": "unique", "duration": 4.0, "targetSpeed": 0.25, "accel": 0.30, "heal": 0, "phase": "spurt", "reqRank": [1, 2]},
    {"id": "1009", "name": "The View from the Lead Is Mine! (Suzuka Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "final200", "reqRank": [1, 1]},
    {"id": "1010", "name": "Sky-High Teio Step (Tokai Teio Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.45, "accel": 0.0, "heal": 0, "phase": "final200", "reqRank": [2, 4]},
    {"id": "1011", "name": "G00 1st. F∞; (Mihono Bourbon Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "final200", "reqRank": [1, 3]},
    {"id": "1012", "name": "U=ma2 (Agnes Tachyon Unique)", "category": "unique", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [3, 4]},
    {"id": "1013", "name": "Pure Heart (Super Creek Unique)", "category": "unique", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [2, 4]},
    {"id": "1014", "name": "Nemesis (Narita Taishin Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "spurt", "reqRank": [4, 7]},
    {"id": "1015", "name": "Shadow Break (Narita Brian Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.45, "accel": 0.0, "heal": 0, "phase": "spurt", "reqRank": [2, 7]},
    {"id": "1016", "name": "A Kiss for Courage (Maruzensky Summer Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 3]},
    {"id": "1017", "name": "Beyond the Horizon / Kanata (Mejiro Dober Unique)", "category": "unique", "duration": 4.0, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [5, 6]},
    {"id": "1018", "name": "Miracle Run! (Oguri Cap Christmas Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.25, "accel": 0.30, "heal": 0.035, "phase": "spurt", "reqRank": [1, 9]},
    {"id": "1019", "name": "Shout of Victory / Kachidoki Wasshoi! (Kitasan Original Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.25, "accel": 0.30, "heal": 0, "phase": "spurt", "reqRank": [1, 2]},
    {"id": "1020", "name": "Blooming in Late Autumn / Appare! (Kitasan NY Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.35, "accel": 0.10, "heal": 0, "phase": "spurt", "reqRank": [1, 3]},
    {"id": "1021", "name": " Wish Upon the New Year (Satono Diamond NY Unique)", "category": "unique", "duration": 5.0, "targetSpeed": 0.25, "accel": 0.0, "heal": 0.035, "phase": "mid", "reqRank": [4, 7]},

    # --- GOLD SKILLS (VELOCIDAD Y ACELERACIÓN DORADAS) ---
    {"id": "2001", "name": "Professor of Curvature (Gold Speed)", "category": "gold", "duration": 2.4, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2006", "name": "Furious Feat / Norikae Jouzu (Gold Late Accel)", "category": "gold", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [4, 9]},
    {"id": "2007", "name": "No Stopping Me! / Nonstop Girl (Gold Accel)", "category": "gold", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [2, 9]},
    {"id": "2011", "name": "Killer Tunes (Gold Medium Mid Speed)", "category": "gold", "duration": 2.4, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 5]},
    {"id": "2012", "name": "Unrestrained / Escape Artist (Gold Front Speed)", "category": "gold", "duration": 3.0, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 1]},
    {"id": "2013", "name": "Taking the Lead / Sente Hisshou (Gold Early Accel)", "category": "gold", "duration": 1.2, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "early", "reqRank": [1, 9]},
    {"id": "2014", "name": "Encroaching Shadow / Semaru Kage (Gold End Accel)", "category": "gold", "duration": 0.9, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [1, 9]},
    {"id": "2015", "name": "Speed Star (Gold Pace Final Corner)", "category": "gold", "duration": 1.8, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "spurt", "reqRank": [1, 5]},
    {"id": "2016", "name": "Rising Dragon (Gold Outer Overtake)", "category": "gold", "duration": 2.4, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "spurt", "reqRank": [2, 9]},
    {"id": "2017", "name": "Beeline Burst (Gold Straight Speed)", "category": "gold", "duration": 2.4, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "spurt", "reqRank": [1, 9]},
    {"id": "2018", "name": "Rushing Gale! (Gold Straight Accel)", "category": "gold", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2019", "name": "In Body and Mind (Gold Final 200m Speed)", "category": "gold", "duration": 2.4, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "final200", "reqRank": [1, 9]},
    {"id": "2020", "name": "Turbo Sprint (Gold Short Accel)", "category": "gold", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.40, "heal": 0, "phase": "spurt", "reqRank": [1, 9]},
    {"id": "2046", "name": " Vanguard Spirit / Sentou Pride (Gold Front Keep)", "category": "gold", "duration": 3.0, "targetSpeed": 0.35, "accel": 0.0, "heal": 0, "phase": "early", "reqRank": [1, 1]},

    # --- HEAL SKILLS (RECUPERACIÓN DE STAMINA) ---
    {"id": "2002", "name": "Swinging Maestro (Gold Corner Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2003", "name": "Gourmand (Gold Pace Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [1, 5]},
    {"id": "2008", "name": "Corner Recovery ○ (White Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.015, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2021", "name": "Race Planner (Gold Pace Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [1, 5]},
    {"id": "2022", "name": "Breath of Fresh Air (Gold Straight Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2023", "name": "Cooldown (Gold Long Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2024", "name": "Sleeping Lion (Gold End Closer Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.055, "phase": "mid", "reqRank": [5, 9]},
    {"id": "2025", "name": "Hydrate (White Pace Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.015, "phase": "mid", "reqRank": [1, 5]},
    {"id": "2026", "name": "Straightaway Recovery (White Heal)", "category": "heal", "duration": 0.0, "targetSpeed": 0.0, "accel": 0.0, "heal": 0.015, "phase": "mid", "reqRank": [1, 9]},

    # --- WHITE SKILLS (HABILIDADES BLANCAS CLAVE DE META) ---
    {"id": "2004", "name": "Straightaway Spurt (End Closer Accel)", "category": "white", "duration": 0.9, "targetSpeed": 0.0, "accel": 0.20, "heal": 0, "phase": "spurt", "reqRank": [1, 9]},
    {"id": "2005", "name": "Groundwork / Jigatame (Early Accel)", "category": "white", "duration": 3.0, "targetSpeed": 0.0, "accel": 0.20, "heal": 0, "phase": "early", "reqRank": [1, 9]},
    {"id": "2009", "name": "Medium Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2010", "name": "Tail Held High / Shippo (Mid Speed)", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2027", "name": "Medium Straightaways ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2028", "name": "Mile Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2029", "name": "Mile Straightaways ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2030", "name": "Long Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2031", "name": "Long Straightaways ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2032", "name": "Sprint Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2033", "name": "Front Runner Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2034", "name": "Pace Chaser Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2035", "name": "Late Surger Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2036", "name": "End Closer Corners ○", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2037", "name": "Playtime's Over! / Osaaki (Mid Speed)", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2038", "name": "Slipstream (Mid Speed)", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2039", "name": "Rampage / Uma Stan (Early Speed)", "category": "white", "duration": 3.0, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "early", "reqRank": [1, 9]},
    {"id": "2040", "name": "Corner Adept ○", "category": "white", "duration": 2.4, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2041", "name": "Straightaway Adept", "category": "white", "duration": 2.4, "targetSpeed": 0.15, "accel": 0.0, "heal": 0, "phase": "mid", "reqRank": [1, 9]},
    {"id": "2042", "name": "Nimble Navigator (Spurt Accel)", "category": "white", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.20, "heal": 0, "phase": "spurt", "reqRank": [2, 9]},
    {"id": "2043", "name": "Slick Surge (Late Spurt Accel)", "category": "white", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.20, "heal": 0, "phase": "spurt", "reqRank": [4, 9]},
    {"id": "2044", "name": "Head-On / Makkou Shoubu (Pace Spurt Accel)", "category": "white", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.20, "heal": 0, "phase": "spurt", "reqRank": [1, 5]},
    {"id": "2045", "name": "Highlander (Up-Slope Accel)", "category": "white", "duration": 1.8, "targetSpeed": 0.0, "accel": 0.20, "heal": 0, "phase": "spurt", "reqRank": [1, 9]}
]

# ==============================================================================
# 4. EXTRACTOR AUTOMÁTICO SI TIENES ALPHA123/UMA-TOOLS EN TU FEDORA
# ==============================================================================
posibles_rutas_alpha = [
    os.path.expanduser("~/uma-tools"),
    "../uma-tools",
    "./uma-tools"
]

for ruta in posibles_rutas_alpha:
    if os.path.exists(ruta):
        print(f"📦 Repositorio local 'uma-tools' detectado en {ruta}. Sincronizando skills...")
        for archivo in glob.glob(f"{ruta}/**/skillnames.json", recursive=True):
            try:
                with open(archivo, "r", encoding="utf-8") as f:
                    raw_names = json.load(f)
                ids_existentes = {s["id"] for s in SKILLS_DATA}
                añadidas = 0
                for sid, names in raw_names.items():
                    if str(sid) not in ids_existentes:
                        nombre_en = names[1] if isinstance(names, list) and len(names) > 1 and names[1] else (names[0] if isinstance(names, list) else str(names))
                        es_unica = str(sid).startswith("10") or str(sid).startswith("9")
                        SKILLS_DATA.append({
                            "id": str(sid),
                            "name": nombre_en,
                            "category": "unique" if es_unica else "white",
                            "duration": 3.0,
                            "targetSpeed": 0.25 if es_unica else 0.15,
                            "accel": 0.10 if es_unica else 0.0,
                            "heal": 0.0,
                            "phase": "spurt" if es_unica else "mid",
                            "reqRank": [1, 9]
                        })
                        añadidas += 1
                print(f"✨ ¡Importadas {añadidas} skills adicionales desde uma-tools!")
                break
            except Exception as e:
                print(f"⚠️ No se pudo leer {archivo}: {e}")

# ==============================================================================
# 5. GUARDAR JSONS FINALES (CON ORDEN ALFABÉTICO MANTENIDO)
# ==============================================================================
with open("data/umas.json", "w", encoding="utf-8") as f:
    json.dump(UMAS_DATA, f, ensure_ascii=False, indent=2)

with open("data/tracks.json", "w", encoding="utf-8") as f:
    json.dump(TRACKS_DATA, f, ensure_ascii=False, indent=2)

with open("data/skills.json", "w", encoding="utf-8") as f:
    json.dump(SKILLS_DATA, f, ensure_ascii=False, indent=2)

print(f"\n✅ Base de datos actualizada en 'data/':")
print(f"   -> {len(UMAS_DATA)} Umas ordenadas alfabéticamente (hasta Kitasan NY)")
print(f"   -> {len(TRACKS_DATA)} Hipódromos de CM")
print(f"   -> {len(SKILLS_DATA)} Skills listas")