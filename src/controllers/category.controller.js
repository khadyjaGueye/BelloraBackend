const categoryService = require('../services/category.service');
const { createClient } = require("@supabase/supabase-js");
const prisma = require("../config/prisma");
const ws = require("ws");
const supabase = require("../config/supabase");


async function getAll(req, res) {
    try {
        const categories =
            await categoryService.findAll();
        return res.status(200).json({
            data: {
                status: 200,
                categories: categories
            }
        });

    } catch (error) {

        return res.status(500).json({
            data: {
                status: 500,
                categories: error.message
            }
        });

    }
}

async function getById(req, res) {
    try {
        const category =
            await categoryService.findById(
                req.params.id
            );
        if (!category) {
            return res.status(404).json({
                data: {
                    message: 'Catégorie introuvable'
                }
            });
        }
        res.status(200).json({
            data: {
                category: category,
                status: 200,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;
        let imageUrl = null;

        if (req.file) {
            // Upload vers Supabase Storage
            const fileName = `categories/${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from("categories") // ton bucket Supabase
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (error) throw error;

            // Récupérer l’URL publique
            const { publicURL } = supabase.storage.from("categories").getPublicUrl(data.path);
            imageUrl = publicURL;
        }

        // Enregistrer en base via Prisma
        const category = await prisma.category.create({
            data: {
                name,
                description,
                image: imageUrl,
            },
        });

        res.json({ success: true, category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// async function create(req, res) {
//     try {
//         const { name, description, image } = req.body;
//         if (!name) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Le nom est obligatoire'
//             });
//         }
//         const result =
//             await categoryService.create({
//                 name,
//                 description,
//                 image
//             });
//         res.status(201).json({
//             data: {
//                 success: true,
//                 message: 'Catégorie créée avec succès',
//                 id: result.insertId
//             }
//         });

//     } catch (error) {
//         res.status(500).json({
//             data: {
//                 success: false,
//                 message: error.message
//             }
//         });
//     }
// }

async function update(req, res) {
    try {
        const { name, description, image } = req.body;
        const category =
            await categoryService.findById(
                req.params.id
            );
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Catégorie introuvable'
            });
        }
        await categoryService.update(
            req.params.id,
            {
                name,
                description,
                image
            }
        );
        const updatedCategory =
            await categoryService.findById(
                req.params.id
            );
        return res.status(200).json({
            data: {
                success: true,
                message: 'Catégorie modifiée avec succès',
                category: updatedCategory
            }
        });
    } catch (error) {
        return res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
    }
}

async function remove(req, res) {
    try {
        const category =
            await categoryService.findById(
                req.params.id
            );
        if (!category) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: 'Catégorie introuvable'
                }
            });
        }
        await categoryService.remove(
            req.params.id
        );
        return res.status(200).json({
            data: {
                success: true,
                message: 'Catégorie supprimée avec succès'
            }
        });
    } catch (error) {
        return res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};


