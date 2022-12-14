const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://Kruppa:Kruppa.Sports@cluster0.t5kreua.mongodb.net/kruppa' //process.env.CONNECTION_STRING;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error));
