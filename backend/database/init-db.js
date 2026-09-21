const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'carconnect.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Table des administrateurs
    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Table des véhicules (voitures et motos)
    db.run(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('voiture', 'moto')),
            marque TEXT NOT NULL,
            modele TEXT NOT NULL,
            annee INTEGER NOT NULL,
            carburant TEXT,
            boite_vitesses TEXT,
            nombre_portes INTEGER,
            nombre_places INTEGER,
            couleur TEXT,
            kilometrage INTEGER,
            finition TEXT,
            prix REAL NOT NULL,
            description TEXT,
            
            -- Motorisation
            moteur TEXT,
            cylindree TEXT,
            puissance TEXT,
            transmission TEXT,
            
            -- Équipements (JSON)
            equipements TEXT,
            
            -- Entretien
            entretien TEXT,
            
            -- Pneumatiques
            pneumatiques TEXT,
            
            -- Points forts (JSON)
            points_forts TEXT,
            
            -- Images
            images TEXT,
            image_principale TEXT,
            
            -- Statut
            disponible INTEGER DEFAULT 1,
            featured INTEGER DEFAULT 0,
            
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Table des contacts
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            email TEXT NOT NULL,
            telephone TEXT,
            sujet TEXT,
            message TEXT NOT NULL,
            type_demande TEXT,
            lu INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Créer l'admin par défaut
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)
    `);
    
    const passwordHash = bcrypt.hashSync('CarConnect974!', 10);
    stmt.run('admin', passwordHash);
    stmt.finalize();

    console.log('✅ Base de données initialisée avec succès !');
    console.log('📁 Chemin:', dbPath);
});

module.exports = db;
