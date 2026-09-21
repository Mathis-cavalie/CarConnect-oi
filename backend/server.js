const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Autoriser GitHub Pages, localhost, et Render
        const allowed = [
            'http://localhost:3000',
            'https://carconnect-oi.onrender.com',
            'https://carconnect-oi-backend.onrender.com'
        ];
        
        // Autoriser aussi les domaines GitHub Pages
        if (origin && origin.includes('github.io')) {
            return callback(null, true);
        }
        
        if (allowed.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            console.error('CORS origin not allowed:', origin);
            callback(null, false);
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contact', contactRoutes);

// Route pour servir les pages HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/vehicules.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'vehicules.html'));
});

app.get('/moto.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'moto.html'));
});

app.get('/vehicule/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'vehicule-detail.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'dashboard.html'));
});

app.get('/admin/vehicles', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'vehicles.html'));
});

app.get('/admin/motos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'motos.html'));
});

app.get('/admin/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'contacts.html'));
});

app.get('/admin/vehicle-form', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'vehicle-form.html'));
});

// Gestion d'erreur 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', '404.html'));
});

// Gestion d'erreur globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue' });
});

app.listen(PORT, () => {
    console.log(`🚗 Serveur CarConnect OI démarré sur http://localhost:${PORT}`);
    console.log(`📁 Dossier uploads: ${path.join(__dirname, 'uploads')}`);
});
