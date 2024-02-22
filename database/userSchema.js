const mongoose = require('mongoose'); //import mongoose
const mongooseConnection = require('./mongodb'); //import the mongoose connection module created in mongodb.js

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema); //create a new model instance of the user schema

module.exports = User; //export the User model