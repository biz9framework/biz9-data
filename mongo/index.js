/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data-Mongo
 */
const async = require("async");
const { get_db_connect_base,check_db_connect_base,delete_db_connect_base,post_item_base,post_bulk_base,get_item_base,delete_item_base,get_id_list_base,delete_item_list_base,get_count_item_list_base}= require("./base.js");
const get_db_connect_main = async (data_config,option) => {
    return [error,data] = await get_db_connect_base(data_config,option);
}
const delete_db_connect_main = async (db_connect,option) => {
    return [error,data] = await delete_db_connect_base(db_connect);
}
const check_db_connect_main = async (db_connect,option) => {
    return data = await check_db_connect_base(db_connect,option);
}
const post_item_main = async (db_connect,data_type,item_data,option) => {
    return [error,data] = await post_item_base(db_connect,data_type,item_data,option);
}
const post_bulk_main = async (db_connect,data_type,data_list) => {
    return [error,data] = await post_bulk_base(db_connect,data_type,data_list);
}
const delete_item_main = async (db_connect,data_type,id,option) => {
    return [error,data] = await delete_item_base(db_connect,data_type,id,option);
}
const get_item_main = async (db_connect,data_type,id,option) => {
    return [error,data] = await get_item_base(db_connect,data_type,id,option);
}
const get_id_list_main = async (db_connect,data_type,filter,sort_by,page_current,page_size,option) => {
	return [error,total_count,data_list] = await get_id_list_base(db_connect,data_type,filter,sort_by,page_current,page_size,option);
}
const delete_item_list_main = async (db_connect,data_type,filter,option) => {
	return [error,data_list] = await delete_item_list_base(db_connect,data_type,filter,option);
}
const get_count_item_list_main = async (db_connect,data_type,filter,option) => {
	return [error,data] = await get_count_item_list_base(db_connect,data_type,filter,option);
}
module.exports = {
	get_db_connect_main,
	get_item_main,
	delete_db_connect_main,
	check_db_connect_main,
	post_item_main,
	post_bulk_main,
	delete_item_main,
	delete_item_list_main,
	get_count_item_list_main,
	get_id_list_main
};
