/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {get_db_connect_main,check_db_connect_main,delete_db_connect_main,post_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,get_count_item_list_main,post_bulk_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num,Obj,DateTime}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
const {DataItem,DataType,Favorite_Logic,Stat_Logic,Review_Logic,Type,App_Logic,Product_Logic,Demo_Logic,Category_Logic,Cart_Logic,Order_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const { get_db_connect_adapter,check_db_connect_adapter,delete_db_connect_adapter,post_item_adapter,post_item_list_adapter,post_bulk_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,get_count_item_list_adapter,delete_item_cache }  = require('./adapter.js');
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
		let error=null;
		let data={};
		return new Promise((callback) => {
			option = option ? option : {biz9_config_file:null,app_id:null};
			if(option.biz9_config_file==null){
				option.biz9_config_file=null;
			}else{
				data_config = Scriptz.get_biz9_config(option);
			}
			if(option.app_id){
				data_config.APP_ID = option.app_id;
			}
			if(data_config.APP_ID==null){
				error=Log.append(error,"Database Error: Missing app_id.");
			}
			Data.open_db(data_config).then(([biz_error,biz_data])=>{
				error=Log.append(error,biz_error);
				biz_data.data_config=data_config;
				biz_data.app_id=data_config.APP_ID;
				callback([error,biz_data]);
			}).catch(err => {
				Log.error("BiZItem-Get-Connect",err);
				callback([err,null]);
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
		let error=null;
		return new Promise((callback) => {
			Data.delete_db(database).then(([error,data])=>{
				callback([error,data]);
			}).catch(err => {
				Log.error("DB-Close",err);
				callback([err,null]);
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
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.BLOG_POST,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}
					else{
						blog_post = biz_data;
					}
				},
			]).then(result => {
				callback([error,blog_post]);
			}).catch(err => {
				Log.error("Blog_Post-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_blog_post_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.BLOG_POST,blog_post_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.BLOG_POST,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.BLOG_POST;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.blog_post_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Blog_Post-Search",err);
				callback([err,null]);
			});
		});
	};
}
class Category_Data { //9_category_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let category = DataItem.get_new(DataType.CATEGORY,0);
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.CATEGORY,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						category = biz_data;
					}
				},
			]).then(result => {
				callback([error,category]);
			}).catch(err => {
				Log.error("Category-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_category_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.CATEGORY,category_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.CATEGORY,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.CATEGORY;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.category_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Category-Search",err);
				callback([err,null]);
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
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.CONTENT,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						content = biz_data;
					}
				},
			]).then(result => {
				callback([error,content]);
			}).catch(err => {
				Log.error("Content-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_content_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.CONTENT,content_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.CONTENT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.CONTENT;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.content_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Content-Search",err);
				callback([err,null]);
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
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.PAGE,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						page = biz_data;
					}
				},
			]).then(result => {
				callback([error,page]);
			}).catch(err => {
				Log.error("Page-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_page_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.PAGE,page_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.PAGE,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type =DataType.PAGE;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.page_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Page-Search",err);
				callback([err,null]);
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
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.TEMPLATE,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						template = biz_data;
					}
				},
			]).then(result => {
				callback([error,template]);
			}).catch(err => {
				Log.error("Template-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_template_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.TEMPLATE,template_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.TEMPLATE,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.TEMPLATE;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.template_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Template-Search",err);
				callback([err,null]);
			});
		});
	};
}
class Gallery_Data {
	//9_gallery_data_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let gallery = DataItem.get_new(DataType.GALLERY,0);
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.GALLERY,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						gallery = biz_data;
					}
				}, ]).then(result => { callback([error,gallery]);
			}).catch(err => {
				Log.error("Gallery-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_gallery_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {gallery_count:0,page_count:1,filter:{},data_type:DataType.GALLERY,gallery_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.GALLERY,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.GALLERY;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.data_type = biz_data.data_type;
						data.gallery_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Gallery-Search",err);
				callback([err,[]]);
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
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.EVENT,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						event = biz_data;
					}
				}, ]).then(result => { callback([error,event]);
			}).catch(err => {
				Log.error("Event-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_event_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {event_count:0,page_count:1,filter:{},data_type:DataType.EVENT,event_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.EVENT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.EVENT;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.data_type = biz_data.data_type;
						data.event_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Event-Search",err);
				callback([err,[]]);
			});
		});
	};
}
class Order_Data {
	//9_order_post
	static post = async (database,order) => {
		return new Promise((callback) => {
			let data = {order:DataItem.get_new(DataType.ORDER,0, {
							order_number:order.order_number,
							parent_data_type:order.parent_data_type,
							user_id:order.user_id,
							cart_number:order.cart_number,
							grand_total:Order_Logic.get_grand_total(order),
						}),order_item_list:[],order_sub_item_list:[]};
			let error = null;
			async.series([
			async function(call){
					const [biz_error,biz_data] = await Portal.post(database,DataType.ORDER,data.order);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
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
										order_id:data.order.id,
										order_number:data.order.order_number,
										user_id:data.order.user_id,
										quanity:item.quanity,
										parent_data_type:item.parent_data_type,
										parent_id:item.parent_id,
										temp_row_id :item.temp_row_id
									}));
						});
						if(data.order_item_list.length>0){
							const [biz_error,biz_data] = await Portal.post_list(database,data.order_item_list);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.order_item_list = biz_data;
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
											order_id:data.order.id,
											order_number:data.order.order_number,
											user_id:data.order.user_id,

											order_item_id:data.order_item_list.find(item_find => item_find.temp_row_id === order_item.temp_row_id).id,
											quanity:order_sub_item.quanity,
											parent_data_type:order_sub_item.parent_data_type,
											parent_id:order_sub_item.parent_id
										}));
							});
						});
						if(data.order_sub_item_list.length>0){
							const [biz_error,biz_data] = await Portal.post_list(database,data.order_sub_item_list);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.order_sub_item_list = biz_data;
							}
						}
					}
				},
				//get order
				async function(call){
					const [biz_error,biz_data] = await Order_Data.get(database,order.order_number);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order = biz_data;
						}
				},
			]).then(result => {
				callback([error,data.order]);
			}).catch(err => {
				Log.error("OrderData-Order-Item-Update",err);
				callback([error,[]]);
			});
		});
	};
	//9_order_get
	static get = (database,order_number,option) => {
		return new Promise((callback) => {
			let data = {order:DataItem.get_new(DataType.ORDER,0,{order_number:order_number,grand_total:0,order_item_list:[],parent_user:DataItem.get_new(DataType.USER,0)})};
			let order_parent_item_list_query = { $or: [] };
			let order_sub_item_list_query = { $or: [] };
			let error = null;
			let order_sub_item_list = [];
			option = option ? option : {get_payment:true};
			async.series([
				//get_order
				async function(call){
					let filter = { order_number: { $regex:String(order_number), $options: "i" } };
					const [biz_error,biz_data] = await Portal.get(database,DataType.ORDER,order_number,{filter:filter});
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.USER,data.order.user_id);
					data.order.parent_user=biz_data;
				},
				//get_order_item_list
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = App_Logic.get_search(DataType.ORDER_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order.order_item_list = biz_data.data_list;
						}
					}
				},
				//get_order_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						data.order.order_item_list.forEach(order_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(order_item.parent_id), $options: "i" };
							order_parent_item_list_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(data.order.parent_data_type,order_parent_item_list_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order.order_item_list.forEach(order_item => {
								order_item.parent_item = biz_data.data_list.find(item_find => item_find.id === order_item.parent_id) ? biz_data.data_list.find(item_find => item_find.id === order_item.parent_id):App_Logic.get_not_found(order_item.parent_data_type,order_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
			//get_order_sub_item_list
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = App_Logic.get_search(DataType.ORDER_SUB_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							order_sub_item_list = biz_data.data_list;
						}
					}
				},
				//get_order_sub_item_list - parent_sub_item_list
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						order_sub_item_list.forEach(order_sub_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(order_sub_item.parent_id), $options: "i" };
							order_sub_item_list_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(DataType.PRODUCT,order_sub_item_list_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							order_sub_item_list.forEach(order_sub_item => {
								order_sub_item.parent_item = biz_data.data_list.find(item_find => item_find.id === order_sub_item.parent_id) ? biz_data.data_list.find(item_find => item_find.id === order_sub_item.parent_id):App_Logic.get_not_found(order_sub_item.parent_data_type,order_sub_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				// order_item_list - order_sub_item_list - bind
				async function(call){
					data.order.order_item_list.forEach(order_item => {
						order_item.order_sub_item_list = [];
						let item_filter_list = order_sub_item_list.filter(item_find=>item_find.order_item_id===order_item.id);
						order_item.order_sub_item_list = [...item_filter_list, ...order_item.order_sub_item_list];
					});
				},
				]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Order-Get",err);
				callback([error,[]]);
			});
		});
	};
	//9_order_delete
	static delete = async (database,id) => {
		return new Promise((callback) => {
			let data = {};
			let error = null;
			data.order = DataItem.get_new(DataType.ORDER,id);
			async.series([
				//get_order
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.ORDER,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.delete(database,DataType.ORDER,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order_delete = biz_data.item;
					}
				},
				async function(call){
					let search = App_Logic.get_search(DataType.ORDER_ITEM,{order_number:data.order.order_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_order_item_search = biz_data;
					}
				},
				async function(call){
					let search = App_Logic.get_search(DataType.ORDER_SUB_ITEM,{order_number:data.order.order_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_order_sub_item_search = biz_data;
					}
				},
				async function(call){
					let search = App_Logic.get_search(DataType.ORDER_PAYMENT,{order_number:data.order.order_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_order_payment_search = biz_data;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("OrderData-Order-Delete",err);
				callback([error,[]]);
			});
		});
	};
}
class Cart_Data {
//9_cart_post
	static post = async (database,cart,option) => {
		return new Promise((callback) => {
			let data = {};
			let error = null;
			data.cart = DataItem.get_new(DataType.CART,cart.id,{cart_number:cart.cart_number,parent_data_type:cart.parent_data_type,user_id:cart.user_id,grand_total: 0});
			data.cart_item_list = [];
			data.cart_sub_item_list = [];
			async.series([
				async function(call){
					for(const key in cart) {
						if(Str.check_is_null(data.cart[key]) && key != 'cart_item_list' &&  key != 'cart_item_list' && key != 'cart_sub_item_list'){
							data.cart[key] = cart[key];
						}
					}
				},
				//post - cart
				async function(call){
					const [biz_error,biz_data] = await Portal.post(database,DataType.CART,data.cart);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				//post - cart items
				async function(call){
					if(cart.cart_item_list.length>0){
						cart.cart_item_list.forEach(item => {
							item.temp_row_id = Num.get_id();
							data.cart_item_list.push(
								DataItem.get_new(DataType.CART_ITEM,0,
									{
										cart_id:data.cart.id,
										cart_number:data.cart.cart_number,
										user_id:data.cart.user_id,

										quanity:item.quanity,
										cost:item.cost,
										parent_data_type:item.parent_data_type,
										parent_id:item.parent_id,

										temp_row_id :item.temp_row_id
									}));
						});
						if(data.cart_item_list.length>0){
							const [biz_error,biz_data] = await Portal.post_list(database,data.cart_item_list);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.cart_item_list = biz_data;
							}
						}
					}
				},
				//post - cart_sub_item_list
				async function(call){
					if(cart.cart_item_list.length>0){
						cart.cart_item_list.forEach(cart_item => {
							cart_item.cart_sub_item_list.forEach(cart_sub_item => {
								data.cart_sub_item_list.push(
									DataItem.get_new(DataType.CART_SUB_ITEM,0,
										{
											cart_id:data.cart.id,
											cart_number:data.cart.cart_number,
											user_id:data.cart.user_id,
											cart_item_id:data.cart_item_list.find(item_find => item_find.temp_row_id === cart_item.temp_row_id).id,
											quanity:cart_sub_item.quanity,
											cost:cart_sub_item.cost,
											parent_data_type:cart_sub_item.parent_data_type,
											parent_id:cart_sub_item.parent_id
										}));
							});
						});
						if(data.cart_sub_item_list.length>0){
							const [biz_error,biz_data] = await Portal.post_list(database,data.cart_sub_item_list);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.cart_sub_item_list = biz_data;
							}
						}
					}
				},
				//get cart
				async function(call){
					const [biz_error,biz_data] = await Cart_Data.get(database,cart.cart_number);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart = biz_data;
						}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("CartData-Cart-Item-Update",err);
				callback([error,[]]);
			});
		});
	};
	//9_cart_get
	static get = (database,cart_number) => {
		return new Promise((callback) => {
			let data = {cart:DataItem.get_new(DataType.CART,0,{cart_number:cart_number,cart_item_list:[],parent_user:DataItem.get_new(DataType.USER,0)})};
			let cart_parent_item_list_query = { $or: [] };
			let cart_sub_item_list_query = { $or: [] };
			let error = null;
			let cart_sub_item_list = [];
			async.series([
				//get_cart
				async function(call){
					let filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
					const [biz_error,biz_data] = await Portal.get(database,DataType.CART,cart_number,{filter:filter});
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.USER,data.cart.user_id);
					data.cart.parent_user=biz_data;
				},
				//get_cart_item_list
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						let filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
						let search = App_Logic.get_search(DataType.CART_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart.cart_item_list = biz_data.data_list;
						}
					}
				},
				//get_cart_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						data.cart.cart_item_list.forEach(cart_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(cart_item.parent_id), $options: "i" };
							cart_parent_item_list_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(data.cart.parent_data_type,cart_parent_item_list_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart.cart_item_list.forEach(cart_item => {
								cart_item.parent_item = biz_data.data_list.find(item_find => item_find.id === cart_item.parent_id) ? biz_data.data_list.find(item_find => item_find.id === cart_item.parent_id):App_Logic.get_not_found(cart_item.parent_data_type,cart_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				//get_cart_sub_item_list
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						let filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
						let search = App_Logic.get_search(DataType.CART_SUB_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							cart_sub_item_list = biz_data.data_list;
						}
					}
				},
				//get_cart_sub_item_list - parent_sub_item_list
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						cart_sub_item_list.forEach(cart_sub_item => {
							let query_field = {};
							query_field['id'] = { $regex:String(cart_sub_item.parent_id), $options: "i" };
							cart_sub_item_list_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(DataType.PRODUCT,cart_sub_item_list_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							cart_sub_item_list.forEach(cart_sub_item => {
								cart_sub_item.parent_item = biz_data.data_list.find(item_find => item_find.id === cart_sub_item.parent_id) ? biz_data.data_list.find(item_find => item_find.id === cart_sub_item.parent_id):App_Logic.get_not_found(cart_sub_item.parent_data_type,cart_sub_item.parent_id,{app_id:database.app_id});
							});
						}
					}
				},
				// cart_item_list - cart_sub_item_list - bind
				async function(call){
					data.cart.cart_item_list.forEach(cart_item => {
						cart_item.cart_sub_item_list = [];
						let item_filter_list = cart_sub_item_list.filter(item_find=>item_find.cart_item_id===cart_item.id);
						cart_item.cart_sub_item_list = [...item_filter_list, ...cart_item.cart_sub_item_list];
					});
				},
			]).then(result => {
				callback([error,data.cart]);
			}).catch(err => {
				Log.error("Cart-Get",err);
				callback([error,[]]);
			});
		});
	};
	//9_cart_delete
	//
	static delete = async (database,id) => {
		return new Promise((callback) => {
			let data = {};
			let error = null;
			data.cart = DataItem.get_new(DataType.CART,id);
			async.series([
				//get_cart
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.CART,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.delete(database,DataType.CART,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart_delete = biz_data;
					}
				},
				async function(call){
					let search = App_Logic.get_search(DataType.CART_ITEM,{cart_number:data.cart.cart_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_cart_item_search = biz_data;
					}
				},
				async function(call){
					let search = App_Logic.get_search(DataType.CART_SUB_ITEM,{cart_number:data.cart.cart_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_cart_sub_item_search = biz_data;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("CartData-Cart-Item-Update",err);
				callback([error,[]]);
			});
		});
	};
}
class Product_Data {
//9_product_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let product = DataItem.get_new(DataType.PRODUCT,0);
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.PRODUCT,key,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						product = biz_data;
					}
				},
			]).then(result => {
				callback([error,product]);
			}).catch(err => {
				Log.error("Product-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_product_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.PRODUCT,data_list:[]};
			let error = null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.PRODUCT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.PRODUCT;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.product_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Product-Search",err);
				callback([err,[]]);
			});
		});
	};
}
class Review_Data {
	//9_review_post
	static post = async(database,parent_data_type,parent_id,user_id,post_review) => {
		return new Promise((callback) => {
			let error = null;
			let data = {parent_item:DataItem.get_new(parent_data_type,parent_id),review:DataItem.get_new(DataType.REVIEW,0)};
			let review = Review_Logic.get_new(parent_data_type,parent_id,user_id,post_review.title,post_review.comment,post_review.rating);
			async.series([
				//review_post
				async function(call){
					const [biz_error,biz_data] = await Portal.post(database,DataType.REVIEW,review);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.review = biz_data;
					}
				},
				//get_parent_item
				async function(call){
					let option = {get_field:true,fields:'id,rating_count,review_count,rating_avg,title,title_url'};
					const [biz_error,biz_data] = await Portal.get(database,parent_data_type,parent_id,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.parent_item = biz_data;
					}
				},
				//post_item
				async function(call){
					if(!Str.check_is_null(data.parent_item.id)){
						//rating_count
						data.parent_item.rating_count = !Str.check_is_null(data.parent_item.rating_count) ? parseInt(data.parent_item.rating_count) + parseInt(review.rating) :parseInt(review.rating);
						//review_count
						data.parent_item.review_count = !Str.check_is_null(data.parent_item.review_count) ? parseInt(data.parent_item.review_count) + 1 : 1;
						//rating_avg
						data.parent_item.rating_avg = !Str.check_is_null(data.parent_item.rating_avg) ? parseInt(data.parent_item.rating_count)  /  parseInt(data.parent_item.review_count) :parseInt(review.rating);
						const [biz_error,biz_data] = await Portal.post(database,parent_data_type,data.parent_item);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.parent_item = biz_data;
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Data-Portal",err);
				callback([err,[]]);
			});
		});
	};
	//9_review_get
	static get = async (database,parent_data_type,parent_id,sort_by,page_current,page_size) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			async.series([
				//review_list
				async function(call){
					let query = {parent_id:parent_id,parent_data_type:parent_data_type};
					let search = App_Logic.get_search(DataType.REVIEW,query,{},page_current,page_size);
					let option = {get_parent:true,parent_data_type:parent_data_type,parent_fields:'id,title,title_url,image_data',get_user:true,user_fields:'id,title,title_url,image_data'};
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
							data.option = option;
							data.data_type=biz_data.data_type;
							data.item_count=biz_data.item_count;
							data.page_count=biz_data.page_count;
							data.filter=biz_data.filter;
							data.review_list=biz_data.data_list;
							data.app_id = database.app_id;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Data-List",err);
				callback([err,[]]);
			});
		});
	};
	//9_review_delete
	static delete = async(database,parent_data_type,parent_id,review_id) => {
		return new Promise((callback) => {
			let error = null;
			let data = {parent_item:DataItem.get_new(parent_data_type,parent_id),review:DataItem.get_new(DataType.REVIEW,0)};
			let review = DataItem.get_new(DataType.REVIEW,review_id);
			async.series([
				//review_post
				async function(call){
					const [biz_error,biz_data] = await Portal.delete(database,DataType.REVIEW,review.id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.review = biz_data;
					}
				},
				//get_parent_item
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,parent_data_type,parent_id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.parent_item = biz_data;
					}
				},
				//post_item
				async function(call){
					if(!Str.check_is_null(data.parent_item.id)){
						//rating_count
						data.parent_item.rating_count = !Str.check_is_null(data.parent_item.rating_count) ? parseInt(data.parent_item.rating_count) - 1 :parseInt(review.rating);
						//review_count
						data.parent_item.review_count = !Str.check_is_null(data.parent_item.review_count) ? parseInt(data.parent_item.review_count) - 1 : 1;
						//rating_avg
						data.parent_item.rating_avg = !Str.check_is_null(data.parent_item.rating_avg) ? parseInt(data.parent_item.rating_count)  /  parseInt(data.parent_item.review_count) :parseInt(review.rating);
						const [biz_error,biz_data] = await Portal.post(database,parent_data_type,data.parent_item);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.parent_item = biz_data;
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Data-Delete-Portal",err);
				callback([err,[]]);
			});
		});
	};
}
class User_Data {
	static get_device = async (device) => {
		return new Promise((callback) => {
			let dev = {};
			dev.platform_name = !Str.check_is_null(device.name) ? device.name : 'N/A';
			dev.platform_version = !Str.check_is_null(device.version) ? device.version : 'N/A';
			dev.platform_layout = !Str.check_is_null(device.layout) ? device.layout : 'N/A';
			dev.platform_os = !Str.check_is_null(device.os) ? device.os : 'N/A';
			dev.platform_description = !Str.check_is_null(device.description) ? device.description : 'N/A';
			callback(dev);
		});
	}
	static get_ip = async (ip_address,geo_key) => {
		return new Promise((callback) => {
			let error = null;
			if(!geo_key){
				error = 'Geo Key Not Found';
				callback([error,null]);
			}
			else{
			let ip_info ={country_name:"N/A",region_name:"N/A",district:"N/A",city_name:"N/A",latitude:"N/A",longitude:"N/A",zip_code:"N/A",isp:"N/A",ip_address:"N/A"};
			var https = require('https');
			let url = 'https://api.ip2location.io/?key=' + geo_key + '&ip=' + ip_address + '&format=json';
			let response = '';
			let req = https.get(url, function (res) {
				res.on('error', (e) => console.log('GEO_LOCATION ERROR: ' + e));
				var https = require('https');
				var key = geo_key;
				var ip = !Str.check_is_null(ip_address) ? ip_address : "0.0.0.0" ;
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
									country_name:!Str.check_is_null(geo_data.country_name) ? geo_data.country_name : "N/A",
									region_name:!Str.check_is_null(geo_data.region_name) ?geo_data.region_name : "N/A",
									is_proxy:!Str.check_is_null(geo_data.is_proxy) ?geo_data.is_proxy : "N/A",
									district:!Str.check_is_null(geo_data.district) ?geo_data.district : "N/A",
									city_name:!Str.check_is_null(geo_data.city_name) ?geo_data.city_name : "N/A",
									latitude:!Str.check_is_null(geo_data.latitude) ?geo_data.latitude : "N/A",
									longitude:!Str.check_is_null(geo_data.longitude) ?geo_data.longitude : "N/A",
									zip_code:!Str.check_is_null(geo_data.zip_code) ?geo_data.zip_code : "N/A",
									isp:!Str.check_is_null(geo_data.as) ?geo_data.as : "N/A",
									ip_address:!Str.check_is_null(geo_data.ip) ?geo_data.ip : "N/A"
								};
							callback([error,ip_info]);
						}
						catch (e) {
							callback([e,ip_info]);
						}
					});
				});
			});
			}
		});
	};
	//9_user_post
	static post = async (database,post_data,option) => {
		/* Post Data
		 *  - user / type. obj / ex. {email:myemail@gmail.com,title:my_title} / default. error
		 *
		/* Options
		*/
		return new Promise((callback) => {
			let error = null;
			let data = {
					email_resultOK:false,
					title_reultOK:false,
				    user:post_data
			};
			async.series([
				//check email
				async function(call){
					let search = App_Logic.get_search(DataType.USER,{email:data.user.email},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(Str.check_is_null(data.user.id) && biz_data.data_list.length<=0){
							data.email_resultOK = true;
						}else if(biz_data.data_list.length>0){
							if(data.user.id == biz_data.data_list[0].id){
								data.email_resultOK = true;
							}
						}else{
							data.email_resultOK = true;
						}
					}
				},
				//check title
				async function(call){
					let search = App_Logic.get_search(DataType.USER,{title:data.user.title},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(Str.check_is_null(data.user.id) && biz_data.data_list.length<=0){
							data.title_resultOK = true;
						}else if(biz_data.data_list.length>0){
							if(data.user.id == biz_data.data_list[0].id){
								data.title_resultOK = true;
							}
						}else{
							data.title_resultOK = true;
						}
					}
				},
				//post user
				async function(call){
					if(data.email_resultOK && data.title_resultOK){
						data.user.last_login = DateTime.get_new();
						const [biz_error,biz_data] = await Portal.post(database,DataType.USER,post_data);
						if(biz_error){
							biz_error=Log.append(error,biz_error);
						}else{
							data.user = biz_data;
						}
					}
				},
		]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("User-Data-Register",err);
				callback([error,{}]);
			});
		});
	};

	//9_user_register
	static register = async (database,post_data,option) => {
		/* Post Data
		 *  - user / type. obj / ex. {email:myemail@gmail.com,title:my_title} / default. error
		 *  - ip_address / type. string / ex. 123.0.0.1 / default. 0.0.0.0
		 *  - geo_key / type. string / ex. Geo Location Key / default. blank
		 *  - device / type. opj / ex. Geo Location Key / default. blank  / https://www.npmjs.com/package/platform
		 *
		/* Options
		 * IP Address Information
		 * - post_stat / type. bool / ex.true,false / default. false
		 * - post_ip_address / type. bool / ex.true,false / default. false
		 * - post_device / type. bool / ex.true,false / default. false
		*/
		return new Promise((callback) => {
			let error = null;
			let data = {
					email_resultOK:false,
					title_resultOK:false,
				    user:post_data.user,
					stat:DataItem.get_new(DataType.STAT,0)
			};
			let post_ip_address = post_data.ip_address?post_data.ip_address:null;
			let post_geo_key = post_data.geo_key?post_data.geo_key:null;
			let post_device = post_data.device?post_data.device:null;
			async.series([
				//check email
				async function(call){
					let search = App_Logic.get_search(DataType.USER,{email:data.user.email},{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(biz_data.count<=0){
							data.email_resultOK = true;
						}
					}
				},
				//check title
				async function(call){
					let search = App_Logic.get_search(DataType.USER,{title:data.user.title},{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(biz_data.count<=0){
							data.title_resultOK = true;
						}
					}
				},
				//post user
				async function(call){
					if(data.email_resultOK && data.title_resultOK){
						data.user.last_login = DateTime.get_new();
						const [biz_error,biz_data] = await Portal.post(database,DataType.USER,data.user);
						if(biz_error){
							biz_error=Log.append(error,biz_error);
						}else{
							data.user = biz_data;
						}
					}
				},
 				//get stat - ip - merge
        		async function(call){
            		if(data.email_resultOK && data.title_resultOK && option.post_ip_address){
				    	data.ip_address = post_ip_address;
				    	data.geo_key = post_geo_key;
                		const [biz_error,biz_data] = await User_Data.get_ip(data.ip_address,data.geo_key);
                	if(biz_error){
                    	error=Log.append(error,biz_error);
                	}
                		data.stat = Obj.merge(data.stat,biz_data);
            		}
        		},
 				//get stat - device - merge
        		async function(call){
            		if(data.email_resultOK && data.title_resultOK && option.post_device){
				    	data.device = post_device;
                		const biz_data = await User_Data.get_device(data.device);
                		data.stat = Obj.merge(data.stat,biz_data);
            		}
        		},
				//post stat
        		async function(call){
            		if(data.email_resultOK && data.title_resultOK && option.post_stat && option.post_device || option.post_ip){
                		let post_new_stat = Stat_Logic.get_new_user(data.user.id,Type.STAT_REGISTER,data.stat);
            			const [biz_error,biz_data] = await Stat_Data.post_user(database,post_new_stat.user_id,post_new_stat.type,post_new_stat.data);
            		if(biz_error){
                		error=Log.append(error,biz_error);
            		}else{
                		data.stat = biz_data;
            		}
            	}
        		},
		]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("User-Data-Register",err);
				callback([error,{}]);
			});
		});
	};
	//9_user_login
	static login = async (database,post_data,option) => {
		/* Post Data
		 *  - user / type. obj / ex. {email:myemail@gmail.com,password:my_password} / default. error
		 *  - ip_address / type. string / ex. 123.0.0.1 / default. 0.0.0.0
		 *  - geo_key / type. string / ex. Geo Location Key / default. blank
		 *  - device / type. opj / ex. Geo Location Key / default. blank  / https://www.npmjs.com/package/platform
		 *
		/* Options
		 * IP Address Information
		 * - post_stat / type. bool / ex.true,false / default. false
		 * - post_ip_address / type. bool / ex.true,false / default. false
		 * - post_device / type. bool / ex.true,false / default. false
		*/

		return new Promise((callback) => {
			let error = null;
			let data = {
				user_resultOK:false,
				user:post_data.user,
				stat:DataItem.get_new(DataType.STAT,0)
			};
			let post_ip_address = post_data.ip_address?post_data.ip_address:null;
			let post_geo_key = post_data.geo_key?post_data.geo_key:null;
			let post_device = post_data.device?post_data.device:null;
			async.series([
				//check email,password
				async function(call){
					let search = App_Logic.get_search(DataType.USER,{email:data.user.email,password:data.user.password},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data.data_list.length>0){
							data.user = biz_data.data_list[0];
							data.user_resultOK = true;
						}
					}
				},
				//post user
				async function(call){
					if(data.user_resultOK){
						data.user.last_login = DateTime.get_new();
						const [biz_error,biz_data] = await Portal.post(database,DataType.USER,data.user);
						if(biz_error){
							error=Log.append(error,biz_error);
						}
					}
				},
				//get stat - ip - merge
        		async function(call){
            		if(data.user_resultOK && option.post_ip_address){
				    	data.ip_address = post_ip_address;
				    	data.geo_key = post_geo_key;
            		const [biz_error,biz_data] = await User_Data.get_ip(data.ip_address,data.geo_key);
                		if(biz_error){
                    		error=Log.append(error,biz_error);
                		}
                			data.stat = Obj.merge(data.stat,biz_data);
            		}
        		},
 				//get stat - device - merge
        		async function(call){
            		if(data.user_resultOK && option.post_device){
						data.device = post_device;
            			const biz_data = await User_Data.get_device(data.device);
                		data.stat = Obj.merge(data.stat,biz_data);
            		}
        		},
				//post stat
        		async function(call){
            		if(data.user_resultOK && option.post_stat && option.post_device || option.post_ip){
                		let post_new_stat = Stat_Logic.get_new_user(data.user.id,Type.STAT_LOGIN,data.stat);
            			const [biz_error,biz_data] = await Stat_Data.post_user(database,post_new_stat.user_id,post_new_stat.type,post_new_stat.data);
            		if(biz_error){
                		error=Log.append(error,biz_error);
            		}else{
                		data.stat = biz_data;
            		}
            	}
        		},
		]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("User-Data-Login",err);
				callback([err,{}]);
			});
		});
	};
}
class Favorite_Data {
	//9_favorite_post
	static post = async (database,parent_data_type,parent_id,user_id) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			data.is_unique = false;
			let favorite = Favorite_Logic.get_new(parent_data_type,parent_id,user_id);
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = App_Logic.get_search(DataType.FAVORITE,favorite_filter,{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(biz_error,error);
					}else{
						if(biz_data.count<=0){
							data.is_unique = true;
						}
					}
				},
				async function(call){
					if(data.is_unique){
						const [biz_error,biz_data] = await Portal.post(database,DataType.FAVORITE,favorite);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.favorite = biz_data;
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Favorite-Data-Update",err);
				callback([err,{}]);
			});
		});
	};
}
class Portal {
	//9_portal_demo / required / type_logic.type_list
	static demo_post = (database,data_type,type_list) => {
		return new Promise((callback) => {
			let data = {resultOK:false};
			let error = null;
			async.series([
				//type_list
				async function(call){
					let post_type_list = [];
					for(const item of type_list) {
						post_type_list.push(Demo_Logic.get_new_type(item.title));
         			};
					const [biz_error,biz_data] = await Portal.post_bulk(database,DataType.TYPE,post_type_list);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
					}
				},
				//category_list
				async function(call){
					let post_category_list = [];
					for(const item of type_list) {
					for(const cat_item of item.categorys) {
						post_category_list.push(Category_Logic.get_new(cat_item.title,cat_item.type,cat_item.category));
         				};
         			};
					if(post_category_list.length>0){
					const [biz_error,biz_data] = await Portal.post_bulk(database,DataType.CATEGORY,post_category_list);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.category_list = biz_data;
						data.resultOK = true;
					}
					}
				},
				//product_list
				async function(call){
					let post_product_list = [];
					for(const item of type_list) {
						for(const cat_item of item.categorys) {
							for(const item of cat_item.items) {
								post_product_list.push(item);
							};
         				};
         			};
					if(post_product_list.length>0){
					const [biz_error,biz_data] = await Portal.post_bulk(database,data_type,post_product_list);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.product_list = biz_data;
						data.resultOK = true;
					}
					}
				},
				async function(call){
					data.resultOK = true;
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Demo-Post",err);
				callback([error,[]]);
			});
		});
	};
	//9_portal_get
	static get = async (database,data_type,key,option) => {
		/* Options
		 * Fields
		   - get_field / type. bool / ex. true,false / default. false
		   - fields / type. string / ex. field1,field2 / default. throw error
		 * Items
		   - get_item / bool / ex. true,false / def. true
		 * Photos
		   - get_image / bool / ex. true,false / def. true
		   - image_count / int / ex. 1-999 / def. 19
		   - image_sort_by / query obj / ex. {date_create:1}
		 */
		return new Promise((callback) => {
			let error = null;
			let data = DataItem.get_new(data_type,0,{key:key?key:'blank'});
			let full_data_list = [];
			let new_data_list = [];
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				function(call){
					if(!Str.check_is_guid(key)){
						option.title_url = key;
					}
					call();
				},
				function(call){
					Data.get(database,data_type,key,option).then(([biz_error,biz_data,option])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(!Str.check_is_null(biz_data.id)){
								data = biz_data;
							}else{
								data = data_type != DataType.USER ? App_Logic.get_not_found(data_type,key,{app_id:database.app_id}) : App_Logic.get_not_found(DataType.USER,key,{app_id:database.app_id});
						}
						}
						call();
					}).catch(err => {
						Log.error("Portal-Get-Key-A",err);
						error = Log.append(error,err);
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
						data.images = [];
						data.items = [];
						if(Str.check_is_null(data.top_id)){
							filter={top_id:data.id};
						}else{
							filter={top_id:data.top_id};
						}
						let search = App_Logic.get_search(DataType.ITEM,filter,get_sort(data),1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([biz_error,item_list,item_count,page_count])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								item_list.forEach(item => {
								if(item.parent_id == data.id){
									let item_title_url = Str.get_title_url(item.title);
									data[item_title_url] = new Object();
									data[item_title_url] = item;
									data.items.push(item);
								}
						});
							}
							call();
						}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
				async function(call){
					if(!Str.check_is_null(data.id) && option.get_image){
						data.images = [];
						if(option.image_count == null){
							option.image_count = 19;
						}
						if(option.image_sort_by == null){
							option.image_sort_by = {date_create:1};
						}
						let filter = {parent_id:data.id};
						let sort_by = option.image_sort_by;
						let page_current = 1;
						let page_size = option.image_count;
						const [biz_error,biz_data] = await Portal.search(database,DataType.IMAGE,filter,sort_by,page_current,page_size,option);
						if(biz_data.data_list.length > 0){
							data.images = biz_data.data_list;
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Portal-Get",err);
				callback([error,{}]);
			});
		});
	};
	//9_portal_search
	static search = (database,data_type,filter,sort_by,page_current,page_size,option) => {
		/* Options
		 * Distinct
		   - get_distinct / type. bool / ex. true,false / default. false
		   - distinct_field / type. string / ex. field1 / default. throw error
		   - distinct_sort / type. string / ex. asc,desc / default. asc
		 * Fields
		   - get_field / type. bool / ex. true,false / default. false
		   - fields / type. string / ex. field1,field2 / default. throw error
		 * Items
		    - get_item / type. bool / ex. true,false / default. false
		 * Photos
		    - get_image / type. bool / ex. true,false / default. false
		    - image_count / type. int / ex. 1-999 / default. 19
		    - image_sort_by / type. {} / ex. {date_create:1} / default. {}
		 *  Count
		    - get_count / type. bool / ex. true,false / default. false
			  - count_data_type / type. string / ex. PRODUCT / default. throw error
			  - count_field / type. number / ex. category /  default. throw error
			  - count_value / type. string / ex. title / default. throw error
		 *  Search
		    - get_search / type. bool / ex. true,false / default. false
			  - search_data_type / type. string / ex. PRODUCT / default. throw error
			  - search_field / type. string / ex. category_title / default. throw error
			  - search_parent_field / type. string / ex. title / default. throw error
 			- get_parent / type. bool / ex. true,false / default. false
			  - parent_data_type / type. string / ex. PRODUCT / ex. throw error
   			  - parent_fields / type. string / ex. field1,field2 / default. empty
			- get_user / type. bool / ex. true,false / default. false
			  - user_fields / type. string / ex. field1,field2 / default. empty
		* Return
			- data_type
			- item_count
			- page_count
			- filter
			- item_list
			- app_id
	     */
		return new Promise((callback) => {
			let data = {data_type:data_type,item_count:0,page_count:1,filter:{},data_list:[],app_id:database.app_id};
			let error=null;
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				function(call){
					let search = App_Logic.get_search(data_type,!Obj.check_is_empty(filter)?filter:{},!Obj.check_is_empty(sort_by)?sort_by:{},!Str.check_is_null(page_current)?page_current:0,!Str.check_is_null(page_size)?page_size:0);
					Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,item_list,item_count,page_count])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							 data.data_type=data_type;
                             data.item_count=item_count;
                             data.page_count=page_count;
                             data.filter=filter;
                             data.data_list=item_list;
                             data.app_id = database.app_id;
							call();
						}
					}).catch(err => {
						error=Log.append(error,err);
					});
				},
				function(call){
					if(option.get_count && data.data_list.length>0){
						let query = { $or: [] };
						data.data_list.forEach(item => {
							let query_field = {};
							query_field[option.count_field] = { $regex:String(item[option.count_value]), $options: "i" };
							query.$or.push(query_field);
						});
						let search = App_Logic.get_search(option.count_data_type,query,{},1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([biz_error,item_list,item_count,page_count])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								if(data.data_list.length> 0 && item_list.length>0){
								data.data_list.forEach(item => {
									item.item_count = 0;
									item_list.forEach(item_count => {
										if(item[option.count_value] == item_count[option.count_field]){
											item.item_count = item.item_count + 1;
										}
									});
								});
								}
							}
							call();
						}).catch(err => {
							error = Log.append(err,biz_error);
							call();
						});
					}else{
						call();
					}
				},
			function(call){
					if(option.get_search && data.data_list.length>0){
						let query = { $or: [] };
						data.data_list.forEach(item => {
							let query_field = {};
							query_field[option.search_field] = { $regex:String(item[option.search_parent_field]), $options: "i" };
							query.$or.push(query_field);
						});
						let search = App_Logic.get_search(option.search_data_type,query,{},1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([biz_error,item_list,item_count,page_count])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								if(data.data_list.length> 0 && item_list.length>0){
								data.data_list.forEach(item => {
									item.data_search_list = [];
									item_list.forEach(item_search => {
										if(item[option.search_parent_field] == item_search[option.search_field]){
											item.data_search_list.push(item_search);
										}
									});
								});
								}
							}
							call();
						}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.get_parent && data.data_list.length>0){
						let query = { $or: [] };
                        data.data_list.forEach(item => {
                          	let query_field = {};
                            query_field['id'] = { $regex:String(item['parent_id']), $options: "i" };
							query.$or.push(query_field);
						});
							let search = App_Logic.get_search(option.parent_data_type,query,{},1,0);
                      	    let parent_option = option.parent_fields ? {get_field:true,fields:option.parent_fields} : {};
                            Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,parent_option).then(([biz_error,item_list,item_count,page_count])=> {
								if(biz_error){
									error=Log.append(error,biz_error);
                                }else{
									if(data.data_list.length> 0){
                                  	data.data_list.forEach(item => {
                                    	item.parent_item = item_list.find(item_find => item_find.id === item.parent_id) ? item_list.find(item_find => item_find.id === item.parent_id):App_Logic.get_not_found(item.parent_data_type,item.parent_id,{app_id:database.app_id});
									});
									}
								}
								call();
								}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.get_user && data.data_list.length>0){
						let query = { $or: [] };
						data.data_list.forEach(item => {
							let query_field = {};
							query_field['id'] = { $regex:String(item['user_id']), $options: "i" };
							query.$or.push(query_field);
						});
						let search = App_Logic.get_search(DataType.USER,query,{},1,0);
						let user_option = option.user_fields ? {get_field:true,fields:option.user_fields} : {};
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,user_option).then(([biz_error,item_list,item_count,page_count])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								if(data.data_list.length> 0){
								data.data_list.forEach(item => {
									item.user = item_list.find(item_find => item_find.id === item.user_id) ? item_list.find(item_find => item_find.id === item.user_id):App_Logic.get_not_found(DataType.USER,item.user_id,{app_id:database.app_id});

								});
								}
							}
							call();
						}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.get_distinct && data.data_list.length>0){
 					 	data.data_list = data.data_list.filter((obj, index, self) =>
                    		index === self.findIndex((t) => t[option.distinct_field] === obj[option.distinct_field])
                		);
						let distinct_sort_by = option.distinct_sort ? option.distinct_sort : 'asc';
						data.data_list = Obj.sort_list_by_field(data.data_list,'title',distinct_sort_by);
						call();
					}
					else{
						call();
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Portal-Search",err);
				callback([err,[]]);
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
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				function(call){
					Data.post(database,data_type,item,option).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Post-Data",err);
				callback([err,{}]);
			});
		});
	};
	//9_portal_post_bulk
	static post_bulk = async (database,data_type,data_list) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data = DataItem.get_new(data_type,0);
			async.series([
				function(call){
					Data.post_bulk(database,data_type,data_list).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Post-Bulk-Data",err);
				callback([err,{}]);
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
			option = option ? option : {get_item:false,get_image:false};
			async.series([
				function(call){
					Data.delete_cache(database,data_type,id).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Delete-Cache-Item",err);
				callback([error,{}]);
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
		 * - delete_item
		 *   - description / bool / example / default: false
		 * - delete_image
		 *   - description / bool / example / default: false
		 * Return
		 * - title
		 *   - description / type /
		 */
		return new Promise((callback) => {
			let error = null;
			let data = {};
			option = option ? option : {delete_ok:false,get_item:false,get_image:false,delete_item:false,delete_item_filter:{},delete_image:false,delete_image_filter:{}};
			async.series([
				function(call){
					Data.delete(database,data_type,id).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.data = biz_data;
							data.delete_ok = true;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
				function(call){
					if(option.delete_item){
						let data_type = DataType.ITEM;
						let filter = option.delete_item_query;
						data.delete_data_list = false;
						Data.delete_list(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_data_list = true;
							}
							call();
						}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.delete_image){
						let data_type = DataType.IMAGE;
						let filter = option.delete_image_query;
						data.delete_image = false;
						Data.delete_list(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_image = true;
							}
							call();
						}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Delete-Item",err);
				callback([err,{}]);
			});
		});
	};
	//9_portal_post_list - 9_post_list
	static post_list = async (database,post_list) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data_list = [];
			async.series([
				function(call){
					Data.post_list(database,post_list).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data_list = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
			]).then(result => {
				callback([error,data_list]);
			}).catch(err => {
				Log.error("Post-List-Data",err);
				callback([err,{}]);
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
			let data = {delete_ok:false,delete_data_list:false,delete_image:false};
			option = option ? option : {delete_ok:false,get_item:false,get_image:false,delete_item:false,delete_item_filter:{},delete_image:false,delete_image_filter:{}};
			async.series([
				//delete_item_list
				function(call){
					Data.delete_list(database,data_type,filter).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
							data.delete_ok = true;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
				function(call){
					if(option.delete_item){
						let data_type = DataType.ITEM;
						let filter = option.delete_item_query;
						data.delete_data_list = false;
						Data.delete_list(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_data_list = true;
							}
							call();
						}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
				function(call){
					if(option.delete_image){
						let data_type = DataType.IMAGE;
						let filter = option.delete_image_query;
						data.delete_image = false;
						Data.delete_list(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_image = true;
							}
							call();
						}).catch(err => {
							error = Log.append(error,err);
							call();
						});
					}else{
						call();
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Delete-List-Data",err);
				callback([err,[]]);
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
					Data.count_list(database,data_type,filter).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Count-List-Data",err);
				callback([err,{}]);
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
			let data = DataItem.get_new(data_type,id);
			let top_data = DataItem.get_new(data_type,0);
			let copy_data = DataItem.get_new(data_type,0);
			let data_list = [];
			let copy_data_list = [];
			async.series([
				function(call){
					Data.get(database,data_type,id).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}
						top_data=biz_data;
						call();
					})
				},
				function(call){
					let filter = {top_id:top_data.id};
					let search = App_Logic.get_search(DataType.ITEM,filter,{},1,0);
					Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([biz_error,biz_data,item_count,page_count])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data_list = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
			},
				function(call){
					copy_data['title'] = 'Copy '+top_data['title'];
					copy_data['title_url'] = 'copy_'+top_data['title_url'];
					copy_data['source_id'] = top_data.id;
					copy_data['source_data_type'] = top_data.data_type;
					const keys = Object.keys(top_data);
					  keys.forEach(key => {
						if(key!='id'&&key!='source'&&key!='title'&&key!='title_url'){
							copy_data[key]=top_data[key];
						}
					});
					call();
							},
				function(call){
					Data.post(database,copy_data.data_type,copy_data).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							copy_data=biz_data;
						}
					call();
					}).catch(err => {
						error=Log.append(error,err);
						call();
					});
				},
				function(call){
					for(const item of data_list) {
						let copy_sub_data=DataItem.get_new(copy_data.data_type,0,{top_id:copy_data.id,top_data_type:copy_data.data_type});
						copy_sub_data['source_id'] = item['id'];
						copy_sub_data['source_data_type'] = item['data_type'];

						copy_sub_data['source_parent_id'] = item['parent_id'];
						copy_sub_data['source_parent_data_type'] = item['parent_data_type'];

						copy_sub_data['source_top_id'] = item['top_id'];
						copy_sub_data['source_top_data_type'] = item['top_data_type'];
 						for(key in item){
							if( key != 'id' && key != 'source' && key != 'parent_id' && key != 'parent_data_type'  && key != 'top_id' && key != 'top_data_type' ){
								copy_sub_data[key] = item[key];
							}
  						}
						copy_data_list.push(copy_sub_data);
					};
					call();
				},
				function(call){
					if(copy_data_list.length>0){
					Data.post_list(database,copy_data_list).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}
						copy_data_list=biz_data;
						call();
					})
					}else{
						call();
					}
				},
				function(call){
					if(copy_data_list.length>0){
					copy_data_list.forEach(item => {
						if(item['source_parent_id'] == top_data['ID']){
							item['parent_id'] = copy_data['ID'];
							item['parent_data_type']  = copy_data['data_type'];
						}else{
							copy_data_list.forEach(item_sub => {
								if(item['source_parent_id'] == item_sub['source_id']){
									item['parent_id'] = item_sub['id'];
									item['parent_data_type'] = item_sub['data_type'];
								}

							});
						}
					});
					call();
					}else{
						call();
					}
				},
				function(call){
					if(copy_data_list.length>0){
					Data.post_list(database,copy_data_list).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}
						copy_data_list=biz_data;
						call();
					})
					}else{
						call();
					}
				},
			]).then(result => {
				if(copy_data.id){
					data = copy_data;
				}
				callback([error,data]);
			}).catch(err => {
				Log.error("Copy",err);
				callback([err,{}]);
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
			option = option ? option : {question_count:19};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.FAQ,key,option);
					data.faq=biz_data;
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
//9_stat_data
class Stat_Data {
	static post_user = (database,user_id,stat_type,post_data,option) => {
		return new Promise((callback) => {
			let post_stat = DataItem.get_new(DataType.STAT,0,{user_id:user_id,type:stat_type});
			post_stat = Obj.merge(post_stat,post_data);
			let data = DataItem.get_new(DataType.STAT,0);
			let error = null;
			async.series([
				//post_stat
				async function(call){
					const [biz_error,biz_data] = await Portal.post(database,DataType.STAT,post_stat);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data = biz_data;
					}
				}
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Stat-Data-Post-User",err);
				callback([error,[]]);
			});
		});
	};
	//9_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = DataItem.get_new(DataType.BLANK,0);
			let error = null;
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.STAT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.BLOG_POST;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
						data.stat_list = biz_data.data_list;
						data.app_id = database.app_id;
					}
					call();
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Blank-Get",err);
				callback([error,[]]);
			});
		});
	};


	/*
	//9_stat_post
	static post = (database,parent_data_type,user_id,stat_type_id,parent_item_list,option) => {
		return new Promise((callback) => {
			let data = {};
			data.stat_new = true;
			data.stat_item_list = [];
			data.stat_item_list = [];
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
						let search = App_Logic.get_search(parent_data_type,query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
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
						let search = App_Logic.get_search(DataType.STAT,query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
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
								data.stat_item_list.push(stat_item);
							}
						}
						const [biz_error,biz_data] = await Portal.post_list(database,data.stat_item_list);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.stat_item_list = data;
						}
					}
				},
				//save item list
				async function(call){
					if(parent_item_list.length>0){
						let stat_item_list = [];
						let str = get_stat_str(stat_type_id);
						for(let a = 0; a < parent_item_list.length; a++){
							if(parent_item_list[a].stat_new && stat_type_id != Stat_Logic.TYPE_STAT_REVIEW){
								let item = DataItem.get_new(parent_item_list[a].item.data_type,parent_item_list[a].item.id);
								item[str] = parent_item_list[a][str];
								data.stat_item_list.push(item);
							}
						}
						if(data.stat_item_list.length>0){
							const [biz_error,biz_data] = await Portal.post_list(database,data.stat_item_list);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.stat_item_list = data;
							}
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("-Update-Item-View-Count-",err);
				callback([error,[]]);
			});
			function get_stat_str(stat_type_id){
				let str = "";
				switch(stat_type_id){
					case Stat_Logic.TYPE_STAT_VIEW:
						str = 'view_count';
						break;
					case Stat_Logic.TYPE_STAT_LIKE:
						str = 'like_count';
						break;
					case Stat_Logic.TYPE_STAT_FAVORITE:
						str = 'favorite_count';
						break;
					case Stat_Logic.TYPE_STAT_CART:
						str = 'cart_count';
						break;
					case Stat_Logic.TYPE_STAT_ORDER:
						str = 'order_count';
						break;
					case Stat_Logic.TYPE_STAT_REVIEW:
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
		return [biz_error,biz_data] = await delete_db_connect_adapter(db_connect);
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
	static post_bulk = async (db_connect,data_type,data_list) => {
		return [error,data] = await post_bulk_adapter(db_connect,data_type,data_list);
	};
	static get_list = async (db_connect,data_type,filter,sort_by,page_current,page_size,option) => {
		const [error,data,item_count,page_count] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size,option);
		return [error,data,item_count,page_count];
	};
	static delete_list = async (db_connect,data_type,filter) => {
		return [error,data_list] = await delete_item_list_adapter(db_connect,data_type,filter);
	};
	static count_list = async (db_connect,data_type,filter) => {
		return [error,data] = await get_count_item_list_adapter(db_connect,data_type,filter);
	};
}
class Blank_Data {
	//9_blank
	static blank = (database) => {
		return new Promise((callback) => {
			let data = DataItem.get_new(DataType.BLANK,0);
			let error = null;
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.post(database,DataType.BLANK,post_data);
					call();
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Blank-Get",err);
				callback([error,[]]);
			});
		});
	};
}
module.exports = {
	Blog_Post_Data,
	Category_Data,
	Cart_Data,
	Content_Data,
	Database,
	Event_Data,
	Gallery_Data,
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
