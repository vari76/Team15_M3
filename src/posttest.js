let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

// define base uri for the REST API (lab03) under test
const uri = 'http://127.0.0.1:4000';

// Test POST /patients
describe('POST /patients', () => {
    it('should create a new patient', (done) => {
      const newPatient = {
        first_name: 'Rahul',
        age: 21,
        fathername: 'Kaka',
        gender: "Male",
        payment: "1200",
        // Add other required fields here
      };

      chai.request(server)
        .post('/patients')
        .send(newPatient)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('first_name').equal('kaka');
          expect(res.body).to.have.property('age').equal('21');
          expect(res.body).to.have.property('fathername').equal('Kaka');
          // Add more assertions based on your response
          done();
        });
    });

    it('should return an error for missing required fields', (done) => {
      const invalidPatient = {
        // Missing required fields
      };

      chai.request(server)
        .post('/patients')
        .send(invalidPatient)
        .end((err, res) => {
          expect(res).to.have.status(400);
          // Add more assertions based on your response
          done();
        });
    });
  });

  // Add more test cases for other endpoints (GET, PUT, DELETE, etc.)mm
  // Test GET /patients
  describe('GET /patients', () => {
  it('should get all patients', (done) => {
    chai.request(server)
      .get('/patients')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        // You can add more assertions based on your actual response structure
        done();
      });
    });
});