

import jwt from 'jsonwebtoken'
import { JWT_CONFIG } from '../config/config.js'


export const generateJWTToken = (payload) => {
    return jwt.sign(payload, JWT_CONFIG.secret, {
        expiresIn:JWT_CONFIG.expiresIn
    })
}

export const verifyJWTToken = (token) => {
    try {
        return jwt.verify(token,)
    } catch (error) {
        
    }
}