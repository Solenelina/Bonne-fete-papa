# 3615 PAPA — un Minitel pour la fête des pères 🟦

Un service **Minitel** reconstitué, à ouvrir dans un navigateur, en cadeau de
fête des pères. Boîtier beige, écran cathodique, police pixel, bips de modem…
la madeleine de Proust complète, avec des rubriques pour rigoler et passer du
temps dessus.

## ▶️ Comment l'ouvrir

Le plus simple : **double-clique sur `index.html`**, il s'ouvre dans ton
navigateur. Puis clique sur **« APPUYEZ POUR VOUS CONNECTER »** (le son du
modem ne démarre qu'après ce clic, c'est une règle des navigateurs).

> Astuce : pour que les **photos souvenir** se chargent sans souci, mieux vaut
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
- Sur **téléphone**, un pavé tactile (chiffres) apparaît sous l'écran.
  Tout est aussi jouable au **clavier** sur ordinateur (Entrée = Envoi,
  Échap = Annulation, Origine/Home = Sommaire).

## 📺 Les 7 rubriques

Classées du moins personnel (culture générale) au plus personnel (la
photo souvenir, en tout dernier) :

1. **Quiz années 80** — mémoire des années fastes
2. **C'était en 1988** — l'année de ses 18 ans
3. **Le Juste Prix** — devine les prix… en francs
4. **Petites annonces** — R5 Turbo, Walkman & co
5. **Blagues de papa** — devinettes et jeux de mots (avec un peu d'humour noir glissé dedans)
6. **Messagerie / Dédicaces** — petits mots pour papa
7. **Photo souvenir** — un clic façon appareil photo d'époque, et la photo se développe lentement (avec une petite légende qui change chaque fois)

## ✏️ Personnaliser (très simple)

Tout est dans **`js/config.js`** :

- `prenomPapa` — mets le prénom de ton papa (par défaut « PAPA »)
- `surnom`, `messageAccueil` — petits mots d'accueil

Pour changer les blagues, dédicaces, questions du quiz, etc. : tout le texte
est dans **`js/data.js`**, clairement séparé par rubrique.

## 🖼️ Ajouter vos photos souvenir

Dans le dossier **`images/`**, dépose tes photos nommées `photo1.jpg`,
`photo2.jpg`, … (jusqu'à 30 ; `.jpg`, `.jpeg` ou `.png`). Le jeu les détecte
tout seul et en pioche une au hasard. Détails dans `images/README.txt`.

## 🌐 Mettre en ligne sur GitHub Pages

Le dépôt contient déjà un workflow **`.github/workflows/deploy.yml`** qui publie
le site automatiquement. Il suffit de :

1. Créer un dépôt sur GitHub, puis y pousser ce dossier :
   ```bash
   git remote add origin https://github.com/<ton-compte>/3615-papa.git
   git branch -M main
   git push -u origin main
   ```
2. Sur GitHub : **Settings → Pages → Build and deployment → Source : « GitHub Actions »**.
3. À chaque `git push` sur `main`, l'onglet **Actions** déploie le site.
   L'adresse publique s'affiche dans **Settings → Pages**
   (du type `https://<ton-compte>.github.io/3615-papa/`).


## 🛠️ Détails techniques

- HTML / CSS / **JavaScript vanilla**, aucun framework, aucune dépendance.
- Sons **WebAudio** synthétisés (aucun fichier audio à charger).
- Respecte **`prefers-reduced-motion`** (pas de clignotement ni d'animation
  de frappe si l'utilisateur a activé ce réglage système).
- Accessible au **clavier**, responsive **mobile**.
- Police **VT323** chargée depuis Google Fonts (nécessite une connexion ;
  sinon une police monospace de secours est utilisée).

Bonne fête, papa ! 🎁
