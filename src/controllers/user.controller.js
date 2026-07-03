const userService = require('../services/user.service');
const db = require('../config/database'); 

exports.getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ data: { success: false, message: "Non authentifié." } });
  }
  // Exemple avec une requête SQL
  const [rows] = await db.query("SELECT id, first_name, last_name, email, phone,address, role, image FROM users WHERE id = ?", [req.user.id]);

  if (rows.length === 0) {
    return res.status(404).json({ data: { success: false, message: "Utilisateur introuvable" } });
  }

  res.json({
    data: {
      success: true,
      user: rows[0]
    }
  });
};


exports.updateProfile = async (req, res) => {
    try {
        const id = req.user.id; // récupéré via authMiddleware
        const { first_name, last_name, phone,address,email } = req.body;
        const image = req.file ? req.file.filename : null;

        const result = await userService.updateProfile(id, {
            first_name,
            last_name,
            phone,
            address,
            image,
            email,
        });

        res.json({
            data: {
                success: true,
                message: 'Profil mis à jour avec succès',
                user: result.user
            }
        });
    } catch (error) {
        res.status(500).json({
            data: {
                success: false,
                message: 'Erreur lors de la mise à jour du profil',
                error: error.message
            }
        });
    }
};

exports.changePassword = async (req, res) => {
  try {
    const id = req.user.id; // récupéré via authMiddleware
    const { old_password, new_password } = req.body;

    const result = await userService.changePassword(id, old_password, new_password);

    if (!result.success) {
      return res.status(400).json({
        data: {
          success: false,
          message: result.message
        }
      });
    }

    res.json({
      data: {
        success: true,
        message: 'Mot de passe modifié avec succès'
      }
    });
  } catch (error) {
    res.status(500).json({
      data: {
        success: false,
        message: 'Erreur lors de la modification du mot de passe',
        error: error.message
      }
    });
  }
};


