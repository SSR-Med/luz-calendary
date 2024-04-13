// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
// Models
const Patient = require('../../models/Patient');
const Session = require('../../models/Session')
// Helpers
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {user} = require('../../helpers/testing/UserTestValues');
const {patient1} = require('../../helpers/testing/PatientTestValue');
const {calendary1, calendary1WrongWeekDay, calendary1WrongHourName,
        calendary1WrongHourOrder, calendary1WrongHourType} = require('../../helpers/testing/SessionTestValue');
// Services
const {createPatient} = require('../../services/patient/PatientService');

beforeEach(async() =>{
    await Patient.sync({force:true});
    await Session.sync({force:true});
    const token = await generateTokenTesting(user.name, user.email, user.password, user.role);
    await createPatient(1, patient1.name, patient1.cellphone, patient1.document);
}, 10000)

describe("POST /session/patient/id/:id?start_date?finish_date", ()=>{

    test("Should create sessions", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=2021-08-01&finish_date=2021-08-28')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(201)
    })
    test("Should return 404 if patient not found", async()=>{
        return request(app)
            .post('/session/patient/id/2?start_date=2021-08-01&finish_date=2021-08-28')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(404)
    })

    test("Should return 400 if required params are missing", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=2021-08-01')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(400)
    })

    test("Should return 403 if token is wrong", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=2021-08-01&finish_date=2021-08-28')
            .auth('wrongtoken', {type: 'bearer'})
            .send(calendary1)
            .expect(403)
    })

    test("Should return 400 if week day is wrong", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=2021-08-01&finish_date=2021-08-28')
            .auth(token, {type: 'bearer'})
            .send(calendary1WrongWeekDay)
            .expect(400)
    })

    test("Should return 400 if hour is wrong", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=2021-08-01&finish_date=2021-08-28')
            .auth(token, {type: 'bearer'})
            .send(calendary1WrongHourName)
            .expect(400)
    })

    test("Should return 400 if hour order is wrong", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=2021-08-01&finish_date=2021-08-28')
            .auth(token, {type: 'bearer'})
            .send(calendary1WrongHourOrder)
            .expect(400)
    })

    test("Should return 400 if hour type is wrong", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=2021-08-01&finish_date=2021-08-28')
            .auth(token, {type: 'bearer'})
            .send(calendary1WrongHourType)
            .expect(400)
    })

    test("Should return 400 if date is invalid", async()=>{
        return request(app)
            .post('/session/patient/id/1?start_date=b&finish_date=2021-08-28')
            .auth(token, {type: 'bearer'})
            .send(calendary1)
            .expect(400)
    })
})