import express from 'express';

import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();


// resister route
router.post('/register', register);

// login route
router.post('/login', login);

export default router;