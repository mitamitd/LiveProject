/**
 * Created by SanJeev on 23-06-2017.
 */


const config =  require('../config');
var mdb = require('mongojs');
//var moment = require('moment');

db = {};
db.mdb = mdb(config.mongodburl);
console.log("Connected MongoDB at ",config.mongodburl);


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
   // console.log("working ------------"+moment(new Date()).format("YYYY-MM-DD"));
    //now_obj.date_YYYYMMDD = _datetime.getFullYear()+((_datetime.getMonth()>9 ? '' : '0') + _datetime.getMonth())+((_datetime.getDate()>9 ? '' : '0') + _datetime.getDate());
    now_obj.month = _datetime.getMonth()+1;
    now_obj.year = _datetime.getFullYear();
    now_obj.day = _datetime.getDate();
    return now_obj;
};

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



Object.freeze(db);
module.exports = db;