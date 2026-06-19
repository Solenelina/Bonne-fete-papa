/* =====================================================================
   data.js — Tout le contenu d'époque du 3615 PAPA
   ---------------------------------------------------------------------
   Ambiance fin des années 80 / début 90, pour un papa né en 1970.
   N'hésite pas à modifier, ajouter ou retirer des entrées : c'est fait
   pour ça !
   ===================================================================== */
"use strict";

const DATA = {

  /* ---------------------- 1. MESSAGERIE / DÉDICACES ---------------- */
  dedicaces: [
    "« Au meilleur papa du monde, celui qui sait tout réparer (ou presque). »",
    "« Merci pour les blagues qui font lever les yeux au ciel. On les adore. »",
    "« Pour le roi du barbecue et des bons conseils. Bonne fête papa ! »",
    "« Tu chantes faux mais on t'aime fort. Signé : toute la famille. »",
    "« Champion de la sieste du dimanche, médaille d'or toutes catégories. »",
    "« Merci de m'avoir appris à faire du vélo (et à tomber avec style). »",
    "« 36 15 BISOUS — message reçu 5 sur 5, papa. »",
    "« À celui qui dit 'demande à ta mère' depuis toujours. On t'aime. »"
  ],

  /* ---------------------- 2. QUIZ ANNÉES 80 ------------------------ */
  quiz: [
    { q: "En 1988, qui chante « La Lambada » version tube de l'été ?",
      options: ["Kaoma", "Gold", "Début de Soirée", "Niagara"], bonne: 0 },
    { q: "Quelle console cartonne dans les chaumières fin des années 80 ?",
      options: ["PlayStation", "NES de Nintendo", "Xbox", "Dreamcast"], bonne: 1 },
    { q: "Quelle petite voiture est LA citadine sportive culte de l'époque ?",
      options: ["Renault 5 GT Turbo", "Twingo", "Clio V6", "Smart"], bonne: 0 },
    { q: "Quel dessin animé démarre « Récré A2 » l'après-midi ?",
      options: ["Pokémon", "Goldorak / Candy", "Naruto", "Bob l'éponge"], bonne: 1 },
    { q: "Sur quoi écoute-t-on sa musique en marchant en 1988 ?",
      options: ["iPod", "Walkman à cassette", "Spotify", "MiniDisc"], bonne: 1 },
    { q: "Quel film de Luc Besson sort en 1988 ?",
      options: ["Le Grand Bleu", "Taxi", "Le Cinquième Élément", "Nikita"], bonne: 0 },
    { q: "Quelle émission musicale réunit la famille le samedi soir ?",
      options: ["The Voice", "Champs-Élysées (Drucker)", "Star Academy", "Nouvelle Star"], bonne: 1 },
    { q: "Comment s'appelle l'ancêtre d'Internet bien français ?",
      options: ["Le Minitel", "Le fax", "Le télégramme", "Le bipeur"], bonne: 0 },
    { q: "Quel groupe français chante « Joe le taxi »… euh non, qui chante « Joe le taxi » ?",
      options: ["Vanessa Paradis", "Mylène Farmer", "Jeanne Mas", "Lio"], bonne: 0 },
    { q: "En 1989 tombe un mur célèbre. Lequel ?",
      options: ["Mur de Berlin", "Mur de la honte de Pise", "Muraille de Chine", "Mur du son"], bonne: 0 }
  ],

  /* ---------------------- 3. BLAGUES DE PAPA ----------------------- */
  blagues: [
    { q: "Que dit un oignon quand il se cogne ?", r: "Aïe ! (Ail !)" },
    { q: "Quel est le comble pour un électricien ?", r: "De ne pas être au courant." },
    { q: "Pourquoi les plongeurs plongent-ils toujours en arrière ?", r: "Parce que sinon ils tombent dans le bateau." },
    { q: "Qu'est-ce qui est jaune et qui attend ?", r: "Jonathan." },
    { q: "Quel est le sport le plus fruité ?", r: "La boxe : tu prends une pêche, tu tombes dans les pommes." },
    { q: "Monsieur et Madame Térieur ont deux fils. Comment s'appellent-ils ?", r: "Alain et Alex (Alain Térieur et Alex Térieur)." },
    { q: "Que fait une fraise sur un cheval ?", r: "Tagada, tagada !" },
    { q: "Pourquoi la mer est-elle si forte en calcul ?", r: "Parce qu'elle connaît ses tables (de multiplication)… et qu'elle a des bancs." },
    { q: "Quel est le comble pour un jardinier ?", r: "C'est de raconter des salades." },
    { q: "Comment appelle-t-on un chat tombé dans un pot de peinture le jour de Noël ?", r: "Un chat-peint de Noël." },
    { q: "Quel est le fromage préféré des superhéros ?", r: "Le fromage qui pète… non : le Comté ! (comte = héros)" },
    { q: "Pourquoi les poissons détestent-ils l'ordinateur ?", r: "Parce qu'ils ont peur du Net." }
  ],

  /* ---------------------- 4. HOROSCOPE ----------------------------- */
  /* Un texte par signe. Lion et Bélier reçoivent un clin d'œil. */
  horoscope: {
    "Bélier":      "Énergie débordante aujourd'hui. Vous foncez tête baissée… comme d'habitude. Astuce : un café avant de répondre aux messages.",
    "Taureau":     "Journée gourmande en perspective. Les astres recommandent une deuxième part de gâteau. Qui sommes-nous pour contredire les astres ?",
    "Gémeaux":     "Vous hésitez entre deux idées. Choisissez les deux. Vous changerez d'avis demain de toute façon.",
    "Cancer":      "Nostalgie au programme. Une vieille chanson va vous coller en tête toute la journée. Désolé d'avance.",
    "Lion":        "★ ROI DU JOUR ★ Couronne sur la tête, vous régnez sur le canapé et la télécommande. Personne n'osera contester. Bonne fête, majesté !",
    "Vierge":      "Tout doit être rangé, aligné, étiqueté. Les astres vous laissent tranquille : ils ont trop peur du désordre.",
    "Balance":     "Vous cherchez l'équilibre. Conseil : ni trop de travail, ni trop de sieste. (Surtout pas trop de travail.)",
    "Scorpion":    "Mystérieux comme toujours. Personne ne sait ce que vous mijotez. Vous non plus, d'ailleurs.",
    "Sagittaire":  "Envie d'aventure et de grand air. Mais le canapé est si confortable… L'aventure attendra dimanche prochain.",
    "Capricorne":  "Sérieux et travailleur. Les astres vous autorisent exceptionnellement à faire une bêtise. Profitez-en.",
    "Verseau":     "Idées géniales en cascade. 80 % sont irréalisables, mais les 20 % restants vont épater la galerie.",
    "Poissons":    "Tête dans les nuages. Vous rêvassez si bien que vous avez déjà oublié ce que disait cet horoscope."
  },

  /* ---------------------- 5. PETITES ANNONCES ---------------------- */
  annonces: [
    "VDS Renault 5 GT Turbo blanche, 1989, 80 000 km, jamais brusquée (ou presque). Faire offre.",
    "ÉCHANGE collection complète Panini contre paix dans le foyer. Urgent.",
    "VDS Walkman Sony + 12 cassettes audio enregistrées à la radio (avec le speaker dessus, désolé).",
    "RECHERCHE télécommande du magnétoscope, disparue depuis 1991. Récompense : un Carambar.",
    "VDS platine vinyle + 33 tours années 80, son chaud garanti, craquements offerts.",
    "DONNE conseils non sollicités sur la circulation et les itinéraires. Gratuit, illimité.",
    "VDS combinaison de ski fluo intégrale, taille papa, portée une seule saison (1988).",
    "RECHERCHE personne pour expliquer pourquoi le magnétoscope clignote 00:00 depuis 30 ans.",
    "VDS appareil photo argentique + 3 pellicules non développées (surprise garantie).",
    "ÉCHANGE blagues de papa contre soupirs d'ados. Stock illimité."
  ],

  /* ---------------------- 6. MÉTÉO / PROGRAMMES TV ----------------- */
  meteo: {
    bulletin: [
      "MÉTÉO DU JOUR — Anticyclone des Açores en grande forme.",
      "Matin : soleil franc, idéal pour laver la voiture.",
      "Après-midi : risque élevé de sieste sur la terrasse.",
      "Soirée : douceur, parfait pour un barbecue.",
      "Températures : agréables. Vent : faible. Moral : au beau fixe."
    ],
    tv: [
      "GRILLE TV DE CE SOIR",
      "20h30  ANTENNE 2 ... Champs-Élysées avec M. Drucker",
      "20h35  TF1 ........ Film du dimanche soir",
      "20h30  FR3 ........ Documentaire animalier",
      "22h15  CANAL+ ..... Le journal du cinéma (en clair)",
      "23h00  TOUTES ..... Bonne nuit les petits (enfin, les papas)"
    ]
  },

  /* ---------------------- 7. LE PENDU ------------------------------ */
  penduMots: [
    { mot: "MINITEL",   indice: "L'ancêtre français d'Internet." },
    { mot: "WALKMAN",   indice: "Musique dans les oreilles, cassette dans la poche." },
    { mot: "CASSETTE",  indice: "On la rembobinait avec un crayon." },
    { mot: "BARBECUE",  indice: "Le royaume de papa l'été." },
    { mot: "MOUSTACHE", indice: "Accessoire très en vogue dans les années 80." },
    { mot: "DISQUETTE", indice: "1,44 Mo de pur bonheur." },
    { mot: "CARAMBAR",  indice: "Bonbon caramel et blagues incluses." },
    { mot: "VINYLE",    indice: "Le disque noir qui craque si bien." },
    { mot: "TELECOMMANDE", indice: "Toujours introuvable au bon moment." },
    { mot: "GOLDORAK",  indice: "Robot géant du dessin animé culte." }
  ],

  /* ---------------------- 8. C'ÉTAIT EN 1988 ----------------------- */
  /* L'année des 18 ans de papa. */
  annee1988: [
    { titre: "★ C'ÉTAIT EN 1988 ★", lignes: ["L'année de tes 18 ans. Accroche-toi !"] },
    { titre: "MUSIQUE", lignes: [
      "• « La Lambada » de Kaoma fait danser tout l'été.",
      "• Mylène Farmer, Jean-Jacques Goldman au sommet.",
      "• On enregistre les tubes à la radio sur cassette." ] },
    { titre: "CINÉMA", lignes: [
      "• « Le Grand Bleu » de Luc Besson : carton.",
      "• « Rain Man » triomphe au cinéma.",
      "• La place de ciné coûte environ 35 francs." ] },
    { titre: "VIE QUOTIDIENNE", lignes: [
      "• Le Minitel trône dans de plus en plus de foyers.",
      "• La baguette : environ 3,20 francs.",
      "• L'essence : environ 4,50 francs le litre." ] },
    { titre: "SPORT & MONDE", lignes: [
      "• Jeux Olympiques de Séoul.",
      "• Une certaine effervescence à l'Est…",
      "• …le mur de Berlin tombera l'année suivante (1989)." ] }
  ],

  /* ---------------------- 9. LE JUSTE PRIX ------------------------- */
  /* Prix en FRANCS de l'époque. Le joueur doit deviner. */
  justeprix: [
    { objet: "Une baguette de pain (1988)", prix: 3,   indice: "On arrondit au franc." },
    { objet: "Une place de cinéma (1988)",  prix: 35,  indice: "Pop-corn non inclus." },
    { objet: "Un litre d'essence (1988)",   prix: 5,   indice: "Moins de 10 francs." },
    { objet: "Un Walkman Sony neuf",        prix: 500, indice: "Un sacré budget pour un ado." },
    { objet: "Une R5 GT Turbo neuve",       prix: 75000, indice: "En milliers de francs." },
    { objet: "Un Carambar à l'unité",       prix: 1,   indice: "Le bonheur ne coûtait pas cher." }
  ]
};
