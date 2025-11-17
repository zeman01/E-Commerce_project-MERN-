import cloudinary from "../config/cloudinary.config.js";
import CustomError from "../middlewares/error_handler.middleware.js"
import fs from "fs";




export const uploadToCloudinary = async (file, folder = '/ ') => {
    try {

        const folder = 'E-Com' + dir;
        const {public_id, secure_url} = await cloudinary.uploader.upload(file, {
            folder: folder,
            unique_filename: true,
        });

        // delete file after upload
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }

        return { public_id, secure_url };
        
    } catch (error) {
        throw new CustomError("Failed to upload file to Cloudinary", 500);
    }
}




// delete file from cloudinary
export const deleteFile = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw new CustomError("Failed to delete file from Cloudinary", 500);
        
    }
}