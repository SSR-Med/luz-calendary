// Dependencies
const express = require('express')
// Helpers
const { verifyToken } = require('../../helpers/user/Token')
const { checkAdmin } = require('../../helpers/user/CheckAdmin')

const router = express.Router()
router.use(express.json())

// Routes
router.get('/', verifyToken, checkAdmin, async (req, res) => {
    return res.status(200).json({ message: "User is Admin" });
})

module.exports = router