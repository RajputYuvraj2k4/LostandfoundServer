//password = I9ticwQniNf6FbtB
const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(() => {
        console.log('Error connecting to MongoDB');
    });