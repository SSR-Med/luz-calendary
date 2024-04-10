// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
// Models
const Patient = require('../../models/Patient');
// Helpers
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {user} = require('../../helpers/testing/UserTestValues'); 
const {patient1, incorrectPatient1} = require('../../helpers/testing/PatientTestValue');

beforeEach(async () => {
    await Patient.sync({force:true});
    const {name, email, password, role} = user;
    const token = await generateTokenTesting(name, email, password, role);
},10000);

describe("POST /patient", ()=>{

    test("Should create a patient", async() =>{
        return request(app)
            .post('/patient')
            .auth(token, {type: 'bearer'})
            .send(patient1)
            .expect(201)
    })

    test("Should return 409 if patient already exists", done =>{
        request(app)
            .post('/patient')
            .auth(token, {type: 'bearer'})
            .send(patient1)
            .expect(201)
            .end(() =>{
                request(app)
                    .post('/patient')
                    .auth(token, {type: 'bearer'})
                    .send(patient1)
                    .expect(409)
                    .end(done)
            })
    });

    test("Should return 403 if token is wrong", async() =>{
        return request(app)
            .post('/patient')
            .auth('wrongtoken', {type: 'bearer'})
            .send(patient1)
            .expect(403)
    })

    test("Should return 400 if name is missing", async() =>{
        return request(app)
            .post('/patient')
            .auth(token, {type: 'bearer'})
            .send(incorrectPatient1)
            .expect(400)
    })
})