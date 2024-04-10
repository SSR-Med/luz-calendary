// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
// Models
const Patient = require('../../models/Patient');
// Helpers
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {user} = require('../../helpers/testing/UserTestValues'); 
const {patient1, incorrectPatient1,patient12, patient2} = require('../../helpers/testing/PatientTestValue');

beforeEach(async () => {
    await Patient.sync({force:true});
    const {name, email, password, role} = user;
    const token = await generateTokenTesting(name, email, password, role);
},10000);

describe("PUT /patient", ()=>{

    test("Should modify a patient", async() =>{
        const patient = await Patient.create(patient1);
        return request(app)
            .put(`/patient/${patient.id}`)
            .auth(token, {type: 'bearer'})
            .send(patient2)
            .expect(200)
    })

    test("Should return 404 if patient does not exist", async() =>{
        return request(app)
            .put(`/patient/1`)
            .auth(token, {type: 'bearer'})
            .send(patient1)
            .expect(404)
    })

    test("Should return 403 if token is wrong", async() =>{
        const patient = await Patient.create(patient1);
        return request(app)
            .put(`/patient/${patient.id}`)
            .auth('wrongtoken', {type: 'bearer'})
            .send(patient2)
            .expect(403)
    })

    test("Should return 400 if name is missing", async() =>{
        const patient = await Patient.create(patient1);
        return request(app)
            .put(`/patient/${patient.id}`)
            .auth(token, {type: 'bearer'})
            .send(incorrectPatient1)
            .expect(400)
    })

    test("Should return 409 if patient already exists", async() =>{
        const patientCreated1 = await Patient.create(patient1);
        const patientCreated2 = await Patient.create(patient12);
        return request(app)
            .put(`/patient/${patientCreated1.id}`)
            .auth(token, {type: 'bearer'})
            .send(patient12)
            .expect(409)
    });

})