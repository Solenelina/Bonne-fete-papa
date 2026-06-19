/* =====================================================================
   audio.js — Sons façon modem en WebAudio
   ---------------------------------------------------------------------
   L'audio est créé/repris UNIQUEMENT après une interaction utilisateur
   (clic sur "SE CONNECTER"), car les navigateurs bloquent le son
   automatique. Tout est synthétisé : aucun fichier son à charger.
   ===================================================================== */
"use strict";

const MinitelAudio = (() => {
  let ctx = null;       // AudioContext (créé au premier geste utilisateur)
  let actif = true;     // l'utilisateur peut couper le son

  /** Crée ou réveille le contexte audio. À appeler depuis un geste utilisateur. */
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;            // navigateur sans WebAudio : on ignore
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /**
   * Joue une fréquence.
   * @param {number} freq  Hz
   * @param {number} start délai (s) avant le début, relatif à maintenant
   * @param {number} dur   durée (s)
   * @param {object} opt   {type, gain}
   */
  function tone(freq, start, dur, opt = {}) {
    if (!ctx || !actif) return;
    const t0 = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opt.type || "square";   // "square" = timbre rétro
    osc.frequency.setValueAtTime(freq, t0);
    const vol = opt.gain != null ? opt.gain : 0.08;
    // petite enveloppe pour éviter les "clics" disgracieux
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  /** Souffle de "porteuse" (bruit blanc filtré) pour imiter le modem. */
  function souffle(start, dur, gain = 0.05) {
    if (!ctx || !actif) return;
    const t0 = ctx.currentTime + start;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    bp.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur);
  }

  /** Petit bip court (validation, navigation). */
  function bip(freq = 1200) {
    if (!ensure()) return;
    tone(freq, 0, 0.06, { gain: 0.06 });
  }

  /** Clic de touche (très court). */
  function clic() {
    if (!ensure()) return;
    tone(2200, 0, 0.02, { gain: 0.04, type: "square" });
  }

  /** Bip d'erreur (deux notes descendantes). */
  function erreur() {
    if (!ensure()) return;
    tone(400, 0, 0.12, { gain: 0.07 });
    tone(220, 0.12, 0.18, { gain: 0.07 });
  }

  /**
   * Séquence de connexion façon modem :
   * tonalité de ligne -> numérotation -> poignée de main -> porteuse.
   * Renvoie la durée totale (s) pour synchroniser le texte à l'écran.
   */
  function connexion() {
    if (!ensure()) return 0;
    let t = 0;
    // 1) tonalité d'invitation à numéroter
    tone(440, t, 0.5, { gain: 0.05, type: "sine" });
    t += 0.6;
    // 2) numérotation "3 6 1 5" facon DTMF (paires de fréquences)
    const dtmf = [[697, 1477], [770, 1209], [697, 1209], [770, 1336]]; // 3,6,1,5 approx
    dtmf.forEach((paire) => {
      tone(paire[0], t, 0.12, { gain: 0.05, type: "sine" });
      tone(paire[1], t, 0.12, { gain: 0.05, type: "sine" });
      t += 0.18;
    });
    t += 0.2;
    // 3) sonnerie / établissement
    tone(1100, t, 0.25, { gain: 0.05, type: "sine" }); t += 0.3;
    // 4) poignée de main : alternance de tons + souffle
    tone(2100, t, 0.3, { gain: 0.05, type: "sine" });
    tone(1300, t + 0.1, 0.35, { gain: 0.04, type: "sine" });
    souffle(t, 0.9, 0.05); t += 0.9;
    tone(1650, t, 0.2, { gain: 0.04, type: "sawtooth" }); t += 0.2;
    // 5) porteuse stable puis accroche
    souffle(t, 0.7, 0.045); t += 0.7;
    bipCourtA(t); t += 0.25;
    return t;
  }

  function bipCourtA(start) { tone(1800, start, 0.12, { gain: 0.06 }); }

  /** Coupe / réactive le son. */
  function setActif(v) { actif = !!v; }
  function estActif() { return actif; }

  return { ensure, bip, clic, erreur, connexion, setActif, estActif, tone };
})();
