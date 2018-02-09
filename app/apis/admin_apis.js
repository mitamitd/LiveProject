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

 app.post('/api/add_schools1/', function (req, res) {
    console.log("-----------------------working");
        var username = req.query.username;
        var body  = req.body;
        var full_date_obj = imports.db.dates.full_date_now();
        mdb.login.find({'user_id':username},function(err,data)
                {
                if (err) {
                
                        app.sendError(req,res,"Request error",err);
                         }
                else if(data.length>0){
                     var  school = new mdb.school();
                     console.log(body.school_code+"");
                            school.collection.find({"school_code":body.school_code},function(err,dataarr){
                                if(err){
                                    app.sendError(req,res,"error",err);
                                        }
                                else
                                        {
                                            console.log(JSON.stringify(dataarr)+"");
                                if(dataarr.length>0)
                                         {
                                        console.log("1")
                                        app.sendError(req,res,"School already added!!","");
                                        }
                                else{
                                    console.log("2")
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


 app.post('/api/add_schools/', function (req, res) {

        var username = req.query.username;
        var body  = req.body;
        var full_date_obj = imports.db.dates.full_date_now();

            mdb.login.find({'user_id':username},function(err,data)
                {
                if (err) {
                
                        app.sendError(req,res,"Request error",err);
                         }
                else if(data.length>0){

                        var  school = new mdb.school();
                        console.log({school_code:body.school_code}+"---------")
                            school.collection.find({school_code:body.school_code},function(err,dataarr){
        if(err){
            app.sendError(req,res,"error",err);
        }
        else
        {
              
           

            if(dataarr.length>0)
            {
                console.log("1")
                app.sendError(req,res,"School already added!!","");
            }
            else{
                console.log("2")
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

                else{
                app.sendError(req,res,"No user found with this loginid!!",err);
            }
        });       

        });

}