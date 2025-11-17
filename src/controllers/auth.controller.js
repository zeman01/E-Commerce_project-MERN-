import { USER_ROLES } from "../constants/enums.constant.js";
import USER from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils.js";

// import custom error class
import CustomError from "../middlewares/error_handler.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { sendEmail } from "../utils/nodemailer.utils.js";


//! register user
export const register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, phone, gender } = req.body;
  const image = req.file;
  console.log(image);

  if (!password) {
    throw new CustomError("Password is required", 400);
  }

  const hashedPass = await hashPassword(password);
  const user = new USER({
    first_name,
    last_name,
    email,
    password: hashedPass,
    phone,
    gender,
    role: USER_ROLES.USER,
  });

  if (image) {
    const { path, public_id } = await uploadToCloud(
      image.path,
      "/profile_images"
    );
    user.profile_image = {
      path,
      public_id,
    };
  }

  await user.save();

  res.status(201).json({
    message: "Account created",
    status: "success",
    data: user,
  });
});

//! login
export const login = asyncHandler(async (req, res, next) => {
  //* email pass
  console.log(req.body);
  const { email, password } = req.body;
  if (!email) {
    throw new CustomError("Email is required", 400);
  }
  if (!password) {
    throw new CustomError("password is required", 400);
  }

  //* check/get user by email
  const user = await USER.findOne({ email });
  // throw error if user not found
  if (!user) {
    throw new CustomError("user does not match", 400);
  }
  //* compare password
  const isMatch = await comparePassword(password, user.password);

  //* throw error if pass do not match
  if (!isMatch) {
    throw new CustomError("Credentials does not match", 400);
  }


  await sendEmail()
  //* token
  const token = generateToken({
    id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  });

  //* login success
  res

    //* using cookie
    .cookie("access_token", access_token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: parseInt(process.env.COOKIE_EXPIRY || "7") * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({
      message: "login success",
      data: user,
      access_token,
    });
});

// ! Logout
export const logout = asyncHandler(async (req, res, next) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    })
    .status(200)
    .json({
      message: "Logout successful",
      status: "success",
      data: null,
    });
});

// ! change password
export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  // fetch user
  const user = await USER.findById(userId).select("+password");

  // compare old password
  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    throw new CustomError("Old password is incorrect", 400);
  }

  // hash new password
  const hashedPass = await hashPassword(newPassword);
  user.password = hashedPass;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
    status: "success",
  });
});

// !
