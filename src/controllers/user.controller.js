import User from "../models/user.model.js";

export const getAll = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      message: "user fetched",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

//! get by id 
export const getById = async (req, res, next) => {
  try {
    // 
    const {id} = req.params
    
    const user = await User.findById(id)
    
    if (!user) {
      throw new Error('User not found')
    }

    res.status(200).json({
      message: 'User by id',
      data:user
    })

  } catch (error) {
    next(error)
  }
  
}

//! update user profile
export const updateUser = async (req, res, next) => {
  try {
    // 
    const {id} = req.params
    const { first_name, last_name, phone, gender } = req.body
    
    const user = await User.findByIdAndUpdate(id, { first_name, last_name, phone, gender }, { new: true })
    
    if (!user) {
      throw new Error('User not found')
    }

    res.status(200).json({
      message: 'Profile updated',
      data:user
    })

  } catch (error) {
    next(error)
  }
  
}

//! delete user
export const deleteUser = async (req, res, next) => {
  try {
    // 
    const {id} = req.params
    
    const user = await User.findByIdAndDelete(id)
    
    if (!user) {
      throw new Error('User not found')
    }

    res.status(200).json({
      message: 'User deleted',
      data:user
    })

  } catch (error) {
    next(error)
  }
  
}
