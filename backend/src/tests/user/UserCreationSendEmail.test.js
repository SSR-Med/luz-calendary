// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const {realUser} = require('../../helpers/testing/UserTestValues');
// Models
const User = require('../../models/User');

beforeEach(async () => {
    await User.sync({force: true})
}, 10000)

describe("POST /user", ()=>{

    test("Should return 201", async() =>{
        return request(app)
            .post('/user')
            .send(realUser)
            .expect(201)
    })

    test("Should return 409 if user already exists", async() =>{
        const {name, email, password, role} = realUser;
        const userDB = await User.create({name, email, password, role});
        return request(app)
            .post('/user')
            .send({name, email, password, role})
            .expect(409)
    });

    test("Should return 400 if missing parameters", async() =>{
        return request(app)
            .post('/user')
            .send({})
            .expect(400)
    });
});