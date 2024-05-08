// hasing password

require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
var md5 = require('md5');

// console.log("message", md5('message'));

const app = express();

const User = require('./models/user');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Start the server
const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_URL;




mongoose.connect(dbURL)
.then(() => {
  console.log('mongodb atlas is connected');
})
.catch((error) => {
  console.log(error);
  process.exit(1);
})


// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

app.post('/register', async(req, res) => {

  const { email, password } = req.body;

  try {
    const newUser = new User({
      email: email,
      password: md5('password'),
    });

    const user = await newUser.save()

    console.log('New user created:', user)
    res.status(201).json({
      user
    });
    
  } catch (error) {
    res.status(500).json(error)
  }
});


app.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
          email: email
        });

      if(user && user.password == md5('password')){
        res.status(200).json({status: 'Valid User'});
      }else{
        res.status(401).json({status: 'User Not Found'});
      }
});


app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found"
    });
});



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});