// Initialisierung des Webservers
const express = require('express');
const app = express();


// body-parser initialisieren
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Use public dir to serve file requests
app.use("/public", express.static(__dirname + '/public'));

//Initialize file upload
var multer = require("multer"); // Upload middleware
const crypto = require('crypto'); // File renaming
const mime = require('mime'); // File extensions
var storage = multer.diskStorage({
	destination: function(req,file,callback){
		callback(null, "./public/uploads");
	},
	  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      callback(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});
var upload = multer({storage:storage}).single("uploadFile");


// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// initialize Mongo-DBw
const MONGO_URL = "mongodb://dbuser:dbpassword@ds042677.mlab.com:42677/r8myfridge";
const DB_COLLECTION = "fridges";
const DB_USERCOLLECTION = "users";
const MongoClient = require('mongodb').MongoClient
var db;

MongoClient.connect(MONGO_URL, (err, database) => {
	if (err) return console.log(err)
	db = database
	app.listen(51544, () => {
		console.log('listening on 51544')
	})
});

//session setup
const session = require('express-session');
app.use(session({
    secret: 'this-was-a-secret',     //necessary for encoding
    resave: false,                  //should be set to false, except store needs it
    saveUninitialized: false        //same reason as above.
}));

//password hash, for encoding the pw
const passwordHash = require('password-hash');


// Webserver starten
// Aufruf im Browser: http://localhost:3000

app.listen(3000, function(){
	console.log("listening on 3000");
});
//-------------// root redirect to stream aka home
app.get("/",function(req,res){
	res.redirect("/stream");
});
//-------------// login page
app.get("/login",function(req,res){
	res.render("login");
});
//-------------// personal statistics
app.get("/stats",function(req,res){
	if(req.session.username == null){
	res.redirect("/login");
		console.log(req.session.username);
	}
	res.render("stats");
});
//-------------// stream aka home
app.get("/stream",function(req,res){
		if(req.session.username == null){
			res.redirect("/login");
		console.log(req.session.username);
	}
		db.collection(DB_COLLECTION).find().toArray(function(err, results) {
			console.log(results);
			res.render("stream",{"fridges":results});
});
});
//-------------//upload page
app.get("/upload",function(req,res){
	if(req.session.username == null){
			res.redirect("/login");
	console.log(req.session.username);
}
	else{
			res.render("upload");

	}
});







//POST for Main Menu
//Link for Main menu Bar
app.post("/menu",function(req,res){ein

});
//Link to Accountpage
app.post("/viewAccount",function(req,res){

});
// Link to stats page
app.post("/viewStats",function(req,res){

});
//Link to upload Paage
app.post("/newUpload",function(req,res){

});
//POST for login
// Login Button
app.post("/commitLogin",function(request,response){

	const username = request.body.benutzername;
	const password = request.body.passwort;
	var errors = [];
	request.session.authenticated = false;

	   db.collection(DB_USERCOLLECTION).findOne({'username': username}, (error, result) => {
			if (error) return console.log(error);
			if (result == null) {
				errors.push('Der User ' + username + ' existiert nicht.');
				response.render('errors', {'error': errors});
				return;
			} else {
				if(passwordHash.verify(password, result.password)) {
					request.session.authenticated = true;
					request.session.username = username;
					response.redirect("/stream");
				} else {
					errors.push('Das Passwort für diesen User stimmt nicht überein.');
					response.render('errors', {'error': errors});
				}
			}

	});
	console.log(username + " " + password + " "+passwordHash.generate(password));

});
// Button to create new Account
app.post("/newAccount",function(request,response){
	  const username = request.body.benutzername;
    const password = request.body.passwort;
    const repPassword = request.body.passwort2;
		console.log("bading");

    var errors = [];
    if (username == "" || username == undefined) {
        errors.push('Bitte einen Username eingeben.');
    }
    if (password == "" || password == undefined) {
        errors.push('Bitte ein Passwort eingeben.');
    }
    if (repPassword == "" || repPassword == undefined) {
        errors.push('Bitte ein Passwort zur Bestätigung eingeben.');
    }
    if (password != repPassword) {
        errors.push('Die Passwörter stimmen nicht überein.');
    }

    db.collection(DB_USERCOLLECTION).findOne({'username': username}, (error, result) => {
        if (result != null) {
            errors.push('User existiert bereits.');
            response.render('errors', {'error': errors});
        } else {
            if (errors.length == 0) {
                const encryptedPassword = passwordHash.generate(password);
                const newUser = {
                    'username': username,
                    'password': encryptedPassword
                }
                db.collection(DB_USERCOLLECTION).save(newUser, (error, result) => {
                    if (error) return console.log(error);
                    console.log('user added to database');
                    response.redirect('/');
                });
            } else {
                response.render('errors', {'error': errors});
            }
        }
});
});

//Passwort reset
app.post("/resetPassword",function(request,response){
	   const username = request.body.benutzername;
    const password = request.body.passwort1;
    const repPassword = request.body.passwort2;
	  const oldPassword = request.body.passwortAlt;

    var errors = [];
    if (username == "" || username == undefined) {
        errors.push('Bitte einen Username eingeben.');
    }
    if (password == "" || password == undefined) {
        errors.push('Bitte ein Passwort eingeben.');
    }
    if (repPassword == "" || repPassword == undefined) {
        errors.push('Bitte ein Passwort zur Bestätigung eingeben.');
    }
    if (password != repPassword) {
        errors.push('Die Passwörter stimmen nicht überein.');
    }
	//###########
	db.collection(DB_USERCOLLECTION).findOne({'username': username}, (error, result) => {
			if (error) return console.log(error);
			if (result == null) {
				errors.push('Der User ' + username + ' existiert nicht.');
				response.render('errors', {'error': errors});
				return;
			} else {
				if (passwordHash.verify(oldPassword, result.password)) {
					request.session.authenticated = true;
					request.session.username = username;
					db.collection(DB_USERCOLLECTION).findOne({'username': username}, (error, result) => {
        if (result != null) {
            if (errors.length == 0) {
                const encryptedPassword = passwordHash.generate(repPassword);
								const newUser = {
									'username': username,
                  'password': encryptedPassword
								 }
                db.collection(DB_USERCOLLECTION).save(newUser, (error, result) => {
                    if (error) return console.log(error);
                    console.log('user password changed');
                    response.redirect('/');
                });
            } else {
                response.render('errors', {'error': errors});
            }
        }
				});
				} else {
					errors.push('Das Passwort für diesen User stimmt nicht überein.');
					response.render('errors', {'error': errors});
				}
			}
		});
	});

//POST for stream
//Sort By Date
app.post("/sortByDate",function(req,res){
});
// Sort by Rating
app.post("/sortByRating",function(req,res){
});
//POST for upload
//Upload Button
app.post("/commitUpload",function(req,res){
	const username = req.session.username;
	var filepath;
	var uploadDate;
	var description;
	upload(req,res,function(error){
		if(error){
			console.log(error);
			return res.send("Error uploading file");
		}
	filepath = req.file.path;
	description = req.body.description;
	const newUpload = {
		'username': username,
		'filepath': filepath,
		'uploadDate': new Date(),
		'description': description,
		'rating' : '0'
	 }
	 db.collection(DB_COLLECTION).save(newUpload, (error, result) => {
	    if (error) return console.log(error);
	     res.send(newUpload);
	    });
	});
});

app.post('/rate/:id', (request, response) => {
	const id = request.params.id;
	const rating = request.body.stars;
//	db.collection(DB_COLLECTION).update({"_id": id}, (err, result)=> {
	//	{ $set: { rating : new_info  }
		console.log(id);
	//});
});
