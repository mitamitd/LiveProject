/**
 * Created by chirag on 26/01/16.
 */

var mongojs = require('mongojs');
var configs = require('configs')

// Current MongoDB
console.log('Connecting mongodb to: ' + configs.mongodb);

var db = mongojs(configs.mongodb);
db.mdb = db;

module.exports = db;