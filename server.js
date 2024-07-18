import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import DbConnection from './Database/DbConnection.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'
dotenv.config()
const app = express();
DbConnection()
app.use(bodyParser.json());
app.use(cors())
app.use('/api/user',userRoutes)
const port = process.env.PORT || 4000

app.get('/',(req,res)=>{
    res.send('APP IS WORKING ON THE SERVER')
})


app.listen(port ,() => {
    console.log(`APP IS LISTIEN ON 127.0.0.1:${port}`);
})