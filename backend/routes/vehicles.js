const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database/init-db');
const router = express.Router();

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/vehicles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'vehicle-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images JPEG, PNG et WebP sont autorisées'));
        }
    }
});

// Middleware pour vérifier l'authentification
const requireAuth = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    next();
};

// Récupérer tous les véhicules (public)
router.get('/', (req, res) => {
    const { type, disponible } = req.query;
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }

    if (disponible !== undefined) {
        query += ' AND disponible = ?';
        params.push(disponible === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        const vehicles = rows.map(row => ({
            ...row,
            equipements: row.equipements ? JSON.parse(row.equipements) : [],
            points_forts: row.points_forts ? JSON.parse(row.points_forts) : [],
            images: row.images ? JSON.parse(row.images) : []
        }));

        res.json(vehicles);
    });
});

// Récupérer un véhicule par ID (public)
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM vehicles WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Erreur DB:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Véhicule non trouvé' });
        }

        const vehicle = {
            ...row,
            equipements: row.equipements ? JSON.parse(row.equipements) : [],
            points_forts: row.points_forts ? JSON.parse(row.points_forts) : [],
            images: row.images ? JSON.parse(row.images) : []
        };

        res.json(vehicle);
    });
});

// Créer un véhicule (admin only)
router.post('/', requireAuth, upload.array('images', 10), (req, res) => {
    try {
        const data = req.body;
        
        // Traiter les images uploadées
        const images = req.files ? req.files.map(f => `/uploads/vehicles/${f.filename}`) : [];
        const imagePrincipale = images[0] || '';

        const equipements = data.equipements ? JSON.parse(data.equipements) : [];
        const pointsForts = data.points_forts ? JSON.parse(data.points_forts) : [];

        const query = `
            INSERT INTO vehicles (
                type, marque, modele, annee, carburant, boite_vitesses,
                nombre_portes, nombre_places, couleur, kilometrage, finition,
                prix, description, moteur, cylindree, puissance, transmission,
                equipements, entretien, pneumatiques, points_forts,
                images, image_principale, disponible, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            data.type, data.marque, data.modele, data.annee, data.carburant, data.boite_vitesses,
            data.nombre_portes, data.nombre_places, data.couleur, data.kilometrage, data.finition,
            data.prix, data.description, data.moteur, data.cylindree, data.puissance, data.transmission,
            JSON.stringify(equipements), data.entretien, data.pneumatiques, JSON.stringify(pointsForts),
            JSON.stringify(images), imagePrincipale, data.disponible ? 1 : 1, data.featured ? 1 : 0
        ];

        db.run(query, params, function(err) {
            if (err) {
                console.error('Erreur DB:', err);
                return res.status(500).json({ error: 'Erreur lors de la création' });
            }

            res.json({
                success: true,
                message: 'Véhicule ajouté avec succès',
                vehicle: {
                    id: this.lastID,
                    ...data,
                    images,
                    imagePrincipale
                }
            });
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la création' });
    }
});

// Modifier un véhicule (admin only)
router.put('/:id', requireAuth, upload.array('images', 10), (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Récupérer les images existantes
        db.get('SELECT images FROM vehicles WHERE id = ?', [id], (err, row) => {
            if (err || !row) {
                return res.status(404).json({ error: 'Véhicule non trouvé' });
            }

            const existingImages = row.images ? JSON.parse(row.images) : [];
            const newImages = req.files ? req.files.map(f => `/uploads/vehicles/${f.filename}`) : [];
            const allImages = [...existingImages, ...newImages];
            const imagePrincipale = data.image_principale || allImages[0] || '';

            const equipements = data.equipements ? JSON.parse(data.equipements) : [];
            const pointsForts = data.points_forts ? JSON.parse(data.points_forts) : [];

            const query = `
                UPDATE vehicles SET
                    type = ?, marque = ?, modele = ?, annee = ?, carburant = ?, boite_vitesses = ?,
                    nombre_portes = ?, nombre_places = ?, couleur = ?, kilometrage = ?, finition = ?,
                    prix = ?, description = ?, moteur = ?, cylindree = ?, puissance = ?, transmission = ?,
                    equipements = ?, entretien = ?, pneumatiques = ?, points_forts = ?,
                    images = ?, image_principale = ?, disponible = ?, featured = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            const params = [
                data.type, data.marque, data.modele, data.annee, data.carburant, data.boite_vitesses,
                data.nombre_portes, data.nombre_places, data.couleur, data.kilometrage, data.finition,
                data.prix, data.description, data.moteur, data.cylindree, data.puissance, data.transmission,
                JSON.stringify(equipements), data.entretien, data.pneumatiques, JSON.stringify(pointsForts),
                JSON.stringify(allImages), imagePrincipale, data.disponible ? 1 : 0, data.featured ? 1 : 0,
                id
            ];

            db.run(query, params, function(err) {
                if (err) {
                    console.error('Erreur DB:', err);
                    return res.status(500).json({ error: 'Erreur lors de la modification' });
                }

                res.json({
                    success: true,
                    message: 'Véhicule modifié avec succès',
                    vehicle: {
                        id: parseInt(id),
                        ...data,
                        images: allImages,
                        imagePrincipale
                    }
                });
            });
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
});

// Supprimer un véhicule (admin only)
router.delete('/:id', requireAuth, (req, res) => {
    const { id } = req.params;

    // Récupérer les images pour les supprimer
    db.get('SELECT images FROM vehicles WHERE id = ?', [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Véhicule non trouvé' });
        }

        const images = row.images ? JSON.parse(row.images) : [];

        db.run('DELETE FROM vehicles WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Erreur DB:', err);
                return res.status(500).json({ error: 'Erreur lors de la suppression' });
            }

            // Supprimer les fichiers images
            images.forEach(imgPath => {
                const fullPath = path.join(__dirname, '..', imgPath);
                fs.unlink(fullPath, (err) => {
                    if (err) console.error('Erreur suppression image:', err);
                });
            });

            res.json({ success: true, message: 'Véhicule supprimé avec succès' });
        });
    });
});

// Supprimer une image spécifique
router.delete('/:id/images/:imageIndex', requireAuth, (req, res) => {
    const { id, imageIndex } = req.params;

    db.get('SELECT images, image_principale FROM vehicles WHERE id = ?', [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Véhicule non trouvé' });
        }

        const images = row.images ? JSON.parse(row.images) : [];
        const imagePrincipale = row.image_principale;

        if (imageIndex >= images.length) {
            return res.status(404).json({ error: 'Image non trouvée' });
        }

        const imageToRemove = images[imageIndex];
        images.splice(imageIndex, 1);

        const newImagePrincipale = imagePrincipale === imageToRemove ? (images[0] || '') : imagePrincipale;

        db.run(
            'UPDATE vehicles SET images = ?, image_principale = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [JSON.stringify(images), newImagePrincipale, id],
            function(err) {
                if (err) {
                    console.error('Erreur DB:', err);
                    return res.status(500).json({ error: 'Erreur lors de la suppression' });
                }

                // Supprimer le fichier
                const fullPath = path.join(__dirname, '..', imageToRemove);
                fs.unlink(fullPath, (err) => {
                    if (err) console.error('Erreur suppression image:', err);
                });

                res.json({ success: true, message: 'Image supprimée' });
            }
        );
    });
});

module.exports = router;
