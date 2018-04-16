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

    app.post('/api/add_schools/', function (req, res) {
    var username = req.query.username;
    var body  = req.body;
    var school_code_ = body.school_code;
    
    var full_date_obj = imports.db.dates.full_date_now();
    mdb.login.find({'user_id':username},function(err,data)
    {
        if (err) {
         app.sendError(req,res,"Request error",err);
     }
     else if(data.length>0){
       var  school = new mdb.school();
       mdb.school.find({"school_code":school_code_},function(err,dataarr){
        if(err){
            app.sendError(req,res,"error",err);
        }
        else
        {
           if(dataarr.length>0)
            {
                app.sendError(req,res,"School already added!!","");
            }
            else{
                school.collection.insert(body,function(err,data1){
                    if(err){
                        app.sendError(req,res,"error",err);           
                    }
                    else{
                      app.send(req,res,data1);        
                  }
              });
            }
        }

    }); 
   }
});
});

app.get('/api/get_all_schools/', function (req, res) {
      mdb.school.find({},function(err,data){
              if(err){
                app.sendError(req,res,"error",err);
              }else{
                app.send(req,res,data);
              }
          });
    
});

app.get('/api/get_all_classes/', function (req, res) {
      var school = req.query.school;
      mdb.class_master.find({school_code:school},function(err,data){
              if(err){
                app.sendError(req,res,"error",err);
              }else{
                app.send(req,res,data);
              }
          });
    
});

app.post('/api/get_add_class_url/',function(req,res){
            var query = {
              class_name:req.body.class_name,
              section:req.body.section,
              school_code:req.body.school_code
            }

            mdb.class_master.find(query,function(err,data){
                  if(err){
                    app.sendError(req,res,"error",err);
                  }
                  else{
                    if(data.length>0){
                   app.sendError(req,res,"Class already added",err);   
                    }
                    else{
                          query.class_code = req.body.class_name + req.body.section;
                          query.school_name = req.body.school_name;
                          console.log(query+"");
                          var class_master = new mdb.class_master();
                          class_master.collection.insert(query,function(err,data){
                            if(err){
                              app.sendError(req,res,"Error!!",err); 
                            }
                            else{
                              app.send(req,res,data);
                            }
                          });
                  }
                  }
            });

});



app.get('/api/get_all_user_url/', function (req, res) {
      var school = req.query.school;
    var class_code = req.query.class_code;
      mdb.user.find({school_code:school,class_code:class_code},function(err,data){
              if(err){
                app.sendError(req,res,"error",err);
              }else{
                app.send(req,res,data);
              }
          });
    
});

    app.get('/api/get_all_student_of_school_and_classes/', function (req, res) {
        var school_code = req.query.school_code;
        var class_code = req.query.class_code;
        mdb.user.find({school_code:school_code,"user_type": "student",class_code:class_code},function(err,data){
            if(err){
                app.sendError(req,res,"error",err);
            }else{
                app.send(req,res,data);
            }
        });

    });







app.post('/api/add_student/',function(req,res){
    var body = req.body;
    mdb.user.find({user_id:req.query.username},function(err,data){
    if(err){
        app.sendError(req,res,"error",err);
    }else if(data.length>0) {
        studentAdmissionNoExistsOrNot(body,function(err,admisno){
            if(err){
                app.sendError(req,res,"Error!!",err);
            }
            else if(admisno.length>0){
                app.sendError(req,res,"Admission No already exist",err);
            }
            else{
                addStudentToDB(req,res,function(err,result){
                    if(err){
                        app.sendError(req,res,"Error!!",err);
                    }else{
                        app.send(req,res,result);
                    }
                });
            }
        })
    }
    else{
        app.sendError(req,res,"user not found!!",err);
    }
    });
});

var studentAdmissionNoExistsOrNot = function(body,callback){
    mdb.user.find({admission_no:body.admission_no},{admission_no:1},function(err,result){
    callback(err,result);
    });
}

var addStudentToDB = function(req,res,callback){

    var body = req.body;

    body.user_type = 'student';

    var query_for_roll_no = {
        class_code:body.class_code,
        user_type:"student",
        school_code:body.school_code
    }

    var user = new mdb.user();
    console.log(JSON.stringify(query_for_roll_no)+"");
    mdb.user.find(query_for_roll_no,{rollno:1,_id:0}).sort({rollno:-1}).limit(1).exec(function(err,result) {
        var r = JSON.stringify(result[0]);
        var r1 = JSON.parse(r);
        if (err) {
            app.sendError(req, res, "Error!!", err);
        }
        else if (result.length > 0) {
        body.rollno = r1.rollno+1;

        mdb.school.find({school_code:body.school_code},{student_precode:1,_id:0},function(err,precode){
            if(err){

            }
            else{
                var admission_no_as_userid = body.admission_no;
                var code = JSON.stringify(precode[0]);
                var cdo = JSON.parse(code);
                body.user_id = cdo.student_precode +""+admission_no_as_userid;
                user.collection.insert(body,function(err,studentregisterdata){
                    if(err){
                        app.sendError(req, res, "Error!!", err);
                    }
                    else {
                        paaswordEntyinlogins(req,res,function(err,success){
                            callback(err, studentregisterdata);
                        });

                    }
                });
            }
        })


        }
        else{
            app.sendError(req, res, "Error in finding roll no!!", err);
        }
    });

}

    var paaswordEntyinlogins = function(req,res,callback){
        var pass =  Math.floor(Math.random(1000,10000) * 10000);
        var data = {
            "user_id": req.body.user_id,
            "password": pass,
            "enabled": "true"
        }
        var logincoll = new mdb.login();
        logincoll.collection.insert(data,function(err,result){
            callback(err,result)
        })
    };














}