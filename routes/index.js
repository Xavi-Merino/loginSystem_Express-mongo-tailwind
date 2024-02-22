var express = require('express');
const User = require('../database/userSchema');
var router = express.Router();

//middleware function to check for logged-in users
function sessionChecker(req, res, next) {

  const user = req.session.user;

  if(!user) {
    res.redirect('/login');
  }
  else {
    next();
  }
}

/* GET User Dashboard page. */
router.get('/index_user',sessionChecker , function(req, res, next) {
  
  res.render('index_user', { title: 'User Dashboard' });
});

/* GET Admin Dashboard page. */
router.get('/index_admin',sessionChecker , function(req, res, next) {
  res.render('index_admin', { title: 'Admin Dashboard' });
});

/* GET login page */
router.get("/login", function(req, res) {
  res.render("login", { title: "Login" });
});

router.post("/login/new", async function(req, res) {
  const { email, password } = req.body //get the email and password from the request body

  //find the user with the email and password in the database
  try{
    const user = await User.findOne({ email: email}) //User is defined in the userSchema.js

    if(user) {
      const checkPassword = user.password === password ? true : false//check if the password is correct

      if(!checkPassword) {
        res.send("Email o Contraseña incorrecto/a")  //if the password is incorrect send a message
      }
      else {
        const location = user.role === "admin" ? "/index_admin" : "/index_user" //if the user is an admin redirect to the admin dashboard, if not redirect to the user dashboard
        req.session.user = user //store the user in the session
        res.redirect(location)
      }
    }
    else {
      res.send("Lo siento, este usuario no existe.") //if the user does not exist send a message
    }
    
   
  }
  catch(er){
    console.error(er)
  }
});


module.exports = router;
