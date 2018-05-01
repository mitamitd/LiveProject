// grab themongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// define our nerd model
// module.exports allows us to pass this to other files when it is called
//mongoose.connect('mongodb://192.168.43.2:27017/test');

var config = {};
config.login = mongoose.model('logins', {user_id:{type : String}
});
config.user = mongoose.model('users', {
});



config.attendance = mongoose.model('attendances', new Schema({ type: Schema.Types.Mixed }, { strict : false }));

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

config.user_direction = mongoose.model('user_directions',{
    
})



config.subjects =  mongoose.model('class_wise_subjects', new Schema({
    "class_code":String,
    "subjects" : [
        {
            "sub_code" : Number,
            "subject_name" : String,
            "total":String
        }]
}));
config.results =  mongoose.model('results', new Schema({
    "first_name" : String,
    "rollno" : Number,
    "class_code" : String,
    // "class_teacher" : String,
    "user_id" : String,
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