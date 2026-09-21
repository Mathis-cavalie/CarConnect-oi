const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/init-db');
const router = express.Router();

// Login admin
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (!admin) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const isValid = bcrypt.compareSync(password, admin.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        // Créer la session
        req.session.adminId = admin.id;
        req.session.username = admin.username;
        req.session.loggedIn = true;

        res.json({
            success: true,
            message: 'Connexion réussie',
            admin: { id: admin.id, username: admin.username }
        });
    });
});

// Vérifier la session
router.get('/check', (req, res) => {
    if (req.session.loggedIn) {
        res.json({
            loggedIn: true,
            admin: { id: req.session.adminId, username: req.session.username }
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
        res.json({ success: true, message: 'Déconnexion réussie' });
    });
});

module.exports = router;
