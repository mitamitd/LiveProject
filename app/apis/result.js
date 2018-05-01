var mdb = require('../models/bear');
//var admin_apis = require('../apis/admin_apis')
var async = require('async');

var _ = require('underscore');

module.exports = function(app) {
    //-----------------Create new Result--------------------//
    app.post('/api/create_result/', function (req, res) {
        var results=req.body;
        function getRandomNumber(obj) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    mdb.results.find({user_id:obj.user_id,class_code: obj.class_code}, function(err,data){
                        if(data.length>0){
                            mdb.results.find({user_id: obj.user_id,class_code: obj.class_code,"results.sub_code": obj.results[0].sub_code}, function(err1,data1){
                                var s=obj;
                                if(data1.length>0){
                                    mdb.results.update({user_id: s.user_id,class_code: s.class_code,"results.sub_code": s.results[0].sub_code},{$set:{"results.$.obtain_marks":s.results[0].obtain_marks}  }, function(err3,data3){
                                        resolve()
                                    })
                                }else{
                                    mdb.results.update({user_id: s.user_id,class_code: s.class_code},{$addToSet:{results: s.results[0]} }, function(err3,data3){
                                        console.log(data3);
                                        resolve()
                                    })
                                }
                            })
                        }else{
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
            for (var x = 0; x < results.length; x += 1) {
                console.log( await  getRandomNumber(results[x]));
            }
        }
        logNumbers(results);
        res.send("");
    });
    app.get('/api/get_all_student_for_create_result', function (req, res) {
        var classCode = req.query.class;
        var subCode = req.query.subject;

        mdb.user.find({class_code:classCode,user_type:"student"},function(err,data){
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
        mdb.results.find({"class_code":classCode,"results.sub_code":subCode},{"first_name":1,"results.$":1,"rollno":1,"user_id":1,"class_code":1},function(err,data){
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
        mdb.results.update({user_id: s.user_id,class_code: s.class_code,"results.sub_code":s.results[0].sub_code},{$set:{"results.$.obtain_marks":s.results[0].obtain_marks}}, function(err,data){
            if(err)
                res.send({"msg":"something went wrong"});
            else
                res.send({"msg":"successfully updated"});
        })
    })

    //---------------------------------------------------Final Result API------------//

    app.get('/api/get_all_result/', function (req, res) {
        console.log("working");
        mdb.subjects.find({class_code:req.query.class},function(err,dt) {
            if(dt.length==0 || err){
                res.send({"msg":"Need To Update class "+req.query.class+" Suject"})
            }else{
                mdb.results.find({class_code:req.query.class}, function (err1, data1) {
                    if (err || dt.length==0) {
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
                                demo['Total Marks']= demo['Total Marks']+parseInt(data.subjects[v].total);
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