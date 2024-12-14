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
const close_client_db = async (db_connect) => {
    return [error,data] = await close_db_connect(db_connect);
};
const check_client_db = async (db_connect) => {
    return check_db_connect(db_connect);
};
const update_item = async (db_connect,data_type,data_item) => {
     return [error,data] = await update_cache_item(db_connect,data_type,data_item);
};


const update_item_old = async (db,data_type,data_item) => {
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
