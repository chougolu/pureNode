const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/practice');


//create a schema
const kittySchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String
});

//register schema
const Signup = mongoose.model('signup', kittySchema);
module.exports=Signup;
