const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config();

const mdConnection=async()=>{

    try {

        await mongoose.connect(process.env.MONGODB);
        console.log("DATABASE CONNECTION SUCCESSFULLY ");
        
    } catch (error) {
        console.log("Error in database connection",error)
        
    }

}

module.exports=mdConnection;
