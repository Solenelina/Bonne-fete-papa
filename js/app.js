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

  // On insère une "invite" (prompt) juste avant la saisie
  const elInvite = document.createElement("span");
  elInvite.className = "invite c-vert";
  elStatut.insertBefore(elInvite, elSaisie);

  /* ============================= ÉTAT ============================== */
  let pageCourante = null;     // objet page actif
  let pile = [];               // historique des id de pages (pour RETOUR)
  let saisie = "";             // ce que tape l'utilisateur
  let photos = [CONFIG.photoExemple]; // photos disponibles pour la rubrique Photo souvenir

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

  // Active le bon clavier selon le type d'entrée attendu par la page
  function configurerClavier(accepte) {
    elPaveNum.style.display = "";
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
  // Ordre du moins personnel (culture générale années 80) au plus
  // personnel (la photo souvenir, en tout dernier).
  const MENU = [
    ["1", "QUIZ ANNÉES 80",         "quiz"],
    ["2", "C'ÉTAIT EN 1988",        "annee1988"],
    ["3", "LE JUSTE PRIX",          "justeprix"],
    ["4", "PETITES ANNONCES",       "annonces"],
    ["5", "BLAGUES DE PAPA",        "blagues"],
    ["6", "MESSAGERIE", "messagerie"],
    ["7", "PHOTO SOUVENIR",         "photo"]
  ];

  PAGES.sommaire = {
    titre: "3615 PAPA  ★  SOMMAIRE",
    invite: "Votre choix :",
    accepte: "num",
    afficher() {
      const surnom = CONFIG.surnom ? ` (${esc(CONFIG.surnom)})` : "";
      let h = "";
      h += L(`<span class="centre c-jaune">BONNE FÊTE PAPA !</span>`);
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

  /* ---- 1. QUIZ ---- */
  PAGES.quiz = {
    titre: "1 ★ QUIZ DES ANNÉES 80",
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
      if (!(n >= 1 && n <= q.options.length)) { MinitelAudio.erreur(); flashStatut("Tape 1, 2, 3 ou 4."); return; }
      const bon = (n - 1) === q.bonne;
      if (bon) { this._score++; MinitelAudio.bip(1760); } else { MinitelAudio.erreur(); }
      this._phase = "reponse";
      this.invite = "SUITE pour continuer";
      setInvite(this.invite);
      let h = VIDE;
      h += L(bon ? `<span class="c-vert">✔ BRAVO, bonne réponse !</span>`
                 : `<span class="c-rouge">✗ Raté !</span>`);
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

  /* ---- 2. C'ÉTAIT EN 1988 ---- */
  PAGES.annee1988 = {
    titre: "2 ★ C'ÉTAIT EN 1988",
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

  /* ---- 3. LE JUSTE PRIX ---- */
  PAGES.justeprix = {
    titre: "3 ★ LE JUSTE PRIX (en francs)",
    accepte: "num",
    _i: 0, _essais: 0, _fini: false,
    afficher() { this._i = 0; this.nouveau(); },
    nouveau() {
      this._essais = 0; this._fini = false;
      this.invite = "Ton prix (francs) + ENVOI";
      setInvite(this.invite);
      const o = DATA.justeprix[this._i % DATA.justeprix.length];
      let h = L(`<span class="c-cyan">Devine le prix d'époque :</span>`) + VIDE;
      h += L(`<span class="c-jaune">${esc(o.objet)}</span>`) + VIDE;
      h += L(`<span class="c-vert">Indice : ${esc(o.indice)}</span>`) + VIDE;
      h += L(`<span class="c-blanc">Tape un montant en francs.</span>`);
      rendre(h);
    },
    onEntree(s) {
      if (this._fini) return;
      const o = DATA.justeprix[this._i % DATA.justeprix.length];
      const prop = parseInt(s, 10);
      if (isNaN(prop)) { MinitelAudio.erreur(); flashStatut("Tape un nombre."); return; }
      this._essais++;
      let h = L(`<span class="c-jaune">${esc(o.objet)}</span>`) + VIDE;
      h += L(`<span class="c-blanc">Ton prix : ${prop} F — essai ${this._essais}</span>`) + VIDE;
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

  /* ---- 4. PETITES ANNONCES ---- */
  PAGES.annonces = {
    titre: "4 ★ PETITES ANNONCES",
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

  /* ---- 5. BLAGUES ---- */
  PAGES.blagues = {
    titre: "5 ★ BLAGUES DE PAPA",
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
        h += L(`<span class="c-vert">... appuie sur SUITE ...</span>`);
      }
      rendre(h);
    },
    onSuite() {
      if (!this._revele) { this._revele = true; MinitelAudio.bip(1320); }
      else { let j; do { j = Math.floor(Math.random() * DATA.blagues.length); } while (j === this._i && DATA.blagues.length > 1); this._i = j; this._revele = false; }
      this.dessiner();
    }
  };

  /* ---- 6. MESSAGERIE ---- */
  PAGES.messagerie = {
    titre: "6 ★ MESSAGERIE",
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

  /* ---- 7. PHOTO SOUVENIR ---- */
  PAGES.photo = {
    titre: "7 ★ PHOTO SOUVENIR",
    invite: "Clique sur la photo (ou ENVOI)",
    accepte: "none",
    _image: "", _idx: 0, _phase: "attente",   // attente -> developpement -> fini
    afficher() {
      this._idx = Math.floor(Math.random() * photos.length);
      this._image = photos[this._idx];
      this._phase = "attente";
      this.invite = "Clique sur la photo (ou ENVOI)";
      this.dessiner();
    },
    reveler() {
      if (this._phase !== "attente") return;
      this._phase = "developpement";
      MinitelAudio.tone(140, 0, 0.05, { type: "square", gain: .08 });
      MinitelAudio.tone(90, 0.06, 0.08, { type: "square", gain: .06 });
      this.invite = "";
      setInvite(this.invite);
      const cadre = $("#photo-cadre");
      cadre.querySelector("img").classList.add("polaroid__img--nette");
      cadre.querySelector(".polaroid__flash").classList.add("polaroid__flash--active");
      const statut = $("#photo-statut");
      if (statut) statut.textContent = "Développement en cours...";
      const duree = reduit ? 250 : 4200; // un vrai Polaroid d'époque prend son temps
      setTimeout(() => {
        if (pageCourante !== this) return; // on a changé de page pendant le développement
        this._phase = "fini";
        if (statut) statut.textContent = "★ photo développée ★";
        this.invite = "SUITE = nouvelle photo";
        setInvite(this.invite);
        MinitelAudio.bip(1500);
      }, duree);
    },
    dessiner() {
      const exemple = this._image === CONFIG.photoExemple;
      const legende = DATA.legendesPhoto[this._idx % DATA.legendesPhoto.length];
      let h = L(`<span class="c-cyan">Un souvenir t'attend...</span>`);
      if (exemple) h += L(`<span class="c-vert">(Astuce : ajoute tes photos dans le dossier images/)</span>`);
      h += `<div class="polaroid" id="photo-cadre" role="button" tabindex="-1" aria-label="Prendre la photo">`
         + `<img class="polaroid__img" src="${this._image}" alt="Photo souvenir">`
         + `<span class="polaroid__flash" aria-hidden="true"></span>`
         + `</div>`;
      h += L(`<span class="centre c-jaune">${esc(legende)}</span>`);
      h += L(`<span class="centre c-vert" id="photo-statut">(clique ou ENVOI pour prendre la photo)</span>`);
      rendre(h);
      $("#photo-cadre").addEventListener("click", () => this.reveler());
    },
    onEntree() { this.reveler(); },
    onSuite() { if (this._phase === "fini") this.afficher(); else this.reveler(); }
  };

  /* ===================== CLAVIER PHYSIQUE =========================
     Tout est pilotable au clavier, en complément des touches à l'écran :
       Entrée .............. Envoi
       Suppr (Delete) ...... Retour (page précédente)
       Échap ............... Sommaire (menu principal)
       C ................... Annulation (efface la saisie)
       Effacement (Backspace) .. efface un caractère
       Page suiv. / + / → / ↓ .. Suite
       Page préc. / ← / ↑ ...... Retour */
  document.addEventListener("keydown", (e) => {
    if (!pageCourante) return;           // pas avant la connexion
    const k = e.key;
    const acc = pageCourante.accepte || "num";

    // Si le focus est déjà sur une touche du clavier, on laisse
    // Entrée / Espace l'activer (évite une double action).
    const surTouche = e.target && e.target.closest && e.target.closest(".clavier");
    if (surTouche && (k === "Enter" || k === " ")) return;

    if (k === "Enter")      { e.preventDefault(); action("envoi"); return; }
    if (k === "Delete")     { e.preventDefault(); action("retour"); return; }   // Suppr → Retour
    if (k === "Escape")     { e.preventDefault(); action("sommaire"); return; } // Échap → Sommaire
    if (k === "Home")       { e.preventDefault(); action("sommaire"); return; }
    if (k === "Backspace")  { e.preventDefault(); effacer(); return; }          // efface un caractère
    if (k === "c" || k === "C") { e.preventDefault(); action("annulation"); return; }

    // Suite / Retour au clavier
    if (k === "PageDown" || k === "+" || k === "ArrowRight" || k === "ArrowDown") {
      e.preventDefault(); action("suite"); return;
    }
    if (k === "PageUp" || k === "ArrowLeft" || k === "ArrowUp") {
      e.preventDefault(); action("retour"); return;
    }

    if (acc === "num" && /^[0-9]$/.test(k)) { ajouterCar(k); MinitelAudio.clic(); }
  });

  // Touches de fonction (clic souris / tactile)
  document.querySelectorAll(".touche[data-action]").forEach((b) => {
    b.addEventListener("click", () => action(b.dataset.action));
  });

  // Après un clic sur une touche du clavier (fonction ou pavé numérique), on
  // retire le focus du bouton. Sinon il reste "sélectionné" et un Entrée
  // physique suivant ré-active CE bouton (comportement natif du <button>)
  // au lieu de valider la saisie via Envoi : la rubrique paraît "bloquée".
  $(".clavier").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) b.blur();
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
  detecterPhotos();
  elDemarrage.addEventListener("click", connecter);

})();
