/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Data
 */

console.log('aaaaaaaaaa');
console.log('aaaaaaaaaa');
//const biz9_config_file=require("/home/think1/www/doqbox/biz9-framework/biz9-data/biz9_config.js");
const biz9_config_file=require(__dirname+"/../../"+"biz9_config.js");
const moment = require('moment');

console.log('bbbbbbbb');
console.log(biz9_config_file);

const get_db_session=()=>{
    console.log('qqqqqqqq');
    console.log(biz9_config_file);
    return 'cool';
    /*
                    return new Promise((resolve) =>{
                        MONGO_FULL_URL="mongodb://"+biz9_config_file.MONGO_USERNAME_PASSWORD+biz9_config_file.MONGO_IP+":"+biz9_config_file.MONGO_PORT+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
                        const { MongoClient } = require("mongodb");
                        const uri = MONGO_FULL_URL;
                        const client_db = new MongoClient(uri);
                        resolve(client_db.connect());
                    });
                    */
                }
module.exports = {
    get_db_session,
};

