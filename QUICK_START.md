# ⚡ Démarrage Rapide — Déploiement GitHub + Render

## 📋 Checklist en 10 minutes

### 1️⃣ GitHub (3 min)

```bash
cd /home/mathis/SiteWeb-CarConnect

# Modifier .gitignore si besoin
nano .gitignore

# Commit et push
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2️⃣ GitHub Pages (2 min)

1. Va sur https://github.com/TON_USERNAME/SiteWeb-CarConnect/settings/pages
2. **Source** : `Deploy from a branch`
3. **Branch** : `main` / `/ (root)`
4. **Save**

✅ Frontend sera sur : `https://TON_USERNAME.github.io/SiteWeb-CarConnect/`

### 3️⃣ Render.com (5 min)

1. Va sur https://render.com
2. **Sign in with GitHub**
3. **New +** > **Web Service**
4. Connecte le repo `SiteWeb-CarConnect`
5. Remplis :
   - **Name** : `carconnect-oi`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
6. **Add Environment Variables** :
   ```
   PORT=3000
   JWT_SECRET=change_this_secret_123
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=CarConnect974!
   SESSION_SECRET=session_secret_456
   ```
7. **Create Web Service**

✅ Backend sera sur : `https://carconnect-oi-xxxx.onrender.com`

### 4️⃣ Configurer l'URL (1 min)

Édite `js/config.js` :

```javascript
window.APP_CONFIG = {
    API_URL: 'https://carconnect-oi-xxxx.onrender.com/api',  // <-- Mets ton URL Render ici
    DEBUG: false
};
```

Commit et push :

```bash
git add js/config.js
git commit -m "Update API URL for production"
git push origin main
```

---

## ✅ Vérification

- [ ] https://TON_USERNAME.github.io/SiteWeb-CarConnect/ charge
- [ ] https://carconnect-oi-xxxx.onrender.com/api/vehicles retourne `[]`
- [ ] https://carconnect-oi-xxxx.onrender.com/admin fonctionne
- [ ] Login : `admin` / `CarConnect974!`

---

## 🆘 Problèmes ?

**CORS Error** : Ajoute l'URL GitHub Pages dans `backend/server.js` :
```javascript
app.use(cors({
    origin: ['https://TON_USERNAME.github.io'],
    credentials: true
}));
```

**Backend en veille** : Le plan gratuit Render endort les apps après 15min. Utilise https://cron-job.org pour ping toutes les 10min.

---

## 📚 Prochaines étapes

1. Change le mot de passe admin dans `.env` et sur Render
2. Ajoute des véhicules via le dashboard admin
3. Personnalise le logo et les couleurs
4. Ajoute ton nom de domaine (optionnel avec GitHub Student)
