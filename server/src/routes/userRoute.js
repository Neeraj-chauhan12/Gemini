const express=require('express');
const { Register, Login, logout, getProfile } = require('../controllers/userController');
const { AuthMiddleware } = require('../middleware/AuthMiddleware');
const router=express.Router();

router.post("/register",Register),
router.post("/login",Login)
router.get("/logout",logout)
router.get("/profile",AuthMiddleware,getProfile)


module.exports=router