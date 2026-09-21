# 🚗 CarConnect OI — Site Web Automobile

> Site web complet pour CarConnect OI, courtier automobile à La Réunion.

[![GitHub Pages](https://img.shields.io/badge/Frontend-GitHub_Pages-181717?logo=github)](https://github.com/pages)
[![Backend](https://img.shields.io/badge/Backend-Render.com-000000?logo=render)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌐 Démonstration

- **Frontend** : [Votre username].github.io/SiteWeb-CarConnect
- **Backend API** : [votre-app].onrender.com/api
- **Admin** : [votre-app].onrender.com/admin

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│  GitHub Pages │           │   Render.com  │
│   (Frontend)  │           │   (Backend)   │
│               │           │               │
│ - HTML/CSS/JS │◄─────────►│ - Node.js     │
│ - Static      │    API    │ - Express     │
│               │  REST     │ - SQLite      │
└───────────────┘           │ - Admin Panel │
                            └───────────────┘
```

## 📁 Structure du projet

```
SiteWeb-CarConnect/
├── frontend (GitHub Pages)
│   ├── index.html          # Page d'accueil
│   ├── vehicules.html      # Catalogue voitures
│   ├── moto.html           # Catalogue motos
│   ├── vehicule-detail.html
│   ├── vendre.html
│   ├── contact.html
│   ├── css/styles.css
│   └── js/main.js
│
├── backend (Render.com)
│   ├── server.js           # Serveur Express
│   ├── routes/
│   │   ├── auth.js         # Authentification
│   │   ├── vehicles.js     # CRUD véhicules
│   │   └── contact.js      # Formulaire contact
│   ├── database/
│   │   └── init-db.js      # Initialisation SQLite
│   └── uploads/            # Photos véhicules
│
└── admin (Render.com)
    ├── login.html          # Connexion admin
    ├── dashboard.html      # Tableau de bord
    ├── vehicles.html       # Gestion voitures
    ├── motos.html          # Gestion motos
    ├── contacts.html       # Messages
    └── vehicle-form.html   # Formulaire
```

## 🚀 Déploiement

### 1. Frontend — GitHub Pages

```bash
# 1. Pousser le code sur GitHub
git add .
git commit -m "Deploy CarConnect OI"
git push origin main

# 2. Activer GitHub Pages
# Aller sur GitHub > Repo > Settings > Pages
# Source: Deploy from branch main / root
```

### 2. Backend — Render.com

```bash
# 1. Créer un compte sur https://render.com (gratuit avec GitHub Student)

# 2. Créer un "Web Service"
# - Connecter votre repo GitHub
# - Build Command: npm install
# - Start Command: npm start
# - Environment Variables:
#   PORT=3000
#   JWT_SECRET=votre_secret
#   ADMIN_USERNAME=admin
#   ADMIN_PASSWORD=votre_mdp
#   SESSION_SECRET=votre_session_secret

# 3. Déployer !
```

### 3. Configurer l'URL du backend dans le frontend

Modifier toutes les URLs d'API dans les fichiers frontend :

```javascript
// Dans vehicules.html, moto.html, vehicule-detail.html, etc.
const API_URL = 'https://votre-backend.onrender.com/api';
```

## 🛠️ Installation Locale

```bash
# Cloner le repo
git clone https://github.com/votre-username/SiteWeb-CarConnect.git
cd SiteWeb-CarConnect

# Installer dépendances
npm install

# Initialiser la base de données
npm run init-db

# Démarrer le serveur
npm start

# Ou mode développement
npm run dev
```

## 🔑 Accès Admin

- **URL** : `/admin`
- **Username** : `admin`
- **Password** : (celui défini dans `.env`)

## 📊 Fonctionnalités

### Frontend (Public)
- ✅ Page d'accueil avec hero section
- ✅ Catalogue véhicules dynamique
- ✅ Catalogue motos dynamique
- ✅ Page détail véhicule (photos, specs, équipements)
- ✅ Formulaire de contact fonctionnel
- ✅ Design responsive (mobile, tablette, desktop)

### Backend (API)
- ✅ Authentification admin sécurisée
- ✅ CRUD complet véhicules/motos
- ✅ Upload multiple de photos
- ✅ Gestion des messages contact
- ✅ Filtres et recherche

### Admin Dashboard
- ✅ Vue d'ensemble avec statistiques
- ✅ Gestion des véhicules
- ✅ Gestion des motos
- ✅ Gestion des messages (lu/non-lu)
- ✅ Formulaire complet d'ajout/modification

## 🎨 Technologies

| Frontend | Backend |
|----------|---------|
| HTML5, CSS3 | Node.js 18+ |
| JavaScript (ES6+) | Express.js |
| Fetch API | SQLite3 |
| Google Fonts | Multer (upload) |
| SVG Icons | JWT/Sessions |

## 📝 Licence

MIT License — voir [LICENSE](LICENSE)

---

**Développé avec ❤️ pour CarConnect OI — La Réunion**
