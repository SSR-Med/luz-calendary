// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const generateTokenTesting = require('../../helpers/TokenGenerationTesting');
const {admin2, incorrectAdmin2} = require('../../helpers/user/UserTestValues'); 

// To get a token we must create an user and login
beforeAll(async () =>{
    const token = await generateTokenTesting(true);
}, 10000)

// Create user
describe("POST /user/admin", ()=>{
    test("Should create an user", async() =>{
        return request(app)
            .post('/user/admin')
            .auth(token, {type: 'bearer'})
            .send(admin2)
            .expect(201)
    })

    test("Should return 409 if user already exists", async() =>{
        return request(app)
            .post('/user/admin')
            .auth(token, {type: 'bearer'})
            .send(admin2)
            .expect(409)
    });

    test("Should return 409 if token is invalid", async() =>{
        return request(app)
            .post('/user/admin')
            .auth(token, {type: 'bearer'})
            .send(admin2)
            .expect(409)
    });

    test("Should return 400 if name is missing", async() =>{
        return request(app)
            .post('/user/admin')
            .auth(token, {type: 'bearer'})
            .send(incorrectAdmin2)
            .expect(400)
    })

});
