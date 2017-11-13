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
	res.redirect("/index");
});

app.get("/index",function(req,res){


		res.render("index");
});

app.get("/upload",function(req,res){
	res.render("upload");
});

app.get("/stats",function(req,res){
	res.render("stats");
});
