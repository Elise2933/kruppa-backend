var express = require('express');
var router = express.Router();
const Group = require('../models/groups');

router.post('/create', (req, res) => {
    
    let { admin_id, photo, name, sport_id, maxMembers, genders, levels, ageMin, ageMax, description, label, latitude, longitude } = req.body

    if(!admin_id && !photo && !name && !sport_id && !maxMembers && !genders && !levels && !ageMin && !ageMax && !description && !label && !latitude && !longitude) {
        res.json({ result: false, message:'Missing or empty fields.' });
        return
    }

    const newGroup = new Group({
        admin: admin_id,
        photo,
        name,
        sport: sport_id,
        maxMembers,
        genders, //check
        levels, //check
        ageMin,
        ageMax,
        description,
        localisation: {
            label,
            latitude,
            longitude,
        }
    })

    newGroup.save().then(newEntry => {
        res.json({result: true, message: 'New group created successfully.', data: newEntry})
    })
});

router.get('/search/:sport/:latitude/:longitude', (req, res) => {
    
    let { sport, latitude, longitude } = req.params

    if(!sport && (!latitude || !longitude)) {
        res.json({ result: true, message:'Missing or empty fields.' })
    }
});

module.exports = router;
