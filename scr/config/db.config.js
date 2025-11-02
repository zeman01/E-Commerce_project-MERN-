
import mongoose from 'mongoose';
import { MONGO_CONFIG } from '../constants/db.constant.js';

// ! mongo db connection function

export const connectDB =  () => {
    mongoose
    .connect(MONGO_CONFIG.uri, {
        dbName: MONGO_CONFIG.dbName,
        autoCreate: true,
    })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.log('MongoDB connection failed:', error.message);
    }
    )
}