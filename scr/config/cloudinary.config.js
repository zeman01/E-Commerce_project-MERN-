import {v2 as cloudinary} from 'cloudinary';
import { cloudinaryConfig } from './config.js';

cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret
});

export default cloudinary;