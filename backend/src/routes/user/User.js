// Dependencies
const express = require('express')
// Services
const { getUsers,deleteUser,createUser,modifyUser, sendLink, sendEmail, recoverPassword } = require('../../services/user/UserService')
// Modules
const {sequelize} = require('../../config/Database')
// Helpers
const { verifyToken } = require('../../helpers/user/Token')
const { checkAdmin } = require('../../helpers/user/CheckAdmin')
const checkRequiredParams = require('../../helpers/CheckRequiredParams')
const { userCompleteParams } = require('../../helpers/user/UserParams')

const router = express.Router()
router.use(express.json())

// Routes
// GET /user : Get all users (Only admin)
router.get('/', verifyToken, checkAdmin, async (req, res) => {
    try{
        const users = await getUsers()
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
});
// Delete /user : Delete a user (Only admin)
router.delete('/id/:id', verifyToken, checkAdmin, async (req, res) => {
    try{
        const user = await deleteUser(req.params.id)
        if (user) {
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})
// Put /user : Modify a user (Only admin)
router.put('/id/:id', verifyToken, checkAdmin,checkRequiredParams(userCompleteParams), async (req, res) => {
    try{
        const user = await modifyUser(req.params.id,req.body.name,req.body.email,req.body.password,req.body.role)
        if (user && user != false) {
            return res.status(200).json({ message: 'User updated successfully' });
        } else {
            if (user == false){
                return res.status(409).json({ message: 'User already exists' });
            }
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})
// POST /user : Register a new user as an user
router.post('/', async (req, res) => {
    try{
        const newUser = await createUser(req.body.name,req.body.email,req.body.password)
        if (!newUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

// Post /user/admin : Register a new user as an admin (Only admin)
router.post('/admin', verifyToken, checkAdmin,checkRequiredParams(userCompleteParams), async (req, res) => {
    try{
        const newUser = await createUser(req.body.name,req.body.email,req.body.password,req.body.role)
        if (!newUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})
// Post /user/password_recovery: Send an email to recover the password
router.post('/password_recovery', async (req, res) => {
    try{
        // Get link
        const link = await sendLink(req.body.email)
        if (!link) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send email
        await sendEmail(link,req.body.email)
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})
// Post /user/password_recovery/:id/:token : Assign another password
router.post('/password_recovery/:id/:token', async (req, res) => {
    try{
        const response = await recoverPassword(req.params.id,req.params.token,req.body.password)
        if (response) {
            return res.status(200).json({ message: 'Password updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

module.exports = router