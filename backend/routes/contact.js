const express = require('express');
const db = require('../database/init-db');
const router = express.Router();

// Envoyer un message de contact
router.post('/', (req, res) => {
    const { nom, email, telephone, sujet, message, type_demande } = req.body;

    if (!nom || !email || !message) {
        return res.status(400).json({ error: 'Nom, email et message sont requis' });
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email invalide' });
    }

    const query = `
        INSERT INTO contacts (nom, email, telephone, sujet, message, type_demande)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [nom, email, telephone || null, sujet || null, message, type_demande || 'general'];

    db.run(query, params, function(err) {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
        }

        // Ici, on pourrait envoyer un email avec nodemailer
        // Pour l'instant, on se contente de stocker en base

        res.json({
            success: true,
            message: 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
        });
    });
});

// Récupérer tous les messages (admin only - à protéger)
router.get('/', (req, res) => {
    // Pour une vraie implémentation, ajouter requireAuth ici
    db.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.json(rows);
    });
});

// Marquer un message comme lu (admin only)
router.put('/:id/read', (req, res) => {
    const { id } = req.params;

    db.run('UPDATE contacts SET lu = 1 WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.json({ success: true });
    });
});

module.exports = router;

module.exports = router;
