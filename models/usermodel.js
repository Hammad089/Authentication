import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username :{
    type:String,
    required:true,
    unique:true,
    validate :{
        validator:function(value){
            return /^[a-zA-Z0-9_]{5,10}$/.test(value)
        },
        message:props =>`${props.value} is not a valid username it should be between 5 and 10 character long and contain only letters, underscores, or numbers` 
    }
},
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
},{timestamps:true});
const UserModel =  mongoose.model("UserInfo", UserSchema);
export default UserModel
