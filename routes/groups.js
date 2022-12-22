var express = require('express');
var router = express.Router();
const Group = require('../models/groups');
const Sport = require('../models/sports');
const User = require('../models/users');
const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// const cloudinary = require('cloudinary').v2;
// const uniqid = require('uniqid');
// const fs = require('fs');
const mongoose = require('mongoose');


router.post('/create', (req, res) => {

    let { token, photo, name, sport, maxMembers, genders, levels, ageMin, ageMax, description, label, latitude, longitude } = req.body;


    if (!token && !photo && !name && !sport && !maxMembers && !genders && !levels && !ageMin && !ageMax && !description && !label && !latitude && !longitude) {
        res.json({ result: false, message: 'Missing or empty fields.' });
        return
    };

    Sport.findOne({ label: sport }).then(sport => {
        User.findOne({ token: token })
            .then(user => {
                const newGroup = new Group({
                    admin: user._id,
                    photo,
                    name,
                    sport: sport._id,
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
                    User.updateOne(
                        { token: token },
                        { $push: { registrations: { group: newEntry._id, status: "Approved" } } }
                    ).then(() => {
                        res.json({ result: true, message: 'New group created successfully.', data: newEntry });
                    })
                });
            });
    })
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

// Retrieves group information
router.post('/main', (req, res) => {
    let { group_id } = req.body;
    const isGroupIdValid = mongoose.Types.ObjectId.isValid(group_id);

    if (!isGroupIdValid) {
        res.json({ result: false, message: 'Invalid group id.' });
        return;
    };

    Group.findById(group_id)
        .populate('sport', 'label -_id')
        .populate('admin', 'username -_id')
        .then(groupData => {
            if (groupData) {
                res.json({ result: true, groupData })
            } else {
                res.json({ result: false, message: 'No group found for group id received.' })
            }
        });
});


//Get all memebers of a given group 
router.post('/members', (req, res) => {
    let { group_id } = req.body;

    User.find({ 'registrations.group': group_id })
        .then(userdata => {
            res.json({ result: true, userdata })
        })
})



//upload group picture

router.post('/upload', async (req, res) => {

    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.groupPicture.mv(photoPath);

    if (!resultMove) {
        const resultCloudinary = await cloudinary.uploader.upload(photoPath);
        res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
        res.json({ result: false, error: resultMove });
    }
    fs.unlinkSync(photoPath);

});

router.put('/picture', (req, res) => {
    const { group_id, url } = req.body
    Group.updateOne(
        { _id: group_id },
        { photo: url }
    ).then(() => {
        Group.findOne({ _id: group_id }).then(data => {
            res.json({ result: true, photo: data.photo });
        });

    });
})


module.exports = router;
