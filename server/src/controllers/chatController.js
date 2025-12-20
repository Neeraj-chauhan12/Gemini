const Prompt = require('../models/promptModel')
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Generate AI reply, store both user message and assistant reply
exports.sendMessage = async (req, res) => {
    try {
        const userId =  req.user.id
        const { message } = req.body
       

        if (!userId) return res.status(401).json({ message: 'unauthorized' })
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ message: 'message is required' })
        }

        // Save user message
        const userPrompt = await Prompt.create({
            userId,
            role: 'user',
            content: message.trim(),
        })

        // Initialize Gemini client
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY
        if (!apiKey) {
            // Do not fail silently: return saved user message but warn client
            return res.status(500).json({ message: 'AI API key not configured' })
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        // Send to model and get reply
        let assistantText = ''
        try {
            const result = await model.generateContent(message)
            // result.response.text() is the SDK pattern used elsewhere
            assistantText = result && result.response && typeof result.response.text === 'function'
                ? result.response.text()
                : String(result)
        } catch (aiErr) {
            console.error('AI generation error:', aiErr)
            assistantText = 'Sorry, I could not generate a response at this time.'
        }

        // Save assistant reply
        const assistantPrompt = await Prompt.create({
            userId,
            role: 'assistant',
            content: assistantText,
        })

        return res.status(201).json({
            message: 'ok',
            userPrompt,
            assistantPrompt,
        })
    } catch (error) {
        console.error('sendMessage error:', error)
        return res.status(500).json({ message: 'internal server error', error: String(error) })
    }
}

exports.getPrompts = async (req, res) => {
    try {
        const userId = req.user && req.user.id
        if (!userId) return res.status(401).json({ message: 'unauthorized' })

        const prompts = await Prompt.find({ userId }).sort({ createdAt: 1 })
        return res.status(200).json({ prompts })
    } catch (error) {
        console.error('getPrompts error:', error)
        return res.status(500).json({ message: 'internal server error' })
    }
}

exports.clearPrompts = async (req, res) => {
    try {
        const userId = req.user && req.user.id
        if (!userId) return res.status(401).json({ message: 'unauthorized' })

        await Prompt.deleteMany({ userId })
        return res.status(200).json({ message: 'cleared' })
    } catch (error) {
        console.error('clearPrompts error:', error)
        return res.status(500).json({ message: 'internal server error' })
    }
}

// Delete a single prompt by id for the authenticated user
exports.deletePrompt = async (req, res) => {
    try {
        const userId = req.user && req.user.id
        const { id } = req.params
        if (!userId) return res.status(401).json({ message: 'unauthorized' })
        if (!id) return res.status(400).json({ message: 'id is required' })

        const prompt = await Prompt.findOne({ _id: id, userId })
        if (!prompt) return res.status(404).json({ message: 'prompt not found' })

        await Prompt.deleteOne({ _id: id, userId })
        return res.status(200).json({ message: 'deleted' })
    } catch (error) {
        console.error('deletePrompt error:', error)
        return res.status(500).json({ message: 'internal server error' })
    }
}