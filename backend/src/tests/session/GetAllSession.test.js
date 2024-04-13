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

describe("GET /session?date?type", ()=>{

    test("Get 1 session in a week", async ()=>{
        return request(app)
            .get('/session?date=2024-04-02&type=week')
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect((res)=>{
                expect(res.body).toHaveLength(1)
            })
    })

    test("Get 2 session in a month", async()=>{
        return request(app)
            .get('/session?date=2024-04-02&type=month')
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect((res)=>{
                expect(res.body).toHaveLength(2)
            })
    })

    test("Get 400 if invalid type date", async()=>{
        return request(app)
            .get('/session?date=2024-04-02&type=year')
            .auth(token, {type: 'bearer'})
            .expect(400)
    })
    
    test("Get 400 if invalid date", async()=>{
        return request(app)
            .get('/session?date=b&type=month')
            .auth(token, {type: 'bearer'})
            .expect(400)
    })

    test("Get 403 if incorrect token", async()=>{
        return request(app)
            .get('/session?date=2024-04-02&type=month')
            .auth("Wasa", {type: 'bearer'})
            .expect(403)
    })
})