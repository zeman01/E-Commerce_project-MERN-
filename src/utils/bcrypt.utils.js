import bcrypt from "bcryptjs";

// !hash password
export const hashPassword = async (password) => {
  // hashing logic here
  try {
    const salt = await bcrypt.genSalt(10);
    return  await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
    throw new Error("Error hashing password");
  }
};

// !compare password
export const comparePassword = async (password, hash) => {
  // compare logic here
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Error comparing password");
  }
};
