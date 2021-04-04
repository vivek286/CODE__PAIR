const mongoose=require('mongoose');
const Data_Schema=new mongoose.Schema({
    html: {
        type: String,
      
    },
    css: {
        type: String,
        
    },
    js: {
        type: String,
    }
});
const Data=mongoose.model('contact',Data_Schema);
module.exports=Data;