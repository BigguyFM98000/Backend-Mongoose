// const { authJwt } = require("../middlewares");
// const controller = require("../controllers/user.controller");
const express = require("express")
const router = express.Router();

// mongodb user model
const User = require("../models/user.model")
// password handler
const bcrypt = require("bcryptjs")

// module.exports = function (app) {
//   app.use(function (req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.get("/api/test/all", controller.allAccess);

//   app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

//   app.get(
//     "/api/test/mod",
//     [authJwt.verifyToken, authJwt.isModerator],
//     controller.moderatorBoard
//   );

//   app.get(
//     "/api/test/admin",
//     [authJwt.verifyToken, authJwt.isAdmin],
//     controller.adminBoard
//   );
// };

router.post("/signup", (req, res) => {
  let {name, email, password, dateOfBirth} = req.body
  name = name.trim()
  email = email.trim()
  password = password.trim()
  dateOfBirth = dateOfBirth.trim()

  if(name == "" || email == "" || password == "" || dateOfBirth == ""){
    res.json({
      status: "FAILED",
      message: "Empty input fields!"
    });
  } else if(!/^[a-zA-Z]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered"
    })
  } else if(!/^[\W-\.]+@([\W-]+\.)+[\W-]{2,4}$/.test(email)){
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if(!new Date(dateOfBirth).getTime()){
    res.json({
      status: "FAILED",
      message: "Invalid date of birth entered",
    });
  } else if(password.length < 8){
    res.json({
      status: "FAILED",
      message: "Password is too short!",
    });
  } else{
    User.find({email}).then(result => {
      if(result.length){
        // a user already exists
        res.json({
          status: "FAILED",
          message: "User with the provided emails already exists",
        });
      } else {
        // try to create the new user

        // password hashing
        const saltRounds = 10;
        bcrypt.hash(password, salt).then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth
          });
          newUser.save().then(result => {
            res.json({
              status: "SUCCESS",
              message: "Signup successful",
              data: result
            });
          }
          ).catch(error => {
            res.json({
          status: "FAILED",
          message: "An error while saving user account!",
        });
      });
        }).catch(error => {
           res.json({
             status: "FAILED",
             message: "An error occured while hashing password!",
           });
        })
      }
    })
  }
});

router.post("/signin", (req, res) => {

});

module.exports = router;
