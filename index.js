/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const dayjs = require('dayjs');
const {get_db_connect_main,check_db_connect_main,delete_db_connect_main,post_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,get_count_item_list_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num,Obj}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
const {DataItem,DataType,FieldType,Item_Logic,User_Logic,Favorite_Logic,Stat_Logic,Order_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const { get_db_connect_adapter,check_db_connect_adapter,delete_db_connect_adapter,post_item_adapter,post_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,get_count_item_list_adapter,delete_item_cache }  = require('./adapter.js');
class Database {
	static get = async (data_config,option) => {
		/* return
		 * - n/a
		 * option params
		 * - biz9_config_file
		 *   - source file for data config. / obj / ex. root folder biz9_config.
		 * - app_id
		 *   - database id. / string / ex. project_500
		 */
		let cloud_error=null;
		return new Promise((callback) => {
			option = !Obj.check_is_empty(option) ? option : {biz9_config_file:null,app_id:null};
			if(option.biz9_config_file==null){
				option.biz9_config_file=null;
			}else{
				data_config = Scriptz.get_biz9_config(option);
			}
			if(option.app_id){
				data_config.app_id = option.app_id;
			}
			if(data_config.app_id==null){
				cloud_error=Log.append(cloud_error,"Database Error: Missing app_id.");
			}
			Data.open_db(data_config).then(([error,data])=>{
				cloud_error=Log.append(cloud_error,error);
				data.data_config=data_config;
				data.app_id=data_config.APP_ID;
				callback([error,data]);
			}).catch(error => {
				cloud_error=Log.append(cloud_error,error);
				Log.error("BiZItem-Get-Connect",error);
				callback([error,null]);
			});
		});
	}
	static delete = async (database) => {
		/* option params
		 * - database
		 *      - connected database. / obj / ex. mongo db connection.
		 * return objects
		 *  - database
		 *      - Disconnect database. / obj / ex. null. dispose db obj.
		 *  - app_id
		 *      - database id. / string / ex. project_500
		 */
		let cloud_error=null;
		return new Promise((callback) => {
			Data.delete_db(database).then(([error,data])=>{
				cloud_error=Log.append(cloud_error,error);
				callback([error,data]);
			}).catch(error => {
				cloud_error=Log.append(cloud_error,error);
				Log.error("DB-Close",error);
				callback([error,null]);
			});
		});
	}
}
class Blog_Post_Data {
	//9_blog_post_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let blog_post = DataItem.get_new(DataType.BLOG_POST,0);
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.get(database,DataType.BLOG_POST,key,option);
					if(error){
						error=Log.append(error,error);
					}
					else{
						blog_post = item_data;
					}
				},
			]).then(result => {
				callback([error,blog_post]);
			}).catch(error => {
				Log.error("Blog_Post-Get",error);
				callback([error,{}]);
			});
		});
	};
	//9_blog_post_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {data_count:0,page_count:1,filter:{},data_type:DataType.BLOG_POST,blog_post_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.search(database,DataType.BLOG_POST,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						data.data_count = item_data.data_count;
						data.data_type = DataType.BLOG_POST;
						data.page_count = item_data.page_count;
						data.filter = item_data.filter;
						data.blog_post_list = item_data.data_list;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Blog_Post-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Category_Data { //9_category_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let category = DataItem.get_new(DataType.CATEGORY,0);
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.get(database,DataType.CATEGORY,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						category = item_data;
					}
				},
			]).then(result => {
				callback([error,category]);
			}).catch(error => {
				Log.error("Category-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_category_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {data_count:0,page_count:1,filter:{},data_type:DataType.CATEGORY,category_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.search(database,DataType.CATEGORY,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						data.data_count = item_data.data_count;
						data.data_type = DataType.CATEGORY;
						data.page_count = item_data.page_count;
						data.filter = item_data.filter;
						data.category_list = item_data.data_list;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Category-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Content_Data {
	//9_content_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let content = DataItem.get_new(DataType.CONTENT,0);
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.get(database,DataType.CONTENT,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						content = item_data;
					}
				},
			]).then(result => {
				callback([error,content]);
			}).catch(error => {
				Log.error("Content-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_content_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {data_count:0,page_count:1,filter:{},data_type:DataType.CONTENT,content_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.search(database,DataType.CONTENT,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						data.data_count = item_data.data_count;
						data.data_type = DataType.CONTENT;
						data.page_count = item_data.page_count;
						data.filter = item_data.filter;
						data.content_list = item_data.data_list;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Content-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Page_Data {
	//9_page_data_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let page = DataItem.get_new(DataType.PAGE,0);
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.PAGE,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						page = data;
					}
				},
			]).then(result => {
				callback([error,page]);
			}).catch(error => {
				Log.error("Page-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_page_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {data_count:0,page_count:1,filter:{},data_type:DataType.PAGE,page_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.PAGE,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						data.data_count = data.data_count;
						data.data_type =DataType.PAGE;
						data.page_count = data.page_count;
						data.filter = data.filter;
						data.page_list = data.data_list;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Page-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Template_Data {
	//9_template_data_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let template = DataItem.get_new(DataType.TEMPLATE,0);
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.TEMPLATE,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						template = data;
					}
				},
			]).then(result => {
				callback([error,template]);
			}).catch(error => {
				Log.error("Template-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_template_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {data_count:0,page_count:1,filter:{},data_type:DataType.TEMPLATE,template_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.TEMPLATE,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						data.data_count = data.data_count;
						data.data_type = DataType.TEMPLATE;
						data.page_count = data.page_count;
						data.filter = data.filter;
						data.template_list = data.data_list;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Template-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Event_Data {
	//9_event_data_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let event = DataItem.get_new(DataType.EVENT,0);
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.EVENT,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						event = data;
					}
				},
			]).then(result => {
				callback([error,event]);
			}).catch(error => {
				Log.error("Event-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_event_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {event_count:0,page_count:1,filter:{},data_type:DataType.EVENT,event_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.EVENT,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						data.data_count = data.data_count;
						data.data_type = DataType.EVENT;
						data.page_count = data.page_count;
						data.filter = data.filter;
						data.data_type = data.data_type;
						data.event_list = data.data_list;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Event-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Order_Data {
	/*
	//9_order_post
	static post = async (database,order) => {
		return new Promise((callback) => {
			let data = {order:DataItem.get_new(DataType.ORDER,0),order_item_list:[],order_sub_item_list:[]};
			let error = null;
			async.series([
				async function(call){
					data.order = DataItem.get_new(DataType.ORDER,0,
						{
							order_number:order.order_number,
							parent_data_type:order.parent_data_type,
							user_id:order.user_id,
							cart_number:order.cart_number,
							grand_total:order.grand_total,
						});
				},
				async function(call){
					for(const key in order) {
						if(Str.check_is_null(cloud_data.order[key]) && key != 'order_item_list' &&  key != 'order_item_list' && key != 'order_sub_item_list'){
							data.order[key] = order[key];
						}
					}
				},
				async function(call){
					const [error,data] = await Portal.post(database,DataType.ORDER,cloud_data.order);
					if(error){
						error=Log.append(error,error);
					}else{
						data.order = data;
					}
				},
				//post - order items
				async function(call){
					if(order.order_item_list.length>0){
						order.order_item_list.forEach(item => {
							item.temp_row_id = Num.get_id();
							data.order_item_list.push(
								DataItem.get_new(DataType.ORDER_ITEM,0,
									{
										order_id:cloud_data.order.id,
										order_number:cloud_data.order.order_number,
										user_id:cloud_data.order.user_id,
										quanity:item.quanity,
										parent_data_type:item.parent_data_type,
										parent_id:item.parent_id,
										temp_row_id :item.temp_row_id
									}));
						});
						if(data.order_item_list.length>0){
							const [error,data] = await Portal.post_list(database,data.order_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								data.order_item_list = data;
							}
						}
					}
				},
				//post - order_sub_item_list
				async function(call){
					if(order.order_item_list.length>0){
						order.order_item_list.forEach(order_item => {
							order_item.order_sub_item_list.forEach(order_sub_item => {
								data.order_sub_item_list.push(
									DataItem.get_new(DataType.ORDER_SUB_ITEM,0,
										{
											order_id:cloud_data.order.id,
											order_number:cloud_data.order.order_number,
											user_id:cloud_data.order.user_id,

											order_item_id:cloud_data.order_item_list.find(item_find => item_find.temp_row_id === order_item.temp_row_id).id,
											quanity:order_sub_item.quanity,
											parent_data_type:order_sub_item.parent_data_type,
											parent_id:order_sub_item.parent_id
										}));
							});
						});
						if(data.order_sub_item_list.length>0){
							const [error,data] = await Portal.post_list(database,data.order_sub_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								data.order_sub_item_list = data;
							}
						}

					}
				},
			]).then(result => {
				callback([error,data.order]);
			}).catch(error => {
				Log.error("OrderData-Order-Item-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_order_get
	static get = (database,order_number,option) => {
		return new Promise((callback) => {
			let data = {order:DataItem.get_new(DataType.ORDER,0,{order_number:order_number,order_item_list:[],parent_user:DataItem.get_new(DataType.USER,0)})};
			let order_parent_item_list_query = { $or: [] };
			let order_sub_item_list_query = { $or: [] };
			let error = null;
			let order_sub_item_list = [];
			option = !Obj.check_is_empty(option) ? option : {get_payment:true};
			async.series([
				//get_order
				async function(call){
					let filter = { order_number: { $regex:String(order_number), $options: "i" } };
					const [error,data] = await Portal.get(database,DataType.ORDER,order_number,{filter:filter});
					if(error){
						error=Log.append(error,error);
					}else{
						data.order = data;
					}
				},
				async function(call){
					const [error,data] = await Portal.get(database,DataType.USER,cloud_data.order.user_id);
					data.parent_user=data;
				},
				//get_order_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.ORDER_ITEM,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							data.order.order_item_list = data.item_list;
						}
					}
				},
				//get_order_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						cloud_data.order.order_item_list.forEach(order_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(order_item.parent_id), $options: "i" };
							order_parent_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(cloud_data.order.parent_data_type,order_parent_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.order.order_item_list.forEach(order_item => {
								order_item.parent_item = data.item_list.find(item_find => item_find.id === order_item.parent_id) ? data.item_list.find(item_find => item_find.id === order_item.parent_id):Item_Logic.get_not_found(order_item.parent_data_type,order_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				//get_order_sub_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.ORDER_SUB_ITEM,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							order_sub_item_list = data.item_list;
						}
					}
				},
				//get_order_sub_item_list - parent_sub_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						order_sub_item_list.forEach(order_sub_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(order_sub_item.parent_id), $options: "i" };
							order_sub_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(DataType.ITEM,order_sub_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							order_sub_item_list.forEach(order_sub_item => {
								order_sub_item.parent_item = data.item_list.find(item_find => item_find.id === order_sub_item.parent_id) ? data.item_list.find(item_find => item_find.id === order_sub_item.parent_id):Item_Logic.get_not_found(order_sub_item.parent_data_type,order_sub_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				// order_item_list - order_sub_item_list - bind
				async function(call){
					cloud_data.order.order_item_list.forEach(order_item => {
						order_item.order_sub_item_list = [];
						let item_filter_list = order_sub_item_list.filter(item_find=>item_find.order_item_id===order_item.id);
						order_item.order_sub_item_list = [...item_filter_list, ...order_item.order_sub_item_list];
					});
				},
				async function(call){
					cloud_data.order = Order_Data.caculate_order(cloud_data.order);
				},
				async function(call){
					if(option.get_payment){
						let filter = {order_number:order_number};
						let search = Item_Logic.get_search(DataType.ORDER_PAYMENT,filter,{date_create:-1},0,1);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.order_payment_search_filter = search;
							cloud_data.order_payment_list = data.item_list;
						}
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Order-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_order_delete
	static delete = async (database,id) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			cloud_data.order = DataItem.get_new(DataType.ORDER,id);
			async.series([
				//get_order
				async function(call){
					const [error,data] = await Portal.get(database,DataType.ORDER,id);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.order = data;
					}
				},
				async function(call){
					const [error,data] = await Portal.delete(database,DataType.ORDER,id);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.order_delete = data.item;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.ORDER_ITEM,{order_number:cloud_data.order.order_number},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_order_item_search = data;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.ORDER_SUB_ITEM,{order_number:cloud_data.order.order_number},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_order_sub_item_search = data;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.ORDER_PAYMENT,{order_number:cloud_data.order.order_number},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_order_payment_search = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("OrderData-Order-Delete",error);
				callback([error,[]]);
			});
		});
	};
	//9_order_search
	static search = (database,parent_data_type,filter,sort_by,page_current,page_size,option) => {
		//9_order_search
		return new Promise((callback) => {
			let cloud_data = {order_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {};
			let order_number_list_query = { $or: [] };
			let order_parent_item_list_query = { $or: [] };
			let order_item_list = [];
			let order_sub_item_list = [];
			async.series([
				async function(call){
					let option = {get_item_search:true,item_search_data_type:DataType.USER,item_search_field:'id',item_search_value:'user_id'};
					const [error,data] = await Portal.search(database,DataType.ORDER,filter,sort_by,page_current,page_size,option);
					data.item_list.forEach(item => {
						const item_match = data.item_search_list.find(item_find => item_find.id === item.user_id);
						if(item_match){
							item.parent_user = item_match;
						}else{
							item.parent_user = User_Logic.get_not_found(item.user_id);
						}
					});
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.item_count = data.item_count;
						cloud_data.page_count = data.page_count;
						cloud_data.filter = data.filter;
						cloud_data.data_type = data.data_type;
						cloud_data.order_list = data.item_list;
					}
				},
				//get_order_item_list
				async function(call){
					if(cloud_data.order_list.length>0){
						cloud_data.order_list.forEach(order => {
							let query_field = {};
							query_field['order_number'] = { $regex:String(order.order_number), $options: "i" };
							order_number_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(DataType.ORDER_ITEM,order_number_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							order_item_list = data.item_list;
						}
					}
				},
				//get_order_item_list - parent_item_list
				async function(call){
					if(cloud_data.order_list.length>0){
						order_item_list.forEach(order_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(order_item.parent_id), $options: "i" };
							order_parent_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(parent_data_type,order_parent_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							order_item_list.forEach(order_item => {
								order_item.parent_item = data.item_list.find(item_find => item_find.id === order_item.parent_id) ? data.item_list.find(item_find => item_find.id === order_item.parent_id):Item_Logic.get_not_found(order_item.parent_data_type,order_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				//get_order_sub_item_list
				async function(call){
					if(cloud_data.order_list.length>0){
						let search = Item_Logic.get_search(DataType.ORDER_SUB_ITEM,order_number_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							order_sub_item_list = data.item_list;
						}
					}
				},
				//get_order_sub_item_list - parent_item_list
				async function(call){
					if(cloud_data.order_list.length>0){
						order_sub_item_list.forEach(order_sub_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(order_sub_item.parent_id), $options: "i" };
							order_parent_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(DataType.ITEM,order_parent_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							order_sub_item_list.forEach(order_sub_item => {
								order_sub_item.parent_item = data.item_list.find(item_find => item_find.id === order_sub_item.parent_id) ? data.item_list.find(item_find => item_find.id === order_sub_item.parent_id):Item_Logic.get_not_found(order_sub_item.parent_data_type,order_sub_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				// order_item_list - order_sub_item_list - bind
				async function(call){
					if(cloud_data.order_list.length>0){
						order_item_list.forEach(order_item => {
							order_item.order_sub_item_list = [];
							let item_filter_list = order_sub_item_list.filter(item_find=>item_find.order_item_id===order_item.id);
							order_item.order_sub_item_list = [...item_filter_list, ...order_item.order_sub_item_list];
						});
					}
				},
				// order_list - order_item_list - bind
				async function(call){
					if(cloud_data.order_list.length>0){
						cloud_data.order_list.forEach(order => {
							order.order_item_list = [];
							let item_filter_list = order_item_list.filter(item_find=>item_find.order_id===order.id);
							order.order_item_list = [...item_filter_list, ...order.order_item_list];
						});
					}
				},
				// order_list - caculate
				async function(call){
					if(cloud_data.order_list.length>0){
						cloud_data.order_list.forEach(order => {
							order = Order_Data.caculate_order(order);
						});
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Order-Search",error);
				callback([error,[]]);
			});
		});
	};

	//9_caculate_order
	static caculate_order = (order) => {
		let grand_total = 0;
		order.order_item_list.forEach(order_item => {
			order_item.sub_total = 0;
			if(!isNaN(order_item.parent_item.cost)){
				order_item.sub_total = (order_item.sub_total + order_item.parent_item.cost) * order_item.quanity;
				grand_total = grand_total + order_item.sub_total;
			}
			order_item.order_sub_item_list.forEach(order_sub_item => {
				order_sub_item.sub_total = 0;
				if(!isNaN(order_sub_item.parent_item.cost)){
					order_sub_item.sub_total = (order_sub_item.sub_total + order_sub_item.parent_item.cost) * order_sub_item.quanity;
					grand_total = grand_total + order_sub_item.sub_total;
				}
			});
		});
		order.grand_total = grand_total;
		return order;
	};
	*/
}
class Cart_Data {
	/*
	//9_cart_post
	static post = async (database,cart,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			cloud_data.cart = DataItem.get_new(DataType.CART,cart.id,{cart_number:cart.cart_number,parent_data_type:cart.parent_data_type,user_id:cart.user_id});
			cloud_data.cart_item_list = [];
			cloud_data.cart_sub_item_list = [];
			async.series([
				async function(call){
					for(const key in cart) {
						if(Str.check_is_null(cloud_data.cart[key]) && key != 'cart_item_list' &&  key != 'cart_item_list' && key != 'cart_sub_item_list'){
							cloud_data.cart[key] = cart[key];
						}
					}
				},
				//post - cart
				async function(call){
					const [error,data] = await Portal.post(database,DataType.CART,cloud_data.cart);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data;
					}
				},
				//post - cart items
				async function(call){
					if(cart.cart_item_list.length>0){
						cart.cart_item_list.forEach(item => {
							item.temp_row_id = Num.get_id();
							cloud_data.cart_item_list.push(
								DataItem.get_new(DataType.CART_ITEM,0,
									{
										cart_id:cloud_data.cart.id,
										cart_number:cloud_data.cart.cart_number,
										user_id:cloud_data.cart.user_id,

										quanity:item.quanity,
										parent_data_type:item.parent_data_type,
										parent_id:item.parent_id,

										temp_row_id :item.temp_row_id
									}));
						});
						if(cloud_data.cart_item_list.length>0){
							const [error,data] = await Portal.post_list(database,cloud_data.cart_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.cart_item_list = data;
							}
						}
					}
				},
				//post - cart_sub_item_list
				async function(call){
					if(cart.cart_item_list.length>0){
						cart.cart_item_list.forEach(cart_item => {
							cart_item.cart_sub_item_list.forEach(cart_sub_item => {
								cloud_data.cart_sub_item_list.push(
									DataItem.get_new(DataType.CART_SUB_ITEM,0,
										{
											cart_id:cloud_data.cart.id,
											cart_number:cloud_data.cart.cart_number,
											user_id:cloud_data.cart.user_id,
											cart_item_id:cloud_data.cart_item_list.find(item_find => item_find.temp_row_id === cart_item.temp_row_id).id,
											quanity:cart_sub_item.quanity,
											parent_data_type:cart_sub_item.parent_data_type,
											parent_id:cart_sub_item.parent_id
										}));
							});
						});
						if(cloud_data.cart_sub_item_list.length>0){
							const [error,data] = await Portal.post_list(database,cloud_data.cart_sub_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.cart_sub_item_list = data;
							}
						}
					}
				}
			]).then(result => {
				callback([error,cloud_data.cart]);
			}).catch(error => {
				Log.error("CartData-Cart-Item-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_cart_get
	static get = (database,cart_number) => {
		return new Promise((callback) => {
			let cloud_data = {cart:DataItem.get_new(DataType.CART,0,{cart_number:cart_number,cart_item_list:[],parent_user:DataItem.get_new(DataType.USER,0)})};
			let cart_parent_item_list_query = { $or: [] };
			let cart_sub_item_list_query = { $or: [] };
			let error = null;
			let cart_sub_item_list = [];
			async.series([
				//get_cart
				async function(call){
					let filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
					const [error,data] = await Portal.get(database,DataType.CART,cart_number,{filter:filter});
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data;
					}
				},
				async function(call){
					const [error,data] = await Portal.get(database,DataType.USER,cloud_data.cart.user_id);
					cloud_data.cart.parent_user=data;
				},
				//get_cart_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						let filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.CART_ITEM,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.cart.cart_item_list = data.item_list;
						}
					}
				},
				//get_cart_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						cloud_data.cart.cart_item_list.forEach(cart_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(cart_item.parent_id), $options: "i" };
							cart_parent_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(cloud_data.cart.parent_data_type,cart_parent_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.cart.cart_item_list.forEach(cart_item => {
								cart_item.parent_item = data.item_list.find(item_find => item_find.id === cart_item.parent_id) ? data.item_list.find(item_find => item_find.id === cart_item.parent_id):Item_Logic.get_not_found(cart_item.parent_data_type,cart_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				//get_cart_sub_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						let filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.CART_SUB_ITEM,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							cart_sub_item_list = data.item_list;
						}
					}
				},
				//get_cart_sub_item_list - parent_sub_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						cart_sub_item_list.forEach(cart_sub_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(cart_sub_item.parent_id), $options: "i" };
							cart_sub_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(DataType.ITEM,cart_sub_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							cart_sub_item_list.forEach(cart_sub_item => {
								cart_sub_item.parent_item = data.item_list.find(item_find => item_find.id === cart_sub_item.parent_id) ? data.item_list.find(item_find => item_find.id === cart_sub_item.parent_id):Item_Logic.get_not_found(cart_sub_item.parent_data_type,cart_sub_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				// cart_item_list - cart_sub_item_list - bind
				async function(call){
					cloud_data.cart.cart_item_list.forEach(cart_item => {
						cart_item.cart_sub_item_list = [];
						let item_filter_list = cart_sub_item_list.filter(item_find=>item_find.cart_item_id===cart_item.id);
						cart_item.cart_sub_item_list = [...item_filter_list, ...cart_item.cart_sub_item_list];
					});
				},
				async function(call){
					cloud_data.cart = Cart_Data.caculate_cart(cloud_data.cart);
				},
			]).then(result => {
				callback([error,cloud_data.cart]);
			}).catch(error => {
				Log.error("Cart-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_cart_delete
	static delete = async (database,id) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			cloud_data.cart = DataItem.get_new(DataType.CART,id);
			async.series([
				//get_cart
				async function(call){
					const [error,data] = await Portal.get(database,DataType.CART,id);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data;
					}
				},
				async function(call){
					const [error,data] = await Portal.delete(database,DataType.CART,id);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart_delete = data.item;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.CART_ITEM,{cart_number:cloud_data.cart.cart_number},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_cart_item_search = data;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.CART_SUB_ITEM,{cart_number:cloud_data.cart.cart_number},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_cart_sub_item_search = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("CartData-Cart-Item-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_cart_search
	static search = (database,parent_data_type,filter,sort_by,page_current,page_size,option) => {
		//9_cart_search
		return new Promise((callback) => {
			let cloud_data = {cart_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {};
			let cart_number_list_query = { $or: [] };
			let cart_parent_item_list_query = { $or: [] };
			let cart_item_list = [];
			let cart_sub_item_list = [];
			async.series([
				async function(call){
					let option = {get_item_search:true,item_search_data_type:DataType.USER,item_search_field:'id',item_search_value:'user_id'};
					const [error,data] = await Portal.search(database,DataType.CART,filter,sort_by,page_current,page_size,option);
					data.item_list.forEach(item => {
						const item_match = data.item_search_list.find(item_find => item_find.id === item.user_id);
						if(item_match){
							item.parent_user = item_match;
						}else{
							item.parent_user = User_Logic.get_not_found(item.user_id);
						}
					});
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.item_count = data.item_count;
						cloud_data.page_count = data.page_count;
						cloud_data.filter = data.filter;
						cloud_data.data_type = data.data_type;
						cloud_data.cart_list = data.item_list;
					}
				},
				//get_cart_item_list
				async function(call){
					if(cloud_data.cart_list.length>0){
						cloud_data.cart_list.forEach(cart => {
							let query_field = {};
							query_field['cart_number'] = { $regex:String(cart.cart_number), $options: "i" };
							cart_number_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(DataType.CART_ITEM,cart_number_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							cart_item_list = data.item_list;
						}
					}
				},
				//get_cart_item_list - parent_item_list
				async function(call){
					if(cloud_data.cart_list.length>0){
						cart_item_list.forEach(cart_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(cart_item.parent_id), $options: "i" };
							cart_parent_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(parent_data_type,cart_parent_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							cart_item_list.forEach(cart_item => {
								cart_item.parent_item = data.item_list.find(item_find => item_find.id === cart_item.parent_id) ? data.item_list.find(item_find => item_find.id === cart_item.parent_id):Item_Logic.get_not_found(cart_item.parent_data_type,cart_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				//get_cart_sub_item_list
				async function(call){
					if(cloud_data.cart_list.length>0){
						let search = Item_Logic.get_search(DataType.CART_SUB_ITEM,cart_number_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							cart_sub_item_list = data.item_list;
						}
					}
				},
				//get_cart_sub_item_list - parent_item_list
				async function(call){
					if(cloud_data.cart_list.length>0){
						cart_sub_item_list.forEach(cart_sub_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(cart_sub_item.parent_id), $options: "i" };
							cart_parent_item_list_query.$or.push(query_field);
						});
						let search = Item_Logic.get_search(DataType.ITEM,cart_parent_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							cart_sub_item_list.forEach(cart_sub_item => {
								cart_sub_item.parent_item = data.item_list.find(item_find => item_find.id === cart_sub_item.parent_id) ? data.item_list.find(item_find => item_find.id === cart_sub_item.parent_id):Item_Logic.get_not_found(cart_sub_item.parent_data_type,cart_sub_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				// cart_item_list - cart_sub_item_list - bind
				async function(call){
					if(cloud_data.cart_list.length>0){
						cart_item_list.forEach(cart_item => {
							cart_item.cart_sub_item_list = [];
							let item_filter_list = cart_sub_item_list.filter(item_find=>item_find.cart_item_id===cart_item.id);
							cart_item.cart_sub_item_list = [...item_filter_list, ...cart_item.cart_sub_item_list];
						});
					}
				},
				// cart_list - cart_item_list - bind
				async function(call){
					if(cloud_data.cart_list.length>0){
						cloud_data.cart_list.forEach(cart => {
							cart.cart_item_list = [];
							let item_filter_list = cart_item_list.filter(item_find=>item_find.cart_id===cart.id);
							cart.cart_item_list = [...item_filter_list, ...cart.cart_item_list];
						});
					}
				},
				// cart_list - caculate
				async function(call){
					if(cloud_data.cart_list.length>0){
						cloud_data.cart_list.forEach(cart => {
							cart = Cart_Data.caculate_cart(cart);
						});
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Cart-Search",error);
				callback([error,[]]);
			});
		});
	};
	//9_caculate_cart
	static caculate_cart = (cart) => {
		let grand_total = 0;
		cart.cart_item_list.forEach(cart_item => {
			cart_item.sub_total = 0;
			if(!isNaN(cart_item.parent_item.cost)){
				cart_item.sub_total = (cart_item.sub_total + cart_item.parent_item.cost) * cart_item.quanity;
				grand_total = grand_total + cart_item.sub_total;
			}
			cart_item.cart_sub_item_list.forEach(cart_sub_item => {
				cart_sub_item.sub_total = 0;
				if(!isNaN(cart_sub_item.parent_item.cost)){
					cart_sub_item.sub_total = (cart_sub_item.sub_total + cart_sub_item.parent_item.cost) * cart_sub_item.quanity;
					grand_total = grand_total + cart_sub_item.sub_total;
				}
			});
		});
		cart.grand_total = grand_total;
		return cart;
	};
	*/
}
class Product_Data {
	//9_product_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let product = DataItem.get_new(DataType.PRODUCT,0);
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.get(database,DataType.PRODUCT,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						product = item_data;
					}
				},
			]).then(result => {
				callback([error,product]);
			}).catch(error => {
				Log.error("Product-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_product_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {data_count:0,page_count:1,filter:{},data_type:DataType.PRODUCT,data_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,item_data] = await Portal.search(database,DataType.PRODUCT,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						data.data_count = item_data.data_count;
						data.data_type = DataType.PRODUCT;
						data.page_count = item_data.page_count;
						data.filter = item_data.filter;
						data.blog_post_list = item_data.data_list;
	}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Product-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Review_Data {
	/*
	//9_review_post
	static post = async(database,item_data_type,item_id,user_id,review) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.item = DataItem.get_new(item_data_type,item_id);
			cloud_data.item_item = DataItem.get_new(item_data_type,item_id);
			cloud_data.review = review;
			cloud_data.review.user = DataItem.get_new(DataType.USER,0);
			let review_list = [];
			let review_count = 0;
			let review_avg = 0;
			async.series([
				//review_post
				async function(call){
					const [error,data] = await Portal.post(database,DataType.REVIEW,cloud_data.review);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						cloud_data.item = data;
					}
				},
				//get_item
				async function(call){
					const [error,data] = await Portal.get(database,cloud_data.item.data_type,cloud_data.item.id);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						cloud_data.item = data;
					}
				},
				//post_item
				async function(call){
					if(!Str.check_is_null(cloud_data.item.id)){
						//rating_count
						cloud_data.item.rating_count = !Str.check_is_null(cloud_data.item.rating_count) ? parseInt(cloud_data.item.rating_count) + parseInt(review.rating) :parseInt(review.rating);
						//review_count
						cloud_data.item.review_count = !Str.check_is_null(cloud_data.item.review_count) ? parseInt(cloud_data.item.review_count) + 1 : 1;
						//rating_avg
						cloud_data.item.rating_avg = !Str.check_is_null(cloud_data.item.rating_avg) ? parseInt(cloud_data.item.rating_count)  /  parseInt(cloud_data.item.review_count) :parseInt(review.rating);

						const [error,data] = await Portal.post(database,cloud_data.item.data_type,cloud_data.item);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.item = data;
						}
					}
				},
				//get_user
				async function(call){
					if(!Str.check_is_null(cloud_data.item.id)){
						const [error,data] = await Portal.get(database,DataType.USER,user_id);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.review.user = data;
						}
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Review-Data-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_review_get
	static get = async (database,item_data_type,user_id,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			let item_item_list = [];
			let user_list = [];
			async.series([
				//review_list
				async function(call){
					let query = {user_id:user_id,item_data_type:item_data_type};
					let search = Item_Logic.get_search(DataType.REVIEW,query,{},page_current,page_size);
					let option = {get_item_search:true,item_search_data_type:item_data_type,item_search_field:'id',item_search_value:'item_id'};
					const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						for(let a=0;a<data.item_list.length;a++){
							data.item_list[a].item = DataItem.get_new(item_data_type,data.item_list[a].item,{title:'Not Found'});
							for(let b=0;b<data.item_search_list.length;b++){
								if(data.item_list[a].item_id == data.item_search_list[b].id){
									data.item_list[a].item_item = data.item_search_list[b];
								}
							}
						}
						cloud_data.item_list = data.item_list;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Review-Data-List",error);
				callback([error,[]]);
			});
		});
	};
	*/
}
class Activity_Data {
	/*
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		//9_activity_search
		return new Promise((callback) => {
			let cloud_data = {item_count:0,page_count:1,filter:{},data_type:DataType.ACTIVITY,item_list:[]};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {};
			let activity_id_list_query = { $or: [] };
			let activity_list = [];
			async.series([
				async function(call){
					let option = {get_item_search:true,item_search_data_type:DataType.USER,item_search_field:'id',item_search_value:'user_id'};
					const [error,data] = await Portal.search(database,DataType.ACTIVITY,filter,sort_by,page_current,page_size,option);
					data.item_list.forEach(item => {
						const item_match = data.item_search_list.find(item_find => item_find.id === item.user_id);
						if(item_match){
							item.parent_user = item_match;
						}else{
							item.parent_user = User_Logic.get_not_found(item.user_id);
						}
					});
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.item_count = data.item_count;
						cloud_data.page_count = data.page_count;
						cloud_data.filter = data.filter;
						cloud_data.data_type = data.data_type;
						cloud_data.activity_list = data.item_list;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Activity-Search",error);
				Log.error("User-Search",error);
			});
		});
	};
	*/
}
class User_Data {
	/*
	static get_device_info = async (activity,device) => {
		return new Promise((callback) => {
			activity.platform_name = !Str.check_is_null(device.name) ? device.name : 'N/A';
			activity.platform_version = !Str.check_is_null(device.version) ? device.version : 'N/A';
			activity.platform_layout = !Str.check_is_null(device.layout) ? device.layout : 'N/A';
			activity.platform_os = !Str.check_is_null(device.os) ? device.os : 'N/A';
			activity.platform_description = !Str.check_is_null(device.description) ? device.description : 'N/A';
			callback([null,activity]);
		});
	}
	static get_ip_info = async (ip_address,geo_key) => {
		return new Promise((callback) => {
			let error = null;
			let ip_info ={country_name:"",region_name:"",district:"",city_name:"",latitude:"",longitude:"",zip_code:"",isp:"",ip_address:""};
			var https = require('https');
			let url = 'https://api.ip2location.io/?key=' + geo_key + '&ip=' + ip_address + '&format=json';
			let response = '';
			let req = https.get(url, function (res) {
				res.on('error', (e) => console.log('GEO_LOCATION ERROR: ' + e));
				var https = require('https');
				var key = geo_key;
				var ip = ip_address;
				let url = 'https://api.ip2location.io/?key=' + key + '&ip=' + ip + '&format=json';
				let response = '';
				let req = https.get(url, function (res) {
					res.on('data', (chunk) => (response = response + chunk));
					res.on('error', (e) => console.log('ERROR: ' + e));
					res.on("end", function () {
						try {
							let geo_data = JSON.parse(response);
							ip_info =
								{
									country_name:geo_data.country_name,
									region_name:geo_data.region_name,
									is_proxy:geo_data.is_proxy,
									district:geo_data.district?geo_data.district:"N/A",
									city_name:geo_data.city_name,
									latitude:geo_data.latitude,
									longitude:geo_data.longitude,
									zip_code:geo_data.zip_code,
									isp:geo_data.as,
									ip_address:geo_data.ip
								};
							callback([error,ip_info]);
						}
						catch (e) {
							error = e;
							callback([error,ip_info]);
						}
					});
				});
			});
		});
	};
	//9_user_register
	static register = async (database,user,ip_address,geo_key,device) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			cloud_data.email_found = false;
			cloud_data.title_found = false;
			cloud_data.user = user;
			cloud_data.activity = DataItem.get_new(DataType.ACTIVITY,0);
			cloud_data.device = DataItem.get_new(DataType.BLANK,0,device);
			async.series([
				//check email
				async function(call){
					let search = Item_Logic.get_search(DataType.USER,{email:cloud_data.user.email},{},1,0);
					const [error,data] = await Portal.count(database,search.data_type,search.filter);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						if(data.count>0){
							cloud_data.email_found = true;
						}
					}
				},
				//check title
				async function(call){
					let search = Item_Logic.get_search(DataType.USER,{title:cloud_data.user.title},{},1,0);
					const [error,data] = await Portal.count(database,search.data_type,search.filter);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						if(data.count>0){
							cloud_data.title_found = true;
						}
					}
				},
				//post user
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						cloud_data.user.last_login = dayjs().toISOString();
						const [error,data] = await Portal.post(database,DataType.USER,cloud_data.user);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.user = data;
						}
					}
				},
				//get activity - ip
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						const [error,data] = await User_Data.get_ip_info(ip_address,geo_key);
						cloud_data.activity = DataItem.get_new(DataType.ACTIVITY,0,data);
						cloud_data.activity.user_id = cloud_data.user.id;
						cloud_data.activity.type = FieldType.ACTIVITY_TYPE_REGISTER;
					}
				},
				//get activity - device
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						const [error,data] = await User_Data.get_device_info(cloud_data.activity,cloud_data.device);
						cloud_data.activity = data;
					}
				},
				//post activity
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						const [error,data] = await Portal.post(database,DataType.ACTIVITY,cloud_data.activity);
						cloud_data.activity = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("User-Data-Register",error);
				callback([error,[]]);
			});
		});
	};
	//9_user_login
	static login = async (database,user,ip_address,geo_key,device) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.user_found = false;
			cloud_data.user = user;
			cloud_data.activity = DataItem.get_new(DataType.ACTIVITY,0);
			cloud_data.device = DataItem.get_new(DataType.BLANK,0,device);
			async.series([
				//check email,password
				async function(call){
					let search = Item_Logic.get_search(DataType.USER,{email:cloud_data.user.email,password:cloud_data.user.password},{},1,0);
					const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						if(data.item_list.length>0){
							cloud_data.user = data.item_list[0];
							cloud_data.user_found = true;
						}
					}
				},
				//post user
				async function(call){
					if(cloud_data.user_found){
						cloud_data.user.last_login = dayjs().toISOString();
						const [error,data] = await Portal.post(database,DataType.USER,cloud_data.user);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.user = data;
						}
					}
				},
				//get user
				async function(call){
					if(cloud_data.user_found){
						const [error,data] = await Portal.get(database,DataType.USER,cloud_data.user.id);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.user = data;
						}
					}
				},
				//get activity - ip
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						const [error,data] = await User_Data.get_ip_info(ip_address,geo_key);
						cloud_data.activity = DataItem.get_new(DataType.ACTIVITY,0,data);
						cloud_data.activity.user_id = cloud_data.user.id;
						cloud_data.activity.type = FieldType.ACTIVITY_TYPE_LOGIN;
					}
				},
				//get activity - device
				async function(call){
					if(cloud_data.user_found){
						const [error,data] = await User_Data.get_device_info(cloud_data.activity,cloud_data.device);
						cloud_data.activity = data;
					}
				},
				//post activity
				async function(call){
					if(cloud_data.user_found){
						const [error,data] = await Portal.post(database,DataType.ACTIVITY,cloud_data.activity);
						cloud_data.activity = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("User-Data-Login",error);
				callback([error,[]]);
			});
		});
	};
	*/
}
class Favorite_Data {
	/*
	//9_favorite_post
	static post = async (database,parent_data_type,parent_id,user_id) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.is_unique = false;
			cloud_data.favorite = DataItem.get_new(DataType.FAVORITE,0,{parent_data_type:parent_data_type,parent_id:parent_id,user_id:user_id});
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = Item_Logic.get_search(DataType.FAVORITE,favorite_filter,{},1,0);
					const [error,data] = await Portal.count(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						if(data.count<=0){
							cloud_data.is_unique = true;
						}
					}
				},
				async function(call){
					if(cloud_data.is_unique){
						const [error,data] = await Portal.post(DataType.FAVORITE,cloud_data.favorite);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.item = data;
						}
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Favorite-Data-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_favorite_get
	static get = async (database,parent_data_type,user_id,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				//favorite_list
				async function(call){
					let query = {user_id:user_id,parent_data_type:parent_data_type};
					let search = Item_Logic.get_search(DataType.FAVORITE,query,{date_create:-1},page_current,page_size);
					let option = {get_item_search:true,item_search_data_type:parent_data_type,item_search_field:'id',item_search_value:'item_id'};
					const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						for(let a=0;a<data.item_list.length;a++){
							data.item_list[a].item = DataItem.get_new(parent_data_type,data.item_list[a].item,{title:'Not Found'});
							for(let b=0;b<data.item_search_list.length;b++){
								if(data.item_list[a].item_id == data.item_search_list[b].id){
									data.item_list[a].item = data.item_search_list[b];
								}
							}
						}
						cloud_data.item_list = data.item_list;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Favorite-Data-List",error);
				callback([error,[]]);
			});
		});
	};
	*/
}
class Portal {
	//9_portal_get
	static get = async (database,data_type,key,option) => {
		/* Options
		 * Items
		 *  - get_item / bool / ex. true,false / def. true
		 * Photos
		 *  - get_photo / bool / ex. true,false / def. true
		 *    - photo_count / int / ex. 1-999 / def. 19
		 *    - photo_sort_by / query obj / ex. {date_create:1}
		 */
		return new Promise((callback) => {
			let error = null;
			let data = DataItem.get_new(data_type,0,{key:key});
			let full_data_list = [];
			let new_data_list = [];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,title_url:null,get_group:false,filter:false};
			async.series([
				function(call){
					if(!Num.check_is_guid(key)){
						option.title_url = key;
					}
					call();
				},
				function(call){
					Data.get(database,data_type,key,option).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							if(!Str.check_is_null(item.id)){
								data = item_data;
							}else{
								data = data_type != DataType.USER ? Item_Logic.get_not_found(data_type,key,{app_id:database.app_id}) : User_Logic.get_not_found(key,{app_id:database.app_id});
								data.photos = [];
								data.items = [];
							}
						}
						call();
					}).catch(error => {
						Log.error("Portal-Get-Key-A",error);
						error = Log.append(error,error);
						call();
					});
				},
				function(call){
					function get_sort(data){
						let sort_order = {};
						switch(data.setting_sort_type)
						{
							case 'title':
								sort_order = data.setting_sort_order == 'desc' ? {title:1} :  {title:-1};
								break;
							case 'order':
								sort_order = data.setting_sort_order == 'asc' ? {setting_order:1} : {setting_order:-1};
								break;
							case 'date':
								sort_order = data.setting_sort_order == 'desc' ? {date_create:1} : {date_create:-1};
								break;
							default:
								sort_order = data.setting_sort_order == 'desc' ? {title:-1} :  {title:1};
								break;
						}
						return sort_order;
					}
					let filter = {};
					if(!Str.check_is_null(data.id) && option.get_item || option.get_section){
						if(Str.check_is_null(data.top_id)){
							filter={top_id:data.id};
						}else{
							filter={top_id:data.top_id};
						}
						let search = Item_Logic.get_search(DataType.ITEM,filter,get_sort(data),1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,item_list,item_count,page_count])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								full_data_list = item_list;
							}
							call();
						}).catch(error => {
							error = Log.append(error,error);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(!Str.check_is_null(data.id) && option.get_item || option.get_section){
						data.items = [];
						for(let a=0; a<full_data_list.length; a++){
							if(full_data_list[a].parent_id == data.id){
								let data_title_url = Str.get_title_url(full_data_list[a].title);
								data[item_title_url] = new Object();
								data[item_title_url] = full_data_list[a];
								data.items.push(full_data_list[a]);
							}
						}
						call();
					}
					else{
						call();
					}
				},
				async function(call){
					if(!Str.check_is_null(data.id) && option.get_photo){
						data.item.photos = [];
						if(option.photo_count == null){
							option.photo_count = 19;
						}
						if(option.photo_sort_by == null){
							option.photo_sort_by = {date_create:1};
						}
						let filter = {parent_id:data.id};
						let sort_by = option.photo_sort_by;
						let page_current = 1;
						let page_size = option.photo_count;
						const [error,item_data] = await Portal.search(database,DataType.PHOTO,filter,sort_by,page_current,page_size,option);
						if(item_data.item_list.length > 0){
							data.photos = item_data.data_list;
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Portal-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_search
	static search = (database,data_type,filter,sort_by,page_current,page_size,option) => {
		/* Options
		 * Items
		 *  - get_item / bool / ex. true,false / def. true
		 * Photos
		 *  - get_photo / bool / ex. true,false / def. true
		 *    - photo_count / int / ex. 1-999 / def. 19
		 *    - photo_sort_by / query obj / ex. {date_create:1}
		 *  Count
		    - get_item_count / true - false
			  - item_count_data_type / Product
			  - item_count_field / ex. category
			  - item_count_value /  ex. title
		 *  Search
		 *  - get_item_search / true - false
			  - item_search_data_type / Product
			  - item_search_field / category_title
			  - item_search_value / 'beauty'
			  */
		return new Promise((callback) => {
			let data = {data_type:data_type,data_count:0,page_count:1,filter:{},data_list:[],app_id:database.app_id};
			let error=null;
			let data_list_count =[];
			let data_search_list =[];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					let search = Item_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,item_list,item_count,page_count])=>{
						if(error){
							error=Log.append(error,error);
						}else{
							data.data_type=data_type;
							data.data_count=item_count;
							data.page_count=page_count;
							data.filter=filter;
							data.data_list=item_list;
							data.app_id = database.app_id;
							call();
						}
					}).catch(error => {
						error=Log.append(error,error);
					});
				},
				function(call){
					if(option.get_item_count && data.data_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < data.data_list.length;a++){
							let query_field = {};
							query_field[option.item_count_field] = { $regex:String(data.data_list[a][option.item_count_value]), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(option.item_count_data_type,query,{},1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,item_list,item_count,page_count])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								data_list_count = item_list;
							}
							call();
						}).catch(error => {
							error = Log.append(error,error);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.get_item_count && data.data_list.length>0){
						for(let a = 0; a < data.data_list.length; a++){
							data.data_list[a].data_count = 0;
							for(let b = 0; b < data_list_count.length; b++){
								if(data.data_list[a][option.item_count_value] == data_list_count[b][option.item_count_field]){
									data.data_list[a].data_count = data.data_list[a].data_count + 1;
								}
							}
						}
						call();
					}else{
						call();
					}
				},
				function(call){
					if(option.get_item_search && data.data_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < data.data_list.length;a++){
							let query_field = {};
							query_field[option.item_search_field] = { $regex:String(data.data_list[a][option.item_search_value]), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(option.item_search_data_type,query,{},1,0);
						data.item_search_search = search;
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,item_list,item_count,page_count])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								data.data_search_list = item_list;
								data.data_search_count = item_count;
								data.data_search_page_count = page_count;
								data.data_search_data_type = search.data_type;
								data.data_search_search = search;
							}
							call();
						}).catch(error => {
							error = Log.append(error,error);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.get_item_search && data.data_list.length>0){
						for(let a = 0; a < data.data_list.length; a++){
							data.data_list[a].data_search_list = [];
							for(let b = 0; b < data_search_list.length; b++){
								if(data.data_list[a][option.item_search_value] == data_search_list[b][option.item_search_field]){
									data.data_list[a].data_search_list.push(data_search_list[b]);
								}
							}
						}
						call();
					}else{
						call();
					}
				}
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Portal-Search",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_post
	static post = async (database,data_type,item,option) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data = DataItem.get_new(data_type,0);
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.post(database,data_type,item,option).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							data = item_data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Post-Data",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_delete_cache
	static delete_cache = async (database,data_type,id,option) => {
		/*
		 * params
		 * - title_tbd
		 *   - description. / type / ex.
		 * option
		 * - title_tbd
		 *   - description. / type / ex.
		 * return
		 * - title_tbd
		 *   - description. / type / ex.
		 *
		 */
		return new Promise((callback) => {
			let error = null;
			let data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.delete_cache(database,data_type,id).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							data = item_data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Delete-Cache-Item",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_delete
	static delete = async (database,data_type,id,option) => {
		/*
		 * Params
		 * - title
		 *   - description / type / example / required
		 * Option
		 * - delete_items
		 *   - description / bool / example / default: false
		 * - delete_photos
		 *   - description / bool / example / default: false
		 * Return
		 * - title
		 *   - description / type /
		 */
		return new Promise((callback) => {
			let error = null;
			let data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,delete_items:true,delete_photos:true};
			async.series([
				function(call){
					Data.delete(database,data_type,id).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							data.data = item_data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
				function(call){
					if(option.delete_items){
						let data_type = DataType.ITEM;
						let filter = {parent_id:id};
						data.delete_data_list = false;
						Data.delete_list(database,data_type,filter).then(([error,item_data])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								data.delete_data_list = true;
							}
							call();
						}).catch(error => {
							error = Log.append(error,error);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.delete_photos){
						let data_type = DataType.PHOTO;
						let filter = {parent_id:id};
						cloud_data.delete_photos = false;
						Data.delete_list(database,data_type,filter).then(([error,item_data])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								data.delete_photos = true;
							}
							call();
						}).catch(error => {
							error = Log.append(error,error);
							call();
						});
					}else{
						call();
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Delete-Item",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_post_list - 9_post_list
	static post_list = async (database,data_list,option) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data_list = [];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.post_list(database,data_list).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							data_list = item_data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,data_list]);
			}).catch(error => {
				Log.error("Post-List-Data",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_delete_search
	static delete_search = async (database,data_type,filter,option) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.delete_list(database,data_type,filter).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							data = item_data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},

			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Delete-List-Data",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_count
	static count = async (database,data_type,filter) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data = {};
			async.series([
				function(call){
					Data.count_list(database,data_type,filter).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							data = item_data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Count-List-Data",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_copy
	static copy = async (database,data_type,id) => {
		/*
		 * params
		 * - title_tbd
		 *   - description. / type / ex.
		 * options
		 * - title_tbd
		 *   - description. / type / ex.
		 * return
		 * - title_tbd
		 *   - description. / type / ex.
		 *
		 */
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {copy_success:false,app_id:database.app_id};
			let top_data = DataItem.get_new(data_type,0);
			let copy_data = DataItem.get_new(data_type,0);
			let data_list = [];
			let copy_data_list = [];
			async.series([
				function(call){
					Data.get(database,data_type,id).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}
						top_data=item_data;
						call();
					})
				},
				function(call){
					let filter = {top_id:top_data.id};
					let search = Item_Logic.get_search(DataType.ITEM,filter,{},1,0);
					Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,item_data,item_count,page_count])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							data_list = item_data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
				function(call){
					copy_data[FieldType.TITLE] = 'Copy '+top_data[FieldType.TITLE];
					copy_data[FieldType.TITLE_URL] = 'copy_'+top_data[FieldType.TITLE_URL];
					copy_data[FieldType.SOURCE_ID] = top_data.id;
					copy_data[FieldType.SOURCE_DATA_TYPE] = top_data.data_type;
					for(const key in top_data) {
						if(key!=FieldType.ID&&key!=FieldType.SOURCE&&key!=FieldType.TITLE&&key!=FieldType.TITLE_URL){
							copy_data[key]=top_data[key];
						}
					}
					call();
				},
				function(call){
					Data.post(database,copy_data.data_type,copy_data).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							copy_data=item_data;
						}
						call();
					}).catch(error => {
						error=Log.append(error,error);
						call();
					});
				},
				function(call){
					for(let a=0;a<data_list.length;a++){
						let copy_sub_data=DataItem.get_new(copy_data.data_type,0,{top_id:copy_data.id,top_data_type:copy_data.data_type});
						copy_sub_data[FieldType.SOURCE_ID] = data_list[a][FieldType.ID];
						copy_sub_data[FieldType.SOURCE_DATA_TYPE] = data_list[a][FieldType.DATA_TYPE];

						copy_sub_data[FieldType.SOURCE_PARENT_ID] = data_list[a][FieldType.PARENT_ID];
						copy_sub_data[FieldType.SOURCE_PARENT_DATA_TYPE] = data_list[a][FieldType.PARENT_DATA_TYPE][FieldType.PARENT_DATA_TYPE];

						copy_sub_data[FieldType.SOURCE_TOP_ID] = data_list[a][FieldType.TOP_ID];
						copy_sub_data[FieldType.SOURCE_TOP_DATA_TYPE] = data_list[a][FieldType.TOP_DATA_TYPE];

						for(const key in data_list[a]) {
							if( key != FieldType.ID && key != FieldType.SOURCE && key != FieldType.PARENT_ID && key != FieldType.PARENT_DATA_TYPE  && key != FieldType.TOP_ID && key != FieldType.TOP_DATA_TYPE ){
								copy_sub_data[key] = data_list[a][key];
							}
						}
						copy_data_list.push(copy_sub_data);
					}
					call();
				},
				function(call){
					Data.post_list(database,copy_data_list).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}
						copy_data_list=item_data;
						call();
					})
				},
				function(call){
					for(let a=0;a<copy_data_list.length;a++){
						if(copy_data_list[a][FieldType.SOURCE_PARENT_ID] == top_data[FieldType.ID]){
							copy_data_list[a][FieldType.PARENT_ID] = copy_data[FieldType.ID];
							copy_data_list[a][FieldType.PARENT_DATA_TYPE]  = copy_data[FieldType.DATA_TYPE];
						}else{
							for(let b=0;b<copy_data_list.length;b++){
								if(copy_data_list[a][FieldType.SOURCE_PARENT_ID] == copy_data_list[b][FieldType.SOURCE_ID]){
									copy_data_list[a][FieldType.PARENT_ID] = copy_data_list[b][FieldType.ID];
									copy_data_list[a][FieldType.PARENT_DATA_TYPE] = copy_data_list[b][FieldType.DATA_TYPE];
								}
							}
						}
					}
					call();
				},
				function(call){
					Data.post_list(database,copy_data_list).then(([error,item_data])=> {
						if(error){
							error=Log.append(error,error);
						}
						copy_data_list=item_data;
						call();
					})
				},
			]).then(result => {
				if(copy_data.id){
					data.copy_data = copy_data;
					data.copy_data_list = copy_data_list;
					data.copy_success = true;
				}
				callback([error,data]);
			}).catch(error => {
				Log.error("Copy",error);
				callback([error,[]]);
			});
		});
	};
}
class Faq_Data{
	//9_faq_get
	static get = (database,key,option) => {
		return new Promise((callback) => {
			let data = {faq:DataItem.get_new(DataType.FAQ,0,{questions:[]})};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {question_count:19};
			let faq = DataItem.get_new(DataType.FAQ,0);
			async.series([
				async function(call){
					const [error,item_data] = await Portal.get(database,DataType.FAQ,key,option);
					faq=item_data;
				},
				async function(call){
					if(!Str.check_is_null(faq.id)){
						for(let a=0;a<option.question_count+1;a++){
							if(faq["field_"+a]){
								data.faq.questions.push({id:a,question:faq["field_"+a],answer:faq["faq_question_"+a]});
							}
						}
					}
				},
			],
				function(error, result){
					callback([error,data.faq.questions]);
				});
		});
	}
}
class Stat_Data {
	/*
	//9_stat_post
	static post = (database,parent_data_type,user_id,stat_type_id,parent_item_list,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			cloud_data.stat_new = true;
			cloud_data.stat_item_list = [];
			cloud_data.stat_item_list = [];
			let error = null;
			if(!parent_item_list){
				parent_item_list = [];
			}
			async.series([
				//get parent items
				async function(call){
					if(parent_item_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < parent_item_list.length;a++){
							let query_field = {};
							query_field['id'] = { $regex:String(parent_item_list[a].item_id), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(parent_data_type,query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < parent_item_list.length; a++){
								parent_item_list[a].item = DataItem.get_new(parent_data_type,0);
								for(let b = 0; b < data.item_list.length; b++){
									if(parent_item_list[a].item_id == data.item_list[b].id){
										parent_item_list[a].item_item = data.item_list[b];
									}
								}
							}
						}
					}
				},
				//get user stats
				async function(call){
					if(parent_item_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < parent_item_list.length;a++){
							let query_field = {};
							query_field['user_id'] = { $regex:String(user_id), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(DataType.STAT,query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < parent_item_list.length; a++){
								let str = get_stat_str(stat_type_id);
								parent_item_list[a][str] = !Str.check_is_null(parent_item_list[a].item[str]) ? parseInt(parent_item_list[a].item[str]) + 1 : 1;
								parent_item_list[a].item[str] = parent_item_list[a][str];
								parent_item_list[a].stat_new = true;
								for(let b = 0; b < data.item_list.length; b++){
									if(parent_item_list[a].id == data.item_list[b].item_id && parent_item_list[a].data_type == data.item_list[b].parent_data_type && stat_type_id== data.item_list[b].type_id){
										parent_item_list[a].stat_new = false;
									}
								}
							}
						}
					}
				},
				//save stat list
				async function(call){
					if(parent_item_list.length>0){
						let str = get_stat_str(stat_type_id);
						for(let a = 0; a < parent_item_list.length; a++){
							if(parent_item_list[a].stat_new){
								let stat_item = DataItem.get_new(DataType.STAT,0,{
									parent_data_type:parent_item_list[a].parent_data_type,
									item_id:parent_item_list[a].item_id,
									stat_type_id:stat_type_id,
									stat_new:parent_item_list[a].stat_new
								});
								stat_item[str] = parent_item_list[a][str];
								cloud_data.stat_item_list.push(stat_item);
							}
						}
						const [error,data] = await Portal.post_list(database,cloud_data.stat_item_list);
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.stat_item_list = data;
						}
					}
				},
				//save item list
				async function(call){
					if(parent_item_list.length>0){
						let stat_item_list = [];
						let str = get_stat_str(stat_type_id);
						for(let a = 0; a < parent_item_list.length; a++){
							if(parent_item_list[a].stat_new && stat_type_id != FieldType.STAT_REVIEW_ADD_ID){
								let item = DataItem.get_new(parent_item_list[a].item.data_type,parent_item_list[a].item.id);
								item[str] = parent_item_list[a][str];
								cloud_data.stat_item_list.push(item);
							}
						}
						if(cloud_data.stat_item_list.length>0){
							const [error,data] = await Portal.post_list(database,cloud_data.stat_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.stat_item_list = data;
							}
						}
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("-Update-Item-View-Count-",error);
				callback([error,[]]);
			});
			function get_stat_str(stat_type_id){
				let str = "";
				switch(stat_type_id){
					case FieldType.STAT_VIEW_ADD_ID:
						str = 'view_count';
						break;
					case FieldType.STAT_LIKE_ADD_ID:
						str = 'like_count';
						break;
					case FieldType.STAT_FAVORITE_ADD_ID:
						str = 'favorite_count';
						break;
					case FieldType.STAT_CART_ADD_ID:
						str = 'cart_count';
						break;
					case FieldType.STAT_ORDER_ADD_ID:
						str = 'order_count';
						break;
					case FieldType.STAT_REVIEW_ADD_ID:
						str = 'review_count';
						break;
					default:
						str = 'view_count';
						break;
				}
				return str;

			}
		});
	};
	*/
}
class Data {
	//9_data
	static open_db = async (data_config) => {
		return [error,data] = await get_db_connect_adapter(data_config);
	};
	static delete_db = async (db_connect) => {
		return [error,data] = await delete_db_connect_adapter(db_connect);
	};
	static check_db = async (db_connect) => {
		return check_db_connect_adapter(db_connect);
	};
	static post = async (db_connect,data_type,data,option) => {
		return [error,data] = await post_item_adapter(db_connect,data_type,data,option);
	};
	static get = async (db_connect,data_type,key,option) => {
		return [error,data] = await get_item_adapter(db_connect,data_type,key,option);
	};
	static delete = async (db_connect,data_type,id) => {
		return [error,data] = await delete_item_adapter(db_connect,data_type,id);
	};
	static delete_cache = async (db_connect,data_type,id) => {
		return [error,data] = await delete_item_cache(db_connect,data_type,id);
	};
	static post_list = async (db_connect,data_list) => {
		return [error,data] = await post_item_list_adapter(db_connect,data_list);
	};
	static get_list = async (db_connect,data_type,filter,sort_by,page_current,page_size) => {
		const [error,data,data_count,page_count] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size);
		return [error,data,data_count,page_count];
	};
	static delete_list = async (db_connect,data_type,filter) => {
		return [error,data_list] = await delete_item_list_adapter(db_connect,data_type,filter);
	};
	static count_list = async (db_connect,data_type,filter) => {
		return [error,data] = await get_count_item_list_adapter(db_connect,data_type,filter);
	};
	//9_blank
	static blank = (database) => {
		return new Promise((callback) => {
			let data = DataItem.get_new(DataType.BLANK,0);
			let error = null;
			async.series([
				async function(call){
				},
			]).then(result => {
				callback([error,data]);
			}).catch(error => {
				Log.error("Blank-Get",error);
				callback([error,[]]);
			});
		});
	};
}
module.exports = {
	Activity_Data,
	Blog_Post_Data,
	Category_Data,
	Cart_Data,
	Content_Data,
	Database,
	Event_Data,
	Favorite_Data,
	Faq_Data,
	Order_Data,
	Page_Data,
	Portal,
	Product_Data,
	Review_Data,
	User_Data,
	Template_Data,
	Stat_Data,
};
