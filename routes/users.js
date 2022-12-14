var express = require('express');
var router = express.Router();
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcryptjs');


router.post('/signup', (req, res) => {
  // Check if all fiels are filled out
  // console.log('req.body : ' + req.body)
  if (!checkBody(req.body, ['username', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username, email: req.body.email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
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
  if (!checkBody(req.body, ['gender', 'birthDate', 'description', 'token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const { gender, photo, birthDate, description, favoriteSports, token } = req.body;
  User.updateOne(
    { token: token },
    {
      gender,
      photo,
      birthDate,
      description,
      // $push: { favoriteSports: { sport: req.body.sport, level: req.body.level } }
      favoriteSports
    }

  )
    .then(() => {
      res.json({ result: true })
    });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return ;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.hash)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


router.post('/', (req, res) => {

  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // find the user which username is req.params
  User.findOne({ username: { $regex: new RegExp(req.params.username, 'i') } }).then(data => {
    res.json({ result: true, user: data });
  });
});


module.exports = router;
