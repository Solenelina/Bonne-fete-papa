/* =====================================================================
   app.js — Moteur du Minitel 3615 PAPA
   ---------------------------------------------------------------------
   Vanilla JS, sans framework. Gère :
   - la séquence de connexion,
   - la navigation (numéro + ENVOI, touches de fonction, clavier),
   - le rendu des rubriques et les mini-jeux,
   - l'accessibilité clavier et le pavé tactile (téléphone).
   ===================================================================== */
"use strict";

(() => {

  /* ============================= OUTILS ============================ */
  const $ = (sel) => document.querySelector(sel);
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Remplace le prénom dans un texte (jeton {PAPA})
  const PRENOM = CONFIG.prenomPapa || "PAPA";

  // Échappe le HTML d'un texte issu des données (sécurité de base)
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // Crée une ligne d'écran
  function L(html = "") { return `<span class="ligne">${html}</span>`; }
  // Ligne vide
  const VIDE = L("&nbsp;");

  /* ============================= DOM =============================== */
  const elZone     = $("#zone");
  const elTitre    = $("#barre-titre");
  const elSaisie   = $("#saisie");
  const elStatut   = $("#barre-statut");
  const elDemarrage= $("#demarrage");
  const elPaveNum  = $("#pave-num");
  const elPaveLet  = $("#pave-lettres");

  // On insère une "invite" (prompt) juste avant la saisie
  const elInvite = document.createElement("span");
  elInvite.className = "invite c-vert";
  elStatut.insertBefore(elInvite, elSaisie);

  /* ============================= ÉTAT ============================== */
  let pageCourante = null;     // objet page actif
  let pile = [];               // historique des id de pages (pour RETOUR)
  let saisie = "";             // ce que tape l'utilisateur
  let photos = [CONFIG.photoExemple]; // photos disponibles pour le taquin

  /* ===================== RENDU DE L'ÉCRAN ========================== */
  function setTitre(t) { elTitre.textContent = t; }
  function setInvite(t) { elInvite.innerHTML = t ? esc(t) + " " : ""; }
  function rendre(html) { elZone.innerHTML = html; }
  function majSaisie() { elSaisie.textContent = saisie; }

  // Effet machine à écrire (désactivé si mouvement réduit)
  function taper(lignes, fin) {
    if (reduit) { rendre(lignes.join("")); if (fin) fin(); return; }
    let i = 0;
    rendre("");
    const tic = () => {
      elZone.innerHTML += lignes[i++];
      if (i < lignes.length) setTimeout(tic, 90);
      else if (fin) fin();
    };
    tic();
  }

  /* ===================== CONFIGURATION DU CLAVIER TACTILE ========== */
  // Construit le pavé numérique une fois pour toutes
  function construirePaveNum() {
    const touches = ["1","2","3","4","5","6","7","8","9","C","0","↵"];
    elPaveNum.innerHTML = "";
    touches.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "touche-num";
      b.textContent = t;
      b.setAttribute("aria-label",
        t === "C" ? "Annulation" : t === "↵" ? "Envoi" : "Chiffre " + t);
      b.addEventListener("click", () => {
        MinitelAudio.clic();
        if (t === "C") return action("annulation");
        if (t === "↵") return action("envoi");
        ajouterCar(t);
      });
      elPaveNum.appendChild(b);
    });
  }

  // Construit le clavier de lettres (pour le Pendu)
  function construirePaveLettres() {
    const lettres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    elPaveLet.innerHTML = "";
    lettres.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "touche-lettre";
      b.textContent = c;
      b.dataset.lettre = c;
      b.addEventListener("click", () => {
        MinitelAudio.clic();
        if (pageCourante && pageCourante.onTouche) pageCourante.onTouche(c);
      });
      elPaveLet.appendChild(b);
    });
  }

  // Active le bon clavier selon le type d'entrée attendu par la page
  function configurerClavier(accepte) {
    if (accepte === "alpha") { elPaveNum.parentElement.style.display = ""; elPaveLet.hidden = false; elPaveNum.style.display = "none"; }
    else if (accepte === "num") { elPaveNum.style.display = ""; elPaveLet.hidden = true; }
    else { elPaveNum.style.display = ""; elPaveLet.hidden = true; }
  }
  function majLettresDispo(trouvees, fautes) {
    [...elPaveLet.children].forEach((b) => {
      const used = trouvees.has(b.dataset.lettre) || fautes.has(b.dataset.lettre);
      b.disabled = used;
    });
  }

  /* ===================== GESTION DE LA SAISIE ===================== */
  function ajouterCar(c) {
    if (!pageCourante) return;
    saisie += c;
    majSaisie();
  }
  function effacer() { saisie = saisie.slice(0, -1); majSaisie(); }
  function razSaisie() { saisie = ""; majSaisie(); }

  /* ===================== NAVIGATION ================================ */
  const PAGES = {};   // rempli plus bas

  function aller(id, sansHistorique) {
    if (!PAGES[id]) return;
    if (!sansHistorique && pageCourante && pageCourante.id && pageCourante.id !== id) {
      pile.push(pageCourante.id);
    }
    razSaisie();
    pageCourante = PAGES[id];
    pageCourante.id = id;
    setTitre(pageCourante.titre || "3615 PAPA");
    setInvite(pageCourante.invite || "");
    configurerClavier(pageCourante.accepte || "num");
    pageCourante.afficher();
    elZone.focus && elZone.setAttribute("tabindex", "-1");
  }

  function retour() {
    // Laisse d'abord la page gérer son propre "retour" (sous-vues)
    if (pageCourante && pageCourante.onRetour && pageCourante.onRetour()) return;
    const id = pile.pop();
    aller(id || "sommaire", true);
  }

  // Point d'entrée des actions (touches de fonction + équivalents)
  function action(nom) {
    switch (nom) {
      case "sommaire":   MinitelAudio.bip(880); pile = []; aller("sommaire", true); break;
      case "retour":     MinitelAudio.bip(660); retour(); break;
      case "suite":      MinitelAudio.bip(990); if (pageCourante && pageCourante.onSuite) pageCourante.onSuite(); break;
      case "annulation": MinitelAudio.bip(440); razSaisie(); break;
      case "envoi":
        MinitelAudio.bip(1320);
        if (pageCourante && pageCourante.onEntree) {
          const ok = pageCourante.onEntree(saisie.trim());
          if (ok !== false) razSaisie();
        }
        break;
    }
  }

  /* ===================== DÉFINITION DES PAGES ===================== */

  /* ---- SOMMAIRE ---- */
  const MENU = [
    ["1", "MESSAGERIE / DÉDICACES", "messagerie"],
    ["2", "QUIZ ANNÉES 80",         "quiz"],
    ["3", "BLAGUES DE PAPA",        "blagues"],
    ["4", "HOROSCOPE DU JOUR",      "horoscope"],
    ["5", "PETITES ANNONCES",       "annonces"],
    ["6", "MÉTÉO & PROGRAMMES TV",  "meteo"],
    ["7", "LE PENDU (jeu)",         "pendu"],
    ["8", "PUZZLE PHOTO (taquin)",  "puzzle"],
    ["9", "C'ÉTAIT EN 1988",        "annee1988"],
    ["10","LE JUSTE PRIX",          "justeprix"]
  ];

  PAGES.sommaire = {
    titre: "3615 PAPA  ★  SOMMAIRE",
    invite: "Votre choix :",
    accepte: "num",
    afficher() {
      const surnom = CONFIG.surnom ? ` (${esc(CONFIG.surnom)})` : "";
      let h = "";
      h += L(`<span class="centre c-jaune">BONNE FÊTE ${esc(PRENOM)}${surnom} !</span>`);
      h += L(`<span class="centre c-blanc">${esc(CONFIG.messageAccueil || "")}</span>`);
      h += VIDE;
      MENU.forEach(([n, t]) => {
        h += L(`<span class="menu-num">${n.padStart(2," ").replace(" ","&nbsp;")}</span> <span class="menu-item">${esc(t)}</span>`);
      });
      h += VIDE;
      h += L(`<span class="c-vert">Tapez un numéro puis ENVOI.</span>`);
      rendre(h);
    },
    onEntree(s) {
      const choix = MENU.find((m) => m[0] === s);
      if (choix) { aller(choix[2]); }
      else { MinitelAudio.erreur(); flashStatut("Code inconnu — réessayez."); }
    }
  };

  function flashStatut(msg) {
    setInvite(msg);
    setTimeout(() => { if (pageCourante) setInvite(pageCourante.invite || ""); }, 1600);
  }

  /* ---- 1. MESSAGERIE / DÉDICACES ---- */
  PAGES.messagerie = {
    titre: "1 ★ MESSAGERIE — DÉDICACES",
    invite: "SUITE = message suivant",
    accepte: "none",
    _i: 0,
    afficher() {
      const d = DATA.dedicaces[this._i % DATA.dedicaces.length];
      let h = VIDE + VIDE;
      h += L(`<span class="centre c-cyan">▼ MESSAGE POUR ${esc(PRENOM)} ▼</span>`);
      h += VIDE;
      h += L(`<span class="centre c-jaune">${esc(d)}</span>`);
      h += VIDE + VIDE;
      h += L(`<span class="centre c-vert">[ ${(this._i % DATA.dedicaces.length) + 1} / ${DATA.dedicaces.length} ]</span>`);
      rendre(h);
    },
    onSuite() { this._i++; this.afficher(); }
  };

  /* ---- 2. QUIZ ---- */
  PAGES.quiz = {
    titre: "2 ★ QUIZ DES ANNÉES 80",
    accepte: "num",
    _i: 0, _score: 0, _phase: "question",
    afficher() {
      this._i = 0; this._score = 0; this._phase = "question";
      this.question();
    },
    question() {
      const q = DATA.quiz[this._i];
      this.invite = "Réponse (1-4) + ENVOI";
      setInvite(this.invite);
      let h = L(`<span class="c-cyan">Question ${this._i + 1}/${DATA.quiz.length}</span>  <span class="c-vert">Score : ${this._score}</span>`);
      h += VIDE + L(`<span class="c-jaune">${esc(q.q)}</span>`) + VIDE;
      q.options.forEach((o, k) => { h += L(`<span class="menu-num">${k + 1}</span> ${esc(o)}`); });
      rendre(h);
    },
    onEntree(s) {
      if (this._phase !== "question") return;
      const n = parseInt(s, 10);
      const q = DATA.quiz[this._i];
      if (!(n >= 1 && n <= q.options.length)) { MinitelAudio.erreur(); flashStatut("Tapez 1, 2, 3 ou 4."); return; }
      const bon = (n - 1) === q.bonne;
      if (bon) { this._score++; MinitelAudio.bip(1760); } else { MinitelAudio.erreur(); }
      this._phase = "reponse";
      this.invite = "SUITE pour continuer";
      setInvite(this.invite);
      let h = VIDE;
      h += L(bon ? `<span class="c-vert">✔ BRAVO, bonne réponse !</span>`
                 : `<span class="c-rouge">�’✗ Raté !</span>`);
      h += L(`<span class="c-jaune">Réponse : ${esc(q.options[q.bonne])}</span>`);
      h += VIDE + L(`<span class="c-vert">Score : ${this._score}/${this._i + 1}</span>`);
      h += VIDE + L(`<span class="c-cyan">→ Touche SUITE pour la suite.</span>`);
      rendre(h);
    },
    onSuite() {
      if (this._phase !== "reponse") return;
      this._i++;
      if (this._i < DATA.quiz.length) { this._phase = "question"; this.question(); }
      else { this.final(); }
    },
    final() {
      this._phase = "fin";
      this.invite = "SOMMAIRE ou RETOUR";
      setInvite(this.invite);
      const n = DATA.quiz.length;
      let msg = this._score === n ? "SANS-FAUTE ! Chapeau, papa !"
        : this._score >= n * 0.6 ? "Belle mémoire des années 80 !"
        : "Il va falloir réviser tes classiques !";
      let h = VIDE + VIDE;
      h += L(`<span class="centre c-jaune">RÉSULTAT FINAL</span>`) + VIDE;
      h += L(`<span class="centre c-cyan">${this._score} / ${n}</span>`) + VIDE;
      h += L(`<span class="centre c-vert">${esc(msg)}</span>`);
      rendre(h);
    }
  };

  /* ---- 3. BLAGUES ---- */
  PAGES.blagues = {
    titre: "3 ★ BLAGUES DE PAPA",
    accepte: "none",
    _i: 0, _revele: false,
    afficher() {
      this._i = Math.floor(Math.random() * DATA.blagues.length);
      this._revele = false; this.dessiner();
    },
    dessiner() {
      const b = DATA.blagues[this._i];
      this.invite = this._revele ? "SUITE = autre blague" : "SUITE = la réponse";
      setInvite(this.invite);
      let h = VIDE;
      h += L(`<span class="c-cyan">Devinette :</span>`) + VIDE;
      h += L(`<span class="c-jaune">${esc(b.q)}</span>`) + VIDE + VIDE;
      if (this._revele) {
        h += L(`<span class="c-vert">${esc(b.r)}</span>`) + VIDE;
        h += L(`<span class="c-cyan">😄 (SUITE pour une autre)</span>`);
      } else {
        h += L(`<span class="c-vert">... appuyez sur SUITE ...</span>`);
      }
      rendre(h);
    },
    onSuite() {
      if (!this._revele) { this._revele = true; MinitelAudio.bip(1320); }
      else { let j; do { j = Math.floor(Math.random() * DATA.blagues.length); } while (j === this._i && DATA.blagues.length > 1); this._i = j; this._revele = false; }
      this.dessiner();
    }
  };

  /* ---- 4. HOROSCOPE ---- */
  PAGES.horoscope = {
    titre: "4 ★ HOROSCOPE DU JOUR",
    accepte: "num",
    _signes: Object.keys(DATA.horoscope),
    _lecture: null,
    afficher() { this._lecture = null; this.liste(); },
    liste() {
      this.invite = "Numéro du signe + ENVOI";
      setInvite(this.invite);
      let h = L(`<span class="c-cyan">Choisissez votre signe :</span>`) + VIDE;
      this._signes.forEach((s, k) => {
        const etoile = (s === CONFIG.signePapa || s === CONFIG.signeEnfant) ? " <span class=\"c-jaune\">★</span>" : "";
        h += L(`<span class="menu-num">${String(k + 1).padStart(2,"0")}</span> <span class="menu-item">${esc(s)}</span>${etoile}`);
      });
      rendre(h);
    },
    onEntree(s) {
      const n = parseInt(s, 10);
      if (!(n >= 1 && n <= this._signes.length)) { MinitelAudio.erreur(); flashStatut("Numéro de 1 à 12."); return; }
      this._lecture = this._signes[n - 1];
      this.afficherSigne();
    },
    afficherSigne() {
      const s = this._lecture;
      this.invite = "RETOUR = liste des signes";
      setInvite(this.invite);
      let h = VIDE;
      h += L(`<span class="inv">${esc(s.toUpperCase())}</span>`) + VIDE;
      h += L(`<span class="c-jaune">${esc(DATA.horoscope[s])}</span>`);
      if (s === CONFIG.signePapa) { h += VIDE + L(`<span class="c-vert">(Et oui : aujourd'hui, c'est TA journée. Bonne fête !)</span>`); }
      rendre(h);
    },
    onRetour() { if (this._lecture) { this._lecture = null; this.liste(); return true; } return false; }
  };

  /* ---- 5. PETITES ANNONCES ---- */
  PAGES.annonces = {
    titre: "5 ★ PETITES ANNONCES",
    invite: "SUITE = annonces suivantes",
    accepte: "none",
    _p: 0, _parPage: 3,
    afficher() { this._p = 0; this.page(); },
    page() {
      const tot = Math.ceil(DATA.annonces.length / this._parPage);
      const deb = (this._p % tot) * this._parPage;
      const lot = DATA.annonces.slice(deb, deb + this._parPage);
      let h = L(`<span class="c-cyan">— RUBRIQUE BONNES AFFAIRES —</span>`) + VIDE;
      lot.forEach((a) => { h += L(`<span class="c-jaune">▸</span> ${esc(a)}`) + VIDE; });
      h += L(`<span class="c-vert centre">[ page ${(this._p % tot) + 1} / ${tot} ]</span>`);
      rendre(h);
    },
    onSuite() { this._p++; this.page(); }
  };

  /* ---- 6. MÉTÉO & TV ---- */
  PAGES.meteo = {
    titre: "6 ★ MÉTÉO & PROGRAMMES TV",
    invite: "SUITE = bascule météo / TV",
    accepte: "none",
    _tv: false,
    afficher() { this._tv = false; this.dessiner(); },
    dessiner() {
      const src = this._tv ? DATA.meteo.tv : DATA.meteo.bulletin;
      let h = VIDE;
      src.forEach((ligne, i) => {
        const cls = i === 0 ? "inv" : (this._tv ? "c-cyan" : "c-jaune");
        h += L(`<span class="${cls}">${esc(ligne)}</span>`);
      });
      h += VIDE + L(`<span class="c-vert">SUITE → ${this._tv ? "revenir à la météo" : "voir les programmes TV"}</span>`);
      rendre(h);
    },
    onSuite() { this._tv = !this._tv; this.dessiner(); }
  };

  /* ---- 7. LE PENDU ---- */
  PAGES.pendu = {
    titre: "7 ★ LE PENDU",
    invite: "Tapez une lettre",
    accepte: "alpha",
    _mot: "", _indice: "", _trouvees: null, _fautes: null, _max: 7, _fini: false,
    afficher() {
      const choix = DATA.penduMots[Math.floor(Math.random() * DATA.penduMots.length)];
      this._mot = choix.mot.toUpperCase();
      this._indice = choix.indice;
      this._trouvees = new Set();
      this._fautes = new Set();
      this._fini = false;
      this.dessiner();
    },
    proposer(c) {
      if (this._fini) return;
      c = c.toUpperCase();
      if (!/^[A-Z]$/.test(c)) return;
      if (this._trouvees.has(c) || this._fautes.has(c)) return;
      if (this._mot.includes(c)) { this._trouvees.add(c); MinitelAudio.bip(1500); }
      else { this._fautes.add(c); MinitelAudio.erreur(); }
      this.dessiner();
    },
    onTouche(c) { this.proposer(c); },
    masque() {
      return this._mot.split("").map((l) => (l === " " ? " " : this._trouvees.has(l) ? l : "_")).join(" ");
    },
    gagne() { return this._mot.split("").every((l) => l === " " || this._trouvees.has(l)); },
    dessiner() {
      const fautes = this._fautes.size;
      const gagne = this.gagne();
      const perdu = fautes >= this._max;
      this._fini = gagne || perdu;
      majLettresDispo(this._trouvees, this._fautes);

      let h = L(`<span class="c-cyan">Indice : ${esc(this._indice)}</span>`) + VIDE;
      h += L(`<span class="c-jaune" style="letter-spacing:2px">${esc(this.masque())}</span>`) + VIDE;
      h += L(`<span class="c-rouge">Erreurs : ${fautes}/${this._max}</span>`
           + `  <span class="c-blanc">${[...this._fautes].join(" ")}</span>`);
      h += dessinPotence(fautes);
      if (gagne) { h += VIDE + L(`<span class="c-vert">★ GAGNÉ ! Bravo champion. SUITE = autre mot.</span>`); MinitelAudio.bip(2000); }
      else if (perdu) { h += VIDE + L(`<span class="c-rouge">PENDU ! Le mot était : ${esc(this._mot)}. SUITE = rejouer.</span>`); }
      else { setInvite("Tapez une lettre"); }
      rendre(h);
    },
    onSuite() { this.afficher(); }
  };

  // Petite potence ASCII selon le nombre d'erreurs (0..7)
  function dessinPotence(n) {
    const etapes = [
      ["  +---+", "  |   |", "      |", "      |", "      |", "========="],
      ["  +---+", "  |   |", "  O   |", "      |", "      |", "========="],
      ["  +---+", "  |   |", "  O   |", "  |   |", "      |", "========="],
      ["  +---+", "  |   |", "  O   |", " /|   |", "      |", "========="],
      ["  +---+", "  |   |", "  O   |", " /|\\  |", "      |", "========="],
      ["  +---+", "  |   |", "  O   |", " /|\\  |", " /    |", "========="],
      ["  +---+", "  |   |", "  O   |", " /|\\  |", " / \\  |", "========="],
      ["  +---+", "  |   |", "  X   |", " /|\\  |", " / \\  |", "========="]
    ];
    const art = etapes[Math.min(n, 7)];
    return VIDE + art.map((l) => L(`<span class="c-vert">${esc(l)}</span>`)).join("");
  }

  /* ---- 8. PUZZLE / TAQUIN ---- */
  PAGES.puzzle = {
    titre: "8 ★ PUZZLE PHOTO",
    invite: "Cliquez/flèches pour glisser",
    accepte: "none",
    _ordre: [], _vide: 8, _image: "", _gagne: false,
    afficher() {
      this._image = photos[Math.floor(Math.random() * photos.length)];
      this._ordre = [0,1,2,3,4,5,6,7,8];
      this._vide = 8; this._gagne = false;
      this.melanger();
      this.dessiner();
    },
    voisins(i) {
      const r = Math.floor(i / 3), c = i % 3, v = [];
      if (r > 0) v.push(i - 3); if (r < 2) v.push(i + 3);
      if (c > 0) v.push(i - 1); if (c < 2) v.push(i + 1);
      return v;
    },
    melanger() {
      // 80 mouvements valides aléatoires depuis l'état résolu => toujours soluble
      for (let k = 0; k < 80; k++) {
        const vois = this.voisins(this._vide);
        const j = vois[Math.floor(Math.random() * vois.length)];
        [this._ordre[this._vide], this._ordre[j]] = [this._ordre[j], this._ordre[this._vide]];
        this._vide = j;
      }
    },
    bouger(i) {
      if (this._gagne) return;
      if (!this.voisins(this._vide).includes(i)) return;
      [this._ordre[this._vide], this._ordre[i]] = [this._ordre[i], this._ordre[this._vide]];
      this._vide = i;
      MinitelAudio.clic();
      this.verifier();
      this.dessiner();
    },
    // flèche : on fait glisser la case située dans la direction donnée
    fleche(dir) {
      const r = Math.floor(this._vide / 3), c = this._vide % 3;
      let i = -1;
      if (dir === "haut"   && r < 2) i = this._vide + 3;
      if (dir === "bas"    && r > 0) i = this._vide - 3;
      if (dir === "gauche" && c < 2) i = this._vide + 1;
      if (dir === "droite" && c > 0) i = this._vide - 1;
      if (i >= 0) this.bouger(i);
    },
    verifier() {
      this._gagne = this._ordre.every((p, idx) => p === idx);
      if (this._gagne) { MinitelAudio.bip(2000); setTimeout(() => MinitelAudio.bip(2400), 120); }
    },
    dessiner() {
      const exemple = this._image === CONFIG.photoExemple;
      let h = L(`<span class="c-cyan">Reconstituez la photo. SUITE = nouvelle photo.</span>`);
      if (exemple) h += L(`<span class="c-vert">(Astuce : ajoutez vos photos dans le dossier images/)</span>`);
      h += `<div class="taquin" id="taquin" role="group" aria-label="Puzzle taquin 3 sur 3">`;
      this._ordre.forEach((piece, idx) => {
        if (this._gagne || piece !== 8) {
          // pièce visible : on positionne la tranche d'image
          const showPiece = this._gagne ? idx : piece; // une fois gagné, image complète
          const row = Math.floor(showPiece / 3), col = showPiece % 3;
          h += `<button class="taquin__case" data-i="${idx}" aria-label="case ${idx + 1}" `
             + `style="background-image:url('${this._image}');background-position:${col * 50}% ${row * 50}%"></button>`;
        } else {
          h += `<button class="taquin__case taquin__case--vide" data-i="${idx}" aria-label="case vide" tabindex="-1"></button>`;
        }
      });
      h += `</div>`;
      if (this._gagne) h += L(`<span class="centre c-jaune">★ BRAVO ! Photo reconstituée ! ★</span>`);
      rendre(h);
      // branchement des clics
      $("#taquin").querySelectorAll(".taquin__case").forEach((b) => {
        b.addEventListener("click", () => this.bouger(parseInt(b.dataset.i, 10)));
      });
    }
  };

  /* ---- 9. C'ÉTAIT EN 1988 ---- */
  PAGES.annee1988 = {
    titre: "9 ★ C'ÉTAIT EN 1988",
    invite: "SUITE = section suivante",
    accepte: "none",
    _i: 0,
    afficher() { this._i = 0; this.dessiner(); },
    dessiner() {
      const sec = DATA.annee1988[this._i % DATA.annee1988.length];
      let h = VIDE + L(`<span class="inv">${esc(sec.titre)}</span>`) + VIDE;
      sec.lignes.forEach((l) => { h += L(`<span class="c-jaune">${esc(l)}</span>`); });
      h += VIDE + L(`<span class="c-vert centre">[ ${(this._i % DATA.annee1988.length) + 1} / ${DATA.annee1988.length} ]</span>`);
      rendre(h);
    },
    onSuite() { this._i++; this.dessiner(); }
  };

  /* ---- 10. LE JUSTE PRIX ---- */
  PAGES.justeprix = {
    titre: "10 ★ LE JUSTE PRIX (en francs)",
    accepte: "num",
    _i: 0, _essais: 0, _fini: false,
    afficher() { this._i = 0; this.nouveau(); },
    nouveau() {
      this._essais = 0; this._fini = false;
      this.invite = "Votre prix (francs) + ENVOI";
      setInvite(this.invite);
      const o = DATA.justeprix[this._i % DATA.justeprix.length];
      let h = L(`<span class="c-cyan">Devinez le prix d'époque :</span>`) + VIDE;
      h += L(`<span class="c-jaune">${esc(o.objet)}</span>`) + VIDE;
      h += L(`<span class="c-vert">Indice : ${esc(o.indice)}</span>`) + VIDE;
      h += L(`<span class="c-blanc">Tapez un montant en francs.</span>`);
      rendre(h);
    },
    onEntree(s) {
      if (this._fini) return;
      const o = DATA.justeprix[this._i % DATA.justeprix.length];
      const prop = parseInt(s, 10);
      if (isNaN(prop)) { MinitelAudio.erreur(); flashStatut("Tapez un nombre."); return; }
      this._essais++;
      let h = L(`<span class="c-jaune">${esc(o.objet)}</span>`) + VIDE;
      h += L(`<span class="c-blanc">Votre prix : ${prop} F — essai ${this._essais}</span>`) + VIDE;
      if (prop === o.prix) {
        this._fini = true; MinitelAudio.bip(2000);
        h += L(`<span class="c-vert">★ EXACT ! C'était bien ${o.prix} F. SUITE = objet suivant.</span>`);
        this.invite = "SUITE = objet suivant"; setInvite(this.invite);
      } else if (Math.abs(prop - o.prix) <= Math.max(2, o.prix * 0.1)) {
        MinitelAudio.bip(1200);
        h += L(`<span class="c-jaune">TOUT PRÈS ! ${prop < o.prix ? "C'est un peu PLUS." : "C'est un peu MOINS."}</span>`);
      } else {
        MinitelAudio.erreur();
        h += L(`<span class="c-rouge">${prop < o.prix ? "C'est PLUS cher !" : "C'est MOINS cher !"}</span>`);
      }
      rendre(h);
    },
    onSuite() { if (this._fini) { this._i++; this.nouveau(); } }
  };

  /* ===================== CLAVIER PHYSIQUE ========================= */
  document.addEventListener("keydown", (e) => {
    if (!pageCourante) return;           // pas avant la connexion
    const k = e.key;
    if (k === "Enter")      { e.preventDefault(); action("envoi"); return; }
    if (k === "Backspace")  { e.preventDefault(); effacer(); return; }
    if (k === "Escape")     { e.preventDefault(); action("annulation"); return; }
    if (k === "Home")       { e.preventDefault(); action("sommaire"); return; }

    const acc = pageCourante.accepte || "num";
    // Flèches : utilisées par le taquin
    if (pageCourante.id === "puzzle" && k.startsWith("Arrow")) {
      e.preventDefault();
      pageCourante.fleche({ ArrowUp: "haut", ArrowDown: "bas", ArrowLeft: "gauche", ArrowRight: "droite" }[k]);
      return;
    }
    if (acc === "num" && /^[0-9]$/.test(k)) { ajouterCar(k); MinitelAudio.clic(); }
    else if (acc === "alpha" && /^[a-zA-Z]$/.test(k)) {
      if (pageCourante.onTouche) pageCourante.onTouche(k.toUpperCase());
    }
  });

  // Touches de fonction (clic souris / tactile)
  document.querySelectorAll(".touche[data-action]").forEach((b) => {
    b.addEventListener("click", () => action(b.dataset.action));
  });

  /* ===================== DÉTECTION DES PHOTOS ===================== */
  function detecterPhotos() {
    const trouvees = [];
    const essais = [];
    for (let i = 1; i <= CONFIG.photosMax; i++) {
      essais.push(new Promise((res) => {
        let e = 0;
        const test = () => {
          if (e >= CONFIG.photosExtensions.length) return res(null);
          const url = `${CONFIG.photosPrefixe}${i}.${CONFIG.photosExtensions[e++]}`;
          const img = new Image();
          img.onload = () => res(url);
          img.onerror = test;
          img.src = url;
        };
        test();
      }));
    }
    Promise.all(essais).then((res) => {
      const ok = res.filter(Boolean);
      if (ok.length) photos = ok;
    });
  }

  /* ===================== SÉQUENCE DE CONNEXION =================== */
  function connecter() {
    elDemarrage.hidden = true;
    MinitelAudio.ensure();
    const duree = MinitelAudio.connexion() || 0;

    setTitre("CONNEXION");
    setInvite("");
    const etapes = reduit
      ? ["CONNEXION...", "CONNECTÉ"]
      : ["NUMÉROTATION 3615...", "RECHERCHE PORTEUSE...", "CONNEXION EN COURS...", "CONNECTÉ — BIENVENUE"];
    let i = 0;
    const pas = reduit ? 350 : Math.max(500, (duree * 1000) / etapes.length);
    rendre(VIDE + VIDE);
    const tic = () => {
      const cls = i === etapes.length - 1 ? "c-jaune" : "c-vert";
      elZone.innerHTML += L(`<span class="${cls}">&gt; ${etapes[i]}</span>`);
      i++;
      if (i < etapes.length) setTimeout(tic, pas);
      else setTimeout(() => aller("sommaire", true), reduit ? 300 : 700);
    };
    tic();
  }

  /* ===================== INITIALISATION ========================== */
  construirePaveNum();
  construirePaveLettres();
  detecterPhotos();
  elDemarrage.addEventListener("click", connecter);

})();
