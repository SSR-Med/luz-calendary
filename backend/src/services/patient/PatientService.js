// Models
const Patient = require('../../models/Patient');
// Helpers
const checkRole= require('../../helpers/patient/CheckRole');
const TitleName = require('../../helpers/patient/TitleName');
// Dependencies
const { Op } = require("sequelize");

// Get all patients
async function getPatients(userId) {
    const isAdmin = await checkRole(userId);
    if(isAdmin === null){
        return null;
    }
    const patients = isAdmin === true ? await Patient.findAll() : await Patient.findAll({where: {id_user: userId}});
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
        name: TitleName(name),
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
    const searchPatient = await Patient.findOne({where: {id_user: id_user, document:document, id: {[Op.not]: patientId}}});
    if (searchPatient){
        return false;
    }
    let patient;
    const isAdmin = await checkRole(userId);
    if(isAdmin === null){
        return null;
    }
    if (isAdmin){
        patient = await Patient.findOne({where: {id: patientId}});
    }
    else{
        patient = await Patient.findOne({where: {id: patientId, id_user: userId}});
    }
    if(!patient){
        return null;
    }
    let patientDataModify = {
        name: TitleName(name),
        cellphone: cellphone,
        document: document,
    };
    if(isAdmin){
        patientDataModify.id_user = id_user;
    }
    await patient.update(patientDataModify);
    return patient;
}



module.exports = { getPatients, modifyPatient, deletePatient, getPatient, createPatient };