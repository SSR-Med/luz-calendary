// Dependencies
const express = require('express')
// Modules
const {sequelize} = require('../../config/Database')
// Services
const { login } = require('../../services/user/UserService')
// Helpers
const checkRequiredParams = require('../../helpers/CheckRequiredParams')

const router = express.Router()
router.use(express.json())

// Routes
// POST /login : Login
router.post('/',checkRequiredParams(["name","password"],"body"), async (req, res) => {
    try{
        const token = await login(req.body.name, req.body.password)
        if (token) {
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: "Authentication failed" });
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})


module.exports = router