/**
 * Created by chirag on 20/01/16.
 */

modules = {};

//modules.configs = require('configs');
modules.app = require('../imapp');
modules.db = require('mdb');
// modules.db = require('mysqldb');

modules.get_f = function(Path_Prefix){
    function provider(path){
        return Path_Prefix + path;
    }
    return provider;
}

module.exports = modules;