var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');

const Sport = require('../models/sports');

router.post('/', (req, res) => {
    // Check if all fiels are filled out
    if (!checkBody(req.body, ['label'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    const sportToSave = req.body.label.toLowerCase()

    Sport.findOne({ label: sportToSave }).then(data => {
        if (data === null) {
            const newSport = new Sport({
                label: sportToSave
            });
            newSport.save().then(newDoc => {
                res.json({ result: true, token: newDoc.token });
            });
        }
        else {
            // User already exists in database
            res.json({ result: false, error: 'Sport already exists' });
        }
    })
})

router.get('/', (req, res) => {
    Sport.find().then(data => {
        sportsData = data.map(e => e.label)
        res.json({ result: true, sports: sportsData });
    });
})




module.exports = router;
