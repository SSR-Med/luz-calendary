// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const generateTokenTesting = require('../../helpers/TokenGenerationTesting');
const {admin2,admin3,admin4,incorrectAdmin2} = require('../../helpers/user/UserTestValues'); 
// Services
const {createUser} = require('../../services/user/UserService');


beforeAll(async () =>{
    const token = await generateTokenTesting(true);
    const { name, email, password, role } = admin3;
    const admin3InDB = await createUser(name, email, password, role);
}, 10000)

// Modify user
describe("PUT /user/id/:id", ()=>{
    
    test("Should modify an user", async() =>{
        return request(app)
            .put('/user/id/1')
            .auth(token, {type: 'bearer'})
            .send(admin2)
            .expect(200)
    })

    test("Should return 400 if name is missing", async() =>{
        return request(app)
            .put('/user/id/1')
            .auth(token, {type: 'bearer'})
            .send(incorrectAdmin2)
            .expect(400)
    })

    test("Should return 403 if token is invalid", async() =>{
        return request(app)
            .put('/user/id/1')
            .auth("Waa", {type: 'bearer'})
            .send(admin2)
            .expect(403)
    })

    test("Should return 409 if user already exists", async() =>{
        return request(app)
            .put('/user/id/1')
            .auth(token, {type: 'bearer'})
            .send(admin3)
            .expect(409)
    })

    test("Should return 404 if user does not exist", async() =>{
        return request(app)
            .put('/user/id/100')
            .auth(token, {type: 'bearer'})
            .send(admin4)
            .expect(404)
    })
});




