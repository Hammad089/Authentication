import UserModel from "../models/usermodel.js";
import  jwt  from "jsonwebtoken";

export const userAuth = async(req,res,next) => {
    let token
    const { authorization} = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1];
            //console.log('token',token);
          //  console.log('AUTHORIZATION',authorization);
            ///verify tokem
            const {UserId} = jwt.verify(token,process.env.JWT_SECRT_KEY)
           // console.log(UserId);
            req.user = await UserModel.findById(UserId).select('-password')
            //console.log(req.user);
            next()
        } catch (error) {
            res.send({
                success:false,
                message:'Unauthorized user'
            })
        }
    }
    if(!token) {
        res.send({
            success:false,
            message:"No token"
        })
    }
}