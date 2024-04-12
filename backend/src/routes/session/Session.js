// Dependencies
const express = require('express')
// Services
const {
    getSession,
    deleteSession,
    changeStatus,
    createSession,
    modifySession,
    deleteMultipleSession
} = require('../../services/calendary/CalendaryService')
// Helpers
const { verifyToken } = require('../../helpers/user/Token')
const checkRequiredParams = require('../../helpers/CheckRequiredParams')

const router = express.Router()
router.use(express.json())

// Get /session?date?type : Get session calendar(month/week)
router.get("/",verifyToken,checkRequiredParams(["date","type"],"query"), async (req, res) => {
    try {
        const sessions = await getSession(req.id,req.query.date, req.query.type)
        if (sessions != "Invalid date") {
            return res.status(200).json(sessions)
        } else {
            return res.status(400).json({ message: session })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Delete /session/id/:id : Delete a session
router.delete("/id/:id",verifyToken, async (req, res) => {
    try {
        const session = await deleteSession(req.id, req.params.id)
        if (session != "Session not found") {
            return res.status(200).json(session)
        } else {
            return res.status(404).json({ message: session})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Patch /session/id/:id : Confirm or cancel a session
router.patch("/id/:id",verifyToken,checkRequiredParams(["status"],"body"), async (req, res) => {
    try {
        const session = await changeStatus(req.id, req.params.id, req.body.status)
        if (session != "Session not found") {
            return res.status(200).json(session)
        } else {
            return res.status(404).json({ message: session })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

// PUT /session/patient/id/:id?start_date?finish_date  : Create a session
router.post("/patient/id/:id",verifyToken,checkRequiredParams(["start_date","finish_date"],"query"), async (req, res) => {
    try {
        const session = await createSession(req.id, req.params.id, req.query.start_date, req.query.finish_date,req.body)
        if (session == "Sessions created") {
            return res.status(201).json(session)
        }
        else if (session == "Patient not found") {
            return res.status(404).json({ message: session })
        }
        else {
            return res.status(400).json({ message: session })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

// PUT /session/patient/id/:id?start_date?finish_date : Modify a session
router.put("/patient/id/:id",verifyToken,checkRequiredParams(["start_date","finish_date"],"query"), async (req, res) => {
    try {
        const session = await modifySession(req.id, req.params.id, req.query.start_date, req.query.finish_date,req.body)
        if (session == "Sessions modified") {
            return res.status(200).json(session)
        } else if(session == "Patient not found") {
            return res.status(404).json({ message: 'Patient not found' })
        }
        else {
            return res.status(400).json({ message: session })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Delete session/patient/id/:id?start_date?finish_date : Delete multiple sessions
router.delete("/patient/id/:id",verifyToken,checkRequiredParams(["start_date","finish_date"],"query"), async (req, res) => {
    try {
        const session = await deleteMultipleSession(req.id, req.params.id, req.query.start_date, req.query.finish_date)
        if (session == "Sessions deleted") {
            return res.status(200).json(session)
        } else {
            return res.status(404).json({ message: session})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router