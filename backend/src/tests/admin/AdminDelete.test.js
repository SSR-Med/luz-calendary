// Dependencies
const request = require('supertest');
// Modules
const app = require('../../app');
const {user,admin} = require('../../helpers/user/UserTestValues'); 
const generateTokenTesting = require('../../helpers/TokenGenerationTesting');

beforeEach(async () =>{
    const {name, email, password, role} = admin;
    const token = await generateTokenTesting(name, email, password, role);
}, 10000)

// Delete a user
describe("Delete /user/id/:id", ()=>{

    test("Should delete an user", async()=>{
        return request(app)
            .delete('/user/id/1')
            .auth(token, {type: 'bearer'})
            .expect(200)
    });
    
    test("Should return 404 if user not found", async()=>{
        return request(app)
            .delete('/user/id/100')
            .auth(token, {type: 'bearer'})
            .expect(404)
    });

    test("Should return 403 if token is invalid", async()=>{
        return request(app)
            .delete('/user/id/1')
            .auth("Waa", {type: 'bearer'})
            .expect(403)
    });

    test("Should return 403 if user is not admin", async()=>{
        const {name, email, password, role} = user;
        const token = await generateTokenTesting(name,email,password,role);
        return request(app)
            .delete('/user/id/1')
            .auth(token, {type: 'bearer'})
            .expect(403)
    })
});