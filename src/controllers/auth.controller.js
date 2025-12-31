import { USER_ROLES } from "../constants/enums.constant.js";
import CustomError from "../middlewares/error_handler.middleware.js";
import USER from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils.js";
import { uploadToCloud } from "../utils/cloudinary.utils.js";
import { registerSuccessEmail } from "../utils/email.utils.js";
import { generateJWTToken } from "../utils/jwt.utils.js";
import { sendEmail } from "../utils/nodemailer.utils.js";

// register user
export const register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, phone, gender } = req.body;
  const image = req.file;

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

  //* send email
  await sendEmail({
    to: user.email,
    subject: "Account created",
    html: registerSuccessEmail(),
  });

  await user.save();

  res.status(201).json({
    message: "Account created",
    status: "success",
    data: user,
  });
});

// login
export const login = asyncHandler(async (req, res, next) => {
  //!email pass
  const { email, password } = req.body;
  if (!email) {
    throw new CustomError("Email is required", 400);
  }
  if (!password) {
    throw new CustomError("password is required", 400);
  }
  //! check/get user by email
  const user = await USER.findOne({ email });
  // throw error if user not found
  if (!user) {
    throw new CustomError("Credentials does not match", 400);
  }
  //! compare password
  const isMatch = await comparePassword(password, user.password);
  //! throw error if pass do not match
  if (!isMatch) {
    throw new CustomError("Credentials does not match", 400);
  }

  // await sendEmail({
  //   to: user?.email,
  //   subject: "Login Success",
  //   html: "<h1>New Login</h1>",
  // });

  //! token
  const access_token = generateJWTToken({
    _id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  });

  //! login success
  res
    .cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: parseInt(process.env.COOKIE_EXPIRY || "7") * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({
      message: "login success",
      data: user,
      access_token,
    });
});

// logout

export const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    })
    .status(200)
    .json({
      message: "Logged out successfully!!",
      status: "success",
      data: null,
    });
});

// check auth /me
export const me = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await USER.findOne({ _id: id });
  console.log("me ");

  res.status(200).json({
    message: "User Profile fetched",
    data: user,
  });
});

// change password

// forgot password
