/**
 * Created by Amit on 6/14/2017.
 */

var mdb = require('../models/index');
var shortid = require('shortid');
var imports = require('../custom_modules/imports');
var moment = require('moment');
module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Username, SourceKey");
        next();
    });
}

module.exports = function(app) {

 app.get('/viewdata/', function (req, res) {
        console.log('shiv')
        mdb.test1.find({}, function (err, data) {
            if (err) {
                console.log("Error found!");
            }
            else {
                console.log(data[0].username);
                res.send(data);
            }
        });
        });

app.get('/api/login/', function (req, res) {
        var username = req.query.username;
        var password = req.query.password;
        mdb.login.find({'user_id':username},function(err,data)
            {
            if (err) {
                app.sendError(res,req,"Request error",err);
            }
            else if(data.length>0){
              data = new app.getDataInFormat(data);
               if(data.password==password){
                    console.log("success login");
                    var sessionID = app.getSessionId();
                    mdb.login.update({user_id:username}, { $set:{key:sessionID}}, {upsert:true}, function(err, doc){
                        console.log("success login1");
                        if (err) {  
                                return app.sendError(req,res,"Error in updating Session",err);
                                }
                                console.log(JSON.stringify(doc)+"logins response");
                                sendUserInfo(req,res,sessionID,username);
                              });

                    }
                else
                {
                  app.sendError(req,res,"Password is wrong with this user id","")
                }
            }
            else{
                app.sendError(req,res,"No user found with this userid","");
            }
            
            });
      
        });



app.get('/api/load_data/', function (req, res) {
        var username = req.query.username;
        var class_code= req.query.class_code;
        var school_code= req.query.school_code;
        mdb.user.find({'class_code':class_code,'school_code':school_code,'roll_type': 'student'},function(err,data){
                        if(data.length>0)
                             {
                             data = new app.getDataInFormat1(data);
                             return app.send(req,res,data);
                                }
                            else
                               {
                                  app.sendError(req,res,"No user found with this userid","");
                                }
                        });
    
    });


app.get('/api/check_students_att/', function (req, res) {
    var class_code = req.query.class_code;
    var school_code = req.query.school_code;
    var currdate = imports.db.dates.format_YYYYMMDD_date(new Date());
    mdb.attendance.find({"data.school_code":school_code,"data.class_code":class_code,"updated_on.date_YYYYMMDD":currdate},function(err,data){
        if(err){
            app.sendError(req,res,"No Data found",err);
        }
        else
        {
            console.log('date ---'+JSON.stringify(data));
            if(data.length>0){
                data = app.getDataInFormat1(data);
                app.send(req,res,data);
            }
            else
                app.send(req,res,data);
        }
    });
});



app.post('/api/submit_att',function(req,res){
        var body  = req.body;
        var full_date_obj = imports.db.dates.full_date_now();
        for(var i=0;i<body.length;i++)
        {
            body[i].updated_on = full_date_obj;
        }
        var  attendance = new mdb.attendance(); 
        attendance.collection.insert(body,function(err,data){
            if(err){
        app.sendError(req,res,"error","");                
            }
            else{
        app.send(req,res,data);        
                }


        });
});

app.get('/api/getClassAtt/',function(req,res){
            var username = req.query.username;
            var class_code = req.query.class_code;
            var school_code = req.query.school_code;
            var sdate = req.query.sdate;
            var sdateMillisec = imports.db.dates.currmilli(new Date(sdate));
            var edate = req.query.edate;
            var edateMillisec = imports.db.dates.currmilli(new Date(edate));

            var obj = {"data.school_code":school_code,"data.class_code":class_code,"updated_on.date": {"$gte": sdateMillisec, "$lte": edateMillisec}}
            mdb.attendance.find(obj,function(err,data){
                    if(err){
                        app.sendError(req,res,"No Data found",err);
                            }
                    else
                        {
                            console.log("getClassAtt "+data);
                        if(data.length>0){
                            
                                data = app.getDataInFormat1(data);

                                app.send(req,res,data);
                                     }
                            else{

                                app.send(req,res,data);
                            }
                        }
    });

})


app.get('/api/checkingdate/', function (req, res) {
    var username = req.query.username;
    var date  = req.query.date;
    
    mdb.attendance.find({updated_by:username,"date": {"$gte": date, "$lt": date}},function(err,data){
        if(err){
            app.sendError(req,res,"No Data found",err);
        }
        else
        {
            if(data.length>0){
                        data = app.getDataInFormat(data);
                        app.send(req,res,data.data);
                        }
            else
                app.send(req,res,data);
        }
    });
});

app.get('/api/getClassStudents/', function (req, res) {
    var class_code = req.query.class_code;
    var school_code  = req.query.school_code;
    mdb.user.find({"roll_type":"student","class_code":class_code,"school_code": school_code},function(err,data){
        if(err){
            app.sendError(req,res,"No Data found",err);
        }
        else
        {
            console.log("class student data "+data);
            if(data.length>0){
                data = app.getDataInFormat1(data);
                app.send(req,res,data);
            }
            else
                app.send(req,res,data);
        }
    });
});







var sendUserInfo = function(req,res,sessionID,username){
        mdb.user.find({'user_id':username},function(err,data){
            if(data.length>0)
                    {
                     data = new app.getDataInFormat(data);
                       data.sessionID = sessionID;
                      return app.send(req,res,data);
                  }
          else
                  {
                  app.sendError(req,res,"No user found with this userid","");
                  }
            });

}






