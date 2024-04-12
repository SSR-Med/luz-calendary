// Dependencies
const express = require('express')
// Helpers
const { verifyToken } = require('../../helpers/user/Token')
const checkRole = require('../../helpers/patient/CheckRole')
const checkRequiredParams = require('../../helpers/CheckRequiredParams')
const {patientParams} = require('../../helpers/patient/PatientParams')
// Services
const { getPatients, modifyPatient, deletePatient, getPatient, createPatient} = require('../../services/patient/PatientService')
// Models
const Patient = require('../../models/Patient')

const router = express.Router()
router.use(express.json())

// Get /patient : Get all patients
router.get('/',verifyToken, async (req, res) => {
    try{
        const patients = await getPatients(req.id)
        if (patients) {
            return res.status(200).json(patients);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

// Get /patient/:id : Get a patient
router.get('/:id',verifyToken, async (req, res) => {
    try{
        const patient = await getPatient(req.id, req.params.id)
        if (patient) {
            return res.status(200).json(patient);
        } else {
            return res.status(404).json({ message: 'Patient not found' });
        }
    }
    catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

// Delete /patient/:id : Delete a patient
router.delete('/:id',verifyToken, async (req, res) => {
    try{
        const patient = await deletePatient(req.id, req.params.id)
        if (patient) {
            return res.status(200).json({ message: 'Patient deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Patient not found' });
        }
    }
    catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

// Post /patient : Create a patient
router.post('/',verifyToken,checkRequiredParams(patientParams,"body"), async (req, res) => {
    try{
        let id_user = req.id;
        if (checkRole(req.id) == true){
            if ((id_user in req.body) == false) return res.status(400).json({ message: 'Missing required parameters"' });
            id_user = req.body.id_user
        }
        const searchPatient = await Patient.findOne({where: {document: req.body.document, id_user: id_user}});
        if (searchPatient) {
            return res.status(409).json({ message: 'Patient already exists' });
        }
        const patient = await createPatient(req.id, req.body.name, req.body.cellphone, req.body.document, id_user)
        return res.status(201).json({ message: 'Patient created successfully' });
    }
    catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

// Put /patient/:id : Modify a patient
router.put('/:id',verifyToken,checkRequiredParams(patientParams,"body"), async (req, res) => {
    try{
        let patient;
        if (checkRole(req.id) == true){
            if ((id_user in req.body) == false) return res.status(400).json({ message: 'Missing required parameters"' });
            patient = await modifyPatient(req.id, req.params.id, req.body.name, req.body.cellphone, req.body.document, req.body.id_user)
        }
        else{
            patient = await modifyPatient(req.id, req.params.id, req.body.name, req.body.cellphone, req.body.document)
        }
        if (patient) {
            return res.status(200).json({ message: 'Patient updated successfully' });
        } else {
            if (patient == false){
                return res.status(409).json({ message: 'Patient already exists' });
            }
            return res.status(404).json({ message: 'Patient not found' });
        }
    }
    catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

module.exports = router;