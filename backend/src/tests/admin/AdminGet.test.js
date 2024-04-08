// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const {admin, user} = require('../../helpers/testing/UserTestValues'); 
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');

beforeEach(async () =>{
    const {name, email, password, role} = admin;
    const token = await generateTokenTesting(name, email, password, role);
}, 10000)

// Get all users
describe("GET /user", ()=>{ 

    test("Should return all users", async() =>{
        return request(app)
            .get('/user')
            .auth(token, {type: 'bearer'})
            .expect(200)
    })

    test("Should return 403 if token is invalid", async() =>{
        return request(app)
            .get('/user')
            .auth("Waa", {type: 'bearer'})
            .expect(403)
    })

    test("Should return 403 if user is not admin", async() =>{
        const {name, email, password, role} = user;
        const token = await generateTokenTesting(name,email,password,role);
        return request(app)
            .get('/user')
            .auth(token, {type: 'bearer'})
            .expect(403)
    })
});