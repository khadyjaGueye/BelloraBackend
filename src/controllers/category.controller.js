const categoryService = require('../services/category.service');
const productService = require("../services/product.service");
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
        next(error); // délègue au middleware global
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
        next(error); // délègue au middleware global
    }
}

async function create(req, res) {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Le nom est obligatoire"
            });
        }
        let image = null;
        if (req.file) {
            const fileName =
                `${Date.now()}-${req.file.originalname}`;
            const { data, error } =
                await supabase.storage
                    .from("categories")
                    .upload(
                        fileName,
                        req.file.buffer,
                        {
                            contentType: req.file.mimetype
                        }
                    );

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
            const {
                data: { publicUrl }
            } = supabase.storage
                .from("categories")
                .getPublicUrl(data.path);
            image = publicUrl;
        }
        const result = await categoryService.create({
            name,
            description,
            image
        });
        res.status(201).json({
            data: {
                success: true,
                message: "Catégorie créée avec succès",
                id: result.insertId
            }
        });

    } catch (error) {
        next(error); // délègue au middleware global
    }
}

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
        next(error); // délègue au middleware global
    }
}

async function remove(req, res, next) {
    try {
        const category = await categoryService.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: 'Catégorie introuvable'
                }
            });
        }

        // Vérifier si des produits sont liés à cette catégorie
        const products = await productService.findByCategory(req.params.id);

        if (products.length > 0) {
            return res.status(400).json({
                data: {
                    success: false,
                    message: 'Impossible de supprimer : des produits sont liés à cette catégorie.'
                }
            });
        }

        // Si aucun produit lié, on peut supprimer
        await categoryService.remove(req.params.id);

        return res.status(200).json({
            data: {
                success: true,
                message: 'Catégorie supprimée avec succès'
            }
        });
    } catch (error) {
        next(error); // délègue au middleware global
    }
}


module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};


