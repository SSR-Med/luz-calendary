// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
// Helpers
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {user} = require('../../helpers/testing/UserTestValues');
const {patient1} = require('../../helpers/testing/PatientTestValue');
const {calendary2} = require('../../helpers/testing/SessionTestValue');
// Models
const Patient = require('../../models/Patient');
const Session = require('../../models/Session')
// Services
const {createPatient} = require('../../services/patient/PatientService');
const {createSession} = require ('../../services/calendary/CalendaryService')

beforeEach(async() =>{
    await Patient.sync({force:true});
    await Session.sync({force:true});
    const token = await generateTokenTesting(user.name, user.email, user.password, user.role);
    await createPatient(1, patient1.name, patient1.cellphone, patient1.document);
    await createSession(1,1,"2024-04-01","2024-04-08",calendary2)
}, 10000)

describe("PATCH /session/id/:id", ()=>{

    test("Change status of a session", async ()=>{
        return request(app)
            .patch('/session/id/1')
            .auth(token, {type: 'bearer'})
            .send({status: true})
            .expect(200)
    })

    test("Get 404 if session not found", async()=>{
        return request(app)
            .patch('/session/id/20')
            .auth(token, {type: 'bearer'})
            .send({status: true})
            .expect(404)
    })

    test("Get 403 if token is wrong", async()=>{
        return request(app)
            .patch('/session/id/1')
            .auth('wrongtoken', {type: 'bearer'})
            .send({status: true})
            .expect(403)
    })
})