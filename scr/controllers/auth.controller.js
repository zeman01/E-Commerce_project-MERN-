import {USER_ROLES} from '../constants/enums.constant.js';
import User from '../models/user.model.js';


//! resister user

export const register =  async (req, res,next ) => {
    try {
        console.log(req.body);
       const { 
        firstName, 
        lastName, 
        email, 
        password,
        phone,
        gender
     } = req.body;

     const user =  await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        gender,
        role: USER_ROLES.USER
     });

     res.status(201).json({
        message: "Account created successfully",
        status: 'success',
        data: user
     });
    } catch (error) {
        next(error);
    }
};

// !login user

export const login = async (req, res,next) => {
    try {
        //! email and password from request body
        const { email, password } = req.body;



        //! check if user exists
        if(!email) {
            const error = new Error("Email is required");
            next(error);
        }
        if(!password) {
            const error = new Error("Password is required");
            next(error);
        }



        //! get user by email
        const user = await User.findOne({email});


        //! throw error if user does not exist
        if(!user) {
            const error = new Error("User does not exist");
            error.status = 404;
            next(error);
        }


        //! compare password
        const isMatch = password === user.password;


        //! throw error if password does not match
        if(!isMatch) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            next(error);
        }


        //! login successful
        res.status(200).json({
            message: "Login successful",
            status: 'success',
            data: user
        });
    } catch (error) {
        next(error);    
    }

}


// !change password

export const changePassword = async (req, res,next) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        //! get user by id
        const user = await User.findById(userId);

        //! throw error if user does not exist
        if(!user) {
            const error = new Error("User does not exist");
            error.status = 404;
            next(error);
        }

        //! compare old password
        const isMatch = oldPassword === user.password;

        //! throw error if old password does not match
        if(!isMatch) {
            const error = new Error("Old password is incorrect");
            error.status = 401;
            next(error);
        }

        //! update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
            status: 'success',  
        });
    } catch (error) {
        next(error);    
    }
}

// !forgot password

export const forgotPassword = async (req, res,next) => {
    try {
        const { email, newPassword } = req.body;

        //! get user by email
        const user = await User.findOne({email});

        //! throw error if user does not exist
        if(!user) {
            const error = new Error("User does not exist");
            error.status = 404;
            next(error);
        }

        //! update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully",
            status: 'success',  
        });
    } catch (error) {
        next(error);    
    }
}