var express = require('express');
var router = express.Router();
const Group = require('../models/groups');

router.post('/create', (req, res) => {
    
    let { admin_id, photo, name, sport_id, maxMembers, genders, levels, ageMin, ageMax, description, label, latitude, longitude } = req.body;

    if(!admin_id && !photo && !name && !sport_id && !maxMembers && !genders && !levels && !ageMin && !ageMax && !description && !label && !latitude && !longitude) {
        res.json({ result: false, message:'Missing or empty fields.' });
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
                coordinates: [longitude, latitude]
            }
        }
    });
    newGroup.save().then(newEntry => {
        res.json({result: true, message: 'New group created successfully.', data: newEntry})
    });
});

router.get('/search/:sport/:latitude/:longitude', (req, res) => {
    
    let { sport, latitude, longitude } = req.params

    Group.find({
        sport: {$regex:new RegExp(sport, "i")}, 
        "workout_location.location": {
            $geoWithin: {
            $centerSphere: [[Number(longitude), Number(latitude)], 5 / 3963.2]
        }}
    }).then(groups => {
        if(groups.length > 0) {
            res.json({result: true, groups})
        } else {
            res.json({result: false, message: 'No groups found.'})
        }
    })
});

// { $geoWithin:
//     { $centerSphere: [ [ -73.93414657, 40.82302903 ], 5 / 3963.2 ] } } })

module.exports = router;
