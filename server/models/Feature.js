import { model, Schema } from 'mongoose';

const FeatureSchema = new Schema({
    image: String
}, { timestamps: true });

export default model('Feature', FeatureSchema);