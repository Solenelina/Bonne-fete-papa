/* =====================================================================
   data.js — Tout le contenu d'époque du 3615 PAPA
   ---------------------------------------------------------------------
   Ambiance fin des années 80 / début 90, pour un papa né en 1970.
   N'hésite pas à modifier, ajouter ou retirer des entrées : c'est fait
   pour ça !
   ===================================================================== */
"use strict";

const DATA = {

  /* ---------------------- 1. QUIZ ANNÉES 80 ------------------------ */
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

  /* ---------------------- 2. C'ÉTAIT EN 1988 ------------------------ */
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

  /* ---------------------- 3. LE JUSTE PRIX ------------------------- */
  /* Prix en FRANCS de l'époque. Le joueur doit deviner. */
  justeprix: [
    { objet: "Une baguette de pain (1988)", prix: 3,   indice: "On arrondit au franc." },
    { objet: "Une place de cinéma (1988)",  prix: 35,  indice: "Pop-corn non inclus." },
    { objet: "Un litre d'essence (1988)",   prix: 5,   indice: "Moins de 10 francs." },
    { objet: "Un Walkman Sony neuf",        prix: 500, indice: "Un sacré budget pour un ado." },
    { objet: "Une R5 GT Turbo neuve",       prix: 75000, indice: "En milliers de francs." },
    { objet: "Un Carambar à l'unité",       prix: 1,   indice: "Le bonheur ne coûtait pas cher." }
  ],

  /* ---------------------- 4. PETITES ANNONCES ----------------------- */
  annonces: [
    "VDS Renault 5 GT Turbo blanche, 1989, 80 000 km, jamais brusquée (ou presque). Faire offre.",
    "RECHERCHE télécommande du magnétoscope, disparue depuis 1991. Récompense : un Carambar.",
    "DONNE conseils non sollicités sur la circulation et les itinéraires. Gratuit, illimité.",
    "RECHERCHE personne pour expliquer pourquoi le magnétoscope clignote 00:00 depuis 30 ans.",
    "ÉCHANGE blagues de papa contre soupirs d'ados. Stock illimité.",
    "VDS Yamaha R1, jamais aussi lente qu'une mise à jour Windows. Entretien fanatique garanti.",
    "RECHERCHE câble USB qui fonctionne du premier coup. Récompense : une tomate de Marmande.",
    "ÉCHANGE vieille tour PC increvable contre une réponse claire à « c'est wifi or not wifi ».",
    "VDS combinaison de moto taille Oliv, encore l'odeur d'asphalte du dernier Grand Prix.",
    "RECHERCHE partenaire de rando capable de tenir le rythme. Essoufflement non remboursé."
  ],

  /* ---------------------- 5. BLAGUES DE PAPA ------------------------ */
  /* Quelques blagues d'humour noir glissées au milieu des classiques. */
  blagues: [
    { q: "Que dit un oignon quand il se cogne ?", r: "Aïe ! (Ail !)" },
    { q: "Quel est le comble pour un électricien ?", r: "De ne pas être au courant." },
    { q: "Pourquoi les plongeurs plongent-ils toujours en arrière ?", r: "Parce que sinon ils tombent dans le bateau." },
    { q: "Pourquoi le corbillard roule-t-il toujours lentement ?", r: "Pour ne pas réveiller les morts." },
    { q: "Qu'est-ce qui est jaune et qui attend ?", r: "Jonathan." },
    { q: "Quel est le sport le plus fruité ?", r: "La boxe : tu prends une pêche, tu tombes dans les pommes." },
    { q: "Monsieur et Madame Térieur ont deux fils. Comment s'appellent-ils ?", r: "Alain et Alex (Alain Térieur et Alex Térieur)." },
    { q: "Quel est le comble pour Dracula ?", r: "Tomber sur un test sanguin négatif." },
    { q: "Que fait une fraise sur un cheval ?", r: "Tagada, tagada !" },
    { q: "Pourquoi la mer est-elle si forte en calcul ?", r: "Parce qu'elle connaît ses tables (de multiplication)… et qu'elle a des bancs." },
    { q: "Quel est le comble pour un jardinier ?", r: "C'est de raconter des salades." },
    { q: "Pourquoi les squelettes ne se battent-ils jamais entre eux ?", r: "Parce qu'ils n'ont pas le cran (ni les tripes)." },
    { q: "Comment appelle-t-on un chat tombé dans un pot de peinture le jour de Noël ?", r: "Un chat-peint de Noël." },
    { q: "Quel est le fromage préféré des superhéros ?", r: "Le fromage qui pète… non : le Comté ! (comte = héros)" },
    { q: "Pourquoi les poissons détestent-ils l'ordinateur ?", r: "Parce qu'ils ont peur du Net." },
    { q: "Comment la Mort fait-elle ses courses ?", r: "Avec une liste... qu'elle raye au fur et à mesure." },
    { q: "Quel est le comble pour un motard geek comme Oliv ?", r: "Rouler à 300 à l'heure... et s'arrêter parce que le wifi ne capte plus." },
    { q: "Pourquoi la tomate de Marmande est-elle si fière ?", r: "Parce qu'elle a vu naître un futur champion (toi, pas Quartararo)." },
    { q: "Comment reconnaît-on un PC qui a trop traîné dans le garage à motos ?", r: "Il a une fiche technique plus longue que celle de la R1." },
    { q: "Quel est le point commun entre Bigard et Jean Lassalle, pour Oliv ?", r: "Les deux peuvent improviser un sketch sans même s'en rendre compte." }
  ],

  /* ---------------------- 6. MESSAGERIE ----------------- */
  dedicaces: [
    "« Au meilleur papa du monde, celui qui sait tout réparer (ou presque). »",
    "« Je souffle (en levant les yeux au ciel) devant tes blagues, mais je t'aime quand même. »",
    "« Tu chantes faux mais je t'aime fort. Signé : ta fille unique (oui, c'est moi ou personne). »",
    "« Merci de m'avoir appris à faire du vélo (et à tomber avec style). »",
    "« 36 15 BISOUS — message reçu 5 sur 5, papa. »",
    "« Les dimanches de GP, tu vis chaque virage de Fabio Quartararo comme si tu étais sur la moto. Bonne fête, champion du fauteuil ! »",
    "« Entre ta R1 et ton dernier gadget high-tech, t'as de la concurrence pour mon cœur. Bonne fête quand même. »",
    "« Merci d'avoir toujours été (et d'être encore) le plus grand hacker que je connaisse : Wii, DS, Wii U, Oculus, des dizaines de jeux PC et autant de films... T'as économisé une fortune à toute la famille ! »",
    "« Avec toutes tes copines, tu pourrais presque faire l'alphabet avec les prénoms... si tu t'en souviens encore tous ! »",
    "« Né pas loin des tomates de Marmande, mais c'est toi le plus mûr de la famille (presque). »",
    "« Je suis hyper contente d'être ta fille, et j'adore tout ce qu'on fait ensemble — même quand on se chamaille un peu. »",
    "« Toujours entre une rando, un coup de main pour quelqu'un et trois projets de plus : on se demande comment tu fais pour tout mener à la fois. »",
    "« Nos meilleurs souvenirs se font sur un festival : vivement Moby à Toulouse et notre prochain Musicalarue ensemble ! »",
    "« Tu m'as élevée comme une battante, et j'en suis fière. Merci pour tout, papa. »"
  ],

  /* ---------------------- 7. PHOTO SOUVENIR ------------------------- */
  /* Chaque photo (photo1.jpg, photo2.jpg...) a SA légende, dans l'ordre :
     la 1ère photo détectée prend legendesPhoto[0], la 2e legendesPhoto[1],
     etc. (et ça boucle si tu as plus de photos que de légendes). Ajoute
     des lignes ici pour donner une légende dédiée à plus de photos. */
  legendesPhoto: [
    "★ Te souviens-tu de ce jour ? ★",
    "Eh beh, il s'en est passé du temps !",
    "J'ai bien grandi, non ?",
    "Wah, ça en fait des souvenirs !",
    "C'est trop mignon !",
    "Regarde-nous, qu'est-ce qu'on a changé !",
    "Un souvenir en or, celui-là.",
    "On dirait hier, et pourtant...",
    "Ce sourire-là, il ne s'oublie pas.",
    "Encore un petit bijou de souvenir."
  ]
};
