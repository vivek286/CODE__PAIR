// CREATE STRING FOR URL SESSIONID ==========================================================================================
function createString() {
  var hash;
  var firstWord = randomWord();
  var secondWord = randomWord();
  var number = Math.floor(Math.random()*999)+1;

  hash = firstWord + number + secondWord;
  return hash.toString();
} 

function randomWord(){
  var words = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cherry", "Grapefruit", "Lemon", "Lime",
                "Coconut","Kiwi","Peach","Pear","Pineapple","Melon","Watermelon","Raspberry","Strawberry","Hanger",
                "Grape","Plum","London","Dublin","Moscow","Berlin","Madrid","Paris","Stockholm","Vienna",
                "Chair","Texas","California","Nevada","Florida","Montana","Bravo","Delta","Echo","Hotel",
                "Tango","Whiskey","Foxtrot","Golf","Zulu","Yankee","Magnet","Button","Watch","Red",
                "White","Green","Black","Yellow","Grey","Blue","Pink","Purple","Diary","Bottle",
                "Water","Fire","Wind","Sweet","Sugar","Stamp","Brush","Small","Medium","Large",
                "Brown","Piano","Guitar","Canvas","Carrot","Mouse","Dog","Cat","Squirrel","Truck",
                "Rabbit","Toothbrush","Chalk","Puddle","Elephant","Giraffe","Frog","Falcon","Eagle","Parrot",
                "Shark","Tiger","Butterfly","Turtle","Snake","Fish","Whale","Walrus","Kangaroo","Wolverine"];
  return words[(Math.floor(Math.random()*100)+0)];
}

//==========================================================================================================================

// FILE SYSTEM METHODS FOR DOWNLOADING CHAT & CODE =========================================================================

  function grabCode(){
      var code = driverEditor.getSession().getValue();

      var hiddenElement = document.createElement('a');

      hiddenElement.href = 'data:attachment/text,' + encodeURI(code);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'code.'+codeDownload;
      hiddenElement.click();
  }

  function grabNavCode(){
      var code = navEditor.getSession().getValue();

      var hiddenElement = document.createElement('a');

      hiddenElement.href = 'data:attachment/text,' + encodeURI(code);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'code.'+codeDownload;
      hiddenElement.click();
  }


  function grabChat(){
      //var chat = document.getElementById('chat-messages').textContent;

      var hiddenElement = document.createElement('a');

      hiddenElement.href = 'data:attachment/text,' + encodeURI(stringMessage);
      hiddenElement.target = '_blank';
      hiddenElement.download = sessionId+'.txt';
      hiddenElement.click();
  }

  function postCode(){

  }

//=============================================================================
// SEND CODE // SET CODE //====================================================

/*function setCode(){
  try{
      var socket = io.connect('http://127.0.0.1:8080');
    } catch(e){

    }
  if(socket !== undefined){
      //put latest string in DB to ACE
      socket.on('codeNavigator', function(data){
        if(data.length){
          var x = data.length-1;
          navEditor.setValue(data[x].code);
        }
      });
  }
}*/

function sendCode(){
  try{
      var socket = io.connect('http://127.0.0.1:8080');
    } catch(e){

    }
  if(socket !== undefined){
    var session = sessionId;
    var manip = driverEditor.getSession().getValue();
      socket.emit('codeDriver',{
        session:session,
        code:manip
      })
  }
}



//===================================================================================
// REMOVE USER=======================================================================
function deleteUser(finishedEmail){
    try{
      var socket = io.connect('http://127.0.0.1:8080');
      console.log("success");
    } catch(e){
      console.log("fail");
    }
    if(socket !== undefined){
        var email = finishedEmail;
        socket.emit('userDelete',{
          email:email
        })
    }
}

// SESSION INITIALISE =================================================================
function driverInit(finishedEmail){
  try{
      var socket = io.connect('http://127.0.0.1:8080');
      console.log("success");
    } catch(e){
      console.log("fail");
    }
    if(socket !== undefined){
      console.log("here");
        var sessionId = session;
        var email = finishedEmail;
        socket.emit('driverInit',{
          sessionId:sessionId,
          email:email
        })
      console.log("here2");
    }
}

// redirects will be in the HTML file
// check if driver matches (send boolean) ===========================================================
function checkDriver(){
  try{
    var socket = io.connect('http://127.0.0.1:8080');
    console.log("success");
  } catch(e){
    console.log("fail");
  }
  if(socket !== undefined){
    console.log("driverHere1");
    var sessionId = session;
    var email = finishedEmail;
      socket.emit('checkDriver',{
        sessionId:sessionId,
        email:email
      })
    console.log("driverHere2");
  }
}

// check if navigator matches (senc boolean) ========================================================
function checkNav(){
  try{
    var socket = io.connect('http://127.0.0.1:8080');
    console.log("success");
  } catch(e){
    console.log("fail");
  }
  if(socket !== undefined){
    console.log("navHere1");
    var sessionId = session;
    var email = finishedEmail;
      socket.emit('checkNavigator',{
        sessionId:sessionId,
        email:email
      })
    console.log("navHere2");
  }
}

// if driver matches get code =======================================================================
function getCode(){
  try{
    var socket = io.connect('http://127.0.0.1:8080');
    console.log("success");
  } catch(e){
    console.log("fail");
  }
  if(socket !== undefined){
    console.log("drivercode1");
    var sessionId = session;
    socket.emit('getDriverInitCode',{
        sessionId:sessionId,
      })
    console.log("drivercode2");
  }
}

// if navigator matches get code ====================================================================
function getNavCode(){
  try{
    var socket = io.connect('http://127.0.0.1:8080');
    console.log("success");
  } catch(e){
    console.log("fail");
  }
  if(socket !== undefined){
    console.log("navgetcode2");
    var sessionId = session;
    socket.emit('getNavInitCode',{
        sessionId:sessionId,
    })
  console.log("navgetcode2");
  }
}
//===================================================================================================

//  Adding a Navigator to the session ===============================================================
function addNav(){
  try{
    var socket = io.connect('http://127.0.0.1:8080');
    console.log("success");
  } catch(e){
    console.log("fail");
  }
  email_input = document.getElementById("email");
  
  if(socket !== undefined){
      console.log("emailhere1");
      var x = email_input.value;
      var sessionId = session;
        socket.emit('addNav',{
          sessionId:sessionId,
          navigator:x
        })
      console.log("emailhere2");
  }
  alert(x +" has been set as Navigator in the Session");
}

// MODES & THEMES FOR DRIVER =========================================================================
function changeMode(mode){
  driverEditor.session.setMode("ace/mode/"+mode);
  if(mode == 'text'){
    codeDownload = 'txt';
  }else if(mode == 'html'){
    codeDownload = 'html';
  }else if(mode == 'css'){
    codeDownload = 'css';
  }else if(mode == 'javascript'){
    codeDownload = 'js';
  }else if(mode == 'java'){
    codeDownload = 'java';
  }else if(mode == 'python'){
    codeDownload = 'py';
  }else if(mode == 'sql'){
    codeDownload = 'sql';
  }else if(mode == 'csharp'){
    codeDownload = 'cs';
  }else if(mode == 'c_cpp'){
    codeDownload = 'cpp';
  }else if(mode == 'php'){
    codeDownload = 'php';
  }else if(mode == 'ruby'){
    codeDownload = 'rb';
  }
}

function changeTheme(theme){
  driverEditor.setTheme("ace/theme/"+theme);
}

// MODES & THEMES FOR NAV ========================================================================
function changeNavMode(mode){
  navEditor.session.setMode("ace/mode/"+mode);
  if(mode == 'text'){
    codeDownload = 'txt';
  }else if(mode == 'html'){
    codeDownload = 'html';
  }else if(mode == 'css'){
    codeDownload = 'css';
  }else if(mode == 'javascript'){
    codeDownload = 'js';
  }else if(mode == 'java'){
    codeDownload = 'java';
  }else if(mode == 'python'){
    codeDownload = 'py';
  }else if(mode == 'sql'){
    codeDownload = 'sql';
  }else if(mode == 'csharp'){
    codeDownload = 'cs';
  }else if(mode == 'c_cpp'){
    codeDownload = 'cpp';
  }else if(mode == 'php'){
    codeDownload = 'php';
  }else if(mode == 'ruby'){
    codeDownload = 'rb';
  }
}

function changeNavTheme(theme){
  navEditor.setTheme("ace/theme/"+theme);
}

// UPLOAD FILE ========================================================================

function uploadFile(){
  var inputFile = document.getElementById("file-upload");
  var txt = document.getElementById('txt');

  inputFile.addEventListener("change", function(){
    var files = inputFile.files;
    var reader = new FileReader();
    var text;
    reader.onload = function(e) {
        var text = reader.result;
        console.log(text);
        driverEditor.session.setValue(text);
        sendCode();
    }
    reader.readAsText(files[0]);
  });
}
/*
<input type="file" id="file-upload"/>
<div id="txt"></div>

var inputFile = document.getElementById("file-upload");
var txt = document.getElementById('txt');

inputFile.addEventListener("change", function(){
    var files = inputFile.files;
    var reader = new FileReader();
    reader.onload = function(e) {
        txt.innerText = reader.result;
    }
    reader.readAsText(files[0]);  
});


possibly make the div invisible
style="visibility: hidden"
https://jsfiddle.net/r2tyw0wb/
*/
