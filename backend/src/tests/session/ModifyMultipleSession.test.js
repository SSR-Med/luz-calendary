// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
// Helpers
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {user} = require('../../helpers/testing/UserTestValues');
const {patient1} = require('../../helpers/testing/PatientTestValue');
const {calendary1,calendary2} = require('../../helpers/testing/SessionTestValue');
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

describe("PUT /session/patient/id/:id?start_date?finish_date", ()=>{

    test("Modify multiple session", async()=>{
        return request(app)
            .put('/session/patient/id/1?start_date=2024-04-01&finish_date=2024-04-08')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(200)
    })

    test("Get 404 if patient not found", async()=>{
        return request(app)
            .put('/session/patient/id/20?start_date=2024-04-01&finish_date=2024-04-08')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(404)
    })

    test("Get 400 if invalid date", async()=>{
        return request(app)
            .put('/session/patient/id/1?start_date=a&finish_date=2024-04-09')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(400)
    })

    test("Get 400 if start date > finish date", async()=>{
        return request(app)
            .put('/session/patient/id/1?start_date=2024-04-09&finish_date=2024-04-01')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(400)
    })
    
    test("Get 403 if token is wrong", async()=>{
        return request(app)
            .put('/session/patient/id/1?start_date=2024-04-01&finish_date=2024-04-08')
            .auth('wrongtoken', {type: 'bearer'})
            .send(calendary1)
            .expect(403)
    })
})