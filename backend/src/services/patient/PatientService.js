// Models
const Patient = require('../../models/Patient');
// Helpers
const checkRole= require('../../helpers/patient/CheckRole');

// Get all patients
async function getPatients(userId) {
    const isAdmin = await checkRole(userId);
    if (isAdmin === null){
        return null
    }
    const attributes = isAdmin ? undefined: { exclude: ['id_user'], where: {id_user: userId} } ;
    const patients = await Patient.findAll({attributes});
    return patients;
}

// Get a patient
async function getPatient(userId, patientId) {
    const isAdmin = await checkRole(userId);
    if(isAdmin === null){
        return null;
    }
    if (isAdmin){
        return Patient.findOne({where: {id: patientId}});
    }
    else{
        return Patient.findOne({where: {id: patientId, id_user: userId}}, { exclude: ['id_user'] });
    }
}

// Delete patient
async function deletePatient(userId, patientId) {
    const isAdmin = await checkRole(userId);
    if(isAdmin === null){
        return null;
    }
    const patient = await Patient.findOne({where: {id: patientId}});
    if(!patient){
        return null;
    }
    if(!isAdmin && patient.id_user != userId){
        return null;
    }
    patient.destroy();
    return patient;
}

// Create patient
async function createPatient(userId, name, cellphone, document, id_user=userId) {
    const isAdmin = await checkRole(userId);
    if(isAdmin === null){
        return null;
    }
    let patientData = {
        name: name,
        cellphone: cellphone,
        document: document,
        id_user: id_user
    };
    const patient = new Patient(patientData);
    await patient.save();
    return patient;
}

// Modify patient
async function modifyPatient(userId, patientId, 
    name, cellphone, document,id_user=userId) {
    const isAdmin = await checkRole(userId);
    if(isAdmin === null){
        return null;
    }
    const patient = await Patient.findOne({where: {id: patientId}});
    if(!patient){
        return null;
    }
    let patientDataModify = {
        name: name,
        cellphone: cellphone,
        document: document,
    };
    if(isAdmin){
        patientDataModify.id_user = id_user;
    }
    await patient.update(data);
    return patient;
}



module.exports = { getPatients, modifyPatient, deletePatient, getPatient, createPatient };