// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = require('./app/custom_modules/imapp/index');
var morgan     = require('morgan');
var methodOverride = require('method-override')
var _ = require('underscore');
var alasql = require('alasql');
// configure app
// configuration ===========================================
global.app = app;


require('./app/apis/apis')(app);
require('./app/apis/result')(app);
require('./app/apis/admin/admin_apis')(app);
require('./app/apis/admin/registration/student_registration_apis')(app);
require('./app/apis/admin/registration/teacher_registration_apis')(app);

var mdb = require('./app/models/bear');
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose   = require('mongoose');
var db = require('./app/config/db');
mongoose.connect(db.url);
console.log("connected db is "+db.url)
// Handle the connection event
var dbconn = mongoose.connection;
dbconn.on('error', console.error.bind(console, 'connection error:'));

dbconn.once('open', function() {
  console.log("DB connection alive");
});



app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Username, SourceKey");
    /*mdb.user.find({user_id: req.query.username}, function (err, data) {

        if (err) {
            app.sendError(req, res, "error", err);
        } else if (data.length > 0) {
            next();
        }
        else{
            app.sendError(req, res, "No User found with this user id!! Authentication", err);
        }
    });*/
next();
});
                //--------------end----------------//


app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public/')); // set the static files location /public/img will be /img for users

app.get('*',function(req,res){
  //res.sendfile(path.join(__dirname + '/public/views/attendance.html'));
  res.sendfile('./public/index.html');
});
app.get('/api/work/',function(req,res){
var rows = [{a:1, b:10, c:'One'}, {a:2, b:20, c:'Two'} ];
     alasql('SELECT * INTO json("restest280b.json") FROM ?', [rows]);
app.send(req,res,[]);

});
// REGISTER OUR ROUTES -------------------------------
/*app.use('/api', router);
*/
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
