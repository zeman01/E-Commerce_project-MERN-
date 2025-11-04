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
