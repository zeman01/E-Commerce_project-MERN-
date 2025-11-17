import express from 'express';

// import file upload middleware
import { uploadFile } from '../middlewares/multer.middleware.js';

// import auth controller functions

import { register, login,  } from '../controllers/auth.controller.js';



const router = express.Router();

// use file upload middleware
const uploader = uploadFile("/profile_images");


// resister route
router.post('/register', uploader.single("profile_image"), register);

// login route
router.post('/login', login);

// change Password route

// forget password route



export default router;