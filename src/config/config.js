

export const MONGO_CONFIG = {
    uri: process.env.MONGODB_URI,
    db_name:process.env.DB_NAME
}


export const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
    
}

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
}

// export const NODEMAILER_CONFIG ={

// }