// import item model
import Item from '../models/item.model.js';

// get all items
export const getAllItems = async (req, res, next) => {
    try {
        const items = await Item.find();

        res.status(200).json({
            message: "Items fetched successfully",
            status: 'success',
            data: items
        });
    } catch (error) {
        next(error);
    }
};

// get items by CATEGORY
export const getItemsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const items = await Item.find({ category });

        res.status(200).json({
            message: `Items in category ${category} fetched successfully`,
            status: 'success',
            data: items
        });
    } catch (error) {
        next(error);
    }
};

// get item by ID
export const getItemById = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findById(itemId);

        if (!item) {
            const error = new Error("Item not found");
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            message: "Item fetched successfully",
            status: 'success',
            data: item
        });
    } catch (error) {
        next(error);
    }
};


        