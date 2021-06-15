// app/routes.js
var configDB = require('../config/databases.js');

module.exports = function(app, passport,mongo) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    app.get('/auth/github',
      passport.authenticate('github', { scope: [ 'user:email' ] }),
      function(req, res){
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

    app.get('/auth/github/callback', 
      passport.authenticate('github', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/profile');
      });

    // ALL POSSIBLE ROUTES
    app.get('/DRIVER/', isLoggedIn, function(req, res) {
        res.render('createString.ejs', {
            user : req.user // get the user out of session and pass to template
            //console.log(req.url);
        });
    });

    app.get('/DRIVER', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
            //console.log(req.url);
        });
    });

    app.get('/NAV/', isLoggedIn, function(req, res) {
        res.render('infoNAV.ejs', {
            //user : req.user // get the user out of session and pass to template
            //console.log(req.url);
        });
    });

    app.get('/NAV', function(req, res) {
        res.render('infoNAV.ejs', {
            //user : req.user // get the user out of session and pass to template
            //console.log(req.url);
        });
    });

    app.get('/NotDriver', function(req, res) {
        res.render('notDriver.ejs', {
            //user : req.user // get the user out of session and pass to template
            //console.log(req.url);
        });
    });

    app.get('/NotNavigator', function(req, res) {
        res.render('notNav.ejs', {
            //user : req.user // get the user out of session and pass to template
            //console.log(req.url);
        });
    });

    //var x = '+([A-Z])+([0-9])+([A-Z])+'

    app.get('/DRIVER/:id',isLoggedIn, function (req, res) {
        mongo.connect(configDB.url, function(err, db1){
            if(err) throw err;
           // assert.equal(null, err);
  console.log("Connected successfully to server");
            // var col = db.collection('session');
            var col=db1.db('session');
            var temp=req.params.id;
            // var col=db1.db('session');
            col.collection('session').findOne({sessionId:req.params.id}, function(err, document){
                console.log(document+' jai hind  '+temp);
                document=temp;
                if(document != null){
                    res.render('driver.ejs', {
                        user : req.user // get the user out of session and pass to template
                        //console.log(req.url);
                    });
                }else{
                    res.render('notSession.ejs', {
                        user : req.user // get the user out of session and pass to template
                        //console.log(req.url);
                    });
                }
            });
        });
    });

    app.get('/NAV/:id',isLoggedIn, function (req, res) {
        mongo.connect(configDB.url, function(err, db1){
            if(err) throw err;
            console.log('navigator_db running');
            var col=db1.db('session');
            var temp=req.params.id;
            //var col = db.collection('session');
            col.collections('session').findOne({sessionId:req.params.id}, function(err, document){
                console.log(document);
                document=temp;
                if(document != null){
                    res.render('nav.ejs', {
                        user : req.user // get the user out of session and pass to template
                        //console.log(req.url);
                    });
                }else{
                    res.render('notSession.ejs', {
                        user : req.user // get the user out of session and pass to template
                        //console.log(req.url);
                    });
                }
            });
        });
    });

    
    app.get('/notLoggedIn', function (req, res) {
        res.render('notLoggedIn.ejs', {
        });
    });
    
    // 404 & 500 errors
    app.use(function(req, res, next) {
      res.status(404).send('Sorry cant find that!');
    });

    app.use(function(err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    //res.redirect('/');
    res.redirect('/notLoggedIn');
}

