import mongoose from "mongoose";
import { CATEGORY } from "../constants/enums.constant";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required']
    },
    description: {
        type: String,
        required: [true, 'Item description is required']
    },
    price: {
        type: Number,
        required: [true, 'Item price is required']
    },
    brand : {
        type : String
    },
    category: {
        type: String,
        enum: Object.value(CATEGORY),
        default: "MISCELLANEOUS"
    },
    stock: {
        type: Number,
        required: [true, 'Item stock is required']
    },
    image: {
        type: {
            path: String,
            public_id: String
        }
    }
}, { timestamps: true })

// creating item model
const Item = mongoose.model('Item', itemSchema);
export default Item;