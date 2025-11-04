import { USER_ROLES } from "../constants/enums.constant.js";
import User from "../models/user.model.js";
import { hashPassword } from "../utils/bcrypt.utils.js";

// import custom error class
import CustomError from "../middlewares/error_handler.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

//! resister user

export const register = asyncHandler (req, res, next) => {
  try {
    console.log(req.body);

    const hashedPassword = await hashPassword(password); // await hashPassword(password);
    const { firstName, lastName, email, password, phone, gender } = req.body;

    if (!password) {
      throw new CustomError("Password is required" , 400);
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      gender,
      role: USER_ROLES.USER,
    });

    res.status(201).json({
      message: "Account created successfully",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// !login user

export const login = async (req, res, next) => {
  try {
    //! email and password from request body
    const { email, password } = req.body;

    //! check if user exists
    if (!email) {
      // const error = new Error("Email is required");
      // next(error);

      throw new CustomError("Email is required", 400);
    }
    if (!password) {
      // const error = new Error("Password is required");
      // next(error);

      throw new CustomError("Password is required", 400);
    }

    //! get user by email
    const user = await User.findOne({ email });

    //! throw error if user does not exist
    if (!user) {
      // const error = new Error("User does not exist");
      // error.status = 404;
      // next(error);

      throw new CustomError("User does not exist", 404);
    }

    //! compare password
    const isMatch = password === user.password;

    //! throw error if password does not match
    if (!isMatch) {
      // const error = new Error("Invalid credentials");
      // error.status = 401;
      // next(error);

      throw new CustomError("Invalid credentials", 401);
    }

    //! login successful
    res.status(200).json({
      message: "Login successful",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// !change password

export const changePassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    //! get user by id
    const user = await User.findById(userId);

    //! throw error if user does not exist
    if (!user) {
      // const error = new Error("User does not exist");
      // error.status = 404;
      // next(error);

      throw new CustomError("User does not exist", 404);
    }

    //! compare old password
    const isMatch = oldPassword === user.password;

    //! throw error if old password does not match
    if (!isMatch) {
      // const error = new Error("Old password is incorrect");
      // error.status = 401;
      // next(error);

      throw new CustomError("Old password is incorrect", 401);
    }

    //! update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

// !forgot password

export const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    //! get user by email
    const user = await User.findOne({ email });

    //! throw error if user does not exist
    if (!user) {
      // const error = new Error("User does not exist");
      // error.status = 404;
      // next(error);

      throw new CustomError("User does not exist", 404);
    }

    //! update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};
