var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.set('view engine', 'ejs');
app.set('views', __dirname );//+ '/views'

app.use(express.static(__dirname)); //+ '/public'

app.get('/client', function(req, res){
  res.render('client', {sayHelloTo: 'world', f:'xa'});
});

app.get('/recr', function(req, res){
  res.render('recr', {sayHelloTo: 'world', f:'xa'});
});

app.get('/client2', function(req, res){
  res.render('client2', {sayHelloTo: 'world', f:'xa'});
});

if(!module.parent){
  app.listen(process.env.PORT || 3001, function(){
    console.log('up and running');
  });
}

var insertDocument = function(db, callback) {
   db.collection('codepair').insertOne( {
      "testid" : "t1",
      "int" : "recr@example.com",
      "client" : "client@example.com",
      "recContent": "Rec content here",
      "solContent": "Sol content here"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into codepair collection.");
    callback();
  });
};

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/foreignhires';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertDocument(db, function() {
      db.close();
  });
});

app.post('/updateRecData', function(req, res) {
	console.log(req.body.recemailaddress);
	console.log(req.body.recrData);
	//io.sockets.in('recr@example.com').emit('getmelatestdata', {msg: message});
});





// const someport=8090;
const io = require('socket.io')(8090);
// const io = new Server(someport);
io.listen(8089,(err)=>{
if(err){
    console.log('error in socket');

}else{
    console.log('server socket is running on 8089');
}
})

io.sockets.on('connection', function (socket) {
	console.log("i am connected");
  socket.on('join', function (data) {
  	console.log("joined");
    socket.join(data.email); // We are using room of socket io
    //io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});


    socket.on('id1changed', function(message) {
    	console.log(message);
    	io.sockets.in('client@example.com').emit('new_msg', {msg: message});
                });
  });
});