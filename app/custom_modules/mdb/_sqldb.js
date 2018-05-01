/**
 * Created by chirag on 26/01/16.
 */

var configs = require('configs');
//var mssql = require('mssql');
var sql = require("seriate");

// Current MongoDB
console.log('Connecting mssql to: ' + JSON.stringify( configs.mssqldb));

sql.setDefaultConfig( configs.mssqldb );

var db = {};

db.query = function(query, values, callback) {
    sql.execute( {
        query: query,
        params: values
    } ).then( function( results ) {
        //console.log( results );
        return callback(null,results);
    }, function( err ) {
        console.log( "Something bad happened:", err );
        return callback(err,[]);
    } );
}

module.exports = db;