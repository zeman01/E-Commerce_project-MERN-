import multer from "multer";

import path from "path";

import fs from "fs";
import CustomError from "./error_handler.middleware.js";

export const uploadFile = (path = "/") => {
  const upload_path = "/uploads" + path;
  const file_size = 1024 * 1024 * 5; // 5MB
  const allowed_extensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".pdf",
    ".svg",
    ".webp",
  ];

  // Create the directory if it doesn’t exist
  if (!fs.existsSync(upload_path)) {
    fs.mkdirSync(upload_path, { recursive: true });
  }
  // create multer upload instance
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, upload_path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  //   file filter
  const fileFilter = (req, file, cb) => {
    const file_ext = path.extname(file.originalname).replace(".", "");
    const is_allowed = allowed_extensions.includes(file_ext);

    if (is_allowed) {
      cb(null, true);
    } else {
      cb(
        new CustomError(
          `${file_ext} format is not allowed. Allowed file types: ${allowed_extensions.join(
            ", "
          )} format are allowed.`,
          400
        )
      );
    }
  };

  // create multer upload storage instance
  const upload = multer({ storage });

  return upload;
};
