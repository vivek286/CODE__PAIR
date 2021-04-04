const express=require('express');
const path=require('path');
const port =8000;
const app=express();
app.set('view engine','ejs');
app.use(express.urlencoded());
app.set('views',path.join(__dirname,'views'));
var projectdata=[
    {
        h:"",
        c:"body{background-color:red;}",
    }
]
var css="body{background-color:red;}";
var html="";
app.get('/',function(req,res){
   return res.render('home',{title: "CODE PAIR",
        project_data:projectdata,
        css_data:css,
        html_data:html});
});
app.post('/add',function(req,data){
    console.log(req);
    return res.redirect('/');
});




app.listen(port,function(err){
    if(err){
        console.log('error in running server',err);
    }
    console.log('server isrunning on',port);
})