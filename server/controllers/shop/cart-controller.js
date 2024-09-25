import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

// Add to cart 
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // handle invalid parameters
        if (!userId || !productId || quantity <= 0) return res.status(400).json({
            success: false,
            message: 'Invalid data provided'
        });

        // find product by id
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({
            success: false,
            message: 'Product not found'
        });

        // find cart already present or not if not then create or else increment quantity
        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });

        // find current product is present or not if not then push to cart.items or else increment quantity
        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (findCurrentProductIndex === -1) {
            cart.items.push({ productId, quantity });
        } else {
            cart.items[findCurrentProductIndex].quantity += quantity;
        }

        // finally save cart
        await cart.save();
        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in addToCart'
        });
    }
}

// fetch cart items
export const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({
            success: false,
            message: 'User id is mandatory!'
        });

        // find the cart for the userId and populate the cart object
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image title price salePrice'
        });

        if (!cart) return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });

        // check valid cart item
        const validItems = cart.items.filter(productItem => productItem.productId);
        if (validItems.length < cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        const populateCartItems = validItems.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in fetchCartItems'
        });
    }
}

// Update cart item quantity
export const updateCartItemQty = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) return res.status(400).json({
            success: false,
            message: 'Invalid data provided'
        });

        // find the cart item of userId
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });

        // find current product index to be updated
        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (findCurrentProductIndex === -1) return res.status(404).json({
            success: false,
            message: 'Cart item not present'
        });

        // then update the cart item quantity
        cart.items[findCurrentProductIndex].quantity = quantity;
        await cart.save();

        await cart.populate({
            path: 'items.productId',
            select: 'image title price salePrice'
        });

        const populateCartItems = cart.items.map(item => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : 'Product not found',
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity ? item.quantity : null
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in updateCartItemQty'
        });
    }
}

// delete cart item
export const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (!userId || !productId) return res.status(400).json({
            success: false,
            message: 'Invalid data provided'
        });

        // find cart item
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image title price salePrice'
        });
        if (!cart) return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });

        // filter the product and assing in cart.items
        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
        await cart.save();

        // populate the cart item
        await cart.populate({
            path: 'items.productId',
            select: 'image title price salePrice'
        });

        const populateCartItems = cart.items.map(item => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : 'Product not found',
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity ? item.quantity : null
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred in deleteCartItem'
        });
    }
}