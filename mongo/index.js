/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data-Mongo
 */
const async = require("async");
const { get_database_base,check_database_base,delete_database_base,post_item_base,post_bulk_base,get_item_base,delete_item_base,get_id_list_base,delete_item_list_base,get_count_item_list_base}= require("./base.js");
const get_database_main = async (data_config,option) => {
    return [error,data] = await get_database_base(data_config,option);
}
const delete_database_main = async (database,option) => {
    return [error,data] = await delete_database_base(database);
}
const check_database_main = async (database,option) => {
    return data = await check_database_base(database,option);
}
const post_item_main = async (database,data_type,item_data,option) => {
    return [error,data] = await post_item_base(database,data_type,item_data,option);
}
const post_bulk_main = async (database,data_type,data_list) => {
    return [error,data] = await post_bulk_base(database,data_type,data_list);
}
const delete_item_main = async (database,data_type,id,option) => {
    return [error,data] = await delete_item_base(database,data_type,id,option);
}
const get_item_main = async (database,data_type,id,option) => {
    return [error,data] = await get_item_base(database,data_type,id,option);
}
const get_id_list_main = async (database,data_type,filter,sort_by,page_current,page_size,option) => {
	return [error,total_count,data_list] = await get_id_list_base(database,data_type,filter,sort_by,page_current,page_size,option);
}
const delete_item_list_main = async (database,data_type,filter,option) => {
	return [error,data_list] = await delete_item_list_base(database,data_type,filter,option);
}
const get_count_item_list_main = async (database,data_type,filter,option) => {
	return [error,data] = await get_count_item_list_base(database,data_type,filter,option);
}
module.exports = {
	get_database_main,
	get_item_main,
	delete_database_main,
	check_database_main,
	post_item_main,
	post_bulk_main,
	delete_item_main,
	delete_item_list_main,
	get_count_item_list_main,
	get_id_list_main
};
