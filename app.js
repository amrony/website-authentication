require("dotenv").config();
require("./config/database");
require("./config/passport");
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const app = express();

const User = require("./models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');


app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl : process.env.MONGODB_URI,
    collectionName: "sessions"
  })
  // cookie: { secure: true }
}));


app.use(passport.initialize())
app.use(passport.session())



// base url
app.get("/", (req, res) => {
  res.render('index');
});

//register : get
app.get("/register", (req, res) => {
  res.render('register');
});

//register : post
app.post("/register", async(req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({username: username});

    if(user){
      res.status(201).send("User already exist");
    }else{

      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const newUser = new User({
          username: username,
          password: hash
        });

        console.log("newUser", newUser);

        await newUser.save(newUser);
  
        res.redirect("/login"); 
      });
    }

   
  } catch (error) {
    res.status(500).send(error);
  }
});

// check logged in
const checkLoggedIn = (req, res, next)=> {
  if(req.isAuthenticated()){
    return res.redirect('/profile');
  }

  next();
}

//login : get
app.get("/login", checkLoggedIn, (req, res) => {
  res.render('login');
});

//login: post

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

const checkAuthenticated = (req, res, next)=> {
  if(req.isAuthenticated()){
    return next();;
  }else{
    res.redirect('/login');
  }
}

//profile protected route
app.get("/profile", checkAuthenticated, (req, res) => {
  res.render('/profile')
});

//logout route
app.get("/logout", (req, res) => {
  try {
    req.logout((err)=> {
      if(err){
        return next(err);
      }
      res.redirect("/");
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
});



module.exports = app;