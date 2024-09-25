import Feature from '../../models/Feature.js';

export const addFeatureImage = async (req, res) => {
    try {
        const { image } = req.body;

        const featureImages = new Feature({ image });
        await featureImages.save();

        res.status(201).json({
            success: true,
            data: featureImages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred in addFeatureImage"
        });
    }
}

export const getFeatureImages = async (req, res) => {
    try {
        const images = await Feature.find({});

        res.status(200).json({
            success: true,
            data: images
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred in getFeatureImages"
        });
    }
}

export const deleteFeatureImage = async (req, res) => {
    try {
        const { id } = req.params;

        await Feature.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Feature image deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred in deleteFeatureImage"
        });
    }
}