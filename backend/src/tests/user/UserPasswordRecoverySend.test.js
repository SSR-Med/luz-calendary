// Dependencies
const request = require('supertest');
// Services
const {createUser} = require('../../services/user/UserService');
// Models
const User = require('../../models/User');
// Modules
const app = require('../../app');
const {realUser} = require('../../helpers/testing/UserTestValues');

beforeEach(async () =>{
    await User.sync({force: true})
});

describe("POST /user/password_recovery", ()=>{

    test("Should return 200", async() =>{
        const {name, email, password, role} = realUser;
        const userDB = await createUser(name, email, password, role);
        return request(app)
            .post("/user/password_recovery")
            .send({email: email})
            .expect(200)
    });

    test("Should return 404",async() => {
        return request(app)
            .post("/user/password_recovery")
            .send({email: "wrongemail"})
            .expect(404)
    })
    
})