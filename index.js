//Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Initialization
var app = express();

//CORS
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connection BBDD
const env = process.env.ENV || 'dev'
let adressDB;

if(env === 'dev') adressDB = 'mongodb://localhost/hospitalDB'
else if(env === 'prod') adressDB = 'mongodb://mbobbio:mbobbio1010@ds155626.mlab.com:55626/admin-pro'
else if(env === 'docker') adressDB = 'mongodb://mongo:27017/hospitalDB'
  
mongoose.connect(adressDB, { useNewUrlParser: true })
.then(() => console.log("Base de datos: \x1b[32m%s\x1b[0m", "online"))
.catch(error => console.log(`Error al conectar la DB en ${env}`, error))

//Import Routes
var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var hospitalRoutes = require("./routes/hospital");
var doctorRoutes = require("./routes/doctor");
var searchRoutes = require("./routes/search");
var loginRoutes = require("./routes/login");
var uploadRoutes = require("./routes/upload");
var imagesRoutes = require("./routes/images");

//Routes
app.use("/user", userRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/doctor", doctorRoutes);
app.use("/search", searchRoutes);
app.use("/login", loginRoutes);
app.use("/upload", uploadRoutes);
app.use("/img", imagesRoutes);
app.use("/", appRoutes);

//Listener
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Express server: \x1b[32m%s\x1b[0m`, "online");
});

console.log(`Port: \x1b[32m%s\x1b[0m`, port);
console.log(`Env: \x1b[32m%s\x1b[0m`, env);
