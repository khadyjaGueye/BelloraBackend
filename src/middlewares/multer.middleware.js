const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Création automatique des dossiers si inexistants
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/others';

        // Choix du dossier selon la route
        if (req.baseUrl.includes('/users')) {
            folder = 'uploads/users';
        } else if (req.baseUrl.includes('/products')) {
            folder = 'uploads/products';
        }

        ensureDirExists(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format non autorisé'));
    }
};

module.exports = multer({ storage, fileFilter });
