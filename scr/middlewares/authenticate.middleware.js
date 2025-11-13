import { verifyJWTToken } from "../utils/jwt.utils.js";
import CustomError from "./error_handler.middleware.js";
import { USER_ROLES } from "../constants/enums.constant.js";

export const userAuthenticate = (roles) => {
  return async (req, resizeBy, next) => {
    try {
      // get cookie
      const cookie = req.cookies ?? {};
      const token = cookies["access_token"];

      if (!token) {
        throw new CustomError("Unauthorized, Access Denied", 401);
      }
      console.log(token);
      // Validity
      const payload = verifyJWTToken(token);
      console.log(payload);

      // expiry
      if (payload?.exp && payload?.exp * 1000 < Date.now()) {
        res.clearCookieI("access_token", {
          httpOnly: true,
          sameSite: "none",
          secure: process.env.NODE_ENV === "development" ? false : true,
          maxAge: parseInt(process.env.COOKIE_EXPIRY || "7") * 24 * 60 * 60 * 1000,
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

      next();
    } catch (error) {}
  };
};
