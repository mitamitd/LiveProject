

/*var shortid = require('shortid');
var imports = require('./../../custom_modules/imports');*/
var moment = require('moment');
var mdb = require('./../../models/index');


module.exports = function(app) {


    app.post('/api/add_student/', function (req, res) {
        var body = req.body;
        getStudentPrecode(body, function (err, studentPreCode) {
                     if (studentPreCode.length > 0) {
                        var admission_no_as_userid = body.admission_no;
                        var code = JSON.stringify(studentPreCode[0]);
                        var cdo = JSON.parse(code);
                        body.user_id = cdo.student_precode + "" + admission_no_as_userid;
                        studentAdmissionNoExistsOrNot(body, function (err, admisno) {
                                addStudentToDB(req, res, function (err, result) {
                                    if (err) {
                                        app.sendError(req, res, "Error!!", err);
                                    } else {
                                        app.send(req, res, result);
                                    }
                                });
                        })
                    }


                })
    });


    var getStudentPrecode = function(body,callback){
        mdb.school.find({school_code: body.school_code}, {student_precode: 1, _id: 0}, function (err, precode) {
            if(err){

            }else if(precode.length>0) {
                callback(err, precode);
            }
            else{
                app.sendError(req, res, "Student precode require!!", err);
            }
        })
    }

    var studentAdmissionNoExistsOrNot = function (body, callback) {
        mdb.user.find({user_id: body.user_id}, {admission_no: 1}, function (err, result) {
            if (err) {
                app.sendError(req, res, "Error!!", err);
            }
            if (result.length > 0) {
                app.sendError(req, res, "Admission No already exist", err);
            }
            else {
                callback(err, result);
            }
        });
    }

    var addStudentToDB = function (req, res, callback) {
        var body = req.body;
        body.user_type = 'student';
        var query_for_roll_no = {
            class_code: body.class_code,
            user_type: "student",
            school_code: body.school_code
        }
        var user = new mdb.user();
        mdb.user.find(query_for_roll_no, {rollno: 1, _id: 0}).sort({rollno: -1}).limit(1).exec(function (err, result) {
            var r = JSON.stringify(result[0]);
            var r1 = JSON.parse(r);
            if (err) {
                app.sendError(req, res, "Error!!", err);
            }
            else if (result.length > 0) {
                body.rollno = r1.rollno + 1;
                        user.collection.insert(body, function (err, studentregisterdata) {
                            if (err) {
                                app.sendError(req, res, "Error!!", err);
                            }
                            else {
                                paaswordEntyinlogins(req, res, function (err, success) {
                                    callback(err, studentregisterdata);
                                });

                            }
                        });
            }
            else {
                app.sendError(req, res, "No any roll no found for create student!!", err);
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