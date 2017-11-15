// Initialisierung des Webservers
const express = require('express');
const app = express();
app.use('/static', express.static(__dirname + '/public'));


// body-parser initialisieren
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// initialize Mongo-DBw
const MONGO_URL = "mongodb://dbuser:dbpassword@ds042677.mlab.com:42677/r8myfridge";
const DB_COLLECTION = "fridgeDB";
const MongoClient = require('mongodb').MongoClient
var db;

MongoClient.connect(MONGO_URL, (err, database) => {
	if (err) return console.log(err)
	db = database
	app.listen(51544, () => {
		console.log('listening on 51544')
	})
});


// Webserver starten
// Aufruf im Browser: http://localhost:3000

app.listen(3000, function(){
	console.log("listening on 3000");
});

app.get("/",function(req,res){
	res.redirect("/home");
});

app.get("/home",function(req,res){
		res.render("home");
});

app.get("/login",function(req,res){
	res.render("login");
});

app.get("/stats",function(req,res){
	res.render("stats");
});

app.get("/stream",function(req,res){
	res.render("stream");
});

app.get("/upload",function(req,res){
	res.render("upload");
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
app.post("/commitLogin",function(req,res){

});
// Button to create new Account
app.post("/newAccount",function(req,res){

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
app.post("/upload",function(req,res){

});
// File Dialogue
app.post("/selectFile",function(req,res){

});
