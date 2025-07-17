import {expect}  from 'chai'
import api from './testHelper.js'



describe('GET/api/applications', () =>{
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