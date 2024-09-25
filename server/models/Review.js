import { model, Schema } from 'mongoose';

const ProductReviewSchema = new Schema({
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number
}, { timestamps: true });

export default model('ProductReview', ProductReviewSchema);

// type: Schema.Types.ObjectId,
//         required: true,
//         ref: 'Product'