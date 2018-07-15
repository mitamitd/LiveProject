    // grab themongoose module
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    // define our nerd model
    // module.exports allows us to pass this to other files when it is called
    //mongoose.connect('mongodb://192.168.43.2:27017/test');

    var config = {};
    config.login = mongoose.model('logins', {user_id:{type : String},password:{type : String}
    });
    //config.user = mongoose.model('users', new Schema({ type: Schema.Types.Mixed }, { strict : false }));

    config.user = mongoose.model('users',{
        first_name:{type:String},
        last_name:{type:String},
        rollno:{type:String},
        user_id:{type:String},
        key:{type:Schema.Types.Mixed},
        studnetDetailAttArr:{type:Schema.Types.Mixed},
        school_code: {type:String},
        father_name: {type:String},
        sex: {type:String},
        mother_name: {type:String},
        admission_no: {type:String},
        phone_no: {type:String},
        caste: {type:String},
        address: {type:String},
        qualification: {type:String},
        caste_name: {type:String},
        aadhar_no: {type:String},
        user_type: {type:String},
        teacher_added: Number,
        school_name: {type:String},
        head_school_name: {type:String},
        head_school_code: {type:String}
        })
    //config.attendance = mongoose.model('attendances', new Schema({ type: Schema.Types.Mixed }, { strict : false }));
    config.attendance = mongoose.model('attendances',{
        data:{att:String,user_id:{type:String}},
        updated_on:
         { 
            datetime:{type:Number},
            date: {type:Number},
            datejs: {type:Schema.Types.Mixed},
            datetimejs:{type:Schema.Types.Mixed},
            date_YYYYMMDD:{type:String},
            month: {type:Number},
            year: {type:Number},
            day: {type:Number} 
        }
    })


    config.school = mongoose.model('schools',{
        school_name:{type : String},
        school_code:{type : String},
        head_school_name:{type : String},
        head_school_code:{type : String}
    })


    config.class_master = mongoose.model('classes_masters',{
        class_name:{type : String},
        class_code:{type : String},
        school_name:{type : String},
        school_code:{type : String}
    })

    config.subjects =  mongoose.model('class_wise_subjects', new Schema({
        "class_code":String,
        "subjects" : [
            {
                "sub_code" : Number,
                "subject_name" : String,
                "total_marks":String
            }]
    }));

    config.exam = mongoose.model('exams',new Schema({
        "exam_name":String,
        "school_code":String,
        "is_active":String,
        "updated_by":String,
        "exam_code":Number   
    }))
    config.results =  mongoose.model('results', new Schema({
        "first_name" : String,
        "rollno" : Number,
        "class_code" : String,
        // "class_teacher" : String,
        "user_id" : String,
        "exam_name" : String,
        "updated_by":String,
        "school_code":String,
        "results" : [
            {
                "sub_code" : Number,
                "subject_name" : String,
                "obtain_marks" : Number,
                "total_marks" : Number,
                "subject_teacher" : String,
                "user_id" : String
            }
        ]
    }))


    config.user_direction = mongoose.model('user_directions',{

    })



    /*---------------Extras------------------*/

    config.protection = mongoose.model('protections', {
        user_id : {type : String, default: ''},
        key : {type : String, default: ''}
    });

    config.test1 = mongoose.model('test1', {
        name : {type : String, default: ''}
    });

    config.dummy = mongoose.model('dummy', {name : {type : String, default: ''}
    });
    config.loginid = mongoose.model('loginid', {
        name : {type : String, default: ''}
    });

    config.login_log = mongoose.model('login_log', {
        name : {type : String, default: ''}
    });



    module.exports = config;

    //module.exports = mongoose.model('user', {
    //    name : {type : String, default: ''}
    //});