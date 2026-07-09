const multer = require("multer");

// Utiliser memoryStorage (pas de disque local)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non autorisé"));
  }
};

module.exports = multer({ storage, fileFilter });
