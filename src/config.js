const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://Aryan:login123@userdetails.pktikgi.mongodb.net/?retryWrites=true&w=majority&appName=UserDetails';
mongoose.connect(dbURI)
.then((result) => console.log("Connected to db"))
.catch((err) => console.log(err));

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true //email is unique
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;