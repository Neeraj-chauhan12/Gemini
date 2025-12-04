const express=require('express')
const dotenv=require('dotenv');
const mdConnection = require('./src/database/dbConnection');
const userRoute=require('./src/routes/userRoute')
const chatRoute=require('./src/routes/chatRoute')
const cors=require('cors')
const cookieParser=require('cookie-parser')


const app=express()
dotenv.config();


const allowedOrgin=[
    "http://localhost:5173",
    "https://chatt123.netlify.app",
    "https://chatt12.netlify.app"

]
app.use(cors({
    origin:allowedOrgin,
    methods:["GET","POST","PUT","DELETE"],
    credentials: true,
   
}));

app.use(express.json());
app.use(cookieParser())


app.use("/api/user",userRoute)
app.use('/api/chat', chatRoute)


mdConnection();
const PORT=process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`app is running on ${PORT} port`)

})