import mongoose from "mongoose";
import UserModel from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer";
import transporter from "../config/emailConfig.js";
export const UserRegistrationController = async(req,res) => {
    const {name,username,email,password} = req.body;
    const user = await UserModel.findOne({email:email});
    if(user){
        res.send({
            success:false,
            message:'User already exist'
        })
    }
    else {
        if(name && username && email && password) {
           try {
            if(password === password) {
                const salt  = await bcrypt.genSaltSync(10);
                const hashPassword = await bcrypt.hash(password,salt)
                const doc = new UserModel({
                    name:name,
                    username:username,
                    email:email,
                    password:hashPassword
                })
                await doc.save()
                const saved_user = await UserModel.findOne({email:email});
                const token = jwt.sign({UserId:saved_user._id},process.env.JWT_SECRT_KEY,{expiresIn:'5m'})
                res.send({
                    success:true,
                    message:'user register successfuly',
                    "token":token,
                  
                })
            }
           } catch (error) {
            console.log('Error',error);
            res.send({
                success:false,
                message:'Unable to register your self'
            })
           }
        }
        else {
            res.send({
                success:false,
                message:'All fields required'
            })
        }
    }
}   
export const loginController = async(req,res) => {
    const {email,password} = req.body;
    try {
        if(email && password) {

            const user = await UserModel.findOne({email:email});
            if(user!=null){
                const isMatchPassword = await bcrypt.compare(password,user.password);
                if(user.email === email && isMatchPassword){
                    const token = jwt.sign({UserId:user._id},process.env.JWT_SECRT_KEY,{expiresIn:'5m'})
                    const refreshToken  = jwt.sign({UserId:user._id},process.env.REFRESHTOKEN,{expiresIn:'5m'})
                    res.send({
                        success:true,
                        message:'User successfully login',
                        "token":token,
                        "refresh_token":refreshToken
                    })
                }
                else {
                    res.send({
                        success:false,
                        message:'Either password or email does not match'
                    })
                }
            }
            else {
                res.send({
                    success:false,
                    message:'user cannot register yourself'
                })
            }
        }
    } catch (error) {
        console.log('Failed to login');
        res.send({
            success:false,
            message:'User failed to login'
        })
    }
}

export const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;
   
    const UserId = req.user._id; 
    

    if (!password || !newPassword) {
        return res.status(400).send({
            success: false,
            message: 'Old password and new password are required'
        });
    }

    try {
        const user = await UserModel.findById(UserId);
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (isMatchPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashPassword;
            await user.save();
            return res.status(200).send({
                success: true,
                message: 'Password changed successfully'
            });
        } else {
            return res.status(401).send({
                success: false,
                message: 'Old password is incorrect'
            });
        }
    } catch (error) {
        console.error('Failed to change password', error);
        return res.status(500).send({
            success: false,
            message: 'User failed to change password'
        });
    }
};

export const loggedUser = async(req,res) => {
    res.send({"user": req.user});
}

export const resetPasswordthrougEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
      const user = await UserModel.findOne({ email: email })
      if (user) {
        const secret = user._id + process.env.JWT_SECRT_KEY
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        console.log(link)
        // Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`
        })
        console.log(info,'indfo');
        res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
      } else {
        res.send({ "status": "failed", "message": "Email doesn't exists" })
      }
    } else {
      res.send({ "status": "failed", "message": "Email Field is Required" })
    }
};