// Dependencies
const express = require('express')
const jwt = require("jsonwebtoken");
// Helpers
const { verifyToken } = require('../../helpers/user/Token')
// Env
const { jwt_key } = require("../../config/Config");

const router = express.Router()
router.use(express.json())

// Routes
// GET /token : Refresh token
router.get('/', verifyToken, async (req, res) => {
    try{
        const id = req.id;
        const token = jwt.sign({ id }, jwt_key, { expiresIn: "1h" });
        return res.status(200).json({token});
    }
    catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
});

module.exports = router
