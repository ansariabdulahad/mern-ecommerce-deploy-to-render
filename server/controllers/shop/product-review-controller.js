import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import ProductReview from '../../models/Review.js';

export const addProductReview = async (req, res) => {
    try {
        const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

        // only that people will add the review who bought the product
        // first find the product by orderId and productId and check the orderStatus

        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            $or: [
                { orderStatus: 'confirmed' },
                { orderStatus: 'delevired' }
            ]
        });

        if (!order) return res.status(403).json({
            success: false,
            message: "You need to purchase product to review it."
        });

        // check exixsting review of this user if present then it will not be able to add another review
        const checkExistingReview = await ProductReview.findOne({ productId, userId });

        if (checkExistingReview) return res.status(400).json({
            success: false,
            message: "You already reviewed this product"
        });

        // then create a new review
        const newReview = new ProductReview({
            productId, userId, userName, reviewMessage, reviewValue
        });

        await newReview.save();

        // after adding update the avarage review on page
        const reviews = await ProductReview.find({ productId });
        const totalReviewsLength = reviews.length;
        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;

        // update the product schema for the average review
        await Product.findByIdAndUpdate(productId, { averageReview });

        // return the new review
        res.status(201).json({
            success: true,
            data: newReview
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred in addProductReview"
        });
    }
}

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await ProductReview.find({ productId });

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred in getProductReview"
        });
    }
}