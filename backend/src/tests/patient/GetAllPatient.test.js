// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
// Models
const Patient = require('../../models/Patient');
// Helpers
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {user} = require('../../helpers/testing/UserTestValues'); 
const {patient1} = require('../../helpers/testing/PatientTestValue');
// Services
const {createPatient} = require('../../services/patient/PatientService');

beforeEach(async () => {
    await Patient.sync({force:true});
    const {name, email, password, role} = user;
    const token = await generateTokenTesting(name, email, password, role);
},10000);

describe("GET /patient", () =>{

    test("Should return all patients", async() =>{
        const {id_user, name, cellphone, document} = patient1;
        const patient = await createPatient(id_user, name, cellphone, document);
        return request(app)
            .get('/patient')
            .auth(token, {type: 'bearer'})
            .expect(200)
    });

    test("Should return 403 if token is invalid", async() =>{
        return request(app)
            .get('/patient')
            .auth("WASAAA", {type: 'bearer'})
            .expect(403)
    });

})