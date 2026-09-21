// Configuration de l'application
// Modifie cette URL après déploiement sur Render.com

window.APP_CONFIG = {
    // URL de base de l'API backend
    // Local: '/api'
    // Production: 'https://votre-app.onrender.com/api'
    API_URL: 'https://carconnect-oi.onrender.com/api',
    
    // Mode debug
    DEBUG: false
};

// Helper pour récupérer l'URL API
window.getApiUrl = function(endpoint) {
    const baseURL = window.APP_CONFIG.API_URL.replace(/\/$/, '');
    return endpoint ? `${baseURL}${endpoint}` : baseURL;
};

// Log la config en mode debug
if (window.APP_CONFIG.DEBUG) {
    console.log('App Config:', window.APP_CONFIG);
}
