var express = require('express');
var router = express.Router();
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcryptjs');


router.post('/signup', (req, res) => {
  // Check if all fiels are filled out
  if (!checkBody(req.body, ['username', 'email', 'hash'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.hash, 10);
      console.log('hash');

      const newUser = new User({
        username: req.body.username,
        gender: null,
        email: req.body.email,
        hash: hash,      
        photo: null,
        birthDate: null,
        description: null,
        favoriteSports: [],
        registrations: [],        
        token: uid2(32),
      });
       console.log(newUser);
      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

//Filling out the rest of user's information
router.put('/signup', (req, res) => {
   

   // Check if all fiels are filled out
   if (!checkBody(req.body, ['gender', 'birthDate', 'description','level'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  console.log('')

 /*  const { gender, photo, birthDate, description, favoriteSports} = req.body; */
  User.updateOne( 
    {token:req.body.token},
    {gender : req.body.gender, 
    photo : req.body.photo,
    birthDate : req.body.birthDate,
    description : req.body.description,
    $push : {favoriteSports : {sport:req.body.sport, level: req.body.level} }}
                          
    )
  .then(() => { 
  res.json({ result: true })});
  });

  router.post('/signin', (req, res) => {
    if (!checkBody(req.body, ['email', 'hash'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    User.findOne({ email: req.body.email }).then(data => {
      if (data && bcrypt.compareSync(req.body.hash, data.hash)) {
        res.json({ result: true, token: data.token });
      } else {
        res.json({ result: false, error: 'User not found or wrong password' });
      }
    });
  });


module.exports = router;
