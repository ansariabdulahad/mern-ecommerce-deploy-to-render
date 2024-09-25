import { imageUploadUtil } from "../../helpers/cloudinary.js";
import Product from "../../models/Product.js";

// Handle image upload for admin using cloudinary service
export const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in handleImageUpload',
            error: error.message
        });
    }
}

// add a new product
export const addProduct = async (req, res) => {
    try {

        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;
        const newlyCreatedProduct = new Product({
            image, title, description, category, brand,
            price, salePrice, totalStock
        });

        await newlyCreatedProduct.save();
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in addProduct',
            error: error.message
        });
    }
}

// fetch all products
export const fetchAllProducts = async (req, res) => {
    try {

        const listOfProducts = await Product.find();
        res.status(200).json({
            success: true,
            data: listOfProducts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in fetchAllProducts",
            error: error.message
        });
    }
}

// edit a product
export const editProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const { image, title, description, category, brand, price, salePrice, totalStock } = req.body;

        // first check product is available in db?
        const findProduct = await Product.findById(id);

        if (!findProduct) return res.status(404).json({
            success: false,
            message: 'Product not found'
        });

        // second update product if available
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === '' ? 0 : price || findProduct.price;
        findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock === '' ? 0 : totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;

        await findProduct.save();
        res.status(200).json({
            success: true,
            data: findProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in editProduct",
            error: error.message
        });
    }
}

// delete a product
export const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) return res.status(404).json({
            success: false,
            message: 'Product not found'
        });

        res.status(200).json({
            success: true,
            message: 'Product successfully deleted',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in deleteProduct",
            error: error.message
        });
    }
}