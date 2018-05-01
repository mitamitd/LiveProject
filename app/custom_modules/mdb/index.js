/**
 * Created by chirag on 29/06/15.
 */

/*
var _db = require('./_db.js');
*/
//var _sqldb = require('./_sqldb.js');


//var mongojs = require('mongojs');
//var configs = require('configs');
//
//console.log('Connecting mongodb to: ' + configs.mongodb);
//
//var db = mongojs(configs.mongodb);
//db.mdb = db;

var db = {};
/*
db.mdb = _db;
*/
//db.msdb = _sqldb;

//Setup Easy Collections:
//db.logins = db.mdb.collection('logins');
//db.projects = db.mdb.collection('projects');
//db.clients = db.mdb.collection('clients');
//db.agents = db.mdb.collection('agents');
// db.field_users = db.mdb.collection('field_users');
//db.users = require('./collections/users.js');
var moment = require('moment');
db.dates = {};
db.dates.full_date = function(_datetime) {
    now_obj = {};
    _datetime = new Date(_datetime);
    var _date = new Date(_datetime.getFullYear(), _datetime.getMonth(), _datetime.getDate());
    _date.setTime( _date.getTime() - _date.getTimezoneOffset()*60*1000 ); // Ensure We GET DATE AS PER UTC TIME

    now_obj.datetime = _datetime.getTime();
    now_obj.date = _date.getTime();
    now_obj.datejs = _date;
    now_obj.datetimejs = _datetime;
    now_obj.date_YYYYMMDD = moment(_datetime).format("YYYY-MM-DD");
    now_obj.month = _datetime.getMonth();
    now_obj.year = _datetime.getFullYear();
    now_obj.day = _datetime.getDate();
    return now_obj;
};

db.dates.currmilli = function(_datetime){
    _datetime = new Date(_datetime);
    var _date = new Date(_datetime.getFullYear(), _datetime.getMonth(), _datetime.getDate());
    _date.setTime( _date.getTime() - _date.getTimezoneOffset()*60*1000 );
    return _date.getTime();
}

db.dates.full_date_now = function() {
    return db.dates.full_date(new Date());
}

db.dates.full_date_from_ms = function(ms) {
    return db.dates.full_date(new Date(ms));
}

db.dates.isDate = function(dateArg) {
    var t = (dateArg instanceof Date) ? dateArg : (new Date(dateArg));
    return !isNaN(t.valueOf());
}

db.dates.isValidRange = function(minDate, maxDate) {
    return (new Date(minDate) <= new Date(maxDate));
}

db.dates.formatDate = function(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    //if (month.length < 2) month = '0' + month;
    //if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}
db.dates.format_YYYYMMDD_date = function(date) {
return moment(date).format("YYYY-MM-DD");
}

db.dates.getDates = function(startDt, endDt) {
    var error = ((db.dates.isDate(endDt)) && (db.dates.isDate(startDt)) && db.dates.isValidRange(startDt, endDt)) ? false : true;
    var between = [];
    //console.log(startDt);
    //console.log(endDt);
    if (error) console.log('error occured!!!... Please Enter Valid Dates');
    else {
        var currentDate = new Date(startDt),
            end = new Date(endDt);
        while (currentDate <= end) {
            var d = db.dates.formatDate(new Date(currentDate));
            between.push(db.dates.full_date(d));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    console.log(between);
    return between;
}

db.array = {};
db.array.getByValue = function(arr, value, property) {

    for (var i=0, iLen=arr.length; i<iLen; i++) {

        if (arr[i][property] == value) return arr[i];
    }
}

db.array.sortArray = function(arr,property){
    arr.sort(function(a,b) {return (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0);} );
    return arr;
}

module.exports = db;