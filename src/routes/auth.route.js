import express from 'express';

// import file upload middleware
import { uploadFile } from '../middlewares/multer.middleware.js';

// import auth controller functions

import { register, login, logout, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { USER_ROLES } from '../constants/enums.constant.js';



const router = express.Router();

// use file upload middleware
const uploader = uploadFile("/profile_images");


// resister route
router.post('/register', uploader.single("profile_image"), register);

// login route
router.post('/login', login);

// logout route
router.post('/logout', logout);

// change Password route

// forget password route

// user page after login
router.get('/me',authenticate([USER_ROLES.USER, USER_ROLES.ADMIN]), me);


export default router;