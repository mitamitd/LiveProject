var mdb = require('../models/bear');
//var admin_apis = require('../apis/admin_apis')
var async = require('async');

var _ = require('underscore');

module.exports = function(app) {

    
    //----------------------Create new Exam------------------------------//
    app.post('/api/create_new_exam/',function(req,res){
        var exam = req.body;
        var user_id = req.query.user_id;
        var school_code = req.query.school_code;
        
        mdb.exam.find({school_code:school_code,"exam_name":exam.exam_name},function(err,data){
                if(err){
                   app.sendError(req,res,"Some problem occur!!",err); 
                }else if(data.length>0){
                    app.sendError(req,res,"Exam already added!!",err);
                }
                else{
                    generateNewExamCode(req,res,school_code,function(response){
                        updateNewExamToDB(req,res,response,school_code,user_id,exam.exam_name);
                        
                    });

                   }
                
            });
    
    });
    
    var generateNewExamCode = function(req,res,school_code,callback){
        mdb.exam.aggregate([{$match:{school_code:"smtohana"}},{$group:{_id:'$school_code',maxvalue:{$max : "$exam_code"} }} ]).exec(function ( err, data ) {
            if(err){
                app.sendError(req,res,"some error occur",err)
            }
            else if(data.maxvalue!=null){
                callback(data.maxvalue+1);
            }
            else{
                callback(1);
            }          
            });
    }

    var updateNewExamToDB = function(req,res,response,school_code,user_id,exam_name){
        mdb.exam.update({school_code:school_code,is_active:"true"},{$set:{is_active:"false"}},function(err1,data1){
                            if(err1){
                                app.sendError(req,res,"",err1)
                            }
                             else {
                                    var examobj = new mdb.exam();
                                    
                                    examobj.collection.insert({"exam_name":exam_name,exam_code:response,updated_by:user_id,school_code:school_code,is_active:"true"},
                                    function(err2,data2){
                                            if(err2){
                                                app.sendError(req,res,"Some Error occur!!",err2);
                                            }
                                            else{
                                                console.log(data2)
                                                app.send(req,res,"Data inserted successfully");
                                            }
                                        }); 
                                }

                        });
    }

    //-----------------Create new Result--------------------//
    app.post('/api/create_result/', function (req, res) {
        var results=req.body;
        var user_id = req.query.user_id;
        var school_code = req.query.school_code;
        var exam_name = "";
        var exam_code = "";
        function getRandomNumber(obj) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    mdb.results.find({user_id:obj.user_id,exam_code:exam_code,class_code: obj.class_code,school_code:school_code}, function(err,data){
                        if(data.length>0){
                            mdb.results.find({user_id: obj.user_id,exam_code:exam_code,class_code: obj.class_code,school_code:school_code,"results.sub_code": obj.results[0].sub_code}, function(err1,data1){
                                var s=obj;
                                if(data1.length>0){
                                    mdb.results.update({user_id: s.user_id,exam_code:exam_code,class_code: s.class_code,school_code:school_code,"results.sub_code": s.results[0].sub_code},{$set:{"results.$.obtain_marks":s.results[0].obtain_marks}  }, function(err3,data3){
                                        resolve()
                                    })
                                }else{
                                    mdb.results.update({user_id: s.user_id,exam_code:exam_code,class_code: s.class_code,school_code:school_code},{$addToSet:{results: s.results[0]} }, function(err3,data3){
                                        console.log(data3);
                                        resolve()
                                    })
                                }
                            })
                        }else{
                            obj['updated_by'] = user_id;
                            obj['school_code'] = school_code;
                            obj['exam_name'] = exam_name;
                            obj['exam_code'] = exam_code;
                            var  resultsDb = new mdb.results();
                            resultsDb.collection.insert(obj, function(err1,data1){
                                resolve()
                            })
                        }
                    });
                }, 2000);
            });
        }
        async function logNumbers() {
            if(exam_name=="" || exam_code==""){
                res.send({"msg":"Exam name or Exam code not found!! Please contact admin!!"});
                return;
            }
            for (var x = 0; x < results.length; x += 1) {
                console.log( await  getRandomNumber(results[x]));
            }
        }

         mdb.exam.findOne({school_code:school_code,is_active:"true"},{"exam_name":1,"exam_code":1},function(err,data){
            if(err){
                app.sendError(req,res,"Error occur!!",err);
            }else{
                exam_name = data.exam_name;
                exam_code = data.exam_code;
                console.log(data.exam_name);
                logNumbers(results);
                res.send("");
            }
         });
    });

    app.get('/api/get_all_student_for_create_result', function (req, res) {
        var classCode = req.query.class;
        var subCode = req.query.subject;
        var school_code = req.query.school_code;

        mdb.user.find({class_code:classCode,user_type:"student",school_code:school_code},function(err,data){
            if (err) {
                res.send({"msg":"something went wrong"});
            }
            else {
                console.log(data);
                res.send(data);
            }
        });
    });


    //-----------------------End---------------//


    //--------------Edit Page API-----------------------//
    app.get('/api/get_all_student_for_update_result', function (req, res) {
        var classCode = req.query.class;
        var subCode = req.query.subject;
        var school_code = req.query.school_code;
        mdb.results.find({"class_code":classCode,"results.sub_code":subCode,school_code:school_code},{"first_name":1,"results.$":1,"rollno":1,"user_id":1,"class_code":1},function(err,data){
            if (err) {
                console.log("Error found!");
                res.send({"msg":"something went wrong"});
            }
            else {
                res.send(data);
            }
        });
    });

    app.post('/api/update_result/', function (req, res) {
        var s=req.body
        var school_code = req.query.school_code;
        mdb.results.update({user_id: s.user_id,class_code: s.class_code,"results.sub_code":s.results[0].sub_code,school_code:school_code},{$set:{"results.$.obtain_marks":s.results[0].obtain_marks}}, function(err,data){
            if(err)
                res.send({"msg":"something went wrong"});
            else
                res.send({"msg":"successfully updated"});
        })
    })

    //---------------------------------------------------Final Result API------------//

    app.get('/api/get_all_result/', function (req, res) {
        console.log("working");
        mdb.subjects.find({class_code:req.query.class,school_code:req.query.school_code},function(err,dt) {
            if(dt.length==0 || err){
                res.send({"msg":"Need To Update class "+req.query.class+" Suject"})
            }else{
                mdb.results.find({class_code:req.query.class,school_code:req.query.school_code}, function (err1, data1) {
                    if (err || data1.length==0) {
                        console.log("Error found!");
                        res.send({"msg":"No Result created for "+req.query.class+"class"})
                    }
                    else {
                        var data=dt[0];
                        var dataFor=[];
                        for(var t=0;t<data1.length;t++){
                            var demo={};
                            demo["Student Name"]=data1[t].first_name;
                            //  demo.Class=data1[t].class_code;
                            demo['Total Marks']=0;
                            demo['obtain Marks']=0;
                            for( var v=0;v<data.subjects.length;v++){
                                var isExist= _.where(data1[t].results, {sub_code:data.subjects[v].sub_code});
                                if(isExist.length==0){
                                    demo[data.subjects[v].subject_name]="N/A";
                                }
                                else{
                                    demo[data.subjects[v].subject_name]=isExist[0].obtain_marks;
                                    demo['obtain Marks']= demo['obtain Marks']+parseInt(isExist[0].obtain_marks);
                                }
                                console.log("1")
                                console.log(data.subjects[v])
                                demo['Total Marks']= demo['Total Marks']+parseInt(data.subjects[v].total_marks);
                            }
                            dataFor.push(demo)
                        }
                        res.send(dataFor);
                    }
                });
            }

        });

    });

}