const express=require('express')
const dotenv=require('dotenv');
const mdConnection = require('./src/database/dbConnection');
const userRoute=require('./src/routes/userRoute')
const cors=require('cors')


const app=express()
dotenv.config();

app.use(cors({
    origin:"http://localhost:5173" ,
    credentials: true,
   
}));

app.use(express.json());


app.use("/api/user",userRoute)


mdConnection();
const PORT=process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`app is running on ${PORT} port`)

})