/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const {get_db_adapter,check_db_adapter,close_db_adapter,update_item_adapter,update_item_list_adapter}  = require('./adapter.js');
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
     return [error,data] = await update_item_adapter(db_connect,data_type,data_item);
};
const get_item = async (db_connect,data_type,tbl_id) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,tbl_id);
};
const update_item_list = async (db_connect,data_item_list) => {
     return [error,data] = await update_item_list_adapter(db_connect,data_item_list);
};
/*
const get_sql = async (db_connect,data_type,sql_obj,sort_by) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,sql,sort_by);
};
const get_sql_paging = async (db_connect,data_type,sql,sort_by,page_current,page_size) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,sql,sort_by,page_current,page_size);
};
const delete_item = async (db_connect,data_type,tbl_id) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,tbl_id);
};
const delete_sql = async (db_connect,data_type,sql_obj) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,sql_obj);
};
const delete_list = async (db_connect,data_type,data_item_list) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,data_item_list);
};
const count = async (db_connect,data_type,sql_obj) => {
     return [error,data] = await get_item_adapter(db_connect,data_type,sql_obj);
};
*/







module.exports = {
    get_db,
    close_db,
    check_db,
    update_item,
    update_item_list,
    get_item,
    /*
    update_list,
    get_sql,
    get_sql_paging,
    delete_item,
    delete_sql,
    delete_list,
    count,
    drop,
    */
};
