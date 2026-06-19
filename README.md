# 3615 PAPA — un Minitel pour la fête des pères 🟦

Un service **Minitel** reconstitué, à ouvrir dans un navigateur, en cadeau de
fête des pères. Boîtier beige, écran cathodique, police pixel, bips de modem…
la madeleine de Proust complète, avec des rubriques pour rigoler et passer du
temps dessus.

## ▶️ Comment l'ouvrir

Le plus simple : **double-clique sur `index.html`**, il s'ouvre dans ton
navigateur. Puis clique sur **« APPUYEZ POUR VOUS CONNECTER »** (le son du
modem ne démarre qu'après ce clic, c'est une règle des navigateurs).

> Astuce : pour que les **photos du puzzle** se chargent sans souci, mieux vaut
> lancer un petit serveur local plutôt que d'ouvrir le fichier directement :
> ```bash
> cd 3615-PAPA
> python3 -m http.server 8000
> # puis ouvre http://localhost:8000 dans ton navigateur
> ```

## 🎛️ Comment ça marche

- **Sommaire** : un menu numéroté. Tape un **numéro** puis **ENVOI**
  (ou la touche **Entrée**) pour entrer dans une rubrique.
- Les **touches de fonction** en bas sont cliquables : Sommaire, Retour,
  Suite, Annulation, **Envoi** (en rouge).
- Sur **téléphone**, un pavé tactile (chiffres, et lettres pour le Pendu)
  apparaît sous l'écran. Tout est aussi jouable au **clavier** sur ordinateur
  (flèches pour le puzzle, lettres pour le pendu, Entrée = Envoi, Échap =
  Annulation, Origine/Home = Sommaire).

## 📺 Les 10 rubriques

1. **Messagerie / Dédicaces** — petits mots pour papa
2. **Quiz années 80** — mémoire des années fastes
3. **Blagues de papa** — devinettes et jeux de mots
4. **Horoscope du jour** — avec un clin d'œil aux signes Lion & Bélier
5. **Petites annonces** — R5 Turbo, Walkman & co
6. **Météo & Programmes TV** — bulletin et grille d'époque
7. **Le Pendu** — jeu de lettres
8. **Puzzle photo (taquin)** — reconstitue une photo de vous
9. **C'était en 1988** — l'année de ses 18 ans
10. **Le Juste Prix** — devine les prix… en francs

## ✏️ Personnaliser (très simple)

Tout est dans **`js/config.js`** :

- `prenomPapa` — mets le prénom de ton papa (par défaut « PAPA »)
- `surnom`, `messageAccueil` — petits mots d'accueil
- `signePapa` / `signeEnfant` — pour les clins d'œil de l'horoscope

Pour changer les blagues, dédicaces, questions du quiz, etc. : tout le texte
est dans **`js/data.js`**, clairement séparé par rubrique.

## 🖼️ Ajouter vos photos au puzzle

Dans le dossier **`images/`**, dépose tes photos nommées `photo1.jpg`,
`photo2.jpg`, … (jusqu'à 30 ; `.jpg`, `.jpeg` ou `.png`). Le jeu les détecte
tout seul et en pioche une au hasard. Détails dans `images/README.txt`.

## 🌐 Mettre en ligne sur GitLab Pages

Le dépôt contient déjà un fichier **`.gitlab-ci.yml`**. Il suffit de :

1. Créer un projet sur GitLab et y pousser ce dossier :
   ```bash
   git remote add origin https://gitlab.com/<ton-compte>/3615-papa.git
   git push -u origin main
   ```
2. GitLab lance automatiquement le déploiement (menu **Build → Pipelines**).
3. L'adresse publique apparaît dans **Deploy → Pages**
   (du type `https://<ton-compte>.gitlab.io/3615-papa/`).

## 🛠️ Détails techniques

- HTML / CSS / **JavaScript vanilla**, aucun framework, aucune dépendance.
- Sons **WebAudio** synthétisés (aucun fichier audio à charger).
- Respecte **`prefers-reduced-motion`** (pas de clignotement ni d'animation
  de frappe si l'utilisateur a activé ce réglage système).
- Accessible au **clavier**, responsive **mobile**.
- Police **VT323** chargée depuis Google Fonts (nécessite une connexion ;
  sinon une police monospace de secours est utilisée).

Bonne fête, papa ! 🎁
