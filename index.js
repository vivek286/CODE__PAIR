const { response } = require('express');
const express=require('express');
const path=require('path');
const port=8000;
const db=require('./config/mongoose.js');
const Contact=require('./models/contact.js');
const app=express();
app.set('view engine','ejs');
app.use(express.urlencoded());

// //middleware1
// app.use(function(req,res,next){
//     console.log('middleware1 is called');
//     next(); 
// });
// // middleware 2
// app.use(function(req,res,next){
//     console.log('middleware2 called');
//     next();
// });     

app.use(express.static('assets'));
var contactList=[
{
    name: "vivek",
    phone: "11111111"
},
{
    name: "hello",
    phone: "87635726"
},
{
    name: "jaiho",
    phone: "876543454"
}
]
app.set('views',path.join(__dirname,'views'));
// app.get('/profile',function(req,res){
//    // console.log(__dirname);
//     return res.render('home',{title: "My Contact List"});
// });
app.get('/',function(req,res){
    Contact.find({},function(err,contacts){
        if(err){ 
            console.log('error in fetching contact fro db');
            return;
        }
        return res.render('home',{
            title: "CONTACT LIST",
            contact_list: contacts
    });
   
    });
});
app.post('/create-contact',function(req ,res){

// console.log(req.body);
// contactList.push(
//     {
//         name: req.body.name,
//         phone: req.body.phone
//     }
// );
// EITHER THIS OR BELOW
// contactList.push(req.body);
//by using mongoose
Contact.create({
    name: req.body.name,
    phone: req.body.phone
},function(err,newContact){
    if(err){console.log('error in creating contact');return;};
    console.log('*******',newContact);
    return res.redirect('/');
});
// return res.redirect('/');
});
app.get('/delete-contact',function(req,res){
    // console.log(req.query);
    //get id from query in the url
    let id=req.query.id;
    //find contact from database and delete it
    Contact.findByIdAndDelete(id,function(err){
        if(err){
            console.log('error in deleting');
            return;
        }
    })
    // let contactindex=contactList.findIndex(contact=> contact.phone==phone);
    // if(contactindex!=-1){
    //     contactList.splice(contactindex,1);
    // }
     return res.redirect('back');
});
app.listen(port,function(err){
    if(err){
        console.log('error in running server',err);
    }
    console.log('express server is running ont port :',port);
});

function newFunction() {
    return '/delete-contact';
}
  