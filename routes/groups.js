var express = require('express');
var router = express.Router();

router.get('/search/:sport/:latitude/:longitude', (req, res) => {
    
    let { sport, latitude, longitude } = req.params

    if(!sport && (!latitude || !longitude)) {
        res.json({ result: true, message:'Missing or empty fields.' })
    }
});

module.exports = router;
