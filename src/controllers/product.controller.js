const productService = require("../services/product.service");
const supabase = require("../config/supabase");
const categoryService = require("../services/category.service");

async function uploadProductImage(file) {
    const filename =
        `${Date.now()}-${file.originalname}`;
    const { error } = await supabase.storage
        .from("products")
        .upload(
            filename,
            file.buffer,
            {
                contentType: file.mimetype
            }
        );
    if (error) {
        throw error;
    }
    const { data } = supabase.storage
        .from("products")
        .getPublicUrl(filename);
    return data.publicUrl;
}

async function getAll(req, res) {
    try {
        const products =
            await productService.findAll();
        res.json({
            data: {
                success: true,
                products: products
            }
        });
    } catch (error) {
        next(error); // délègue au middleware global
    }
}

async function getById(req, res) {
    try {
        const product =
            await productService.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produit introuvable"
            });
        }
        res.json({
            data: {
                success: true,
                product: product,
            }
        });
    } catch (error) {
        next(error); // délègue au middleware global
    }
}

async function create(req, res) {
    try {
        console.log(req.body);
        let image = null;
        if (req.file) {
            image = await uploadProductImage(req.file);
        }
        if (!req.body.price || !req.body.category_id) {
            return res.status(400).json({
                data: {
                    success: false,
                    message: "price et category_id sont obligatoires"
                }
            });
        }
        const product = await productService.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category_id: req.body.category_id,
            image
        });
        res.status(201).json({
            data: {
                success: true,
                message: "Produit enregistré avec succès",
                product
            }
        });
    } catch (error) {
        next(error); // délègue au middleware global
    }
}

async function update(req, res, next) {
    try {
        const oldProduct = await productService.findById(req.params.id);
        if (!oldProduct) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: "Produit introuvable"
                }
            });
        }

        let image = oldProduct.image;
        if (req.file) {
            image = await uploadProductImage(req.file);
        }

        const product = await productService.update(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category_id: req.body.category_id,
            image
        });

        res.json({
            data: {
                success: true,
                message: "Produit modifié",
                product
            }
        });
    } catch (error) {
        next(error); // délègue au middleware global
    }
}


async function remove(req, res) {
    try {
        await productService.remove(req.params.id);
        res.json({
            data: {
                success: true,
                message: "Produit supprimé"
            }
        });
    } catch (error) {
        next(error); // délègue au middleware global
    }
}

async function getByCategory(req, res, next) {
    try {
        const categoryId = req.params.id;
        // Vérifier si la catégorie existe
        const category = await categoryService.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: "Catégorie introuvable"
                }
            });
        }
        // Récupérer les produits liés à cette catégorie
        const products = await productService.findByCategory(categoryId);

        return res.status(200).json({
            data: {
                success: true,
                category: category,
                products: products
            }
        });
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByCategory
};