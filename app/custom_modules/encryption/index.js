/**
 * Created by a1san on 27-06-17.
 */

const Cryptr = require('cryptr'),
    cryptr = new Cryptr('ssha');

obj={};

obj.encryptpwd=function (pwd) {
    return cryptr.encrypt(pwd)
};

obj.matchpwd=function (userpwd,dbpwd) {
    if(cryptr.encrypt(userpwd)==dbpwd)
        return true;
    else
        return false
};
module.exports=obj;