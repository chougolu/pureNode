var express = require('express');
var ejs = require('ejs')
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Signup = require('./model/signupmodel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var app = express();

dotenv.config();

//Default middleware.
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.render('home');
})
app.get('/dashboard', (req, res) => {
	res.render('dashboard');
})
app.get('/login', (req, res) => {
	res.render('login');
})

app.get('/update', (req, res) => {
	res.render('update');
})

app.get('/manage',async (req, res) => {
	const dbData = await Signup.find({});
	// console.log(dbData);
if(dbData){
	res.render('manage',{dbRecord:dbData});
}
})

//delete.
app.get('/delData/:dId',async(req,res)=>{
	// console.log(req.params.dId);
	var dData = await Signup.findByIdAndDelete({_id:req.params.dId})
	if(dData){
	res.redirect('/manage');
	}
})

//edit.

app.get('/ediData/:eId',async(req,res)=>{
	// console.log(req.params.eId);
	const eData = await Signup.findOne({_id:req.params.eId});
	// console.log(eData);
	if(eData){
		res.render('update',{edData:eData});
	}
})

//update.

app.post('/update',async(req,res)=>{
	var upData = await Signup.findByIdAndUpdate({_id:req.body.id},{name:req.body.name,email:req.body.email,password:req.body.password})
		res.redirect('/manage')
})


app.post('/login', async (req, res) => {
	// res.render('login');
	// console.log(req.body);
	const { email,password } = req.body;
	// console.log(email);
	const data = await Signup.find({ email });
	// console.log(data);
	if (data.length > 0) {
		// Load hash from your password DB.
		bcrypt.compare(password, data[0].password, function (err, result) {
			if(err){
				console.log('Invalid user.')
			}
			if(result){
				//genrate json web token
				jwt.sign({useId:data._id},"HFREJIDKXNJN",{expiresIn:'1h'},(error,token)=>{
					if(error){
						console.log(error);
					}else{
						console.log(token);
					}
				}) 
				res.redirect('dashboard');
			}else{
				res.redirect('login');
			}
		});
	}
})
app.get('/signup', (req, res) => {
	res.render('signup');
})
app.post('/signup', async (req, res) => {
	// console.log(req.body.name);
	// console.log(req.body.email);
	// console.log(req.body.password);

	//email verification.

	var veriemail = await Signup.findOne({email:req.body.email})
	console.log(veriemail);
	if(veriemail != null){
		console.log('Email is already exist');
	}else{
		//hash password
	bcrypt.hash(req.body.password, 10, async function (err, hash) {
		if (err) {
			console.log(err);
		} else {
			const useSignup = new Signup({ name: req.body.name, email: req.body.email, password: hash });
			const data = await useSignup.save();//save always return a promice .
			if (data) {
				console.log('data inserted successfully.')
				res.render('signup');
			} else {
				console.log('error');
			}
		}
	});
	}

	


})

app.listen(process.env.PORT, () => {
	console.log(`our server is running on ${process.env.STATUS} on this port ${process.env.PORT} .`)
})


// cmd--->npm i jsonwebtoken
// const jwt = require('jsonwebtoken');
// generate jwt token

// jwt.sign({userId:data._id},"HFFHFJKSKES",{expiresIn:'1h'},(error,token)=>{
// 	if(error){
// 		console.log(error);
// 	}else{
// 		console.log(token)
// 	}
// })

// create a environmental file in our node project.

// .env
// cmd--->npm i dotenv
// const dotenv = require('dotenv')//our server page
// dotenv.config();//our server page
// PORT=4000
// STATUS=Development Mode

// process.env.PORT/STATUS

// Meeting ID: 434 373 718 951
// Passcode: 2qU5Cg