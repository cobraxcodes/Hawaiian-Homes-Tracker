import {expect}  from 'chai'
import api from './testHelper.js'



describe('GET/legacy/applications', () =>{
    let res;

    it("should return all applications from the database", async function (){
        res = await api
        .get('/applications')
        .expect(200)
        .expect('Content-type', /application\/json/)
        expect(res.body.applications).to.be.an('array')
    })

    it("should return applications from custom page with limit params", async function(){
       
        const page = 2
        const limit = 5

       res = await api
        .get('/applications')
        .query({page,limit})
        .expect('Content-type', /json/)
        .expect(200)
        expect(res.body.applications).to.be.an('array')
        expect(res.body.applications.length).to.be.at.most(limit)
    })
})

describe('GET/legacy/applications/rank', ()=>{
    let res;

    it("should return apps with matching rank", async() =>{
        res = await api
        .get('/applications/rank/8')
        .expect('Content-type', /json/)
        .expect(200)
        expect(res.body.applications).to.be.an('array')
    })

    it("should return 404 for apps with no matching rank", async() =>{
        res = await api
        .get('/applications/rank/0')
        .expect('Content-type', /text\/html/)
        .expect(404)
        
    })
})

describe("GET/legacy/applications/lastname", () =>{
    let res;

    it("should return apps with match last name route params", async() =>{
    res = await api
    .get('/applications/lastname/aina')
    .expect('Content-type', /json/)
    .expect(200)
    expect(res.body.applications).to.be.an('array')
    })

    it("should return 404 when no matches are found ", async () =>{
        res = await api
        .get('/applications/lastname/rumchata')
        .expect('Content-type', /text\/html/)
        .expect(404)
    })
})

describe("GET/legacy/applications/fullname", () =>{
    let res;
    it("should return apps that successfully matches with full name", async() =>{
        res = await api
        .get('/applications/name/aamold, adela')
        .expect('Content-type', /json/)
        .expect(200)
        expect(res.body.applications).to.be.an("object")
        
    })
    
    it("should return 404 when no apps matched", async()=>{
        res = await api
        .get('/applications/name/test')
        .expect('Content-type', /text\/html/)
        .expect(404)
    })
})


describe("GET/legacy/applications/zipcde", () =>{
    let res;
    it("should return apps that successfully matches with zipcode param", async() =>{
        res = await api
        .get('/applications/zipcode/96793')
        .expect('Content-type', /json/)
        .expect(200)
        expect(res.body.applications).to.be.an("array")
        
    })
    
    it("should return 404 when no apps matched", async()=>{
        res = await api
        .get('/applications/zipcode/12345')
        .expect('Content-type', /text\/html/)
        .expect(404)
    })
})

describe("GET/legacy/applications/areacode", () =>{
    let res;
    it("should return apps that successfully matches with areacode param", async() =>{
        res = await api
        .get('/applications/areacode/193')
        // .expect('Content-type', /json/)
        .expect(200)
        expect(res.body.applications).to.be.an("array")
        
    })
    
    it("should return 404 when no apps matched", async()=>{
        res = await api
        .get('/applications/areacode/010')
        .expect('Content-type', /text\/html/)
        .expect(404)
    })
})

describe("DELETE/legacy/applications/userCreatedAppId", () =>{
    let res;
    it("should successfully delete app that matches with id", async() =>{
        res = await api
        .get('/applications/687954327f12d201be058fd3')
        .expect(404)
        
    })
    
    it("should return 404 when no apps matched", async()=>{
        res = await api
        .get('/applications/687954327f12d201be058fd3')
        .expect('Content-type', /text\/html/)
        .expect(404)
    })
})
