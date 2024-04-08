// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const {user} = require('../../helpers/testing/UserTestValues');
// Services
const {createUser} = require('../../services/user/UserService');
// Models
const User = require('../../models/User');

beforeEach(async () =>{
    await User.sync({force: true})
    const {name, email, password, role} = user;
    const userDB = await createUser(name, email, password, role);
});

describe("POST /login", ()=>{

    test("Should return token", async() =>{
        return request(app)
            .post('/login')
            .send({name: user.name, password: user.password})
            .expect(200)
    })

    test("Should return 401 if user does not exist", async() =>{
        return request(app)
            .post('/login')
            .send({name: "DoesNotExist", password: "DoesNotExist"})
            .expect(401)
    });

    test("Should return 400 if missing parameters", async() =>{
        return request(app)
            .post('/login')
            .send({name: "DoesNotExist"})
            .expect(400)
    })
});