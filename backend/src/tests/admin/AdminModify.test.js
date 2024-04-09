// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {admin,admin2,admin3,admin4,incorrectAdmin2, user} = require('../../helpers/testing/UserTestValues'); 
// Services
const {createUser} = require('../../services/user/UserService');


beforeEach(async () =>{
    const {name, email, password, role} = admin;
    const token = await generateTokenTesting(name, email, password, role);
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

    test("Should return 403 if user is not admin", async() =>{
        const {name, email, password, role} = user;
        const token = await generateTokenTesting(name,email,password,role);
        return request(app)
            .put('/user/id/1')
            .auth(token, {type: 'bearer'})
            .send(admin2)
            .expect(403)
    })

    test("Should return 409 if user already exists", async() =>{
        const { name, email, password, role } = admin3;
        const admin3InDB = await createUser(name, email, password, role);
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




