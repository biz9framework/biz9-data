/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const { get_db_connect_adapter,check_db_connect_adapter,close_db_connect_adapter,update_item_adapter,update_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,count_item_list_adapter }  = require('./adapter.js');
const get_db_connect = async (db_name) => {
     return [error,data] = await get_db_connect_adapter(db_name);
};
const close_db_connect = async (db_connect) => {
    return [error,data] = await close_db_connect_adapter(db_connect);
};
const check_db_connect = async (db_connect) => {
    return check_db_connect_adapter(db_connect);
};
const update_item = async (db_connect,data_type,item_data,options) => {
     return [error,data] = await update_item_adapter(db_connect,data_type,item_data,options);
};
const get_item = async (db_connect,data_type,tbl_id,options) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,tbl_id,options);
};
const update_item_list = async (db_connect,item_data_list,options) => {
     return [error,data] = await update_item_list_adapter(db_connect,item_data_list,options);
};
const delete_item = async (db_connect,data_type,tbl_id) => {
     return [error,data] = await delete_item_adapter(db_connect,data_type,tbl_id);
};
const get_item_list = async (db_connect,data_type,sql,sort_by,page_current,page_size,options) => {
     return [error,data_list,item_count,page_count] = await get_item_list_adapter(db_connect,data_type,sql,sort_by,page_current,page_size,options);
};
const delete_item_list = async (db_connect,data_type,sql) => {
     return [error,data_list] = await delete_item_list_adapter(db_connect,data_type,sql);
};
const count_item_list = async (db_connect,data_type,sql) => {
     return [error,data] = await count_item_list_adapter(db_connect,data_type,sql);
};

/*
const get_sql = async (db_connect,data_type,sql_obj,sort_by) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,sql,sort_by);
};
const delete_sql = async (db_connect,data_type,sql_obj) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,sql_obj);
};
const delete_list = async (db_connect,data_type,item_data_list) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,item_data_list);
};
const count = async (db_connect,data_type,sql_obj) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,sql_obj);
};
*/







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
    /*
    update_list,
    get_sql,
    delete_item,
    delete_sql,
    delete_list,
    count,
    drop,
    */
};
