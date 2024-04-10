// Dependencies
const request = require('supertest');
// Modules
const app = require('../../../app');
// Models
const Patient = require('../../../models/Patient');
// Helpers
const generateTokenTesting = require('../../../helpers/testing/TokenGenerationTesting');
const {user} = require('../../../helpers/testing/UserTestValues'); 
// Services
const {createPatient} = require('../../../services/patient/PatientService');
const {createUser} = require('../../../services/user/UserService');

beforeEach(async () => {
    await Patient.sync({force:true});
    const {name, email, password, role} = user;
    const token = await generateTokenTesting(name, email, password, role);
},10000);

describe("GET /patient", () =>{

    test("Should return all patients", async() =>{
        const patient = await createPatient(1, 'John Doe', '123456789', '12345678901');
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