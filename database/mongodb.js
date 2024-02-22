const mongoose = require('mongoose');
require('dotenv').config(); //import the dotenv module and call the config method to load the environment variables


const mongooseConnect = mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Database connection error " + err);
    });

module.exports = mongoose; //export the mongoose module