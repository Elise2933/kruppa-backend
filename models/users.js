const mongoose = require('mongoose');



const favoriteSportSchema = mongoose.Schema({
    sport: String, //{ type: mongoose.Schema.Types.ObjectId, ref: 'sports' },
    level: String,
});

const registrationSchema = mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'groups' },
    status: String,

});

const usersSchema = mongoose.Schema({
    username: String,
    gender: String,
    email: String,
    hash: String,
    photo: String,
    birthDate: Date,
    description: String,
    favoriteSports: [favoriteSportSchema],
    registrations: [registrationSchema],
    token: String
});

const User = mongoose.model('users', usersSchema);

module.exports = User;
