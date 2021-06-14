// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/databases.js');

var fs = require('fs');
var assert = require('assert');

var	http = require('http').Server(app);
var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(http).sockets;

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

 require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // set up ejs for templating

// Load static files
app.use(express.static('views'));



// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport,mongo); // load our routes and pass in our app and fully configured passport

// sending code ================================================================
mongo.connect(configDB.url, function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){
		var col = db.collection('code');
		//send code
		socket.on('codeDriver',function(data){
			var session = data.session;
			var code = data.code;
			client.emit('codeNavigator', [data]);
			col.insert({session:session, code:code}, function(){
				console.log("HERE");
			});
		
			col.find({session:session}).limit(1).sort({_id:-1}).toArray(function(err, res) {
				if(err) throw err;
				console.log(res);
				//client.emit('codeNavigator', res);
			});
		});

		socket.on('getDriverInitCode',function(data){
			console.log("drivercode3");
			var sessionId = data.sessionId;
			console.log(sessionId);
			col.find({session:sessionId}).limit(1000000000000).sort({_id:-1}).toArray(function(err, document) {
				if(err) throw err;
				var x = document.length;
				console.log(x);
				console.log(document);
				console.log(document[0]);
				client.emit('initCodeDriver',document[0]);
			});
			console.log("drivercode4");
		});

		socket.on('getNavInitCode',function(data){
			console.log("navcode3");
			var sessionId = data.sessionId;
			console.log(sessionId);
			col.find({session:sessionId}).limit(1000000000000).sort({_id:-1}).toArray(function(err, document) {
				if(err) throw err;
				var x = document.length;
				console.log(x);
				console.log(document);
				console.log(document[0]);
				client.emit('initCodeNav',document[0]);
			});
			console.log("navcode4");
		});

		var col3 = db.collection('session');
		socket.on('driverInit',function(data){
			console.log("here3");
			var sessionId = data.sessionId;
			var email = data.email;
			var navigator = "none";
			col3.insert({sessionId:sessionId,DRIVER:email,NAVIGATORS:navigator}, function(){
				console.log("successful creation of Session");
			});
			console.log("here4");
		});

		socket.on('addNav',function(data){
			console.log("emailhere3");
			var sessionId = data.sessionId;
			var navigator = data.navigator;
			col3.updateOne({sessionId:sessionId},
				{
					$set:{"NAVIGATORS":navigator}
				}, function(){
					console.log("successful adding of NAV");
			});
			console.log("emailhere4");
		});

		socket.on('checkDriver',function(data){
			console.log("driverhere3");
			var sessionId = data.sessionId;
			var email = data.email;
			console.log(data.email);
			col3.findOne({sessionId:sessionId,DRIVER:email}, function(err, document){
				if(document != null){
					if(document.DRIVER == data.email){
						console.log("found");
						client.emit('firstDriverCheck', "true");
					}
				}else{
					console.log("not found");
				    client.emit('firstDriverCheck', "false");
				}
			});
			console.log();
					console.log("successful check");
			//});
			console.log("driverhere4");
		});

		socket.on('checkNavigator',function(data){
			console.log("navhere3");
			var sessionId = data.sessionId;
			var navigator = data.email;
			console.log(data);
			col3.findOne({sessionId:sessionId,NAVIGATORS:navigator}, function(err, document){
				if(document != null){
					if(document.NAVIGATORS==data.email){
						console.log("found");
						client.emit('firstNavCheck', "true");
					}
				}else{
					console.log("not found");
					client.emit('firstNavCheck', "false");
				}
			});
			console.log("successful check");
			console.log("navhere4");
		});

	});
});

mongo.connect(configDB.url, function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){
		var col = db.collection('messages'),
			sendStatus = function(s) {
				socket.emit('status', s);
			};

		// Emit all messages
		col.find().limit(100).sort({_id: 1}).toArray(function(err, res) {
			if(err) throw err;
			socket.emit('output', res);
		});

		//wait for input
		socket.on('input',function(data){
			var name = data.name,
				sessionId = data.sessionId,
				message = data.message,
				whitespacePattern = /^\s*$/;

			if(whitespacePattern.test(name) || whitespacePattern.test(message)){
				sendStatus('Name and Message is required.');
			}else{
				col.insert({sessionId: sessionId,name: name, message: message}, function(){


					// Emit latest message to All Clients
					client.emit('output', [data]);

					sendStatus({
						message: "Message sent",
						clear: true
					});
				});
			}
		});

		var collection2 = db.collection('code');
		

		//send code
		

		//get code
		//socket.on('codeNavigator',function(data){
			
		//});

		// delete user
		var col2 = db.collection('users');
		socket.on('userDelete',function(data){
			var email = data.email;
			console.log(data.email);
			col2.deleteOne({"local.email":email}, function(){
				console.log("successful deletion");
			});
		});



	});
});

mongo.connect(configDB.url, function(err, db){
	if(err) throw err;
	client.on('connection', function(socket){
		
	});
});

// launch ======================================================================
http.listen(port);
console.log('The magic happens on port ' + port);

/*
//console.log(document.NAVIGATORS);
				if(document.NAVIGATORS != null){
					console.log("found");
					client.emit('firstNavCheck', "true");
				}else{
					console.log("not found");
					client.emit('firstNavCheck', "false");
				}
				var x = col3.findOne({sessionId:sessionId,NAVIGATORS:navigator});
			console.log(x);
			if(x){
				if(x.NAVIGATORS == undefined || x.NAVIGATORS != data.email){
					console.log("not found");
					client.emit('firstNavCheck', "false");
				}else{
					console.log("found");
					client.emit('firstNavCheck', "true");
				}
				//var navEmail = x.NAVIGATORS;
				console.log(x.NAVIGATORS);
			}
*/