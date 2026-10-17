document.addEventListener("DOMContentLoaded", () => {
  // 1. Si estamos en simulador.html
  if (document.getElementById("card-uma-1")) {
    renderUmaCard("uma1", "card-uma-1", "👑 UMA 1 // ESQUINA VERXINA");
    renderUmaCard("uma2", "card-uma-2", "🔥 UMA 2 // ESQUINA WIN VARIATION");
    runComparison();

    const duelGrid = document.querySelector(".duel-grid");
    duelGrid.addEventListener("input", e => {
      const slot = e.target.dataset.slot;
      if (slot && e.target.dataset.stat) {
        state[slot][e.target.dataset.stat] = parseInt(e.target.value, 10) || 100;
        renderUmaCard("uma1", "card-uma-1", "👑 UMA 1 // ESQUINA VERXINA");
        renderUmaCard("uma2", "card-uma-2", "🔥 UMA 2 // ESQUINA WIN VARIATION");
        runComparison();
      }
    });

    duelGrid.addEventListener("change", e => {
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

    duelGrid.addEventListener("click", e => {
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

    document.getElementById("btn-run-sim").addEventListener("click", runComparison);
    document.getElementById("track-select").addEventListener("change", runComparison);
    document.getElementById("ground-select").addEventListener("change", runComparison);

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

    document.getElementById("btn-export-build").addEventListener("click", () => {
      const code = btoa(encodeURIComponent(JSON.stringify({ uma1: state.uma1, uma2: state.uma2 })));
      navigator.clipboard.writeText(code);
      alert("¡Código del duelo copiado al portapapeles!");
    });

    document.getElementById("btn-import-build").addEventListener("click", () => {
      const code = prompt("Pega aquí el código del duelo:");
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
  }

  // 2. Si estamos en stamina.html
  if (document.getElementById("stamina-result-box")) {
    updateStaminaCalc();
    document.querySelectorAll(".stamina-inputs input, .stamina-inputs select").forEach(el => {
      el.addEventListener("input", updateStaminaCalc);
    });
  }
});
