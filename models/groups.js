const mongoose = require('mongoose');

const localisationSchema = mongoose.Schema({
    label: String,
    latitude: Number,
    longitude: Number,
});

const groupsSchema = mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    photo: String,
    name: String,
    sport: String, //{ type: mongoose.Schema.Types.ObjectId, ref: 'sports' },
    maxMembers: Number,
    genders: [String],
    levels: [String],
    ageMin: Number,
    ageMax: Number,
    description: String,
    localisation: localisationSchema,
});

const Group = mongoose.model('groups', groupsSchema);

module.exports = Group;
