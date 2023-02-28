const express = require("express"); // building the rest api
const cors = require("cors"); // provides express middlewares to enable CORS
const dbConfig = require("./app/config/db.config")
const UserRouter = require("./app/routes/user.routes")

const app = express();

var corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:8081"],
};

app.use(cors(corsOptions));

// for accepting post form data
const bodyParser = require("express").json;
app.use(bodyParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

//mongodb+srv://Bigguy:fhatuwani23456@webmobileapplication.jx4opz3.mongodb.net/?retryWrites=true&w=majority
db.mongoose
  .connect(
    dbConfig.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });   

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
// require('./app/routes/user.routes')(app);
app.use("/user", UserRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
