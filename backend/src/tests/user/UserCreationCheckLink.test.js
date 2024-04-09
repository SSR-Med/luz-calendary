// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const {realUser} = require('../../helpers/testing/UserTestValues');
// Models
const User = require('../../models/User');
// Services
const {encryptUserData} = require('../../services/user/UserService');

beforeEach(async () =>{
    await User.sync({force: true})
}, 10000);

describe("POST /user/creation/:encrypted", ()=>{

    const encrypted = encryptUserData(JSON.stringify(realUser));
    
    test("Should return 201", async() =>{
        return request(app)
            .get(`/user/creation/${encrypted}`)
            .expect(201)
    });

    test("Should return 409 if user already exists", async() =>{
        const {name, email, password, role} = realUser;
        const userDB = await User.create({name, email, password, role});
        return request(app)
            .get(`/user/creation/${encrypted}`)
            .expect(409)
    });

})