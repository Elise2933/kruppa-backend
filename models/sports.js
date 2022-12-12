const mongoose = require('mongoose');

const sportsSchema = mongoose.Schema({
    label: String
});

const Sport = mongoose.model('sports', sportsSchema);

module.exports = Sport;
