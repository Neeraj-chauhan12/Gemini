const express = require('express')
const router = express.Router()
const { AuthMiddleware } = require('../middleware/AuthMiddleware')
const { sendMessage, getPrompts, clearPrompts } = require('../controllers/chatController')


// Send a message (user -> AI); stores both user message and AI reply
router.post('/send', AuthMiddleware, sendMessage)

// Get all prompts for authenticated user
router.get('/', AuthMiddleware, getPrompts)

// Clear all prompts for authenticated user
router.delete('/clear', AuthMiddleware,clearPrompts)

module.exports = router
