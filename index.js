/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../biz9_config.js'));
const {get_db_connect,close_db_connect,check_db_connect,update_cache_item}  = require('./dataz/index.js');
const get_client_db = async () => {
     return [error,data] = await get_db_connect();
};
const close_client_db = async (db) => {
    return [error,data] = await close_db_connect(db);
};
const check_client_db = async (db) => {
    return await check_db_connect(db);
};
const update_item = async (db,data_type,data_item) => {
    //return await dataz.update_cache_item(db,data_type,data_item);
    return await update_cache_item(db,data_type,data_item);
    console.log('here');
    /*
 module.update_item=function(db,document_title,data_item,callback){
        dataz.update_cache_item(db,document_title,data_item,function(error,data)
            {
                callback(error,data);
            });
    }
    */

};


module.exports = {
    get_client_db,
    close_client_db,
    check_client_db,
    update_item
};
