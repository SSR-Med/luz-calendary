// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const generateTokenTesting = require('../../helpers/testing/TokenGenerationTesting');
const {admin, admin2, incorrectAdmin2,user} = require('../../helpers/testing/UserTestValues'); 

// To get a token we must create an user and login
beforeEach(async () =>{
    const {name, email, password, role} = admin;
    const token = await generateTokenTesting("admin","admin@gmail.com","admin",true);
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
    test("Should return 409 if user already exists", done =>{
        request(app)
            .post('/user/admin')
            .auth(token, {type: 'bearer'})
            .send(admin2)
            .expect(201)
            .end(() =>{
                request(app)
                    .post('/user/admin')
                    .auth(token, {type: 'bearer'})
                    .send(admin2)
                    .expect(409)
                    .end(done)
            })
    });
    test("Should return 403 if token is wrong", async() =>{
        return request(app)
            .post('/user/admin')
            .auth('wrongtoken', {type: 'bearer'})
            .send(admin2)
            .expect(403)
    })
    test("Should return 403 if user is not admin", async() =>{
        const {name, email, password, role} = user;
        const token = await generateTokenTesting(name,email,password,role);
        return request(app)
            .post('/user/admin')
            .auth(token, {type: 'bearer'})
            .send(admin2)
            .expect(403)
    })

    test("Should return 400 if name is missing", async() =>{
        return request(app)
            .post('/user/admin')
            .auth(token, {type: 'bearer'})
            .send(incorrectAdmin2)
            .expect(400)
    })
});
