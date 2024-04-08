// Dependencies
const request = require('supertest');
const jwt = require("jsonwebtoken");
// Modules
const app = require('../../app');
const {realUser} = require('../../helpers/testing/UserTestValues');
// Services
const {createUser} = require('../../services/user/UserService');
// Models
const User = require('../../models/User');
// Env
const {jwt_key} = require("../../config/Config");

beforeEach(async () =>{
    await User.sync({force: true})
});

describe("POST /user/password_recovery/:id/:token", ()=>{

    test("Should return 200", async() =>{
        const {name, email, password, role} = realUser;
        const userDB = await createUser(name, email, password, role);
        const token = jwt.sign({id: userDB.id}, jwt_key, {expiresIn: '1h'});
        return request(app)
            .post(`/user/password_recovery/${userDB.id}/${token}`)
            .send({password: "123"})
            .expect(200)
    });

    test("Should return 404", async() =>{
        return request(app)
            .post(`/user/password_recovery/100/100`)
            .send({password: "123"})
            .expect(404)
    })

})