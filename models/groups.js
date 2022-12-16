const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    label: String,
    location: {
        type: { type: String },
        coordinates: [Number] //[longitude, latitude]
    }
});

locationSchema.index = ({ location: '2dsphere' });

const groupsSchema = mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    photo: String,
    name: String,
    sport: { type: mongoose.Schema.Types.ObjectId, ref: 'sports' },
    maxMembers: Number,
    genders: { type: String },
    levels: [{ type: String }],
    ageMin: Number,
    ageMax: Number,
    description: String,
    workout_location: locationSchema,
});

const Group = mongoose.model('groups', groupsSchema);

module.exports = Group;
