import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()
const DbConnection = async() => {
    try {
        const DbConn = await mongoose.connect('mongodb://127.0.0.1:27017/user_authentication');
        console.log('DATABASE CONNECTED SUCCESSFULLY');
    } catch (error) {
        console.log('FAILED TO CONNECT DATABASE',error);
    }
}

export default DbConnection
