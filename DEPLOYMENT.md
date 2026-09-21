# 🚀 Guide de Déploiement — CarConnect OI

## Prérequis

- ✅ Compte GitHub (avec GitHub Student Developer Pack pour avantages gratuits)
- ✅ Compte Render.com (gratuit)
- ✅ Git installé sur ta machine

---

## Étape 1 : GitHub Student Developer Pack

1. **Active ton pack étudiant** : https://education.github.com/students
2. Une fois activé, tu as accès à :
   - GitHub Pages illimité
   - GitHub Actions (CI/CD)
   - Nom de domaine gratuit (.me) pendant 1 an (optionnel)

---

## Étape 2 : Préparer le dépôt GitHub

```bash
cd /home/mathis/SiteWeb-CarConnect

# Initialiser git si pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: CarConnect OI website"

# Ajouter le remote (remplace par ton username)
git remote add origin https://github.com/TON_USERNAME/SiteWeb-CarConnect.git

# Pousser vers GitHub
git push -u origin main
```

---

## Étape 3 : Activer GitHub Pages

1. Va sur https://github.com/TON_USERNAME/SiteWeb-CarConnect
2. Clique sur **Settings** (roue crantée)
3. Menu de gauche : **Pages**
4. **Source** : `Deploy from a branch`
5. **Branch** : `main` / `/ (root)`
6. Clique sur **Save**

Ton frontend sera accessible sur : `https://TON_USERNAME.github.io/SiteWeb-CarConnect/`

---

## Étape 4 : Déployer le Backend sur Render.com

### 4.1 Créer un compte Render

1. Va sur https://render.com
2. Clique sur **Get Started for Free**
3. Choisis **Sign in with GitHub**
4. Autorise l'accès à ton repo `SiteWeb-CarConnect`

### 4.2 Créer le Web Service

1. Clique sur **New +** > **Web Service**
2. Connecte ton repo GitHub `SiteWeb-CarConnect`
3. Remplis les champs :

```
Name: carconnect-oi-backend
Region: Paris (ou le plus proche)
Branch: main
Root Directory: (laisser vide)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

4. Choisis le plan gratuit : **Free**

### 4.3 Variables d'environnement

Clique sur **Advanced** > **Add Environment Variable** :

```
PORT=3000
JWT_SECRET=carconnect_secret_2026_changez_cette_valeur
ADMIN_USERNAME=admin
ADMIN_PASSWORD=CarConnect974!
SESSION_SECRET=session_carconnect_securise_2026
```

⚠️ **Change ces valeurs en production !**

### 4.4 Déployer

Clique sur **Create Web Service**

Attendre le déploiement (5-10 minutes).

Ton backend sera accessible sur : `https://carconnect-oi-backend-xxxx.onrender.com`

---

## Étape 5 : Configurer l'URL du Backend

### 5.1 Noter l'URL du backend

Une fois déployé, Render te donne une URL comme :
```
https://carconnect-oi-backend-abc123.onrender.com
```

### 5.2 Modifier les fichiers frontend

Dans chaque fichier qui utilise l'API, remplace l'URL :

**Fichiers à modifier :**
- `vehicules.html` (ligne ~230)
- `moto.html` (ligne ~230)
- `vehicule-detail.html` (ligne ~280)
- `admin/dashboard.html` (ligne ~350)
- `admin/vehicles.html` (ligne ~280)
- `admin/motos.html` (ligne ~280)
- `admin/vehicle-form.html` (ligne ~560)
- `admin/contacts.html` (ligne ~280)

**Remplacer :**
```javascript
const API_URL = '/api';
```

**Par :**
```javascript
const API_URL = 'https://carconnect-oi-backend-abc123.onrender.com/api';
```

### 5.3 Alternative : Utiliser un fichier de config

Crée un fichier `js/config.js` :

```javascript
window.APP_CONFIG = {
    API_URL: 'https://carconnect-oi-backend-abc123.onrender.com/api'
};
```

Puis dans chaque page :
```html
<script src="js/config.js"></script>
<script src="js/main.js"></script>
```

---

## Étape 6 : Vérifier le déploiement

### Frontend (GitHub Pages)
- [ ] Page d'accueil charge
- [ ] Navigation fonctionne
- [ ] CSS chargé correctement

### Backend (Render)
- [ ] `/api/vehicles` retourne un tableau vide `[]`
- [ ] `/api/auth/check` fonctionne
- [ ] Login admin fonctionne

### Admin
- [ ] Connexion avec `admin` / `CarConnect974!`
- [ ] Dashboard affiche les stats
- [ ] Formulaire d'ajout véhicule fonctionne
- [ ] Upload de photos fonctionne

---

## Étape 7 : Ajouter un véhicule de test

1. Va sur `https://carconnect-oi-backend-xxxx.onrender.com/admin`
2. Connecte-toi
3. Clique sur "Ajouter un véhicule"
4. Remplis le formulaire
5. Upload 2-3 photos
6. Enregistre

Puis vérifie sur :
- `https://TON_USERNAME.github.io/SiteWeb-CarConnect/vehicules.html`

---

## 🆘 Problèmes courants

### ❌ "404 Not Found" sur GitHub Pages

**Solution** : Vérifie que GitHub Pages est activé dans Settings > Pages

### ❌ "CORS Error" dans la console

**Solution** : Le backend doit autoriser le domaine GitHub Pages

Dans `backend/server.js` :
```javascript
app.use(cors({
    origin: ['https://TON_USERNAME.github.io', 'http://localhost:3000'],
    credentials: true
}));
```

### ❌ Backend Render.com se met en veille

Le plan gratuit Render met les apps en veille après 15 min d'inactivité.

**Solutions** :
1. Utilise un service de ping comme https://cron-job.org pour appeler ton API toutes les 10 min
2. Ou upgrade vers le plan payant (~7$/mois)

### ❌ Upload de photos ne fonctionne pas

Vérifie :
1. Le dossier `backend/uploads/vehicles/` existe
2. Les permissions sont correctes sur Render
3. La taille des fichiers < 5MB

---

## 🎉 C'est terminé !

Ton site est maintenant en ligne :

- **Frontend** : https://TON_USERNAME.github.io/SiteWeb-CarConnect/
- **Backend API** : https://carconnect-oi-backend-xxxx.onrender.com/api
- **Admin** : https://carconnect-oi-backend-xxxx.onrender.com/admin

---

## 📚 Ressources utiles

- [GitHub Student Developer Pack](https://education.github.com/students)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Render.com Free Tier](https://render.com/docs/pricing)
- [Deploy Node.js on Render](https://render.com/docs/deploy-node-express-app)
