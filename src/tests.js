let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

// define base uri for the REST API (lab03) under test
const uri = 'http://127.0.0.1:4000';

describe('Patients API', () => {
    // Assuming you have a running MongoDB server
    before((done) => {
      mongoose.connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', () => {
        console.log('Connected to test database');
        done();
      });
    });
  
    after((done) => {
      mongoose.connection.close(() => {
        console.log('Connection to test database closed');
        done();
      });
    });
  
    // Test GET /patients
    describe('GET /patients', () => {
      it('should get all patients', (done) => {
        chai.request(server)
          .get('/patients')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            // Add more assertions based on your response
            done();
          });
      });
    });
  
    // Test GET /patients/:id
    describe('GET /patients/:id', () => {
      it('should get a single patient by ID', (done) => {
        // Assuming you have a patient ID to test with
        const patientId = '1234567890abcdef12345678';
  
        chai.request(server)
          .get(`/patients/${patientId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            // Add more assertions based on your response
            done();
          });
      });
  
      it('should return 404 for non-existing patient ID', (done) => {
        // Assuming you have a non-existing patient ID to test with
        const nonExistingPatientId = 'nonexistingpatientid';
  
        chai.request(server)
          .get(`/patients/${nonExistingPatientId}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            // Add more assertions based on your response
            done();
          });
      });
    });
  
    // Add more test cases for other endpoints (POST, PUT, DELETE, etc.)
  });