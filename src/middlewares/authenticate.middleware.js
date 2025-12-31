import { verifyJWTToken } from "../utils/jwt.utils.js";
import CustomError from "./error_handler.middleware.js";
import { USER_ROLES } from "../constants/enums.constant.js";
import User from "../models/user.model.js";

export const authenticate = (roles) => {
  return async (req, res, next) => {
    try {
      // get cookie
      const cookie = req.cookies ?? {};
      const token = cookie["access_token"];

      if (!token) {
        throw new CustomError("Unauthorized, Access Denied", 401);
      }
      console.log(token);
      // Validity
      const payload = verifyJWTToken(token);
      console.log(payload);

      // expiry
      if (payload?.exp && payload?.exp * 1000 < Date.now()) {
        res.clearCookie("access_token", {
          httpOnly: true,
          sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
          secure: process.env.NODE_ENV === "development" ? false : true,
          maxAge: Date.now(),
        });
        throw new CustomError("Unauthorized, Access Denied", 401);
      }
      const user = await User.findOne({
        _id: payload._id,
        email: payload.email,

      });
      console.log(user);

      // roles
      if (!roles.includes(USER_ROLES.ADMIN)) {
        throw new CustomError("Unauthorized, Access Denied", 401);
      }

      // used for authorized user to access their info in req object
      req.user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {}
  };
};
