const productService = require('../services/product.service');

const fs = require('fs');
const path = require('path');

async function getAll(req, res) {
    try {
        const products =
            await productService.findAll();
        return res.status(200).json({
            data: {
                success: true,
                products: products
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

async function getById(req, res) {
    try {
        const product =
            await productService.findById(
                req.params.id
            );
        if (!product) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: 'Produit introuvable'
                }
            });
        }
        return res.status(200).json({
            data: {
                success: true,
                product: product
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

async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400)
                .json({
                    data: {
                        success: false,
                        message: 'Aucune image'
                    }
                });
        }
        return res.status(200)
            .json({
                data: {
                    success: true,
                    image: req.file.filename,
                    path: `/uploads/products/${req.file.filename}`
                }
            });
    } catch (error) {
        return res.status(500)
            .json({
                data: {
                    success: false,
                    message: error.message
                }
            });
    }
}

async function create(req, res) {
    try {
        const { name, description, price, stock, category_id } = req.body;
        const image =
            req.file
                ? req.file.filename
                : null;

        const result =
            await productService.create({ name, description, price, stock, image, category_id });
        const product =
            await productService.findById(result.insertId);
        return res.status(201).json({
            data: {
                success: true,
                message: "Produit enrégistré avec succé",
                product: product
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

async function update(req, res) {
    try {
        const id = req.params.id;

        const oldProduct = await productService.findById(id);
        if (!oldProduct) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: 'Produit introuvable'
                }
            });
        }
        let image = oldProduct.image;
        if (req.file) {
            if (oldProduct.image) {
                const imagePath = path.join(
                    __dirname,
                    '../../uploads/products',
                    oldProduct.image
                );
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            image = req.file.filename;
        }
        await productService.update(
            id,
            {
                ...req.body,
                image
            }
        );
        const updatedProduct = await productService.findById(id);
        return res.status(200).json({
            data: {
                success: true,
                message: 'Produit modifié avec succès',
                product: updatedProduct
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
        const id = req.params.id;
        const product = await productService.findById(id);
        if (!product) {
            return res.status(404).json({
                data: {
                    success: false,
                    message: 'Produit introuvable'
                }
            });
        }
        if (product.image) {
            const imagePath = path.join(
                __dirname,
                '../../uploads/products',
                product.image
            );
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await productService.remove(id);
        return res.status(200).json({
            data: {
                success: true,
                message: 'Produit supprimé avec succès'
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
    uploadImage,
    create,
    update,
    remove
};