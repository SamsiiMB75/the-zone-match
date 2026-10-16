// BASE DE DATOS DE PISTAS Y HABILIDADES COMPETITIVAS
const TRACKS = {
  tokyo_2400_turf: { name: "Tokio Césped 2400m", distance: 2400, surface: "turf" },
  nakayama_2500_turf: { name: "Nakayama Césped 2500m", distance: 2500, surface: "turf" },
  hanshin_1600_turf: { name: "Hanshin Césped 1600m", distance: 1600, surface: "turf" },
  kyoto_3200_turf: { name: "Kioto Césped 3200m", distance: 3200, surface: "turf" },
  chukyo_1200_turf: { name: "Chukyo Césped 1200m", distance: 1200, surface: "turf" },
  tokyo_2000_turf: { name: "Tokio Césped 2000m", distance: 2000, surface: "turf" },
  oi_2000_dirt: { name: "Oi Tierra 2000m", distance: 2000, surface: "dirt" }
};

const SKILLS_DB = [
  { id: "verxina_ult", name: "👑 Reina Azul (Unique)", type: "unique", phase: 0.55, dur: 5, spd: 0.38, acc: 0.10, heal: 0 },
  { id: "winvari_ult", name: "🔥 As Carmesí (Unique)", type: "unique", phase: 0.67, dur: 5, spd: 0.35, acc: 0.25, heal: 0 },
  { id: "angling", name: "🎣 Angling & Scheming (Seiun)", type: "unique", phase: 0.66, dur: 4, spd: 0.05, acc: 0.40, heal: 0 },
  { id: "redshift", name: "🏎️ Red Shift (Maruzensky)", type: "unique", phase: 0.66, dur: 4, spd: 0.05, acc: 0.40, heal: 0 },
  { id: "pump_iron", name: "💪 Let's Pump Some Iron (Ryan)", type: "unique", phase: 0.66, dur: 4, spd: 0.0, acc: 0.40, heal: 0 },
  { id: "prof_curv", name: "✨ Professor of Curvature", type: "gold", phase: 0.35, dur: 3, spd: 0.35, acc: 0, heal: 0 },
  { id: "killer_tunes", name: "🎵 Killer Tunes / Elated", type: "gold", phase: 0.45, dur: 3, spd: 0.35, acc: 0, heal: 0 },
  { id: "no_stopping", name: "⚡ No Stopping Me!", type: "gold", phase: 0.67, dur: 3, spd: 0.15, acc: 0.35, heal: 0 },
  { id: "spurt", name: "🚀 Straightaway Spurt", type: "white", phase: 0.68, dur: 2.5, spd: 0, acc: 0.20, heal: 0 },
  { id: "maestro", name: "💙 Swinging Maestro (+5.5% HP)", type: "Heal", phase: 0.40, dur: 1, spd: 0, acc: 0, heal: 0.055 },
  { id: "gourmand", name: "💚 Gourmand / Hydrate (+5.5% HP)", type: "Heal", phase: 0.48, dur: 1, spd: 0, acc: 0, heal: 0.055 },
  { id: "tail_high", name: "🏳️ Tail Held High", type: "white", phase: 0.50, dur: 3, spd: 0.25, acc: 0, heal: 0 }
];

const ROSTER_PRESETS = [
  { name: "Verxina (Reina Azul)", spd: 1200, sta: 880, pwr: 950, guts: 440, wit: 680, style: "nige", skills: ["verxina_ult", "angling", "prof_curv", "maestro"] },
  { name: "Win Variation (As Carmesí)", spd: 1200, sta: 900, pwr: 1050, guts: 460, wit: 620, style: "sashi", skills: ["winvari_ult", "pump_iron", "no_stopping", "maestro"] },
  { name: "Special Week [Special Dreamer]", spd: 1180, sta: 860, pwr: 920, guts: 420, wit: 600, style: "senkou", skills: ["prof_curv", "gourmand", "tail_high"] },
  { name: "Oguri Cap [Starlight Beat]", spd: 1200, sta: 850, pwr: 1000, guts: 450, wit: 650, style: "senkou", skills: ["redshift", "prof_curv", "maestro"] },
  { name: "Narita Taishin [Nevertheless]", spd: 1200, sta: 920, pwr: 980, guts: 430, wit: 580, style: "oikomi", skills: ["spurt", "no_stopping", "maestro"] },
  { name: "Silence Suzuka [Innocent Silence]", spd: 1200, sta: 780, pwr: 880, guts: 400, wit: 700, style: "nige", skills: ["angling", "prof_curv", "tail_high"] }
];

// ESTADO DE LAS 2 UMAS EN EL COMPARADOR
let state = {
  uma1: { ...ROSTER_PRESETS[0], distApt: "S", surfApt: "A" },
  uma2: { ...ROSTER_PRESETS[1], distApt: "S", surfApt: "A" },
  lastTelemetry: null
};

// RANGO DE LETRA SEGÚN VALOR DE STAT
function getStatRank(val) {
  if (val >= 1500) return "UD";
  if (val >= 1300) return "UG";
  if (val >= 1150) return "SS+";
  if (val >= 1100) return "SS";
  if (val >= 1000) return "S";
  if (val >= 800) return "A";
  if (val >= 600) return "B";
  return "C";
}

// RENDERIZAR TARJETAS DE UMA 1 Y UMA 2
function renderUmaCard(slotKey, containerId, labelTitle) {
  const u = state[slotKey];
  const container = document.getElementById(containerId);

  const presetOptions = ROSTER_PRESETS.map((p, idx) =>
    `<option value="${idx}" ${p.name === u.name ? "selected" : ""}>${p.name}</option>`
  ).join("");

  const statInputs = [
    { key: "spd", label: "SPEED" },
    { key: "sta", label: "STAMINA" },
    { key: "pwr", label: "POWER" },
    { key: "guts", label: "GUTS" },
    { key: "wit", label: "WIT" }
  ].map(s => `
    <div class="stat-box">
      <label>${s.label}</label>
      <input type="number" data-slot="${slotKey}" data-stat="${s.key}" value="${u[s.key]}" min="100" max="2000" step="10" />
      <span class="stat-rank">${getStatRank(u[s.key])}</span>
    </div>
  `).join("");

  const skillPills = SKILLS_DB.map(sk => {
    const isActive = u.skills.includes(sk.id);
    return `<div class="skill-pill ${isActive ? 'active' : ''} type-${sk.type}" data-slot="${slotKey}" data-skill="${sk.id}">${sk.name}</div>`;
  }).join("");

  container.innerHTML = `
    <div class="uma-card-header">
      <div class="corner-badge">${labelTitle}</div>
      <select class="preset-select" data-slot="${slotKey}">
        ${presetOptions}
      </select>
    </div>

    <div class="stats-row">${statInputs}</div>

    <div class="config-row">
      <div class="field-group" style="min-width:unset">
        <label>Estilo</label>
        <select data-slot="${slotKey}" data-field="style">
          <option value="nige" ${u.style === "nige" ? "selected" : ""}>Líder (Nige)</option>
          <option value="senkou" ${u.style === "senkou" ? "selected" : ""}>Delantera (Senkou)</option>
          <option value="sashi" ${u.style === "sashi" ? "selected" : ""}>Medio (Sashi)</option>
          <option value="oikomi" ${u.style === "oikomi" ? "selected" : ""}>Remate (Oikomi)</option>
        </select>
      </div>
      <div class="field-group" style="min-width:unset">
        <label>Aptitud Distancia</label>
        <select data-slot="${slotKey}" data-field="distApt">
          <option value="S" ${u.distApt === "S" ? "selected" : ""}>Rango S (+5% Spd)</option>
          <option value="A" ${u.distApt === "A" ? "selected" : ""}>Rango A (100%)</option>
          <option value="B" ${u.distApt === "B" ? "selected" : ""}>Rango B (-10%)</option>
        </select>
      </div>
      <div class="field-group" style="min-width:unset">
        <label>Aptitud Pista</label>
        <select data-slot="${slotKey}" data-field="surfApt">
          <option value="S" ${u.surfApt === "S" ? "selected" : ""}>Rango S (+5% Pwr)</option>
          <option value="A" ${u.surfApt === "A" ? "selected" : ""}>Rango A (100%)</option>
        </select>
      </div>
    </div>

    <div class="skills-section-title">
      <span>Habilidades Activas (${u.skills.length})</span>
      <span>Clic para activar/desactivar</span>
    </div>
    <div class="skills-pool">${skillPills}</div>
  `;
}

// MOTOR FÍSICO DE CARRERA UMA MUSUME (TELEMETRÍA)
function simulateSingleRace(uma, distance, groundMod, randomVariance = true) {
  const baseSpeed = 20.0 - (distance - 2000) / 1000;
  const distMult = uma.distApt === "S" ? 1.05 : (uma.distApt === "B" ? 0.9 : 1.0);
  const surfMult = uma.surfApt === "S" ? 1.05 : 1.0;

  const styleMod = {
    nige: { early: 1.0, mid: 0.98, late: 0.962, hpMod: 0.95 },
    senkou: { early: 0.978, mid: 0.991, late: 0.975, hpMod: 0.89 },
    sashi: { early: 0.938, mid: 0.998, late: 0.994, hpMod: 1.0 },
    oikomi: { early: 0.931, mid: 1.0, late: 1.0, hpMod: 0.995 }
  }[uma.style];

  // Cálculo de HP Total (Stamina)
  const maxHp = 0.8 * styleMod.hpMod * uma.sta + distance;
  let hp = maxHp;

  const dt = 0.2;
  let pos = 0;
  let time = 0;
  let curSpeed = 3.0; // Velocidad de salida del cajón

  const spurtTargetSpeed =
    (baseSpeed * (styleMod.late + 0.01) + Math.sqrt(500 * uma.spd) * distMult * 0.002) * 1.05 +
    Math.pow(450 * uma.guts, 0.597) * 0.0001;

  const baseAccel = 0.0006 * Math.sqrt(500 * uma.pwr) * surfMult * groundMod;

  const samples = [];
  const activatedSkills = new Set();
  const activeBuffs = [];
  let survivedSpurt = true;

  while (pos < distance && time < 260) {
    const progress = pos / distance;
    const phase = progress < 0.166 ? 0 : (progress < 0.666 ? 1 : 2);

    // Comprobar activación de habilidades
    for (const skId of uma.skills) {
      if (!activatedSkills.has(skId)) {
        const sk = SKILLS_DB.find(s => s.id === skId);
        if (sk && progress >= sk.phase) {
          activatedSkills.add(skId);
          // Probabilidad por Wit (o 100% para uniques si no hay varianza)
          const witChance = Math.max(0.72, 1 - 90 / uma.wit);
          if (!randomVariance || Math.random() <= witChance) {
            if (sk.heal > 0) hp = Math.min(maxHp, hp + maxHp * sk.heal);
            activeBuffs.push({ end: time + sk.dur, spd: sk.spd, acc: sk.acc });
          }
        }
      }
    }

    let skillSpdBonus = 0;
    let skillAccBonus = 0;
    for (const b of activeBuffs) {
      if (time < b.end) {
        skillSpdBonus += b.spd;
        skillAccBonus += b.acc;
      }
    }

    // Velocidad objetivo según fase
    let targetSpeed = baseSpeed;
    if (phase === 0) targetSpeed = baseSpeed * styleMod.early;
    else if (phase === 1) targetSpeed = baseSpeed * styleMod.mid + (uma.wit / 5500) * 0.35;
    else {
      if (hp > 0) targetSpeed = spurtTargetSpeed;
      else {
        survivedSpurt = false;
        targetSpeed = baseSpeed * 0.85; // Quedarse sin Stamina (Out of HP)
      }
    }

    if (randomVariance) {
      targetSpeed += (Math.random() - 0.5) * 0.14;
    }
    targetSpeed += skillSpdBonus;

    // Aceleración hacia la velocidad objetivo
    const accel = (pos < 25 ? 24.0 : baseAccel) + skillAccBonus;
    if (curSpeed < targetSpeed) {
      curSpeed = Math.min(targetSpeed, curSpeed + accel * dt);
    } else {
      curSpeed = Math.max(targetSpeed, curSpeed - 0.8 * dt);
    }

    // Consumo de Stamina
    const hpDrain = 20.0 * Math.pow(curSpeed - baseSpeed + 12.0, 2) / 144.0 * dt;
    hp = Math.max(0, hp - hpDrain);

    pos += curSpeed * dt;
    time += dt;

    samples.push({
      pos: Math.min(distance, pos),
      spd: curSpeed,
      hpPct: (hp / maxHp) * 100
    });
  }

  return { time, samples, survivedSpurt };
}

// EJECUTAR COMPARATIVA MONTE CARLO Y DIBUJAR GRÁFICA
function runComparison() {
  const trackKey = document.getElementById("track-select").value;
  const track = TRACKS[trackKey];
  const groundVal = document.getElementById("ground-select").value;
  const groundMod = { good: 1.0, yielding: 0.98, soft: 0.96, heavy: 0.93 }[groundVal];
  const runs = parseInt(document.getElementById("sim-runs").value, 10);

  // Actualizar etiquetas del banner
  document.getElementById("banner-uma1").textContent = `🟦 ${state.uma1.name}`;
  document.getElementById("banner-uma2").textContent = `🟥 ${state.uma2.name}`;

  // Telemetría limpia (sin ruido aleatorio) para el gráfico
  const clean1 = simulateSingleRace(state.uma1, track.distance, groundMod, false);
  const clean2 = simulateSingleRace(state.uma2, track.distance, groundMod, false);
  state.lastTelemetry = { clean1, clean2, distance: track.distance };

  // Simulación Monte Carlo
  const bashinDiffs = [];
  let sumT1 = 0, sumT2 = 0, surv1 = 0, surv2 = 0;

  for (let i = 0; i < runs; i++) {
    const r1 = simulateSingleRace(state.uma1, track.distance, groundMod, true);
    const r2 = simulateSingleRace(state.uma2, track.distance, groundMod, true);
    sumT1 += r1.time;
    sumT2 += r2.time;
    if (r1.survivedSpurt) surv1++;
    if (r2.survivedSpurt) surv2++;
    // 1 segundo a ~20m/s equivale a ~8 cuerpos (1 bashin = 2.5 metros)
    const diffMeters = (r2.time - r1.time) * 20.0;
    bashinDiffs.push(diffMeters / 2.5);
  }

  bashinDiffs.sort((a, b) => a - b);
  const avgBashin = bashinDiffs.reduce((a, b) => a + b, 0) / runs;
  const minB = bashinDiffs[0];
  const maxB = bashinDiffs[bashinDiffs.length - 1];

  const winnerEl = document.getElementById("res-winner");
  if (Math.abs(avgBashin) < 0.08) {
    winnerEl.textContent = "Empate Técnico (Foto Finish)";
    winnerEl.style.color = "#fbbf24";
  } else if (avgBashin > 0) {
    winnerEl.textContent = `🟦 ${state.uma1.name}`;
    winnerEl.style.color = "#00e5ff";
  } else {
    winnerEl.textContent = `🟥 ${state.uma2.name}`;
    winnerEl.style.color = "#ff4d6d";
  }

  document.getElementById("res-bashin").textContent = `${avgBashin >= 0 ? "+" : ""}${avgBashin.toFixed(2)} cuerpos`;
  document.getElementById("res-range").textContent = `${minB.toFixed(2)} a ${maxB.toFixed(2)} c.`;
  document.getElementById("res-times").textContent = `${(sumT1 / runs).toFixed(2)}s vs ${(sumT2 / runs).toFixed(2)}s`;
  document.getElementById("res-spurt").textContent = `${Math.round((surv1 / runs) * 100)}% vs ${Math.round((surv2 / runs) * 100)}%`;

  drawTelemetryCanvas();
}

// DIBUJAR CANVAS CON COLORES VERXINA (CIAN) VS WIN VARIATION (CARMESÍ)
function drawTelemetryCanvas(hoverRatio = null) {
  if (!state.lastTelemetry) return;
  const { clean1, clean2, distance } = state.lastTelemetry;
  const canvas = document.getElementById("race-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Fondos de Fases: Fase Inicial (0-16.6%), Fase Media (16.6-66.6%), Last Spurt (66.6-100%)
  const xPhase1 = W * 0.166;
  const xPhase2 = W * 0.666;

  ctx.fillStyle = "rgba(37, 99, 235, 0.06)";
  ctx.fillRect(0, 0, xPhase1, H);
  ctx.fillStyle = "rgba(124, 131, 253, 0.04)";
  ctx.fillRect(xPhase1, 0, xPhase2 - xPhase1, H);
  ctx.fillStyle = "rgba(225, 29, 72, 0.07)";
  ctx.fillRect(xPhase2, 0, W - xPhase2, H);

  // Líneas divisoras de fase
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.setLineDash([5, 5]);
  [xPhase1, xPhase2].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Etiquetas de fase
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 12px 'Plus Jakarta Sans'";
  ctx.fillText("FASE INICIAL (Opening)", 12, 20);
  ctx.fillText("FASE MEDIA (Middle)", xPhase1 + 12, 20);
  ctx.fillStyle = "#ff4d6d";
  ctx.fillText(`🔥 LAST SPURT (${Math.round(distance * 0.666)}m)`, xPhase2 + 12, 20);

  const minSpd = 17.5, maxSpd = 26.5;
  const yFromSpd = spd => H - 25 - ((spd - minSpd) / (maxSpd - minSpd)) * (H - 55);
  const yFromHp = hp => H - 25 - (hp / 100) * (H - 55);

  // Dibujar Stamina (Punteada)
  function plotHp(samples, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = (s.pos / distance) * W;
      const y = yFromHp(s.hpPct);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Dibujar Velocidad (Línea sólida brillante)
  function plotSpd(samples, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = (s.pos / distance) * W;
      const y = yFromSpd(s.spd);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  plotHp(clean1.samples, "rgba(0, 229, 255, 0.45)");
  plotHp(clean2.samples, "rgba(255, 77, 109, 0.45)");
  plotSpd(clean1.samples, "#00e5ff"); // Cian Verxina
  plotSpd(clean2.samples, "#ff4d6d"); // Carmesí Win Variation

  // Cursor interactivo al pasar el ratón
  if (hoverRatio !== null) {
    const hx = hoverRatio * W;
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx, 0);
    ctx.lineTo(hx, H);
    ctx.stroke();
  }
}

// CALCULADORA DE STAMINA (PESTAÑA 2)
function updateStaminaCalc() {
  const dist = parseFloat(document.getElementById("sc-distance").value) || 2400;
  const styleMod = parseFloat(document.getElementById("sc-style").value) || 1.0;
  const spd = parseFloat(document.getElementById("sc-speed").value) || 1200;
  const guts = parseFloat(document.getElementById("sc-guts").value) || 450;
  const goldHeals = parseInt(document.getElementById("sc-gold-heals").value, 10) || 0;
  const debuffDrain = parseFloat(document.getElementById("sc-debuffs").value) || 0;

  // Estimación competitiva de Stamina requerida
  const baseReq = (dist - 1000) * 0.42 + 340;
  const spdTax = (spd - 1000) * 0.22;
  const gutsDiscount = (guts - 400) * 0.35;
  const rawStaminaNeeded = (baseReq + spdTax - gutsDiscount) / styleMod;

  const netHealPct = goldHeals * 0.055 - debuffDrain;
  const finalStamina = Math.max(300, Math.round(rawStaminaNeeded * (1 - netHealPct * 1.35)));

  const box = document.getElementById("stamina-result-box");
  box.innerHTML = `
    <span class="club-tag">RECOMENDACIÓN LA ZONA</span>
    <h3>Stamina Mínima para Full Spurt</h3>
    <div class="big-stamina-number">${finalStamina} STA</div>
    <p style="color:#94a3b8; font-size:0.88rem;">
      Con <strong>${goldHeals} cura(s) dorada(s)</strong> y <strong>${guts} Guts</strong> en ${dist}m.<br/>
      <em>Consejo del Club: Añade +50 STA extra si corres con humor Normal o pista Pesada.</em>
    </p>
  `;
}

// EVENTOS E INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  renderUmaCard("uma1", "card-uma-1", "👑 UMA 1 // ESQUINA VERXINA");
  renderUmaCard("uma2", "card-uma-2", "🔥 UMA 2 // ESQUINA WIN VARIATION");
  runComparison();
  updateStaminaCalc();

  // Delegación de eventos en las tarjetas de Umas
  document.querySelector(".duel-grid").addEventListener("input", e => {
    const slot = e.target.dataset.slot;
    if (!slot) return;
    if (e.target.dataset.stat) {
      state[slot][e.target.dataset.stat] = parseInt(e.target.value, 10) || 100;
      renderUmaCard("uma1", "card-uma-1", "👑 UMA 1 // ESQUINA VERXINA");
      renderUmaCard("uma2", "card-uma-2", "🔥 UMA 2 // ESQUINA WIN VARIATION");
      runComparison();
    }
  });

  document.querySelector(".duel-grid").addEventListener("change", e => {
    const slot = e.target.dataset.slot;
    if (!slot) return;
    if (e.target.classList.contains("preset-select")) {
      const preset = ROSTER_PRESETS[parseInt(e.target.value, 10)];
      state[slot] = { ...preset, skills: [...preset.skills], distApt: "S", surfApt: "A" };
      renderUmaCard("uma1", "card-uma-1", "👑 UMA 1 // ESQUINA VERXINA");
      renderUmaCard("uma2", "card-uma-2", "🔥 UMA 2 // ESQUINA WIN VARIATION");
      runComparison();
    } else if (e.target.dataset.field) {
      state[slot][e.target.dataset.field] = e.target.value;
      runComparison();
    }
  });

  document.querySelector(".duel-grid").addEventListener("click", e => {
    const pill = e.target.closest(".skill-pill");
    if (!pill) return;
    const slot = pill.dataset.slot;
    const skId = pill.dataset.skill;
    const list = state[slot].skills;
    const idx = list.indexOf(skId);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(skId);
    renderUmaCard("uma1", "card-uma-1", "👑 UMA 1 // ESQUINA VERXINA");
    renderUmaCard("uma2", "card-uma-2", "🔥 UMA 2 // ESQUINA WIN VARIATION");
    runComparison();
  });

  // Botón Simular y selectores de pista
  document.getElementById("btn-run-sim").addEventListener("click", runComparison);
  document.getElementById("track-select").addEventListener("change", runComparison);
  document.getElementById("ground-select").addEventListener("change", runComparison);

  // Interacción con el Canvas (Tooltip de metros y velocidad)
  const canvas = document.getElementById("race-canvas");
  const tooltip = document.getElementById("canvas-tooltip");
  canvas.addEventListener("mousemove", e => {
    if (!state.lastTelemetry) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const { clean1, clean2, distance } = state.lastTelemetry;
    const targetDist = ratio * distance;

    const s1 = clean1.samples.find(s => s.pos >= targetDist) || clean1.samples[clean1.samples.length - 1];
    const s2 = clean2.samples.find(s => s.pos >= targetDist) || clean2.samples[clean2.samples.length - 1];

    tooltip.classList.remove("hidden");
    tooltip.innerHTML = `
      <strong>Distancia: ${Math.round(targetDist)}m</strong><br/>
      <span style="color:#00e5ff">Uma 1: ${s1.spd.toFixed(2)} m/s (HP: ${Math.round(s1.hpPct)}%)</span><br/>
      <span style="color:#ff4d6d">Uma 2: ${s2.spd.toFixed(2)} m/s (HP: ${Math.round(s2.hpPct)}%)</span>
    `;
    drawTelemetryCanvas(ratio);
  });

  canvas.addEventListener("mouseleave", () => {
    tooltip.classList.add("hidden");
    drawTelemetryCanvas(null);
  });

  // Pestañas de navegación
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // Calculadora de Stamina
  document.querySelectorAll("#tab-stamina input, #tab-stamina select").forEach(el => {
    el.addEventListener("input", updateStaminaCalc);
  });

  // Exportar / Importar JSON para compartir en el Discord de La Zona
  document.getElementById("btn-export-build").addEventListener("click", () => {
    const code = btoa(encodeURIComponent(JSON.stringify({ uma1: state.uma1, uma2: state.uma2 })));
    navigator.clipboard.writeText(code);
    alert("¡Código del duelo copiado al portapapeles! Pégalo en el Discord de La Zona.");
  });

  document.getElementById("btn-import-build").addEventListener("click", () => {
    const code = prompt("Pega aquí el código del duelo compartido en La Zona:");
    if (!code) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(atob(code.trim())));
      if (parsed.uma1 && parsed.uma2) {
        state.uma1 = parsed.uma1;
        state.uma2 = parsed.uma2;
        renderUmaCard("uma1", "card-uma-1", "👑 UMA 1 // ESQUINA VERXINA");
        renderUmaCard("uma2", "card-uma-2", "🔥 UMA 2 // ESQUINA WIN VARIATION");
        runComparison();
      }
    } catch {
      alert("El código no es válido.");
    }
  });
});