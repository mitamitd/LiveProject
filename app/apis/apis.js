        /**
         * Created by Amit on 6/14/2017.
         */

        var mdb = require('../models/bear');
        //var admin_apis = require('../apis/admin_apis')
        var imports = require('../custom_modules/imports/index');
        var moment = require('moment');
        var alasql = require('alasql');



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
            console.log("working")
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
                            var sessionID = app.getSessionId();
                           console.log("success login"+" "+sessionID);
                            mdb.user.update({user_id:username}, { $set:{key:sessionID}}, {upsert:true}, function(err, doc){
                                console.log("success login1");
                                if (err) {  
                                        return app.sendError(req,res,"Error in updating Session",err);
                                        }
                                else {
                                    console.log(JSON.stringify(doc) + "logins response");
                                    //app.send(req, res, doc);
                                    sendUserInfo(req,res,sessionID,username);
                                }

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
                mdb.user.find({'class_code':class_code,'school_code':school_code,'user_type': 'student'},function(err,data){
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


            app.get('/api/getClassAtt1/',function(req,res){
                        var username = req.query.username;
                        var class_code = req.query.class_code;
                        var school_code = req.query.school_code;
                        var sdate = req.query.sdate;
                        var sdateMillisec = imports.db.dates.currmilli(new Date(sdate));
                        var edate = req.query.edate;
                        var edateMillisec = imports.db.dates.currmilli(new Date(edate));
                        var download = req.query.download;
             var obj = {"data.school_code":school_code,"data.class_code":class_code,"updated_on.date": {"$gte": sdateMillisec, "$lte": edateMillisec}}
                        mdb.attendance.find(obj,function(err,classAttData){
                                if(err){
                                    app.sendError(req,res,"No Data found",err);
                                        }
                                else
                                    {
    //                                console.log("getClassAtt-------------------- "+classAttData);
                                    if(classAttData.length>0){
                                            getStudentsofClass(class_code,school_code,function(allStudents){
                                                    var allBtwDates = [];
                                                    var startDate = moment(sdate).startOf('day');
                                                    var lastDate = moment(edate).startOf('day');
                                                    allBtwDates.push(moment(startDate).format('YYYY-MM-DD'));
                                                    console.log("--------------------working-------------------")
                                                    
                                                    while(startDate.add(1, 'days').diff(lastDate) < 1) {
                                                            //console.log(startDate.toDate());
                                                            allBtwDates.push(moment(startDate).format('YYYY-MM-DD'));
                                                        }
                                                        console.log(allBtwDates)
                                                        var dataToDownload = [];
                                                    for(var k=0;k<allStudents.length;k++){
                                                        var obj = {"first_name": allStudents[k].first_name,"last_name": allStudents[k].last_name,"user_id": allStudents[k].user_id,"rollno": allStudents[k].rollno};
                                                        allStudents[k].studnetDetailAttArr = [];
                                                        for(var i=0;i<allBtwDates.length;i++)
                                                            {
                                                            var isDateFound = false;
                                                            for(var j=0;j<classAttData.length;j++){
                                                                var updatedon = classAttData[j].updated_on;
                                                                var dateAsKey = ""+allBtwDates[i]+"";
                                                                if(allBtwDates[i] == updatedon.date_YYYYMMDD && allStudents[k].user_id==classAttData[j].data.user_id)
                                                                    {
                                                                    isDateFound = true;
                                                                    allStudents[k].studnetDetailAttArr.push(classAttData[j].data);
                                                                    
                                                                    //console.log("--"+dateAsKey)
                                                                    var dataAtt = classAttData[j].data;
                                                                    obj[dateAsKey] = dataAtt["att"];
                                                                    console.log(obj[dateAsKey])
                                                                    break;
                                                                    }
                                                                }
                                                                if(!isDateFound){
                                                                    allStudents[k].studnetDetailAttArr.push({"att":"-","date":allBtwDates[i]});
                                                                    obj[dateAsKey] = "-";
                                                                    }
                                                            }
//                                                            console.log(allStudents)
                                                            dataToDownload.push(obj)
                                                        }
                                                        //console.log(dataToDownload)
                                                        if(download){
                                                            app.send(req,res,dataToDownload);
                                                        } else                                                       
                                                        app.send(req,res,allStudents);

                                            });

    //                                        app.send(req,res,data);
                                            }
                                    else{
                                        app.sendError(req,res,"No data found!!",err);
                                        }
                                    }
                });



                    });


     var getStudentsofClass = function(class_code,school_code,callback){
         mdb.user.find({"user_type":"student","class_code":class_code,"school_code": school_code},function(err,data){
                    if(err){
                        app.sendError(req,res,"No Data found",err);
                    }
                    else
                    {
    //                    console.log("class student data "+data);
                        if(data.length>0){

                            callback(data)
    //                        app.send(req,res,data);
                        }
                        else
                            app.sendError(req,res,"No students found",data);
                    }
                });
            }


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
                                    
        //                                data = app.getDataInFormat1(data);

                                        app.send(req,res,data);
                                             }
                                    else{

                                        app.send(req,res,"No data found!!",data);
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
            mdb.user.find({"user_type":"student","class_code":class_code,"school_code": school_code},function(err,data){
                if(err){
                    app.sendError(req,res,"No Data found",err);
                }
                else
                {
                    console.log("class student data "+data);
                    if(data.length>0){
        //                data = app.getDataInFormat1(data);
                        app.send(req,res,data);
                    }
                    else
                        app.send(req,res,data);
                }
            });
        });

        app.get('/api/downloadexcel/', function (req, res) {
            app.sendCSV(req,res,[],[],"");
            });

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
                            console.log('date ---'+JSON.stringify(data));
                            
                             console.log(body.school_code+"");
                                    mdb.school.find({"school_code":body.school_code},function(err,data){
                                        if(err){
                                            app.sendError(req,res,"error",err);
                                                }
                                        else
                                                {
                                                    
                                        if(data.length>0)
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

        }



        var sendUserInfo = function(req,res,sessionID,username){
                mdb.user.find({'user_id':username},function(err,data){
                    if(data.length>0)
                            {
        /*                     data = new app.getDataInFormat(data);
                               data.sessionID = sessionID;*/
                              return app.send(req,res,data);
        //                        return app.send(req,res,{username:"smt01"});
                          }
                  else
                          {
                          app.sendError(req,res,"No user found with this userid","");
                          }
                    });

        }






