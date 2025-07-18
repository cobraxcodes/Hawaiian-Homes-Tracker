import {expect}  from 'chai'
import api from './testHelper.js'



// describe('GET/legacy/applications', () =>{
//     let res;

//     it("should return all applications from the database", async function (){
//         res = await api
//         .get('/applications')
//         .expect(200)
//         .expect('Content-type', /application\/json/)
//         expect(res.body.applications).to.be.an('array')
//     })

//     it("should return applications from custom page with limit params", async function(){
       
//         const page = 2
//         const limit = 5

//        res = await api
//         .get('/applications')
//         .query({page,limit})
//         .expect('Content-type', /json/)
//         .expect(200)
//         expect(res.body.applications).to.be.an('array')
//         expect(res.body.applications.length).to.be.at.most(limit)
//     })
// })

// describe('GET/legacy/applications/rank', ()=>{
//     let res;

//     it("should return apps with matching rank", async() =>{
//         res = await api
//         .get('/applications/rank/8')
//         .expect('Content-type', /json/)
//         .expect(200)
//         expect(res.body.applications).to.be.an('array')
//     })

//     it("should return 404 for apps with no matching rank", async() =>{
//         res = await api
//         .get('/applications/rank/0')
//         .expect('Content-type', /text\/html/)
//         .expect(404)
        
//     })
// })

// describe("GET/legacy/applications/lastname", () =>{
//     let res;

//     it("should return apps with match last name route params", async() =>{
//     res = await api
//     .get('/applications/lastname/aina')
//     .expect('Content-type', /json/)
//     .expect(200)
//     expect(res.body.applications).to.be.an('array')
//     })

//     it("should return 404 when no matches are found ", async () =>{
//         res = await api
//         .get('/applications/lastname/rumchata')
//         .expect('Content-type', /text\/html/)
//         .expect(404)
//     })
// })


// describe("GET/legacy/applications/fullname", () =>{
//     let res;
//     it("should return apps that successfully matches with full name", async() =>{
//         res = await api
//         .get('/applications/name/aamold, adela')
//         .expect('Content-type', /json/)
//         .expect(200)
//         expect(res.body.applications).to.be.an("object")
        
//     })
    
//     it("should return 404 when no apps matched", async()=>{
//         res = await api
//         .get('/applications/name/test')
//         .expect('Content-type', /text\/html/)
//         .expect(404)
//     })
// })


// describe("GET/legacy/applications/zipcode", () =>{
//     let res;
//     it("should return apps that successfully matches with zipcode param", async() =>{
//         res = await api
//         .get('/applications/zipcode/96793')
//         .expect('Content-type', /json/)
//         .expect(200)
//         expect(res.body.applications).to.be.an("array")
        
//     })
    
//     it("should return 404 when no apps matched", async()=>{
//         res = await api
//         .get('/applications/zipcode/12345')
//         .expect('Content-type', /text\/html/)
//         .expect(404)
//     })
// })

// describe("GET/legacy/applications/areacode", () =>{
//     let res;
//     it("should return apps that successfully matches with areacode param", async() =>{
//         res = await api
//         .get('/applications/areacode/193')
//         // .expect('Content-type', /json/)
//         .expect(200)
//         expect(res.body.applications).to.be.an("array")
        
//     })
    
//     it("should return 404 when no apps matched", async()=>{
//         res = await api
//         .get('/applications/areacode/010')
//         .expect('Content-type', /text\/html/)
//         .expect(404)
//     })
// })

// describe("DELETE/legacy/applications/userCreatedAppId", () =>{
//     let res;
//     it("should successfully delete app that matches with id", async() =>{
//         res = await api
//         .get('/applications/687954327f12d201be058fd3')
//         .expect(404)
        
//     })
    
//     it("should return 404 when no apps matched", async()=>{
//         res = await api
//         .get('/applications/687954327f12d201be058fd3')
//         .expect('Content-type', /text\/html/)
//         .expect(404)
//     })
// })



// describe("POST/applications/signup", ()=>{
//     let res;
//     // it("should successfully signup user if all fields are filled", async() =>{
//     //     const testUser = {
//     //         username: "mochatest1",
//     //         password: "Admin123"
//     //     }
    
//     // res = await api
//     // .post('/applications/signup')
//     // .send(testUser)
//     // .expect('Content-Type', /json/)
//     // .expect(201)

//     // expect(res.body.token).to.exist
//     // })

//     it("should respond with error message for invalid username", async () =>{
//         const testUser1={
//             username: "x",
//             password: "Admin123"
//         }


//         res = await api
//         .post('/applications/signup')
//         .send(testUser1)
//         .expect(401)
//         expect(res.text).to.include("Invalid username. Usernames must have at least 6 characters")
//     })

//     it("should respond with error message for invalid password", async () =>{
//         const testUser2={
//             username: "mochatest2",
//             password: "x"
//         }

//         res = await api
//         .post('/applications/signup')
//         .send(testUser2)
//         .expect(401)
//         expect(res.text).to.include("Invalid password. Passwords must have at least 8 characters!")
//     })

//     it("should responsd with err message for existing user", async () =>{
//         const testUser3={
//             username: "mochatest",
//             password: "Admin123"
//         }

//         res=await api
//         .post('/applications/signup')
//         .send(testUser3)
//         .expect(400)
//         expect(res.text).to.include("Username mochatest exists. Please try again!")
//     })
// })



// describe("POST/applications/login", () =>{
//     let res;
//     let token;

//     it("should successfully login with correct credentials and send error for invalid", async () =>{
//      const loginUser = {
//         username: "mochatest",
//         password: "Admin123"
//      }

//      res = await api
//      .post('/applications/login')
//      .send(loginUser)
//      .expect('Content-Type', /json/)
//      .expect(200)
//      expect(res.body).to.have.property("token")
//     })

//     it("should send error message for invalid username", async () =>{
//         const loginUser = {
//             username: "mochajest",
//             password: "Admin123"
//         }

//         res = await api
//         .post('/applications/login')
//         .send(loginUser)
//         .expect('Content-type', /json/)
//         .expect(401)
//         expect(res.text).to.include("Invalid Login! No user found!")
//     })


//     it("should send error message for invalid password", async () =>{
//         const loginUser = {
//             username: "mochatest",
//             password: "dfasdfasd"
//         }

//         res= await api
//         .post('/applications/login')
//         .send(loginUser)
//         .expect(401)
//         expect(res.text).to.include( "Invalid password!")
//     })
// })


describe('POST/applications/logout', () =>{
    let res;
    it("should test succesful logout with valid token", async() =>{
        const testUser = {
            username: "mochatest",
            password: "Admin123"
        }
    res = await api
    .post('/applications/logout')
    .send(testUser)
    .expect(200)
    .expect('Content-type', /json/)
    expect(res.text).to.include("Logout successful!")

    })
})