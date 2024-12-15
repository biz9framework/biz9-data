/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../biz9_config.js'));
//const {get_db_adapter,close_db_adapter,check_db_adapter,update_item_adapter}  = require('./adapter.js');
const {get_db_adapter,check_db_adapter,close_db_adapter,update_item_adapter}  = require('./adapter.js');

const get_db = async () => {
     return [error,data] = await get_db_adapter();
};
const close_db = async (db_connect) => {
    return [error,data] = await close_db_adapter(db_connect);
};
const check_db = async (db_connect) => {
    return check_db_adapter(db_connect);
};
const update_item = async (db_connect,data_type,data_item) => {
     return [error,data] = await update_item_apdapter(db_connect,data_type,data_item);
};

module.exports = {
    get_db,
    close_db,
    check_db,
    //update_item
};
