import User from '../models/user.model.js';
// import  CustomError  from "../middlewares/error_handler.middleware.js";



// get all users
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


// get user by Id
export const getById = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user){
            res.status(404).json({
                message: "User not found",
                data: null,
            });
            return ;
        }
        res.status(200),json({
            data: user,
            message: "User fetched successfully"
        })
    } catch ( error ){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!data) {
      res.status(400).json({
        message: "data expected",
        data: null,
      });
      return;
    }
    //   const userIndex = users.findIndex((user) => user.id.toString() === id);

    const user = await User.findByIdAndUpdate(id, data,{ new: true });
          
      res.status(201).json({
        message: "User updated successfully",
        data: users[userIndex],
      });
    
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};




// ! Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    //! find user by id and update
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    //! if user not found
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "User profile updated successfully"})} catch (error) {
    next(error);
  }}

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // const userIndex = users.findIndex((user) => user.id.toString() === id);
    await User.findByIdAndDelete(id);
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        message: "User not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};