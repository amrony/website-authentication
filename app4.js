// hasing + salting password authentication

require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    
    bcrypt.hash(password, saltRounds, async function(err, hash) {
      const newUser = new User({
        email: email,
        password: hash,
      });

      await newUser.save()

      res.status(201).json({
        newUser
      });

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

      if(user){
        bcrypt.compare(password, user.password, function(err, result) {
          if(result == true){
            res.status(200).json({status: 'Valid User'});
          }
        });
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