/* =====================================================================
   config.js — Personnalisation rapide du service 3615 PAPA
   ---------------------------------------------------------------------
   👉  C'est ICI qu'on personnalise le cadeau. Tout est modifiable
       sans toucher au reste du code.
   ===================================================================== */
"use strict";

const CONFIG = {
  /* Le prénom de papa (s'affiche un peu partout). Mets son prénom ici : */
  prenomPapa: "Olivier",

  /* Surnom affectueux facultatif (laisse "" si aucun) */
  surnom: "Oliv",

  /* Petit mot d'accueil affiché sous le titre du Sommaire */
  messageAccueil: "Bonne fête des pères ! Ton terminal est connecté.",

  /* ------------------------------------------------------------------
     PHOTOS DU PUZZLE (taquin)
     Le jeu pioche AU HASARD une photo dans le dossier images/.
     Nomme simplement tes photos :  photo1.jpg, photo2.jpg, photo3.jpg ...
     (jusqu'à 30). Le programme détecte tout seul celles qui existent.
     Formats acceptés : jpg, jpeg, png.
     S'il n'y a aucune photo, un visuel d'exemple est utilisé.
     ------------------------------------------------------------------ */
  photosPrefixe: "images/photo",
  photosMax: 30,
  photosExtensions: ["jpg", "jpeg", "png"],
  photoExemple: "images/exemple.svg"
};
