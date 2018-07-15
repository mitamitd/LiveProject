var mdb = require('../../models/bear');


module.exports = function(app) {
    app.post('/api/add_schools/', function (req, res) {
    var body  = req.body;
    var school_code_ = body.school_code;
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

   /* app.get('/api/get_all_classes_codes/', function (req, res) {
        var school = req.query.school;
        mdb.class_master.find({school_code:school},{"class_code":1},function(err,data){
            if(err){
                app.sendError(req,res,"error",err);
            }else{
                app.send(req,res,data);
            }
        });

    });*/

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



/*app.get('/api/get_all_user_url/', function (req, res) {
      var school = req.query.school;
    var class_code = req.query.class_code;
      mdb.user.find({school_code:school,class_code:class_code},function(err,data){
              if(err){
                app.sendError(req,res,"error",err);
              }else{
                app.send(req,res,data);
              }
          });
    
});*/
      app.get('/api/get_all_student_of_school_and_classes/',function(req,res){
        var school_code = req.query.school_code;
        var class_code = req.query.class_code;
        mdb.user.aggregate([{$match:{enabled: "true",school_code:school_code,"user_type": "student",class_code:class_code}},{
              "$lookup": {
                "from": "logins", //collection name
                "localField": "user_id", // uid is exists in both collection
                "foreignField": "user_id",
                "as": "result"
                }
              }]).exec().then(function(data){
                              app.send(req,res,data);
                              }).catch(function(err){
                                          console.log(err)
                                          app.sendError(res,res,"Some error found!!",err);
                                        })
      });
    /*app.get('/api/get_all_student_of_school_and_classes/', function (req, res) {
        var school_code = req.query.school_code;
        var class_code = req.query.class_code;
        mdb.user.find({enabled: "true",school_code:school_code,"user_type": "student",class_code:class_code},function(err,data){
            if(err){
                app.sendError(req,res,"error",err);
            }else{
                app.send(req,res,data);
            }
        });
    });*/

    app.get('/api/view_all_teacher/', function (req, res) {
        var school_code = req.query.school_code;
        mdb.user.find({school_code:school_code,"user_type": "teacher",enabled: "true"},function(err,data){
            if(err){
                app.sendError(req,res,"error",err);
            }else{
                app.send(req,res,data);
            }
        });
    });

}