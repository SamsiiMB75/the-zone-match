/* ============================================================================
   MOTOR DE SIMULACIÓN CHAMPIONS MEETING (3v6) - CLUB LA ZONA
   Conectado a data/tracks.json, data/skills.json y data/umas.json
   ============================================================================ */

// Base de datos de respaldo (Fallback)
const FALLBACK_TRACKS = [
  {
    id: "10606", trackName: "Tokyo", name: "Tokyo 2400m (Turf) - Japanese Derby / Japan Cup",
    distance: 2400, surface: "Turf",
    corners: [{ start: 350, length: 400 }, { start: 1400, length: 450 }],
    straights: [{ start: 0, end: 350 }, { start: 750, end: 1400 }, { start: 1850, end: 2400 }],
    slopes: [{ start: 1900, length: 200, slope: 200 }]
  },
  {
    id: "10506", trackName: "Nakayama", name: "Nakayama 2500m (Turf) - Arima Kinen",
    distance: 2500, surface: "Turf",
    corners: [{ start: 300, length: 400 }, { start: 1550, length: 640 }],
    straights: [{ start: 0, end: 300 }, { start: 700, end: 1550 }, { start: 2190, end: 2500 }],
    slopes: [{ start: 2250, length: 180, slope: 220 }]
  },
  {
    id: "10903", trackName: "Hanshin", name: "Hanshin 1600m (Turf) - Mile Championship / Oka Sho",
    distance: 1600, surface: "Turf",
    corners: [{ start: 650, length: 470 }],
    straights: [{ start: 0, end: 650 }, { start: 1120, end: 1600 }],
    slopes: [{ start: 1350, length: 150, slope: 180 }]
  }
];

const FALLBACK_UMAS = [
  { id: "102001", name: "Seiun Sky (Original)", defaultStyle: 1 },
  { id: "100502", name: "Maruzensky (Summer)", defaultStyle: 1 },
  { id: "100401", name: "Oguri Cap (Original)", defaultStyle: 2 },
  { id: "103401", name: "Narita Taishin (Original)", defaultStyle: 4 },
  { id: "102701", name: "Mejiro Ryan (Original)", defaultStyle: 3 },
  { id: "100701", name: "Gold Ship (Original)", defaultStyle: 4 },
  { id: "100101", name: "Special Week (Original)", defaultStyle: 2 },
  { id: "101701", name: "Symboli Rudolf (Original)", defaultStyle: 3 }
];

const FALLBACK_SKILLS = [
  { id: "1001", name: "Angling and Scheming (Seiun Unique)", category: "unique", duration: 4.0, targetSpeed: 0.0, accel: 0.40, heal: 0, phase: "spurt", reqRank: [1, 1] },
  { id: "1002", name: "Let's Pump Some Iron! (Ryan Unique)", category: "unique", duration: 4.0, targetSpeed: 0.0, accel: 0.40, heal: 0, phase: "spurt", reqRank: [6, 6] },
  { id: "1003", name: "Red Shift / LP1211-M (Maruzensky Unique)", category: "unique", duration: 4.0, targetSpeed: 0.0, accel: 0.40, heal: 0, phase: "spurt", reqRank: [1, 5] },
  { id: "1004", name: "Shooting for Victory! (Taiki Unique)", category: "unique", duration: 4.0, targetSpeed: 0.0, accel: 0.40, heal: 0, phase: "spurt", reqRank: [3, 5] },
  { id: "1005", name: "Triumphant Pulse (Oguri Unique)", category: "unique", duration: 5.0, targetSpeed: 0.45, accel: 0.0, heal: 0, phase: "final200", reqRank: [2, 5] },
  { id: "2001", name: "Professor of Curvature (Gold)", category: "gold", duration: 2.4, targetSpeed: 0.35, accel: 0.0, heal: 0, phase: "mid", reqRank: [1, 9] },
  { id: "2002", name: "Swinging Maestro (Gold Heal)", category: "heal", duration: 0.0, targetSpeed: 0.0, accel: 0.0, heal: 0.055, phase: "mid", reqRank: [1, 9] },
  { id: "2003", name: "Gourmand (Gold Heal - Pace)", category: "heal", duration: 0.0, targetSpeed: 0.0, accel: 0.0, heal: 0.055, phase: "mid", reqRank: [1, 5] },
  { id: "2004", name: "Straightaway Spurt (End Closer Accel)", category: "white", duration: 0.9, targetSpeed: 0.0, accel: 0.20, heal: 0, phase: "spurt", reqRank: [1, 9] },
  { id: "2005", name: "Groundwork (Early Accel)", category: "white", duration: 3.0, targetSpeed: 0.0, accel: 0.20, heal: 0, phase: "early", reqRank: [1, 9] },
  { id: "2006", name: "Furious Feat (Mile/Late Accel)", category: "gold", duration: 1.8, targetSpeed: 0.0, accel: 0.30, heal: 0, phase: "spurt", reqRank: [4, 9] },
  { id: "2007", name: "No Stopping Me! (Gold Accel)", category: "gold", duration: 1.8, targetSpeed: 0.0, accel: 0.30, heal: 0, phase: "spurt", reqRank: [2, 9] },
  { id: "2008", name: "Corner Recovery (White Heal)", category: "heal", duration: 0.0, targetSpeed: 0.0, accel: 0.0, heal: 0.015, phase: "mid", reqRank: [1, 9] },
  { id: "2009", name: "Medium/Long Corners", category: "white", duration: 3.0, targetSpeed: 0.25, accel: 0.0, heal: 0, phase: "mid", reqRank: [1, 9] },
  { id: "2010", name: "Tail Held High", category: "white", duration: 3.0, targetSpeed: 0.25, accel: 0.0, heal: 0, phase: "mid", reqRank: [1, 9] }
];

// Estado global de la aplicación
let currentSkillFilter = 'all';

const STATE = {
  tracks: [],
  umas: [],
  skills: [],
  activeSlot: 0,
  playerTeam: [
    { name: "Oguri Cap (Original)", style: 2, speed: 1200, stamina: 900, power: 1000, guts: 420, wit: 650, skills: ["1004", "1005", "2001", "2003"] },
    { name: "Special Week (Original)", style: 2, speed: 1200, stamina: 850, power: 950, guts: 400, wit: 700, skills: ["1001", "2001", "2002", "2005"] },
    { name: "Gold Ship (Original)", style: 4, speed: 1200, stamina: 920, power: 1050, guts: 400, wit: 600, skills: ["2002", "2004", "2007"] }
  ],
  rivalArchetypes: [
    { slot: 4, role: "nige_meta" },
    { slot: 5, role: "nige_meta" },
    { slot: 6, role: "pace_ace" },
    { slot: 7, role: "late_gambler" },
    { slot: 8, role: "end_spurt" },
    { slot: 9, role: "debuffer" }
  ]
};

const RIVAL_ROLES = {
  nige_meta: { name: "Front Runner", style: 1, skills: ["1001", "2001", "2002", "2005"], debuffStamina: 0 },
  pace_ace: { name: "Pace", style: 2, skills: ["1003", "1004", "2001", "2003"], debuffStamina: 0 },
  late_gambler: { name: "Late Surger", style: 3, skills: ["1002", "2001", "2006", "2009"], debuffStamina: 0 },
  end_spurt: { name: "End Closer", style: 4, skills: ["2002", "2004", "2007", "2009"], debuffStamina: 0 },
  debuffer: { name: "Debuffer", style: 3, skills: ["2009"], debuffStamina: 0.03 } 
};

// ============================================================================
// 1. CARGA DE LA BASE DE DATOS JSON (CON FALLBACK)
// ============================================================================
async function initDatabase() {
  const badge = document.getElementById("dbStatusBadge");
  try {
    const [tracksRes, skillsRes, umasRes] = await Promise.all([
      fetch("data/tracks.json"),
      fetch("data/skills.json"),
      fetch("data/umas.json")
    ]);

    if (tracksRes.ok && skillsRes.ok) {
      const loadedTracks = await tracksRes.json();
      const loadedSkills = await skillsRes.json();
      STATE.tracks = loadedTracks.length > 0 ? loadedTracks : FALLBACK_TRACKS;
      STATE.skills = [...FALLBACK_SKILLS, ...loadedSkills.slice(0, 300)];
      badge.textContent = `DB Global Conectada (${STATE.skills.length} skills)`;
      badge.style.color = "#34d399";
    } else {
      throw new Error("Archivos locales aún no generados");
    }

    if (umasRes && umasRes.ok) {
      const rawUmas = await umasRes.json();
      const parsedUmas = [];
      for (const [uid, uval] of Object.entries(rawUmas)) {
        const uname = uval.name ? (Array.isArray(uval.name) ? uval.name[1] || uval.name[0] : uval.name) : `Uma #${uid}`;
        parsedUmas.push({ id: uid, name: uname, defaultStyle: 2 });
      }
      STATE.umas = parsedUmas.length > 0 ? [...FALLBACK_UMAS, ...parsedUmas] : FALLBACK_UMAS;
    } else {
      STATE.umas = FALLBACK_UMAS;
    }
  } catch (err) {
    STATE.tracks = FALLBACK_TRACKS;
    STATE.skills = FALLBACK_SKILLS;
    STATE.umas = FALLBACK_UMAS;
    badge.textContent = "DB Semilla Activa (Ejecuta sync_data.py para expandir)";
    badge.style.color = "#fbbf24";
  }

  loadSavedBuilds();
  renderUI();
  runChampionsMeeting();
}

// ============================================================================
// 2. INTERFAZ Y EVENTOS DEL USUARIO
// ============================================================================
function renderUI() {
  const trackSel = document.getElementById("trackSelect");
  trackSel.innerHTML = STATE.tracks.map((t, idx) => `<option value="${idx}">${t.name}</option>`).join("");

  const umaSel = document.getElementById("umaCharSelect");
  umaSel.innerHTML = STATE.umas.map(u => `<option value="${u.name}">${u.name}</option>`).join("");

  renderActivePlayerSlot();
  renderRivalsGrid();
}

function renderActivePlayerSlot() {
  const uma = STATE.playerTeam[STATE.activeSlot];
  document.getElementById("umaCharSelect").value = uma.name;
  document.getElementById("umaStyleSelect").value = uma.style;
  document.getElementById("statSpeed").value = uma.speed;
  document.getElementById("statStamina").value = uma.stamina;
  document.getElementById("statPower").value = uma.power;
  document.getElementById("statGuts").value = uma.guts;
  document.getElementById("statWit").value = uma.wit;

  // Cargar imagen dinámica con SISTEMA MULTI-CDN (Anti 404)
  const portraitImg = document.getElementById("umaPortrait");
  const selectedUmaData = STATE.umas.find(u => u.name === uma.name);
  
  if (selectedUmaData && selectedUmaData.id) {
    let iconId = selectedUmaData.id.toString();
    if (iconId.length === 4) iconId += "01"; 
    
    // Cola de enlaces: Si uno falla, intenta el siguiente automáticamente
    const fallbackChain = [
      `https://uma.tools/images/icons/chara_${iconId}.png`, // Intento 1: Uma-tools
      `https://wsrv.nl/?url=gametora.com/images/umamusume/characters/icons/chara_${iconId}.png`, // Intento 2: GameTora vía Proxy (Se salta el bloqueo CORS)
      `assets/umas.jpg` // Intento 3: Imagen local por defecto
    ];
    
    let attempt = 0;
    portraitImg.src = fallbackChain[attempt];
    portraitImg.onerror = () => {
      attempt++;
      if (attempt < fallbackChain.length) {
        portraitImg.src = fallbackChain[attempt];
      }
    };
  } else {
    portraitImg.src = 'assets/umas.jpg';
  }

  renderSkillPills(document.getElementById("skillSearchInput").value);
}

function renderSkillPills(filterText = "") {
  const container = document.getElementById("skillPillsContainer");
  const uma = STATE.playerTeam[STATE.activeSlot];
  const query = filterText.toLowerCase().trim();

  const filtered = STATE.skills.filter(sk => {
    const matchesText = sk.name.toLowerCase().includes(query);
    let matchesType = true;
    
    if (currentSkillFilter === 'speed') matchesType = sk.targetSpeed > 0;
    if (currentSkillFilter === 'accel') matchesType = sk.accel > 0;
    if (currentSkillFilter === 'heal') matchesType = sk.heal > 0;
    
    return matchesText && matchesType;
  });

  document.getElementById("activeSkillCount").textContent = uma.skills.length;

  container.innerHTML = filtered.slice(0, 100).map(sk => {
    const isActive = uma.skills.includes(sk.id);
    return `<div class="skill-pill ${isActive ? 'active' : ''} type-${sk.category || 'white'}" data-skill-id="${sk.id}">
      ${sk.name}
    </div>`;
  }).join("");

  container.querySelectorAll(".skill-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const sid = pill.getAttribute("data-skill-id");
      const idx = uma.skills.indexOf(sid);
      if (idx >= 0) uma.skills.splice(idx, 1);
      else uma.skills.push(sid);
      saveBuilds();
      renderSkillPills(document.getElementById("skillSearchInput").value);
    });
  });
}

function renderRivalsGrid() {
  const grid = document.getElementById("rivalsGrid");
  grid.innerHTML = STATE.rivalArchetypes.map((r, i) => `
    <div class="rival-card">
      <div class="rival-slot-title">OPONENTE #${r.slot}</div>
      <select class="cm-input-sm rival-role-select" data-rival-idx="${i}">
        <option value="nige_meta" ${r.role === 'nige_meta' ? 'selected' : ''}>Front Runner</option>
        <option value="pace_ace" ${r.role === 'pace_ace' ? 'selected' : ''}>Pace</option>
        <option value="late_gambler" ${r.role === 'late_gambler' ? 'selected' : ''}>Late Surger</option>
        <option value="end_spurt" ${r.role === 'end_spurt' ? 'selected' : ''}>End Closer</option>
        <option value="debuffer" ${r.role === 'debuffer' ? 'selected' : ''}>Debuffer</option>
      </select>
    </div>
  `).join("");

  grid.querySelectorAll(".rival-role-select").forEach(sel => {
    sel.addEventListener("change", (e) => {
      const idx = parseInt(e.target.getAttribute("data-rival-idx"));
      STATE.rivalArchetypes[idx].role = e.target.value;
    });
  });
}

function saveBuilds() {
  localStorage.setItem("lazona_cm_team", JSON.stringify(STATE.playerTeam));
}

function loadSavedBuilds() {
  const saved = localStorage.getItem("lazona_cm_team");
  if (saved) {
    try { STATE.playerTeam = JSON.parse(saved); } catch (e) {}
  }
}

// ============================================================================
// 3. MOTOR FÍSICO DE CARRERA DE 9 UMAS
// ============================================================================
const STYLE_COEFF = {
  1: { earlySpd: 1.000, midSpd: 0.980, spurtSpd: 0.962, earlyAcc: 1.00, midAcc: 1.00, spurtAcc: 0.996, hpMult: 0.95 }, 
  2: { earlySpd: 0.978, midSpd: 0.991, spurtSpd: 0.975, earlyAcc: 0.985, midAcc: 1.00, spurtAcc: 0.996, hpMult: 0.89 }, 
  3: { earlySpd: 0.938, midSpd: 0.998, spurtSpd: 0.994, earlyAcc: 0.975, midAcc: 1.00, spurtAcc: 1.000, hpMult: 1.00 }, 
  4: { earlySpd: 0.931, midSpd: 1.000, spurtSpd: 1.000, earlyAcc: 0.945, midAcc: 1.00, spurtAcc: 0.997, hpMult: 0.995 } 
};

function buildNineRunners(track, tier) {
  const tierStats = {
    whale: { speed: 1600, stamina: Math.min(1300, Math.round(track.distance * 0.40)), power: 1400, guts: 1200, wit: 1200 },
    comp:  { speed: 1200, stamina: Math.min(1000, Math.round(track.distance * 0.35)), power: 1000, guts: 800, wit: 800 },
    casual:{ speed: 1000, stamina: Math.min(780, Math.round(track.distance * 0.31)), power: 780,  guts: 450, wit: 480 }
  }[tier];

  const runners = [];

  STATE.playerTeam.forEach((p, idx) => {
    runners.push({
      id: idx,
      isPlayer: true,
      label: `Tu #${idx + 1}: ${p.name.split(" ")[0]}`,
      fullName: p.name,
      style: parseInt(p.style),
      speed: Number(p.speed),
      stamina: Number(p.stamina),
      power: Number(p.power),
      guts: Number(p.guts),
      wit: Number(p.wit),
      skillIds: [...p.skills],
      color: idx === 0 ? "#38bdf8" : (idx === 1 ? "#f43f5e" : "#a855f7")
    });
  });

  STATE.rivalArchetypes.forEach((r, idx) => {
    const arch = RIVAL_ROLES[r.role];
    runners.push({
      id: idx + 3,
      isPlayer: false,
      label: `Bot #${idx + 4}: ${arch.name}`,
      fullName: arch.name,
      style: arch.style,
      speed: tierStats.speed,
      stamina: tierStats.stamina,
      power: tierStats.power,
      guts: tierStats.guts,
      wit: tierStats.wit,
      skillIds: [...arch.skills],
      debuffStamina: arch.debuffStamina || 0,
      color: "rgba(148, 163, 184, 0.35)"
    });
  });

  return runners;
}

function simulateSingleRace(runnersConfig, track, groundMod) {
  const dist = track.distance;
  const baseSpeed = 20.0 - (dist - 2000) / 1000.0;
  const spurtStart = (dist * 2) / 3;
  const dt = 0.2;

  const frontCount = runnersConfig.filter(r => r.style === 1).length;
  const totalEnemyDebuff = runnersConfig.filter(r => !r.isPlayer).reduce((acc, r) => acc + (r.debuffStamina || 0), 0);

  const states = runnersConfig.map(r => {
    const coeff = STYLE_COEFF[r.style] || STYLE_COEFF[2];
    const maxHp = 0.8 * coeff.hpMult * r.stamina + dist;
    let startHp = maxHp;
    if (r.isPlayer && totalEnemyDebuff > 0) {
      startHp -= maxHp * totalEnemyDebuff;
    }

    return {
      cfg: r,
      coeff,
      pos: 0,
      vel: 3.0,
      hp: startHp,
      maxHp,
      rank: 1,
      usedSkills: new Set(),
      activeBuffs: [],
      telemetry: [],
      finishTime: null
    };
  });

  let time = 0;
  let allFinished = false;

  while (!allFinished && time < 240) {
    time += dt;

    const sorted = [...states].sort((a, b) => b.pos - a.pos);
    sorted.forEach((st, idx) => { st.rank = idx + 1; });

    allFinished = true;

    for (const st of states) {
      if (st.pos >= dist) continue;
      allFinished = false;

      const phase = st.pos < dist / 6 ? "early" : (st.pos < spurtStart ? "mid" : "spurt");
      const witActivationProb = Math.max(0.25, 1.0 - 90.0 / st.cfg.wit);

      for (const sid of st.cfg.skillIds) {
        if (st.usedSkills.has(sid)) continue;
        const sk = STATE.skills.find(s => s.id === sid);
        if (!sk) continue;

        const skPhase = sk.phase || (sk.category === "heal" ? "mid" : "spurt");
        const [minR, maxR] = sk.reqRank || [1, 9];

        const phaseMatch = (skPhase === phase) || (skPhase === "final200" && st.pos >= dist - 220);
        const rankMatch = st.rank >= minR && st.rank <= maxR;

        if (phaseMatch && rankMatch) {
          st.usedSkills.add(sid);
          if (Math.random() <= witActivationProb) {
            if (sk.heal > 0) {
              st.hp = Math.min(st.maxHp, st.hp + st.maxHp * sk.heal);
            }
            if (sk.targetSpeed > 0 || sk.accel > 0) {
              st.activeBuffs.push({
                endTime: time + (sk.duration || 3.0) * (dist / 1000.0),
                spd: sk.targetSpeed || 0,
                acc: sk.accel || 0
              });
            }
          }
        }
      }

      st.activeBuffs = st.activeBuffs.filter(b => b.endTime > time);
      const buffSpd = st.activeBuffs.reduce((sum, b) => sum + b.spd, 0);
      const buffAcc = st.activeBuffs.reduce((sum, b) => sum + b.acc, 0);

      let targetSpd = baseSpeed;
      let accel = 0.0006 * Math.sqrt(500.0 * st.cfg.power * groundMod);

      if (phase === "early") {
        const nigeContestBonus = (st.cfg.style === 1 && frontCount >= 2) ? 0.35 : 0;
        targetSpd = baseSpeed * st.coeff.earlySpd + nigeContestBonus;
        accel *= st.coeff.earlyAcc * (st.pos < 30 ? 4.2 : 1.1);
      } else if (phase === "mid") {
        const witRandom = ((st.cfg.wit / 5500.0) * Math.log10(st.cfg.wit * 0.1)) * (0.85 + Math.random() * 0.3);
        targetSpd = baseSpeed * (st.coeff.midSpd + witRandom * 0.01);
        accel *= st.coeff.midAcc;
      } else {
        const spdStatBonus = Math.sqrt(500.0 * st.cfg.speed) * 0.002;
        const gutsBonus = Math.pow(450.0 * st.cfg.guts, 0.597) * 0.0001;
        targetSpd = (baseSpeed * (st.coeff.spurtSpd + 0.01) + spdStatBonus + gutsBonus) * 1.05;
        accel *= st.coeff.spurtAcc;

        if (st.hp <= 0) {
          targetSpd = baseSpeed * 0.82;
        }
      }

      targetSpd += buffSpd;
      accel += buffAcc;

      if (st.vel < targetSpd) {
        st.vel = Math.min(targetSpd, st.vel + accel * dt);
      } else {
        st.vel = Math.max(targetSpd, st.vel - 0.8 * dt);
      }

      const pacePenalty = (st.cfg.style === 1 && frontCount >= 3 && phase !== "spurt") ? 1.25 : 1.0;
      const hpDrain = 20.0 * Math.pow(st.vel - baseSpeed + 12.0, 2) / 144.0 * pacePenalty * dt;
      st.hp -= hpDrain;

      const prevPos = st.pos;
      st.pos += st.vel * dt;
      st.telemetry.push({ m: Math.min(dist, st.pos), v: st.vel });

      if (st.pos >= dist && st.finishTime === null) {
        const remain = dist - prevPos;
        st.finishTime = time - dt + (remain / st.vel);
      }
    }
  }

  return states;
}

// ============================================================================
// 4. EJECUCIÓN MONTE CARLO Y DIBUJADO DE TELEMETRÍA
// ============================================================================
function runChampionsMeeting() {
  const trackIdx = parseInt(document.getElementById("trackSelect").value) || 0;
  const track = STATE.tracks[trackIdx] || FALLBACK_TRACKS[0];
  const groundVal = parseInt(document.getElementById("groundSelect").value) || 1;
  const groundMod = groundVal === 1 ? 1.0 : (groundVal === 2 ? 0.96 : 0.91);
  const runs = parseInt(document.getElementById("simRunsSelect").value) || 50;
  const tier = document.getElementById("rivalTierSelect").value || "comp";

  const runners = buildNineRunners(track, tier);
  const wins = new Array(9).fill(0);
  const bestTimes = new Array(9).fill(999);
  let sampleRace = null;

  for (let i = 0; i < runs; i++) {
    const result = simulateSingleRace(runners, track, groundMod);
    if (i === 0) sampleRace = result;

    let winnerIdx = 0;
    let minT = 9999;
    result.forEach((st, idx) => {
      const t = st.finishTime || 999;
      if (t < bestTimes[idx]) bestTimes[idx] = t;
      if (t < minT) {
        minT = t;
        winnerIdx = idx;
      }
    });
    wins[winnerIdx]++;
  }

  const teamWins = wins[0] + wins[1] + wins[2];
  const teamWinrate = Math.round((teamWins / runs) * 100);

  const badge = document.getElementById("teamWinrateBadge");
  badge.textContent = `WINRATE: ${teamWinrate}%`;
  badge.style.borderColor = teamWinrate >= 50 ? "#34d399" : "#f43f5e";

  document.getElementById("cmSummaryText").textContent =
    `Simuladas ${runs} carreras en ${track.name} contra nivel ${tier.toUpperCase()}. Tu equipo ganó ${teamWins} de ${runs} partidas.`;

  const sbGrid = document.getElementById("scoreboardGrid");
  sbGrid.innerHTML = runners.map((r, i) => {
    const wr = Math.round((wins[i] / runs) * 100);
    const mins = Math.floor(bestTimes[i] / 60);
    const secs = (bestTimes[i] % 60).toFixed(2).padStart(5, "0");
    return `
      <div class="score-card ${r.isPlayer ? 'is-player' : ''}" style="border-top: 3px solid ${r.color};">
        <div class="score-name">${r.label}</div>
        <div class="score-wr">${wr}% <span>(${wins[i]}W)</span></div>
        <div class="score-time">Mejor: ${mins}:${secs}</div>
      </div>
    `;
  }).join("");

  drawTelemetryCanvas(sampleRace, track);
}

function drawTelemetryCanvas(raceStates, track) {
  const canvas = document.getElementById("telemetryCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const padL = 52, padR = 24, padT = 28, padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const dist = track.distance;
  const minV = 17.5, maxV = 26.5;

  const xEarly = padL + (1 / 6) * plotW;
  const xSpurt = padL + (2 / 3) * plotW;

  ctx.fillStyle = "rgba(56, 189, 248, 0.04)";
  ctx.fillRect(padL, padT, xEarly - padL, plotH);
  ctx.fillStyle = "rgba(244, 63, 94, 0.06)";
  ctx.fillRect(xSpurt, padT, padL + plotW - xSpurt, plotH);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.font = "11px Inter, sans-serif";
  ctx.fillStyle = "#94a3b8";

  for (let v = 18; v <= 26; v += 2) {
    const y = padT + plotH - ((v - minV) / (maxV - minV)) * plotH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
    ctx.fillText(`${v} m/s`, 8, y + 4);
  }

  ctx.fillStyle = "#fda4af";
  ctx.fillText(`▶ LAST SPURT (${Math.round(dist * 2 / 3)}m)`, xSpurt + 6, padT + 14);
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("0m", padL, H - 10);
  ctx.fillText(`${dist}m`, padL + plotW - 35, H - 10);

  const orderedToDraw = [...raceStates].sort((a, b) => (a.cfg.isPlayer ? 1 : -1));

  for (const st of orderedToDraw) {
    ctx.beginPath();
    ctx.strokeStyle = st.cfg.color;
    ctx.lineWidth = st.cfg.isPlayer ? 2.6 : 1.2;

    st.telemetry.forEach((pt, idx) => {
      const x = padL + (pt.m / dist) * plotW;
      const y = padT + plotH - ((Math.max(minV, Math.min(maxV, pt.v)) - minV) / (maxV - minV)) * plotH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

// ============================================================================
// 5. VINCULAR CONTROLES DEL DOM
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".uma-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".uma-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      STATE.activeSlot = parseInt(tab.getAttribute("data-slot"));
      renderActivePlayerSlot();
    });
  });

  // Filtros de Habilidades
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentSkillFilter = e.target.getAttribute("data-filter");
      renderSkillPills(document.getElementById("skillSearchInput").value);
    });
  });

  const bindInput = (id, key, isNum = true) => {
    document.getElementById(id).addEventListener("input", (e) => {
      STATE.playerTeam[STATE.activeSlot][key] = isNum ? Number(e.target.value) : e.target.value;
      saveBuilds();
    });
  };

  bindInput("umaCharSelect", "name", false);
  bindInput("umaStyleSelect", "style", true);
  bindInput("statSpeed", "speed", true);
  bindInput("statStamina", "stamina", true);
  bindInput("statPower", "power", true);
  bindInput("statGuts", "guts", true);
  bindInput("statWit", "wit", true);

  document.getElementById("skillSearchInput").addEventListener("input", (e) => {
    renderSkillPills(e.target.value);
  });

  document.getElementById("btnRunCM").addEventListener("click", runChampionsMeeting);
  document.getElementById("trackSelect").addEventListener("change", runChampionsMeeting);

  initDatabase();
});