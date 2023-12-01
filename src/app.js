const express = require("express");
const app = express();

let SERVER_NAME = "user-api";
let PORT = 4000;
let HOST = "127.0.0.1";

const mongoose = require("mongoose");
const username = "jeetkaur941";
const password = "zgwueYu2YovUMcAy";
const dbname = "Harvar";
let uristring =
  "mongodb+srv://jeetkaur941:zgwueYu2YovUMcAy@harvar.v8ovqmx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
// Atlas MongoDb connection string format
//mongodb+srv://<username>:<password>@cluster0.k7qyrcg.mongodb.net/<dbname(optional)>?retryWrites=true&w=majority
//let uristring = 'mongodb+srv://'+username+':'+password+'@harvar.v8ovqmx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

// Makes db connection asynchronously
mongoose.connect(uristring, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // we're connected!
  console.log("!!!! Connected to db: " + uristring);
});

const paitentSchema = new mongoose.Schema({
  first_name: String,
  fathername: String,
  age: Number,
  date: String,
  time: String,
  gender: String,
  payment: String,
  addres: String,
  phone: Number,
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'User' collection in the MongoDB database
let patientsModel = mongoose.model("Patients", paitentSchema);

let errors = require("restify-errors");
let restify = require("restify"),
  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("**** Resources: ****");
  console.log("********************");
  console.log(" /patients");
  console.log(" /patients/:id");
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all users in the system
server.get("/patients", function (req, res, next) {
  console.log("GET /patients params=>" + JSON.stringify(req.params));

  // Find every entity in db
  patientsModel
    .find({})
    .then((patients) => {
      // Return all of the patients in the system
      res.send(patients);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get a single user by their patient id
server.get("/patients/:id", function (req, res, next) {
  console.log("GET /patients/:id params=>" + JSON.stringify(req.params));

  // Find a single patient by their id in db
  patientsModel
    .findOne({ _id: req.params.id })
    .then((patient) => {
      console.log("found patient: " + patient);
      if (patient) {
        // Send the patient if no issues
        res.send(patient);
      } else {
        // Send 404 header if the patient doesn't exist
        res.send(404);
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Create a new patient
server.post("/patients", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  console.log("POST /patients body=>" + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.first_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("name must be supplied"));
  }
  if (req.body.age === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("age must be supplied"));
  }
  if (req.body.fathername === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("father name must be supplied"));
  }
  const paitentSchema = new mongoose.Schema({});

  let newPatient = new patientsModel({
    first_name: req.body.first_name,
    age: req.body.age,
    fathername: req.body.fathername,
    date: req.body.date,
    time: req.body.time,
    gender: req.body.gender,
    payment: req.body.payment,
    addres: req.body.addres,
    phone: req.body.phone,
  });

  // Create the patient and save to db
  newPatient
    .save()
    .then((patient) => {
      // Send the patient if no issues
      res.send(201, patient);
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});
//update the patients by patch
/*server.patch('patients/:id' ,function (req, res ,next){ 
  console.log('PATCH / patients parms =>' +JSON.stringify(req.params));

})
app.patch("patients/ :id", async(req,res) =>{
  try{
    const _id =req.params.id;
    const updatepatients =await patient.findByIdAndUpdate(_id,req.body);
    res.send(updatepatients)

  }catch(err){
    res.status(404).send(updatepatients)

  }
})*/

// patientsModel.updateMany({_id: req.params.id},newPatient).then((patient) =>{
//   console.log("updated patient:"  + patient);
//   //send the patient if no issues
//   res.send(200 , patient);
//   return next();
// }).catch((err)=>{
//   console.log("error:" +  err);
//   return next(new Error)(JSON.stringify(err.errors))
// });

// Delete patient with the given id
server.del("/patients/:id", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  // Delete the user in db
  patientsModel
    .findOneAndDelete({ _id: req.params.id })
    .then((deletedPatient) => {
      console.log("deleted Patient: " + deletedPatient);
      if (deletedUser) {
        res.send(200, deletedPatient);
      } else {
        res.send(404, "patient not found");
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// // Example of using promise
// UsersModel.findOne({ _id: req.params.id })
// .then((user)=>{ }) // success
// .catch((error)=>{ }); // error

// Update a patient by their ID using PUT method
server.put("/patients/:id", function (req, res, next) {
  const patientId = req.params.id;
  const updateData = req.body; // Data to update the patient

  // Ensure that at least one field to update is provided in the request body
  if (Object.keys(updateData).length === 0) {
    return next(
      new errors.BadRequestError("No data provided for updating the patient.")
    );
  }

  // Find the patient by their ID and update the data
  patientsModel
    .findOne({ _id: patientId })
    .then((patient) => {
      if (!patient) {
        res.send(404, "Patient not found");
        return next();
      }

      // Update the patient's data
      Object.assign(patient, updateData);

      // Save the updated patient to the database
      return patient.save();
    })
    .then((updatedPatient) => {
      res.send(200, updatedPatient);
      return next();
    })
    .catch((error) => {
      console.log("Error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Define the clinical test schema
const clinicalTestSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patients",
    required: true,
  },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: [
      "Blood Pressure",
      "Respiratory Rate",
      "Blood Oxygen Level",
      "Heart Beat Rate",
    ],
    required: true,
  },
  reading: { type: String, required: true },
  status: String,
});

// Create models based on schemas
const clinicalTestModel = mongoose.model("ClinicalTests", clinicalTestSchema);

// Create a new clinical test
server.post("/clinicalTests", function (req, res, next) {
  // Validation logic here
  if (!req.body.patient) {
    return next(new errors.BadRequestError("Patient ID must be supplied"));
  }

  const newClinicalTest = new clinicalTestModel({
    patient: req.body.patient,
    date: req.body.date,
    type: req.body.type,
    reading: req.body.reading,
    status: req.body.status,
  });

  newClinicalTest
    .save()
    .then((clinicalTest) => {
      res.send(201, clinicalTest);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

server.get("/clinical-tests/:testId", function (req, res, next) {
  clinicalTestModel
    .findOne({ _id: req.params.testId })
    .then((clinicalTest) => {
      if (clinicalTest) {
        res.send(clinicalTest);
      } else {
        res.send(404);
      }
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get all tests of a specific patient
server.get("/clinical-tests/patient/:patientId", function (req, res, next) {
  clinicalTestModel
    .find({ patient: req.params.patientId })
    .then((clinicalTests) => {
      res.send(clinicalTests);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Update a specific test by its ID using PUT method
server.put("/clinical-tests/:testId", function (req, res, next) {
  const testId = req.params.testId;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    return next(
      new errors.BadRequestError("No data provided for updating the test.")
    );
  }

  clinicalTestModel
    .findOne({ _id: testId })
    .then((test) => {
      if (!test) {
        res.send(404, "Test not found");
        return next();
      }

      Object.assign(test, updateData);

      return test.save();
    })
    .then((updatedTest) => {
      res.send(200, updatedTest);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Delete a specific test by its ID
server.del("/clinical-tests/:testId", function (req, res, next) {
  clinicalTestModel
    .findOneAndDelete({ _id: req.params.testId })
    .then((deletedTest) => {
      if (deletedTest) {
        res.send(200, deletedTest);
      } else {
        res.send(404, "Test not found");
      }
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Delete all tests of a specific patient
server.del("/clinical-tests/patient/:patientId", function (req, res, next) {
  clinicalTestModel
    .deleteMany({ patient: req.params.patientId })
    .then((result) => {
      res.send(200, result);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get patients with tests having status "critical"
server.get("/criticalTests", function (req, res, next) {
  console.log("GET /criticalTests");

  // Find tests with status "critical" and populate patient details
  clinicalTestModel
    .find({ status: "critical" })
    .populate("patient") // Populate the patient field
    .then((tests) => {
      // Create an array to store combined patient and test information
      const results = tests.map((test) => {
        return {
          patient: {
            id: test.patient._id,
            first_name: test.patient.first_name,
            // Add other patient details as needed
          },
          test: {
            id: test._id,
            date: test.date,
            type: test.type,
            reading: test.reading,
            status: test.status,
          },
        };
      });

      // Return the list of patients with critical tests and their details
      res.send(results);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});
