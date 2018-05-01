
var db = require('../_db.js');

var users = db.collection('users');

users.get_user = function(username,onComplete){
    users.find({username:username}).toArray(function(err,docs){
        if(err){
            if(onComplete) onComplete(err,null);
        }else{
            if(docs.length==0){
                if(onComplete) onComplete({
                    error: 'USER_NOT_FOUND_ERROR',
                    message: 'Require User Not Found in DB'
                },null);
            }else if(docs.length == 1){
                if(onComplete) onComplete(null,docs[0]);
            }else{
                if(onComplete) onComplete({
                    error: 'MULTI_USER_FOUND_ERROR',
                    message: 'Multiple Users Found With Same Username'
                },null);
            }
        }
    });
};

users.create_user = function(user){

}

module.exports = users;