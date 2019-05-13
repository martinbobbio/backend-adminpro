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
const env = process.argv[2] || 'dev'
if(env === 'dev')
    mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, console.log("Base de datos: \x1b[32m%s\x1b[0m", "online"))
else if(env === 'prod')
    mongoose.connect('mongodb://mbobbio:mbobbio1010@ds155626.mlab.com:55626/admin-pro', { useNewUrlParser: true }, () => console.log("Base de datos: \x1b[32m%s\x1b[0m", "online"))

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
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Express server puerto ${port}: \x1b[32m%s\x1b[0m`, "online");
});
