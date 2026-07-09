const productService = require("../services/product.service");
const supabase = require("../config/supabase");

async function uploadProductImage(file) {
    const filename =
        `products/${Date.now()}-${file.originalname}`;
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
        res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
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
        res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
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
        res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
    }
}

async function update(req, res) {
    try {
        const oldProduct =
            await productService.findById(req.params.id);
        if (!oldProduct) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: "Produit introuvable"
                }
            });
        }
        let image =
            oldProduct.image;
        if (req.file) {
            image =
                await uploadProductImage(req.file);
        }
        const product =
            await productService.update(
                req.params.id,
                {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    stock: req.body.stock,
                    categoryId: req.body.category_id,
                    image
                }
            );
        res.json({
            data: {
                success: true,
                message: "Produit modifié",
                product: product
            }
        });
    } catch (error) {
        res.status(500).json({
            data: {
                success: false,
                message: error.message
            }
        });
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
        res.status(500).json({
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