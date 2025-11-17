import mongoose from 'mongoose';
import {GENDER, USER_ROLES } from '../constants/enums.constant.js';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'user already exists']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLES),
        default: 'USER_ROLE.USER'
    },
    gender: {
        type: String,
        enum: Object.values(GENDER),
        default: GENDER.MALE
    },
    profile_image: {
        type:{
            path: String,
            public_id: String
        }
    },
    phone: {
        type: String
        }
    },{ timestamps: true })


    // creating user model
    const User = mongoose.model('User', userSchema);
    export default User;