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
        var school = req.query.school;
        var class_code = req.query.class_code;
        mdb.user.find({school_code:school,"user_type": "student",class_code:class_code},function(err,data){
            if(err){
                app.sendError(req,res,"error",err);
            }else{
                app.send(req,res,data);
            }
        });

    });





app.post('/api/add_user_url/',function(req,res){

  var body = req.body;
  body.class_code = body.class_name+body.section;
  if(body.user_type=='teacher')
  {
    body.class_code = [body.class_name+body.section+""];
  }


  mdb.user_direction.find(
    {'user_type':body.user_type,'class_code':body.class_code,"school_code":body.school_code},function(err,data){
     /* if(body.roll_no.length<2)
        body.roll_no = "0"+body.roll_no;
      console.log(data[0].school_id+body.roll_no)*/
      app.send(req,res,{'user_type':body.user_type,'class_code':body.class_code,"school_code":body.school_code});
    }
    );




  /*var user = new mdb.user();
  user.collection.insert(body,function(err,data){
    if(err){
      app.sendError(req,res,JSON.stringify(err),err); 
    }else{


        var login = new mdb.login();
        var logindata = {
          "user_id": body.user_id,
          "password": body.user_id+"@123",
          "enabled": "true"
        }

        login.collection.insert(logindata,function(err,data1){
              if(err)
              {
                app.sendError(req,res,err,err);
              }
              else
              {
              app.send(req,res,data1);
              }          
        });


    }

  });*/



});

}