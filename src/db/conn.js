const mongoose = require ("mongoose");
const username = "jeetkaur941";
const password = "zgwueYu2YovUMcAy";
const dbname = "Harvar";
let uristring ='mongodb+srv://jeetkaur941:zgwueYu2YovUMcAy@harvar.v8ovqmx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';
// Atlas MongoDb connection string format
//mongodb+srv://<username>:<password>@cluster0.k7qyrcg.mongodb.net/<dbname(optional)>?retryWrites=true&w=majority
//let uristring = 'mongodb+srv://'+username+':'+password+'@harvar.v8ovqmx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

// Makes db connection asynchronously
mongoose.connect(uristring, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  // we're connected!
  console.log("!!!! Connected to db: " + uristring)
});