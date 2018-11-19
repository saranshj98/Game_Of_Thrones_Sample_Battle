const assert    = require('assert')
const chai      = require('chai')
const server    = require('../server/app')
const chaiHttp  = require('chai-http')
const should    = chai.should();
chai.config.includeStack = true;


chai.use(chaiHttp)


describe('count function', () => {

    it('count​ - returns total number of battle occurred', () => {
        chai.request(server)
        .get('/api/battles/count')
        .end((err, res)=>{
            assert.equal(200, res.statusCode);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('count');
        })
    })

})


describe('list function', () => {

    it('list ​- returns list(array) of all the places where battle has taken place', () => {
        chai.request(server)
        .get('/api/battles/list')
        .end((err, res) => {
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('location');
            assert.equal(200, res.statusCode);
        })
    })
})


describe('stats function', () => {

    it('returns most_active, defender_size, battle_outcome', () => {
        chai.request(server)
        .get('/api/battles/stats')
        .end((err, res) => {
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('stats');
            assert.equal(200, res.statusCode);
        })
    })

})


describe('search​ function', () => {

    it('search​ - searches for any attribute', () => {
        chai.request(server)
        .get('/api/battles/search')
        .query({attacker_king:"Robb Stark"})
        .end((err, res) => {
            res.should.be.json;
            res.body.should.be.a('object');
            res.text.should.be.equal('Robb Stark');
            assert.equal(200, res.statusCode);
        })
    })

})