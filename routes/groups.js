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
        res.json({result: true, message: 'New group created successfully.', data: newEntry});
    });
});

router.get('/search', (req, res) => {
    
    let { sport, latitude, longitude } = req.query;

    if((!sport && !latitude && !longitude) || ((latitude || longitude) && (!latitude || !longitude))) {
        res.json({ result: false, message:'Missing or empty fields.' });
        return;
    }

    Group.find({
        ...(sport && { sport: {$regex:new RegExp(sport, "i")} }), 
        ...((latitude && longitude) && {"workout_location.location" : {
            $geoWithin: {
            $centerSphere: [[Number(longitude), Number(latitude)], 5 / 3963.2] //create a file with all consts
        }}})
    }).then(groups => {
        if(groups.length > 0) {
            res.json({result: true, groups}) //add map function to transform the object in order to change format and contain latitude and longitude (avoids errors from long/lat by default from mongo)
        } else {
            res.json({result: false, message: 'No groups found.'})
        }
    });
});

module.exports = router;
