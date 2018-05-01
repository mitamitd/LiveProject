

/*var shortid = require('shortid');
var imports = require('./../../custom_modules/imports');*/
var moment = require('moment');
var mdb = require('./../../models/index');


    module.exports = function(app) {

    app.post('/api/add_teacher/', function (req, res) {
        var body = req.body;
        body.class_code = [body.class_code];
        getTeacherPrecodeAndTotalTeacherAdded(req, res, body, function (err, teacherPreCodeAndTotalTeacherAdded) {
            var postCode = teacherPreCodeAndTotalTeacherAdded[0].teacher_added + 1;
            body.user_id = teacherPreCodeAndTotalTeacherAdded[0].teacher_precode + "" + postCode;
            teacherAdmissionNoExistsOrNot(req, res, body, function (err, admisno) {
                addTeacherToDB(req, res, function (err, result) {
                    if (err) {
                        app.sendError(req, res, "Error!!", err);
                    } else {
                        app.send(req, res, result);
                    }
                });

            })
        });
    });


    var getTeacherPrecodeAndTotalTeacherAdded = function(req,res,body,callback){
        mdb.school.find({school_code: body.school_code}, {teacher_precode: 1, _id: 0}, function (err, precode) {
            if (err) {
                app.sendError(req, res, "Error!!", err);
            }
            else if (precode.length > 0) {
                var query_for_total_teacher = {
                    user_type: "teacher",
                    school_code: body.school_code
                }
                mdb.user.find(query_for_total_teacher, {teacher_added: 1, _id: 0}).sort({teacher_added: -1}).limit(1).exec(function (err, result) {
                    if(err){
                        app.sendError(req, res, "Error!!", err);
                    }
                    else if(result.length>0){
                        result = app.getDataInFormat1(result);
                        precode = app.getDataInFormat1(precode);
                        precode[0].teacher_added = result[0].teacher_added;
                        callback(err, precode);
                    }
                    else{
                        app.sendError(req, res, "No teacher id found to assign!!", err);
                    }
                })
            }
            else {
                app.sendError(req, res, "Teacher precode require!!", err);
            }
        })
    }

    var teacherAdmissionNoExistsOrNot = function (req,res,body, callback) {

        mdb.user.find({user_id: body.user_id}, function (err, result) {
            if (err) {
                app.sendError(req, res, "Error!!", err);
            }
            else if (result.length > 0) {
                app.sendError(req, res, "User already exits!!", err);
            }
            else {
            callback(err, result);
            }

        });
    }

    var addTeacherToDB = function (req, res, callback) {
        var user = new mdb.user();
        req.body.user_type = 'teacher';
        user.collection.insert(req.body, function (err, teacherregisterdata) {
                            if (err) {
                                app.sendError(req, res, "Error!!", err);
                            }
                            else {
                                paaswordEntyinlogins(req, res, function (err, success) {
                                    callback(err, teacherregisterdata);
                                });

                            }
                        });
    }
    var paaswordEntyinlogins = function (req, res, callback) {
        var pass = Math.floor(Math.random(1000, 10000) * 10000);
        var data = {
            "user_id": req.body.user_id,
            "password": pass,
            "enabled": "true"
        }
        var logincoll = new mdb.login();
        logincoll.collection.insert(data, function (err, result) {
            callback(err, result)
        })
    };


}



