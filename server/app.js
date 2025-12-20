const express = require("express");
const dotenv = require("dotenv");
const mdConnection = require("./src/database/dbConnection");
const userRoute = require("./src/routes/userRoute");
const chatRoute = require("./src/routes/chatRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path=require('path')

const app = express();
dotenv.config();




app.use(
  cors({
    origin: "http://localhost:5173" ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const _dirname=path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

// deploy code
app.use(express.static(path.join(_dirname, '/client/dist')));
app.get((req,res)=>{
  res.sendFile(path.resolve(_dirname,'/client/dist/index.html'))
})

mdConnection();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`app is running on ${PORT} port`);
});
