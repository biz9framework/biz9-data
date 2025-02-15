/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const { get_db_connect_adapter,check_db_connect_adapter,close_db_connect_adapter,update_item_adapter,update_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,count_item_list_adapter }  = require('./adapter.js');
const get_db_connect = async (data_config) => {
    return [error,data] = await get_db_connect_adapter(data_config);
};
const close_db_connect = async (db_connect) => {
    return [error,data] = await close_db_connect_adapter(db_connect);
};
const check_db_connect = async (db_connect) => {
    return check_db_connect_adapter(db_connect);
};
const update_item = async (db_connect,data_type,item_data) => {
    return [error,data] = await update_item_adapter(db_connect,data_type,item_data);
};
const get_item = async (db_connect,data_type,id) => {
    return [error,data] = await get_item_adapter(db_connect,data_type,id);
};
const update_item_list = async (db_connect,item_data_list) => {
    return [error,data] = await update_item_list_adapter(db_connect,item_data_list);
};
const delete_item = async (db_connect,data_type,id) => {
    return [error,data] = await delete_item_adapter(db_connect,data_type,id);
};
const get_item_list = async (db_connect,data_type,filter,sort_by,page_current,page_size) => {
    return [error,data_list,item_count,page_count] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size);
    /*
    console.log('here');
    console.log(data_list);
    console.log('here2');
    console.log(item_count);
    console.log('here3');
    console.log(page_count);
    */
};
const delete_item_list = async (db_connect,data_type,filter) => {
    return [error,data_list] = await delete_item_list_adapter(db_connect,data_type,filter);
};
const count_item_list = async (db_connect,data_type,filter) => {
    return [error,data] = await count_item_list_adapter(db_connect,data_type,filter);
};
module.exports = {
    get_db_connect,
    close_db_connect,
    check_db_connect,
    update_item,
    update_item_list,
    get_item,
    delete_item,
    get_item_list,
    count_item_list,
    delete_item_list
};
