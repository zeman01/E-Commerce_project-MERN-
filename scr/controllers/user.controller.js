import User from '../models/user.model.js';

export const getAll = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            message: "Users fetched successfully",
            status: 'success',
            data: users
        });
    } catch (error) {
        next(error);
    }
};