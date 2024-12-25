/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data-Mongo
 */
const path = require('path');
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const async = require("async");
const { get_title_url } = require("biz9-utility");
const { get_db_connect_base,check_db_connect_base,close_db_connect_base,update_item_base,get_item_base,delete_item_base,get_id_list_base,delete_item_list_base,count_item_list_base}= require("./base.js");
const get_db_connect_main = async (db_name) => {
    return [error,data] = await get_db_connect_base(db_name);
}
const close_db_connect_main = async (db_connect) => {
    return [error,data] = await close_db_connect_base(db_connect);
}
const check_db_connect_main = async (db_connect) => {
    return data = await check_db_connect_base(db_connect);
}
const update_item_main = async (db_connect,data_type,item_data) => {
    return [error,data] = await update_item_base(db_connect,data_type,item_data);
}
const delete_item_main = async (db_connect,data_type,id) => {
    return [error,data] = await delete_item_base(db_connect,data_type,id);
}
const get_item_main = async (db_connect,data_type,id) => {
    return [error,data] = await get_item_base(db_connect,data_type,id);
}
const get_id_list_main = async (db_connect,data_type,sql,sort_by,page_current,page_size) => {
	return [error,total_count,data_list] = await get_id_list_base(db_connect,data_type,sql,sort_by,page_current,page_size);
}
const delete_item_list_main = async (db_connect,data_type,sql) => {
	return [error,data_list] = await delete_item_list_base(db_connect,data_type,sql);
}
const count_item_list_main = async (db_connect,data_type,sql) => {
	return [error,data] = await count_item_list_base(db_connect,data_type,sql);
}
module.exports = {
	get_db_connect_main,
	get_item_main,
	close_db_connect_main,
	check_db_connect_main,
	update_item_main,
	delete_item_main,
	delete_item_list_main,
	count_item_list_main,
	get_id_list_main
};
