import Address from '../../models/Address.js';

export const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pincode, phone, notes } = req.body;

        if (!userId || !address || !city || !pincode || !phone || !notes) return res.status(400).json({
            success: false,
            message: 'Invalid data provided'
        });

        const newlyCreatedAddress = new Address({
            userId, address, city, pincode, phone, notes
        });
        await newlyCreatedAddress.save();

        res.status(201).json({
            success: true,
            data: newlyCreatedAddress
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in addAddress"
        });
    }
}

export const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({
            success: false,
            message: "UserId is required"
        });

        const addressList = await Address.find({ userId });

        res.status(200).json({
            success: true,
            data: addressList
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in fetchAllAddress"
        });
    }
}

export const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const formData = req.body;

        if (!userId || !addressId) return res.status(400).json({
            success: false,
            message: "User id and address id are required"
        });

        const address = await Address.findOneAndUpdate({ _id: addressId, userId }, formData, { new: true });

        if (!address) return res.status(404).json({
            success: false,
            message: "Address not found"
        });

        res.status(200).json({
            success: true,
            data: address
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in editAddress"
        });
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        if (!userId || !addressId) return res.status(400).json({
            success: false,
            message: "User id and address id is required"
        });

        const address = await Address.findOneAndDelete({ _id: addressId, userId });

        if (!address) return res.status(404).json({
            success: false,
            message: "Address not found"
        });

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred in deletingAddress"
        });
    }
}