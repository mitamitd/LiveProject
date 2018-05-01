// modules =================================================
var express        = require('express');
//var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app  = require('./app/custom_modules/imapp/index');
var moment = require('moment');
var path = require('path');
// configuration ===========================================
global.app = app;	
// config files
var db = require('./config/db');


require('./app/apis/apis')(app);
//require('./app/routes')(app);
require('./app/apis/admin_apis')(app);
require('./app/apis/registration/student_registration_apis')(app);
require('./app/apis/registration/teacher_registration_apis')(app);
var mdb = require('./app/models/index');
//require('./app/apis/')(app)

var port = process.env.PORT || 8080; // set our port
 mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)
console.log("connected db is "+db.url)
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Username, SourceKey");

    mdb.user.find({user_id: req.query.username}, function (err, data) {

        if (err) {
            app.sendError(req, res, "error", err);
        } else if (data.length > 0) {
            next();
        }
        else{
            app.sendError(req, res, "No User found with this user id!!", err);
        }
    });
});

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public/')); // set the static files location /public/img will be /img for users

app.get('/test',function(req,res){
	//console.log(moment(new Date()).format("YYYY-MM-DD"));
//	console.log("date : "+mdbfile.dates.formatDate(new Date()));
	app.send(req,res,[{"abc":"test"}]);
})
app.get('*',function(req,res){
  //res.sendfile(path.join(__dirname + '/public/views/attendance.html'));
  res.sendfile('./public/index.html');
});
//app.get('/viewdata/',function(req,res){
//    console.log('m here')
//    mdb.user.find({},function(err,data){
//        if(err){
//            console.log("Error found!");
//        }
//        else{
////            console.log(data);
//            res.send(data);
//        }
//    })
//});
/*app.get('/nerds',function(req,res){
  res.sendfile('./public/views/nerd1.html');
});*/


// routes ==================================================
//require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
module.exports = app; 						// expose app
