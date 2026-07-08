const userService = require('../services/user.service');

exports.getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Non authentifié." });
  }

  const user = await userService.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
  }

  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { first_name, last_name, phone, address, email } = req.body;
    const image = req.file ? req.file.filename : null;

    const result = await userService.updateProfile(id, {
      first_name,
      last_name,
      phone,
      address,
      email,
      image,
    });

    res.json({ success: true, message: 'Profil mis à jour', user: result.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { old_password, new_password } = req.body;

    const result = await userService.changePassword(id, old_password, new_password);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
