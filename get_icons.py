import urllib.request
import os

os.makedirs("assets/icons", exist_ok=True)

# Camuflar la petición como si fuera un navegador web normal para evitar el bloqueo
opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0')]
urllib.request.install_opener(opener)

# Los IDs de los personajes que tienes por defecto
umas_ids = ["102001", "100502", "100401", "103401", "102701", "100701", "100101", "101701"]

for uid in umas_ids:
    url = f"https://gametora.com/images/umamusume/characters/icons/chara_{uid}.png"
    path = f"assets/icons/{uid}.png"
    try:
        urllib.request.urlretrieve(url, path)
        print(f"✅ Descargado: {uid}.png")
    except Exception as e:
        print(f"❌ Error con {uid}: {e}")