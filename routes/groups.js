var express = require('express');
var router = express.Router();
const Group = require('../models/groups');
const Sport = require('../models/sports');
const User = require('../models/users');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');

router.post('/create', (req, res) => {

    let { admin_id, photo, name, sport_id, maxMembers, genders, levels, ageMin, ageMax, description, label, latitude, longitude } = req.body;

    if (!admin_id && !photo && !name && !sport_id && !maxMembers && !genders && !levels && !ageMin && !ageMax && !description && !label && !latitude && !longitude) {
        res.json({ result: false, message: 'Missing or empty fields.' });
        return
    };

    const newGroup = new Group({
        admin: admin_id,
        photo,
        name,
        sport: sport_id,
        maxMembers,
        genders,
        levels,
        ageMin,
        ageMax,
        description,
        workout_location: {
            label,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        }
    });
    newGroup.save().then(newEntry => {
        res.json({ result: true, message: 'New group created successfully.', data: newEntry });
    });
});

router.get('/search', (req, res) => {

    let { sport, latitude, longitude } = req.query;

    if ((!sport && !latitude && !longitude) || ((latitude || longitude) && (!latitude || !longitude))) {
        res.json({ result: false, message: 'Missing or empty fields.' });
        return;
    }

    Sport.findOne({ label: sport })
        .then(sportData => {
            Group.find({
                ...(sport && { sport: sportData._id }),
                ...((latitude && longitude) && {
                    "workout_location.location": {
                        $geoWithin: {
                            $centerSphere: [[Number(longitude), Number(latitude)],
                            10 / 6378.1] //create a file with all consts
                        }
                    }
                })
            })
                .populate('sport')
                .then(groups => {
                    if (groups.length > 0) {
                        res.json({ result: true, groups }) //add map function to transform the object in order to change format and contain latitude and longitude (avoids errors from long/lat by default from mongo)
                    } else {
                        res.json({ result: false, message: 'No groups found.', groups })
                    }
                });
        });
});

router.post('/getbytoken', (req, res) => {
    User.findOne({ token: req.body.token })
        .populate('group')
        .then(data => {
            res.json({ result: true, groups: data.registrations })
            console.log(data);
        });
})

module.exports = router;
