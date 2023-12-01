let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

// define base uri for the REST API (lab03) under test
const uri = 'http://127.0.0.1:4000';

describe("when we issue a 'GET' to /patients", function(){
    it("should return HTTP 200", function(done) {
        chai.request(uri)
            .get('/patients')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                done();
            });
    });
});

describe("when we issue a 'GET' to /patients", function(){
    it("should return empty list []", function(done) {
        chai.request(uri)
            .get('/patients')
            .end(function(req, res){
                expect(res.text).to.equal('[]');
                done();
            });
    });
});

describe("when we issue a 'POST' to /patients with patient info", function(){
    it("should return response with patient created", function(done) {
        chai.request(uri)
            .post('/patients')
            .field('name', 'Peter Doe')
            .field('age', 21)
            .end(function(req, res){
                expect(res.status).to.equal(201);
                expect(res.text).to.equal('{"name":"Peter Doe","age":"21","_id":"1"}');
                done();
            });
    });
});

describe("when we issue a 'GET' to /patients after creating new patient", function(){
    it("should return array with this user", function(done) {
        chai.request(uri)
            .get('/patients')
            .end(function(req, res){
                expect(res.text).to.equal('[{"name":"Peter Doe","age":"21","_id":"1"}]');
                done();
            });
    });
});