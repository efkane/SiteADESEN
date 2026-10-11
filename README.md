# 🇸🇳 Site Web Officiel — ADESEN Nice

Bienvenue sur le dépôt du site officiel de l'**ADESEN** (Association des Étudiants Sénégalais de Nice) hébergé sur [adesen.fr](https://adesen.fr).

---

## 🚀 Guide de démarrage pour l'équipe

### 1. Cloner le projet
```bash
git clone https://github.com/efkane/SiteADESEN.git
cd SiteADESEN
```

### 2. Tester en local
Ouvrez simplement le fichier `index.html` dans votre navigateur (ou utilisez l'extension **Live Server** sur VS Code).

### 3. Workflow de travail collaboratif
Avant de travailler, récupérez toujours les dernières modifications :
```bash
git pull origin main
```

Une fois vos modifications apportées :
```bash
git add .
git commit -m "Description claire des modifications"
git push origin main
```

> ⚡ **Déploiement Automatique (CI/CD)** :  
> Chaque fois qu'un commit est poussé sur la branche `main`, **Netlify déploie automatiquement** la nouvelle version sur [adesen.fr](https://adesen.fr) en quelques secondes.

---

## 📁 Structure du projet

- `index.html` : Page d'accueil du site
- `evenements.html` : Page des événements et galerie
- `bureau.html` : Présentation du bureau de l'association
- `adherer.html` : Formulaire d'adhésion
- `don.html` : Page de dons
- `contact.html` : Formulaire de contact
- `styles.css` : Feuilles de style globales (responsive, design système ADESEN)
- `app.js` : Scripts interactifs (navigation, compte à rebours, lightbox, etc.)
- `_redirects` : Règles de redirection Netlify pour des URLs propres
