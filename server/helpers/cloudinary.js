import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

// cloudinary configuration
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

// multer configuration storage
const storage = new multer.memoryStorage();

export async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    });

    return result;
}

// use storage in multer
export const upload = multer({ storage });