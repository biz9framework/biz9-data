/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const moment = require('moment');
const {get_db_connect_main,check_db_connect_main,close_db_connect_main,update_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,count_item_list_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num,Obj}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
const {DataItem,DataType,FieldType,Item_Logic,User_Logic,Favorite_Logic,Stat_Logic,Order_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const { get_db_connect_adapter,check_db_connect_adapter,close_db_connect_adapter,update_item_adapter,update_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,count_item_list_adapter,delete_item_cache }  = require('./adapter.js');
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
	static close = async (database) => {
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
			Data.close_db(database).then(([error,data])=>{
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
class Data_Logic {
	//9_data_logic
	static get_parent_child_list_old = (full_item_list) => {
		/* option params
		 * - full_item_list
		 *      - List of objects. Bind all child id values to matching parent id. / list / ex. Products and child attributes items.
		 * return objects
		 * - full_item_list
		 *      - Binded list of objects. / list / ex. Products now binded to child items.
		 */
		return new Promise((callback) => {
			async.series([
				function(call){
					for(let a=0; a<full_item_list.length; a++){
						let item_title_url = Str.get_title_url(full_item_list[a].title);
						Log.w('item_title_url',item_title_url);
						let new_item = full_item_list[a];
						new_item.items = [];
						//new_item_list[item_title_url] = full_item_list[a];
						//new_item_list[item_title_url].items = [];
						for(let b=0;b<full_item_list.length;b++){
							if(full_item_list[a].id == full_item_list[b].parent_id){
								new_item.items.push(full_item_list[b]);
							}
						}
						if(!Obj.check_is_empty(new_item)){
							new_item_list.push(new_item);
						}
					}
					Log.w('new_item_list_len',new_item_list.length);
					Log.w('new_item_list',new_item_list);
					//call();
				},
				function(call){
					for(let a=0; a<new_item_list.length; a++){
						if(!Obj.check_is_empty(new_item_list[a])){
						let item_title_url = !Str.check_is_null(new_item_list[a].title) ? Str.get_title_url(new_item_list[a].title) : "not_found";
						let new_item = new_item_list[a];
						new_item.items=[];
						new_item_list[item_title_url] = new_item_list[a];
						new_item_list[item_title_url].items =[];
						for(let b=0;b<new_item_list.length;b++){
							//console.log(new_item_list[b]);
							let sub_item_title_url = Str.get_title_url(new_item_list[b].title);
							if(new_item_list[a].id == new_item_list[b].parent_id){
								let sub_item = new_item_list[b];
								sub_item.items = [];
								new_item.items.push(sub_item);
								new_item_list[a][sub_item_title_url] = sub_item;
								new_item_list[a][sub_item_title_url].items = [];
							}
						}
					}
					Log.w('new_item_list',new_item_list);
					}
					//call();
				},
			]).then(result => {
				//callback([error,new_item_list]);
			}).catch(error => {
				Log.error("Portal-Get",error);
				callback([error,[]]);
			});
		});
	};
	static get_child_list = (database,item_list,data_type,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			/*
			 * - option
			 *    - get_group / bool / ex. true,false / def. false /n/a
			 *    - group_search / search obj / ex. {} /n/a
			 *
			 *    - group_child_data_type / data_type /
			 *    - group_parent_field / field_title /
			 *    - group_child_field / field_title /
			 *    */
			let error=null;
			let cloud_data = {};
			let child_item_list = [];
			async.series([
				function(call){
					let search = Item_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=>{
						if(error){
							error=Log.append(error,error);
						}else{
							child_item_list=data;
							call();
						}
					}).catch(error => {
						error=Log.append(error,error);
					});
				},
				function(call){
					for(let a = 0; a<item_list.length;a++){
						item_list[a].items = [];
						for(let b = 0; b<child_item_list.length;b++){
							if(item_list[a][option.group_parent_field] == child_item_list[b][option.group_child_field]){
								item_list[a].items.push(child_item_list[b]);
							}
						}
					}
					cloud_data.item_list = item_list;
					call();
				}
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Get-Child-List",error);
				callback([error,[]]);
			});
		});
	};
}
class Blog_Post_Data {
	//9_blog_post_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.BLOG_POST,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Blog_Post-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_blog_post_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.BLOG_POST,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Blog_Post-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Category_Data {
	//9_category_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.CATEGORY,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Category-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_category_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.CATEGORY,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
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
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.CONTENT,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Content-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_content_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.CONTENT,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
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
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.PAGE,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Page-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_page_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.PAGE,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
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
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.TEMPLATE,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Template-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_template_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.TEMPLATE,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
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
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.EVENT,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Event-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_event_data_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.EVENT,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Event-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Order_Data {
	//9_order_data_update
	static update = async (database,cart,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			cloud_data.order = DataItem.get_new(DataType.ORDER,0);
			cloud_data.order_payment = DataItem.get_new(DataType.ORDER_PAYMENT,0);
			cloud_data.publish_order_item_list = [];
			cloud_data.publish_order_sub_item_list = [];
			cloud_data.stat_parent_item_list = [];
			async.series([
				//bind-update order
				async function(call){
					cloud_data.order = DataItem.get_new(DataType.ORDER,0,
						{
							//cart
							cart_number:cart.cart_number,
							user_id:cart.user_id,
							parent_data_type:cart.parent_data_type,

							payment_plan:cart.payment_plan,
							grand_total:cart.grand_total,

							//order
							order_status:cart.order_status,
							order_number:cart.order_number,

						});
					const [error,data] = await Portal.update(database,DataType.ORDER,cloud_data.order);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.order = data.item;
					}
				},
				//if new order update ORDER_PAYMENT
				async function(call){
					cloud_data.order_payment = DataItem.get_new(DataType.ORDER_PAYMENT,0,
						{
							order_id: cloud_data.order.id,
							pay_now_amount:cart.pay_now_amount,
							order_number:cloud_data.order.order_number,

							order_payment_type:cart.order_payment_type,
							grand_total:cart.grand_total,
							payment_plan:cart.payment_plan,
							transaction_id:cart.transaction_id,
						});
					const [error,data] = await Portal.update(database,DataType.ORDER_PAYMENT,cloud_data.order_payment);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.order_payment = data.item;
					}
				},
				//bind order_item_list
				async function(call){
					if(cart.cart_item_list.length>0){
						for(let a=0;a<cart.cart_item_list.length;a++){
							cloud_data.publish_order_item_list.push(
								DataItem.get_new(DataType.ORDER_ITEM,0,{
									parent_data_type:cart.cart_item_list[a].parent_data_type,
									parent_id:cart.cart_item_list[a].parent_id,
									cart_number:cart.cart_item_list[a].cart_number,
									order_number:cloud_data.order.order_number,
									user_id:cart.cart_item_list[a].user_id,
									quanity:cart.cart_item_list[a].quanity,
									order_id:cloud_data.order.id
								}));
						}
						if(cloud_data.publish_order_item_list.length>0){
							const [error,data] = await Portal.update_list(database,cloud_data.publish_order_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.publish_order_item_list = data.item_list;
							}
						}
					}
				},
				//bind order_item_list - order_sub_item_list
				async function(call){
					if(cart.cart_item_list.length>0){
						for(let a=0;a<cloud_data.publish_order_item_list.length;a++){
							for(let b=0;b<cart.cart_item_list[a].cart_sub_item_list.length;b++){
								cloud_data.publish_order_sub_item_list.push(
									DataItem.get_new(DataType.ORDER_SUB_ITEM,0,{
										quanity:cart.cart_item_list[a].cart_sub_item_list[b].quanity,
										order_id:cloud_data.order.id,
										order_number:cloud_data.order.order_number,
										cart_number:cart.cart_item_list[a].cart_sub_item_list[b].cart_number,
										user_id:cart.cart_item_list[a].user_id,
										parent_data_type:cart.cart_item_list[a].cart_sub_item_list[b].parent_data_type,
										parent_id:cart.cart_item_list[a].cart_sub_item_list[b].parent_id,
										order_item_id:cloud_data.publish_order_item_list[a].id
									}));
							}
						}
						if(cloud_data.publish_order_sub_item_list.length>0){
							const [error,data] = await Portal.update_list(database,cloud_data.publish_order_sub_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.publish_order_sub_item_list = data.item_list;
							}
						}
					}
				},
				async function(call){
					let stat_list = [];
					for(let a = 0; a < cloud_data.publish_order_item_list.length; a++){
						stat_list.push(DataItem.get_new(DataType.STAT,0,{parent_id:cloud_data.publish_order_item_list[a].parent_id,parent_data_type:cloud_data.publish_order_item_list[a].parent_data_type}));
					}
					const [error,data] = await Stat_Data.update(database,cloud_data.order.parent_data_type,cloud_data.order.user_id,FieldType.STAT_ORDER_ADD_ID,stat_list);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.stat_new = data.stat_new;
						cloud_data.stat_parent_item_list = data.stat_parent_item_list;
						cloud_data.stat_item_list = data.stat_item_list;
					}
				},
				//get order
				async function(call){
					const [error,data] = await Order_Data.get(database,cloud_data.order.order_number);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.order = data.order;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("OrderData-Order-Item-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_order_get
	static get = (database,order_number,option) => {
		return new Promise((callback) => {
			let cloud_data = {order:DataItem.get_new(DataType.ORDER,0,{order_number:order_number,order_item_list:[],order_payments:[]})};
			let order_item_item_list_query = { $or: [] };
			let order_sub_item_item_list_query = { $or: [] };
			let error = null;
			let order_sub_item_list = [];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,get_order_item:true};
			async.series([
				//order
				async function(call){
					option.filter = { order_number: { $regex:String(order_number), $options: "i" } };
					const [error,data] = await Portal.get(database,DataType.ORDER,order_number,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.order = data.item;
					}
				},
				//order_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.ORDER_ITEM,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.order.order_item_list = data.item_list;
						}
					}
				},
				//order_item_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						for(let a = 0;a < cloud_data.order.order_item_list.length; a++){
							let query_field = {};
							query_field['id'] = { $regex:String(cloud_data.order.order_item_list[a].parent_id), $options: "i" };
							order_item_item_list_query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(cloud_data.order.parent_data_type,order_item_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < cloud_data.order.order_item_list.length; a++){
								cloud_data.order.order_item_list[a].parent_item = DataItem.get_new(cloud_data.order.order_item_list[a].parent_data_type,0);
								for(let b = 0; b < data.item_list.length; b++){
									if(cloud_data.order.order_item_list[a].parent_id == data.item_list[b].id){
										cloud_data.order.order_item_list[a].parent_item = data.item_list[b];
									}
								}
								if(Str.check_is_null(cloud_data.order.order_item_list[a].parent_item.id)){
									cloud_data.order.order_item_list[a].parent_item = Item_Logic.get_not_found(cloud_data.order.order_item_list[a].data_type,cloud_data.order.order_item_list[a].id,{app_id:database.app_id});
								}
							}
						}
					}
				},
				//order_sub_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.ORDER_SUB_ITEM,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							order_sub_item_list = data.item_list;
							for(let a = 0; a < cloud_data.order.order_item_list.length; a++){
								cloud_data.order.order_item_list[a].order_sub_item_list = [];
								for(let b = 0; b < order_sub_item_list.length; b++){
									if(cloud_data.order.order_item_list[a].id == order_sub_item_list[b].order_item_id){
										cloud_data.order.order_item_list[a].order_sub_item_list.push(order_sub_item_list[b]);
									}
								}
							}
						}
					}
				},
				//order_sub_item_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						let parent_data_type = DataType.BLANK;
						for(let a = 0; a < order_sub_item_list.length; a++){
							let query_field = {};
							query_field['id'] = { $regex:String(order_sub_item_list[a]['parent_id']), $options: "i" };
							order_sub_item_item_list_query.$or.push(query_field);
							parent_data_type = order_sub_item_list[a]['parent_data_type'];
						}
						let search = Item_Logic.get_search(parent_data_type,order_sub_item_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < cloud_data.order.order_item_list.length; a++){
								for(let b = 0; b < cloud_data.order.order_item_list[a].order_sub_item_list.length; b++){
									cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_item = DataItem.get_new(DataType.ITEM,0,{parent_id: cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_id});
									for(let c = 0; c < data.item_list.length; c++){
										if(cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_id == data.item_list[c].id){
											cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_item = data.item_list[c];
										}
									}
								}
							}
						}
					}
				},
				//order_payments
				async function(call){
					if(!Str.check_is_null(cloud_data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.ORDER_PAYMENT,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.order.order_payments = data.item_list;
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
	static delete = async (database,id,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			cloud_data.order = DataItem.get_new(DataType.ORDER,id);
			async.series([
				async function(call){
					const [error,data] = await Portal.delete(database,DataType.ORDER,id);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.order = data.item;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.ORDER_ITEM,{order_id:id},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_order_item_search = data;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.ORDER_SUB_ITEM,{order_id:id},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_order_sub_item_search = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("OrderData-Order-Item-Update",error);
				callback([error,[]]);
			});
		});
	};
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		//9_order_search
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.ORDER,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Product-Search",error);
				callback([error,[]]);
			});
		});
	};
}

class Cart_Data {
	//cart_update
	static update = async (database,parent_data_type,user_id,cart,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			cloud_data.cart = DataItem.get_new(DataType.CART,0);
			cloud_data.publish_cart_item_list = [];
			cloud_data.publish_cart_sub_item_list = [];
			cloud_data.cart_sub_item_list = [];
			cloud_data.stat_parent_item_list = [];
			let cart_item_item_list = [];
			async.series([
				//bind-update cart
				async function(call){
					let publish_cart = DataItem.get_new(DataType.CART,cart.id,
						{
							cart_number:cart.cart_number,
							user_id:user_id,
							parent_data_type:parent_data_type
						});
					const [error,data] = await Portal.update(database,DataType.CART,publish_cart);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data.item;
						cloud_data.cart.cart_item_list = [];
					}
				},
				//bind cart_item_list
				async function(call){
					if(cart.cart_item_list.length>0){
						for(let a=0;a<cart.cart_item_list.length;a++){
							cart.cart_item_list[a].cart_id = cloud_data.cart.id;
							cloud_data.publish_cart_item_list.push(
								DataItem.get_new(DataType.CART_ITEM,0,
									{
										quanity:cart.cart_item_list[a].quanity,
										cart_id:cloud_data.cart.id,
										cart_number:cart.cart_number,
										user_id:user_id,
										parent_data_type:cart.cart_item_list[a].parent_data_type,
										parent_id:cart.cart_item_list[a].parent_id,
									}));
						}
						if(cloud_data.publish_cart_item_list.length>0){
							const [error,data] = await Portal.update_list(database,cloud_data.publish_cart_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.cart.cart_item_list = data.item_list;
							}
						}
					}
				},
				//bind cart_sub_item_list
				async function(call){
					if(cart.cart_item_list.length>0){
						for(let a=0;a<cloud_data.publish_cart_item_list.length;a++){
							for(let b=0;b<cart.cart_item_list[a].cart_sub_item_list.length;b++){
								cloud_data.publish_cart_sub_item_list.push(
									DataItem.get_new(DataType.CART_SUB_ITEM,0,
										{
											quanity:cart.cart_item_list[a].cart_sub_item_list[b].quanity,
											cart_id:cloud_data.cart.id,
											cart_number:cloud_data.cart.cart_number,
											user_id:user_id,
											parent_data_type:cart.cart_item_list[a].cart_sub_item_list[b].parent_data_type,
											parent_id:cart.cart_item_list[a].cart_sub_item_list[b].parent_id,
											cart_item_id:cloud_data.publish_cart_item_list[a].id
										}));
							}
						}
						if(cloud_data.publish_cart_sub_item_list.length>0){
							const [error,data] = await Portal.update_list(database,cloud_data.publish_cart_sub_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.publish_cart_sub_item_list = data.item_list;
							}
						}
					}
				},
				async function(call){
					let stat_list = [];
					for(let a = 0; a < cart.cart_item_list.length; a++){
						stat_list.push(DataItem.get_new(DataType.STAT,0,{parent_id:cart.cart_item_list[a].parent_id,parent_data_type:cart.cart_item_list[a].parent_data_type}));
					}
					const [error,data] = await Stat_Data.update(database,parent_data_type,user_id,FieldType.STAT_CART_ADD_ID,stat_list);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.stat_new = data.stat_new;
						cloud_data.stat_parent_item_list = data.stat_parent_item_list;
						cloud_data.stat_item_list = data.stat_item_list;
					}
				},
				//get cart
				async function(call){
					const [error,data] = await Cart_Data.get(database,cart.cart_number);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data.cart;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("OrderData-Cart-Item-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_cart_get
	static get = (database,cart_number,option) => {
		return new Promise((callback) => {
			let cloud_data = {cart:DataItem.get_new(DataType.CART,0,{cart_number:cart_number,cart_item_list:[]})};
			let cart_item_item_list_query = { $or: [] };
			let cart_sub_item_item_list_query = { $or: [] };
			let error = null;
			let cart_sub_item_list = [];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,get_cart_item:true};
			async.series([
				//cart
				async function(call){
					option.filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
					const [error,data] = await Portal.get(database,DataType.CART,cart_number,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data.item;
					}
				},
				//cart_item_list
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
				//cart_item_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						for(let a = 0;a < cloud_data.cart.cart_item_list.length; a++){
							let query_field = {};
							query_field['id'] = { $regex:String(cloud_data.cart.cart_item_list[a].parent_id), $options: "i" };
							cart_item_item_list_query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(cloud_data.cart.parent_data_type,cart_item_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < cloud_data.cart.cart_item_list.length; a++){
								cloud_data.cart.cart_item_list[a].parent_item = DataItem.get_new(cloud_data.cart.cart_item_list[a].parent_data_type,0);
								for(let b = 0; b < data.item_list.length; b++){
									if(cloud_data.cart.cart_item_list[a].parent_id == data.item_list[b].id){
										cloud_data.cart.cart_item_list[a].parent_item = data.item_list[b];
									}
								}
								if(Str.check_is_null(cloud_data.cart.cart_item_list[a].parent_item.id)){
									cloud_data.cart.cart_item_list[a].parent_item = Item_Logic.get_not_found(cloud_data.cart.cart_item_list[a].data_type,cloud_data.cart.cart_item_list[a].id,{app_id:database.app_id});
								}
							}
						}
					}
				},
				//cart_sub_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						let filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
						let search = Item_Logic.get_search(DataType.CART_SUB_ITEM,filter,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(error){
							error=Log.append(error,error);
						}else{
							cart_sub_item_list = data.item_list;
							for(let a = 0; a < cloud_data.cart.cart_item_list.length; a++){
								cloud_data.cart.cart_item_list[a].cart_sub_item_list = [];
								for(let b = 0; b < cart_sub_item_list.length; b++){
									if(cloud_data.cart.cart_item_list[a].id == cart_sub_item_list[b].cart_item_id){
										cloud_data.cart.cart_item_list[a].cart_sub_item_list.push(cart_sub_item_list[b]);
									}
								}
							}
						}
					}
				},
				//cart_sub_item_item_list - parent_item_list
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						let parent_data_type = DataType.BLANK;
						for(let a = 0; a < cart_sub_item_list.length; a++){
							let query_field = {};
							query_field['id'] = { $regex:String(cart_sub_item_list[a]['parent_id']), $options: "i" };
							cart_sub_item_item_list_query.$or.push(query_field);
							parent_data_type = cart_sub_item_list[a]['parent_data_type'];
						}
						let search = Item_Logic.get_search(parent_data_type,cart_sub_item_item_list_query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < cloud_data.cart.cart_item_list.length; a++){
								for(let b = 0; b < cloud_data.cart.cart_item_list[a].cart_sub_item_list.length; b++){
									cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_item = DataItem.get_new(DataType.ITEM,0,{parent_id: cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_id});
									for(let c = 0; c < data.item_list.length; c++){
										if(cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_id == data.item_list[c].id){
											cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_item = data.item_list[c];
										}
									}
								}
							}
						}
					}
				},
				//sub_total - grand_total
				async function(call){
					if(!Str.check_is_null(cloud_data.cart.id)){
						let grand_total = 0;
						for(let a = 0; a < cloud_data.cart.cart_item_list.length; a++){
							let sub_total = 0;
							if(!isNaN(cloud_data.cart.cart_item_list[a].parent_item.cost)){
								sub_total = (sub_total + cloud_data.cart.cart_item_list[a].parent_item.cost) * cloud_data.cart.cart_item_list[a].quanity;
								grand_total = grand_total + sub_total;
							}
							cloud_data.cart.cart_item_list[a].sub_total = sub_total;
							for(let b = 0; b < cloud_data.cart.cart_item_list[a].cart_sub_item_list.length; b++){
								let sub_total = 0;
								if(!isNaN(cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_item.cost)){
									sub_total = (sub_total + cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_item.cost) * cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].quanity;
									grand_total = grand_total + sub_total;
								}
								cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].sub_total = sub_total;
							}
						}
						cloud_data.cart.grand_total = grand_total;
					}
				}
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Cart-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_cart_delete
	static delete = async (database,id,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			cloud_data.cart = DataItem.get_new(DataType.CART,id);
			async.series([
				async function(call){
					const [error,data] = await Portal.delete(database,DataType.CART,id);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data.item;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.CART_ITEM,{cart_id:id},{},1,0);
					const [error,data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.delete_cart_item_search = data;
					}
				},
				async function(call){
					let search = Item_Logic.get_search(DataType.CART_SUB_ITEM,{cart_id:id},{},1,0);
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
				Log.error("OrderData-Cart-Item-Update",error);
				callback([error,[]]);
			});
		});
	};
	//9_cart_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.ORDER,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Product-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Product_Data {
	//9_product_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.PRODUCT,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Product-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_product_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.PRODUCT,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Product-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Review_Data {
	//9_review_update
	static update = async(database,parent_data_type,parent_id,user_id,review) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.parent_item = DataItem.get_new(parent_data_type,parent_id);
			cloud_data.review = review;
			cloud_data.review.parent_user = DataItem.get_new(DataType.USER,0);
			let review_list = [];
			let review_count = 0;
			let review_avg = 0;
			async.series([
				//review_update
				async function(call){
					const [error,data] = await Portal.update(database,DataType.REVIEW,cloud_data.review);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						cloud_data.review = data.item;
					}
				},
				//get_parent_item
				async function(call){
					const [error,data] = await Portal.get(database,cloud_data.parent_item.data_type,cloud_data.parent_item.id);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						cloud_data.parent_item = data.item;
					}
				},
				//update_parent_item
				async function(call){
					if(!Str.check_is_null(cloud_data.parent_item.id)){
						//rating_count
						cloud_data.parent_item.rating_count = !Str.check_is_null(cloud_data.parent_item.rating_count) ? parseInt(cloud_data.parent_item.rating_count) + parseInt(review.rating) :parseInt(review.rating);
						//review_count
						cloud_data.parent_item.review_count = !Str.check_is_null(cloud_data.parent_item.review_count) ? parseInt(cloud_data.parent_item.review_count) + 1 : 1;
						//rating_avg
						cloud_data.parent_item.rating_avg = !Str.check_is_null(cloud_data.parent_item.rating_avg) ? parseInt(cloud_data.parent_item.rating_count)  /  parseInt(cloud_data.parent_item.review_count) :parseInt(review.rating);

						const [error,data] = await Portal.update(database,cloud_data.parent_item.data_type,cloud_data.parent_item);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.parent_item = data.item;
						}
					}
				},
				//update stat
				async function(call){
					if(!Str.check_is_null(cloud_data.parent_item.id)){
						let stat = Stat_Logic.get_new(parent_data_type,user_id,FieldType.STAT_REVIEW_ADD_ID,[DataItem.get_new(DataType.STAT,0,
							{parent_data_type:cloud_data.parent_item.data_type,parent_id:cloud_data.parent_item.id,user_id:user_id})]);
						const [error,data] = await Stat_Data.update(database,stat.parent_data_type,stat.user_id,stat.stat_type_id,stat.item_list);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.stat_new = data.stat_new;
							cloud_data.stat_parent_item_list = data.stat_parent_item_list;
							cloud_data.stat_item_list =data.stat_item_list;
						}
					}
				},
				//get_parent_user
				async function(call){
					if(!Str.check_is_null(cloud_data.parent_item.id)){
						const [error,data] = await Portal.get(database,DataType.USER,user_id);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.review.parent_user = data.item;
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
	static get = async (database,parent_data_type,parent_id,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let error=null;
			let cloud_data = {item_list:0,item_count:0,page_count:1};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			let parent_item = [];
			let user_list = [];
			async.series([
				//review_list
				async function(call){
					let search = Item_Logic.get_search(DataType.REVIEW,{parent_id:parent_id},sort_by,page_current,page_size);
					let option = {get_item_search:true,item_search_data_type:DataType.USER,item_search_field:'id',item_search_value:'user_id'};
					const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						for(let a=0;a<data.item_list.length;a++){
							data.item_list[a].parent_user = DataItem.get_new(DataType.USER,0);
							for(let b=0;b<data.item_search_list.length;b++){
								if(data.item_list[a].user_id == data.item_search_list[b].id){
									data.item_list[a].parent_user = data.item_search_list[b];
								}
							}
							if(Str.check_is_null(data.item_list[a].parent_user.id)){
								data.item_list[a].parent_user = User_Logic.get_not_found(data.item_list[a].user_id,{app_id:database.app_id});
							}
						}
						cloud_data.item_list = data.item_list;
						cloud_data.item_count = data.item_count;
						cloud_data.page_count = data.page_count;
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
}
class User_Data {
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
										district:geo_data.district,
										city_name:geo_data.city_name,
										latitude:geo_data.latitude,
										longitude:geo_data.longitude,
										zip_code:geo_data.zip_code,
										isp:geo_data.isp,
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
			let cloud_data = {};
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
				//update user
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						cloud_data.user.last_login =  new moment().toISOString();
						const [error,data] = await Portal.update(database,DataType.USER,cloud_data.user);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.user = data.item;
						}
					}
				},
				//get activity - ip
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						const [error,data] = await User_Data.get_ip_info(ip_address,geo_key);
						cloud_data.activity = DataItem.get_new(DataType.ACTIVITY,0,data);
						cloud_data.activity.user_id = cloud_data.user.id;
					}
				},
				//get activity - device
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						const [error,data] = await User_Data.get_device_info(cloud_data.activity,cloud_data.device);
						cloud_data.activity = data;
					}
				},
				//update activity
				async function(call){
					if(!cloud_data.email_found && !cloud_data.title_found){
						const [error,data] = await Portal.update(database,DataType.ACTIVITY,cloud_data.activity);
						cloud_data.activity = data.item;
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
	static login = async (database,email,password,ip_address,geo_key) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.user_found = false;
			cloud_data.user = DataItem.get_new(DataType.USER,0,{email:email,password:password});
			cloud_data.ip_info = {country_name:"N/A",region_name:"N/A",district:"N/A",city_name:"N/A",latitude:"N/A",longitude:"N/A",zip_code:'N/A',isp:"N/A",ip_address:"N/A"};
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
				//update user
				async function(call){
					if(cloud_data.user_found){
						cloud_data.user.last_login =  new moment().toISOString();
						const [error,data] = await Portal.update(database,DataType.USER,cloud_data.user);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.user = data.item;
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
							cloud_data.user = data.item;
						}
					}
				},
				//get activity
				async function(call){
					if(cloud_data.user_found){
						const [error,data] = await User_Data.get_ip_info(ip_address,geo_key);
						cloud_data.activity = DataItem.get_new(DataType.ACTIVITY,0,data);
					}
				},
				//update activity
				async function(call){
					if(cloud_data.user_found){
						const [error,data] = await Portal.update(database,DataType.ACTIVITY,cloud_data.activity);
						cloud_data.activity = data.item;
						cloud_data.activity.user_id = cloud_data.user.id;
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
}
class Favorite_Data {
	//9_favorite_update
	static update = async (database,parent_data_type,parent_id,user_id) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.favorite_found = false;
			cloud_data.favorite = DataItem.get_new(DataType.FAVORITE,0,{parent_data_type:parent_data_type,parent_id:parent_id,user_id:user_id});
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = Item_Logic.get_search(DataType.FAVORITE,favorite_filter,{},1,0);
					const [error,data] = await Portal.count(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						if(data.count>0){
							cloud_data.favorite_found = true;
						}
					}
				},
				async function(call){
					if(!cloud_data.favorite_found){
						const [error,data] = await Portal.update(database,cloud_data.favorite.data_type,cloud_data.favorite);
						if(error){
							cloud_error=Log.append(cloud_error,error);
						}else{
							cloud_data.favorite = data.item;
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
			let parent_item_list = [];
			let user_list = [];
			async.series([
				//favorite_list
				async function(call){
					let query = {user_id:user_id,parent_data_type:parent_data_type};
					let search = Item_Logic.get_search(DataType.FAVORITE,query,{},page_current,page_size);
					let option = {get_item_search:true,item_search_data_type:parent_data_type,item_search_field:'id',item_search_value:'parent_id'};
					const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(error){
						cloud_error=Log.append(cloud_error,error);
					}else{
						for(let a=0;a<data.item_list.length;a++){
							data.item_list[a].parent_item = DataItem.get_new(parent_data_type,data.item_list[a].parent_item,{title:'Not Found'});
							for(let b=0;b<data.item_search_list.length;b++){
								if(data.item_list[a].parent_id == data.item_search_list[b].id){
									data.item_list[a].parent_item = data.item_search_list[b];
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
}

class Business_Data {
	//9_business_get
	static get = (database,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					let search = Item_Logic.get_search(DataType.BUSINESS,{},{},0,1);
					const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						if(data.item_list.length>0){
							cloud_data.item = data.item_list[0];
						}else{
							cloud_data.item = Item_Logic.get_not_found(DataType.BUSINESS,0,{app_id:data.app_id});
						}
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Business-Search",error);
				callback([error,[]]);
			});
		});
	};
}
class Admin_Data {
	//9_admin_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.ADMIN,key,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Admin-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_admin_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				async function(call){
					const [error,data] = await Portal.search(database,DataType.ADMIN,filter,sort_by,page_current,page_size,option);
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data = data;
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Admin-Search",error);
				callback([error,[]]);
			});
		});
	};
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
			let cloud_data = {};
			let full_item_list = [];
			let new_item_list = [];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,title_url:null,get_group:false,filter:false};
			async.series([
				function(call){
					if(!Num.check_is_guid(key)){
						option.title_url = key;
					}
					call();
				},
				function(call){
					Data.get_item(database,data_type,key,option).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							if(!Str.check_is_null(data.id)){
								cloud_data.item = data;
							}else{
								cloud_data.item = data_type != DataType.USER  ? Item_Logic.get_not_found(data_type,key,{app_id:database.app_id}) : User_Logic.get_not_found(key,{app_id:database.app_id});
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
					function get_sort(item){
						let sort_order = {};
						switch(item.setting_sort_type)
						{
							case 'title':
								sort_order = item.setting_sort_order == 'desc' ? {title:1} :  {title:-1};
								break;
							case 'order':
								sort_order = item.setting_sort_order == 'asc' ? {setting_order:1} : {setting_order:-1};
								break;
							case 'date':
								sort_order = item.setting_sort_order == 'desc' ? {date_create:1} : {date_create:-1};
								break;
							default:
								sort_order = item.setting_sort_order == 'desc' ? {title:-1} :  {title:1};
								break;
						}
						return sort_order;
					}
					let filter = {};
					if(!Str.check_is_null(cloud_data.item.id) && option.get_item || option.get_section){
						if(Str.check_is_null(cloud_data.item.top_id)){
							filter={top_id:cloud_data.item.id};
						}else{
							filter={top_id:cloud_data.item.top_id};
						}
						let search = Item_Logic.get_search(DataType.ITEM,filter,get_sort(cloud_data.item),1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								full_item_list = data;
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
					if(!Str.check_is_null(cloud_data.item.id) && option.get_item || option.get_section){
						cloud_data.item.items = [];
						for(let a=0; a<full_item_list.length; a++){
							if(full_item_list[a].parent_id == cloud_data.item.id){
								let item_title_url = Str.get_title_url(full_item_list[a].title);
								cloud_data.item[item_title_url] = new Object();
								cloud_data.item[item_title_url] = full_item_list[a];
								cloud_data.item.items.push(full_item_list[a]);
							}
						}
						call();
					}
					else{
						call();
					}
				},
				/*
				async function(call){
					//old
					//Log.w('rrrrr',full_item_list);
					//if(!Str.check_is_null(cloud_data.item.id) && option.get_item || option.get_section){
						//const [error,data] = await Data_Logic.get_parent_child_list(full_item_list);
						//new_item_list = data;
					//}
				},
				function(call){
					//old
					if(!Str.check_is_null(cloud_data.item.id) && option.get_item || option.get_section){
						cloud_data.item.items = [];
						for(let a=0; a<new_item_list.length; a++){
							if(new_item_list[a].parent_id == cloud_data.item.id){
								let item_title_url = Str.get_title_url(new_item_list[a].title);
								cloud_data.item[item_title_url] = new Object();
								cloud_data.item[item_title_url] = new_item_list[a];
								cloud_data.item.items.push(new_item_list[a]);
							}
						}
						Log.w('cloud_data',cloud_data.item);

						//call();
					}
					else{
						//call();
					}
				},
				*/
				async function(call){
					if(!Str.check_is_null(cloud_data.item.id) && option.get_photo){
						cloud_data.item.photos = [];
						if(option.photo_count == null){
							option.photo_count = 19;
						}
						if(option.photo_sort_by == null){
							option.photo_sort_by = {date_create:1};
						}
						let filter = {parent_id:cloud_data.item.id};
						let sort_by = option.photo_sort_by;
						let page_current = 1;
						let page_size = option.photo_count;
						const [error,data] = await Portal.search(database,DataType.PHOTO,filter,sort_by,page_current,page_size,option);
						if(data.item_list.length > 0){
							cloud_data.item.photos = data.item_list;
						}
					}
				},
			]).then(result => {
				callback([error,cloud_data]);
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
		 *  - get_item_count / true - false
			  - item_count_data_type / Product
			  - item_count_filter / {category:category}
			  - item_count_field / title
			  - item_count_value / 'beauty'
		 *  Search
		 *  - get_item_search / true - false
			  - item_search_data_type / Product
			  - item_search_field / category_title
			  - item_search_value / 'beauty'
			  */
		return new Promise((callback) => {
			let cloud_data = {};
			let error=null;
			let item_count_list =[];
			let item_search_list =[];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					let search = Item_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=>{
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.item_count=item_count;
							cloud_data.page_count=page_count;
							cloud_data.filter=filter;
							cloud_data.data_type=data_type;
							cloud_data.item_list=data;
							cloud_data.app_id = database.app_id;
							call();
						}
					}).catch(error => {
						error=Log.append(error,error);
					});
				},
				//old
				/*
				async function(call){
					if(option.get_item){
						const [error,data] = await Data_Logic.get_parent_child_list(cloud_data.item_list);
						cloud_data.item_list = data;
					}
				},
				*/
				function(call){
					if(option.get_item_count && cloud_data.item_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < cloud_data.item_list.length;a++){
							let query_field = {};
							query_field[option.item_count_field] = { $regex:String(cloud_data.item_list[a][option.item_count_value]), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(option.item_count_data_type,query,{},1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								item_count_list = data;
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
					if(option.get_item_count && cloud_data.item_list.length>0){
						for(let a = 0; a < cloud_data.item_list.length; a++){
							cloud_data.item_list[a].item_count = 0;
							for(let b = 0; b < item_count_list.length; b++){
								if(cloud_data.item_list[a][option.item_count_value] == item_count_list[b][option.item_count_field]){
									cloud_data.item_list[a].item_count = cloud_data.item_list[a].item_count + 1;
								}
							}
						}
						call();
					}else{
						call();
					}
				},
				function(call){
					if(option.get_item_search && cloud_data.item_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < cloud_data.item_list.length;a++){
							let query_field = {};
							query_field[option.item_search_field] = { $regex:String(cloud_data.item_list[a][option.item_search_value]), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(option.item_search_data_type,query,{},1,0);
						cloud_data.item_search_search = search;
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.item_search_list = data;
								cloud_data.item_search_count = item_count;
								cloud_data.item_search_page_count = page_count;
								cloud_data.item_search_data_type = search.data_type;
								cloud_data.item_search_search = search;
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
					if(option.get_item_search){
						for(let a = 0; a < cloud_data.item_list.length; a++){
							cloud_data.item_list[a].item_search_list = [];
							for(let b = 0; b < item_search_list.length; b++){
								if(cloud_data.item_list[a][option.item_search_value] == item_search_list[b][option.item_search_field]){
									cloud_data.item_list[a].item_search_list.push(item_search_list[b]);
								}
							}
						}
						call();
					}else{
						call();
					}
				}
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Portal-Get",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_update
	static update = async (database,data_type,item_data,option) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.update_item(database,data_type,item_data,option).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.item = data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Update-Item",error);
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
			let cloud_data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.delete_cache_item(database,data_type,id).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data = data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,cloud_data]);
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
			let cloud_data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,delete_items:true,delete_photos:true};
			async.series([
				function(call){
					Data.delete_item(database,data_type,id).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.item = data;
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
						cloud_data.delete_items = false;
						Data.delete_list(database,data_type,filter).then(([error,data])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.delete_items = true;
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
						Data.delete_list(database,data_type,filter).then(([error,data])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.delete_photos = true;
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
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Delete-Item",error);
				callback([error,[]]);
			});
		});
	};
	//9_portal_update_list
	static update_list = async (database,item_data_list,option) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.update_list(database,item_data_list).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.item_list = data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Update-List-Data",error);
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
			let cloud_data = {};
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
			async.series([
				function(call){
					Data.delete_list(database,data_type,filter).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.item_list = data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},

			]).then(result => {
				callback([error,cloud_data]);
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
			let cloud_data = {};
			async.series([
				function(call){
					Data.count_list(database,data_type,filter).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data = data;
						}
						call();
					}).catch(error => {
						error = Log.append(error,error);
						call();
					});
				},
			]).then(result => {
				callback([error,cloud_data]);
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
			let top_item = DataItem.get_new(data_type,0);
			let copy_item = DataItem.get_new(data_type,0);
			let item_list = [];
			let copy_item_list = [];
			async.series([
				function(call){
					Data.get_item(database,data_type,id).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}
						top_item=data;
						call();
					})
				},
				function(call){
						//let filter = data_type != DataType.ITEM ? {top_id:top_item.id} : {$and:[{ top_id:{$regex:top_item.top_id, $options:"i"}},{parent_id:{$regex:top_item.id,$options:"i"}}]}; // not working
						let filter = {top_id:top_item.id};
						let search = Item_Logic.get_search(DataType.ITEM,filter,{},1,0);
						Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {
							if(error){
								error=Log.append(error,error);
							}else{
								item_list = data;
							}
							call();
						}).catch(error => {
							error = Log.append(error,error);
							call();
						});
				},
				function(call){
					copy_item[FieldType.TITLE] = 'Copy '+top_item[FieldType.TITLE];
					copy_item[FieldType.TITLE_URL] = 'copy_'+top_item[FieldType.TITLE_URL];
					copy_item[FieldType.SOURCE_ID] = top_item.id;
					copy_item[FieldType.SOURCE_DATA_TYPE] = top_item.data_type;
					for(const key in top_item) {
						if(key!=FieldType.ID&&key!=FieldType.SOURCE&&key!=FieldType.TITLE&&key!=FieldType.TITLE_URL){
							copy_item[key]=top_item[key];
						}
					}
					call();
				},
				function(call){
					Data.update_item(database,copy_item.data_type,copy_item).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}else{
							copy_item=data;
						}
						call();
					}).catch(error => {
						error=Log.append(error,error);
						call();
					});
				},
				function(call){
					let source_top_items = [];
					for(let a=0;a<item_list.length;a++){
						let copy_sub_item=DataItem.get_new(copy_item.data_type,0,{top_id:copy_item.id,top_data_type:copy_item.data_type});
						copy_sub_item[FieldType.SOURCE_ID] = item_list[a][FieldType.ID];
						copy_sub_item[FieldType.SOURCE_DATA_TYPE] = item_list[a][FieldType.DATA_TYPE];

						copy_sub_item[FieldType.SOURCE_PARENT_ID] = item_list[a][FieldType.PARENT_ID];
						copy_sub_item[FieldType.SOURCE_PARENT_DATA_TYPE] = item_list[a][FieldType.PARENT_DATA_TYPE][FieldType.PARENT_DATA_TYPE];

						copy_sub_item[FieldType.SOURCE_TOP_ID] = item_list[a][FieldType.TOP_ID];
						copy_sub_item[FieldType.SOURCE_TOP_DATA_TYPE] = item_list[a][FieldType.TOP_DATA_TYPE];

						for(const key in item_list[a]) {
							if( key != FieldType.ID && key != FieldType.SOURCE && key != FieldType.PARENT_ID && key != FieldType.PARENT_DATA_TYPE  && key != FieldType.TOP_ID && key != FieldType.TOP_DATA_TYPE ){
								copy_sub_item[key] = item_list[a][key];
							}
						}
						copy_item_list.push(copy_sub_item);
					}
					call();
				},
				function(call){
					Data.update_list(database,copy_item_list).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}
						copy_item_list=data;
						call();
					})
				},
				function(call){
					for(let a=0;a<copy_item_list.length;a++){
						if(copy_item_list[a][FieldType.SOURCE_PARENT_ID] == top_item[FieldType.ID]){
								copy_item_list[a][FieldType.PARENT_ID] = copy_item[FieldType.ID];
								copy_item_list[a][FieldType.PARENT_DATA_TYPE]  = copy_item[FieldType.DATA_TYPE];
						}else{
							for(let b=0;b<copy_item_list.length;b++){
								if(copy_item_list[a][FieldType.SOURCE_PARENT_ID] == copy_item_list[b][FieldType.SOURCE_ID]){
									copy_item_list[a][FieldType.PARENT_ID] = copy_item_list[b][FieldType.ID];
									copy_item_list[a][FieldType.PARENT_DATA_TYPE] = copy_item_list[b][FieldType.DATA_TYPE];
								}
							}
						}
					}
					call();
				},
				function(call){
					Data.update_list(database,copy_item_list).then(([error,data])=> {
						if(error){
							error=Log.append(error,error);
						}
						copy_item_list=data;
						call();
					})
				},
			]).then(result => {
				if(copy_item.id){
					cloud_data.copy_item = copy_item;
					cloud_data.copy_item_list = copy_item_list;
					cloud_data.copy_success = true;
				}
				callback([error,cloud_data]);
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
			let cloud_data = {item:DataItem.get_new(DataType.FAQ,0,{questions:[]})};
			let faq = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {question_count:19};
			let items = [];
			async.series([
				async function(call){
					const [error,data] = await Portal.get(database,DataType.FAQ,key,option);
					faq=data.item;
				},
				async function(call){
					if(!Str.check_is_null(faq.id)){
						cloud_data.item.id = faq.id;
						cloud_data.item.title = faq.title;
						cloud_data.item.title_url = faq.title_url;
						cloud_data.item.date_create = faq.date_create;
						for(let a=0;a<option.question_count+1;a++){
							if(faq["field_"+a]){
								cloud_data.item.questions.push({id:a,question:faq["field_"+a],answer:faq["faq_question_"+a]});
							}
						}
					}else{
						cloud_data.item = faq;
						cloud_data.item.questions = [];
					}
				},
			],
				function(error, result){
					callback([error,cloud_data]);
				});
		});
	}
}
class Stat_Data {
	//9_stat_update
	static update = (database,parent_data_type,user_id,stat_type_id,item_list,option) => {
		return new Promise((callback) => {
			let cloud_data = {};
			cloud_data.stat_new = true;
			cloud_data.stat_parent_item_list = [];
			cloud_data.stat_item_list = [];
			let error = null;
			if(!item_list){
				item_list = [];
			}
			async.series([
				//get parent items
				async function(call){
					if(item_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < item_list.length;a++){
							let query_field = {};
							query_field['id'] = { $regex:String(item_list[a].parent_id), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(parent_data_type,query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < item_list.length; a++){
								item_list[a].parent_item = DataItem.get_new(parent_data_type,0);
								for(let b = 0; b < data.item_list.length; b++){
									if(item_list[a].parent_id == data.item_list[b].id){
										item_list[a].parent_item = data.item_list[b];
									}
								}
							}
						}
					}
				},
				//get user stats
				async function(call){
					if(item_list.length>0){
						let query = { $or: [] };
						for(let a = 0;a < item_list.length;a++){
							let query_field = {};
							query_field['user_id'] = { $regex:String(user_id), $options: "i" };
							query.$or.push(query_field);
						}
						let search = Item_Logic.get_search(DataType.STAT,query,{},1,0);
						const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(error){
							error=Log.append(error,error);
						}else{
							for(let a = 0; a < item_list.length; a++){
								let str = get_stat_str(stat_type_id);
								item_list[a][str] = !Str.check_is_null(item_list[a].parent_item[str]) ? parseInt(item_list[a].parent_item[str]) + 1 : 1;
								item_list[a].parent_item[str] = item_list[a][str];
								item_list[a].stat_new = true;
								for(let b = 0; b < data.item_list.length; b++){
									if(item_list[a].id == data.item_list[b].parent_id && item_list[a].data_type == data.item_list[b].parent_data_type && stat_type_id== data.item_list[b].type_id){
										item_list[a].stat_new = false;
									}
								}
							}
						}
					}
				},
				//save stat list
				async function(call){
					if(item_list.length>0){
						let str = get_stat_str(stat_type_id);
						for(let a = 0; a < item_list.length; a++){
							if(item_list[a].stat_new){
								let stat_item = DataItem.get_new(DataType.STAT,0,{
									parent_data_type:item_list[a].parent_data_type,
									parent_id:item_list[a].parent_id,
									stat_type_id:stat_type_id,
									stat_new:item_list[a].stat_new
								});
								stat_item[str] = item_list[a][str];
								cloud_data.stat_item_list.push(stat_item);
							}
						}
						const [error,data] = await Portal.update_list(database,cloud_data.stat_item_list);
						if(error){
							error=Log.append(error,error);
						}else{
							cloud_data.stat_item_list = data.item_list;
						}
					}
				},
				//save parent_item list
				async function(call){
					if(item_list.length>0){
						let stat_parent_item_list = [];
						let str = get_stat_str(stat_type_id);
						for(let a = 0; a < item_list.length; a++){
							if(item_list[a].stat_new && stat_type_id != FieldType.STAT_REVIEW_ADD_ID){
								let parent_item = DataItem.get_new(item_list[a].parent_item.data_type,item_list[a].parent_item.id);
								parent_item[str] = item_list[a][str];
								cloud_data.stat_parent_item_list.push(parent_item);
							}
						}
						if(cloud_data.stat_parent_item_list.length>0){
							const [error,data] = await Portal.update_list(database,cloud_data.stat_parent_item_list);
							if(error){
								error=Log.append(error,error);
							}else{
								cloud_data.stat_parent_item_list = data.item_list;
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
}
class Data {
	//9_data
	static open_db = async (data_config) => {
		return [error,data] = await get_db_connect_adapter(data_config);
	};
	static close_db = async (db_connect) => {
		return [error,data] = await close_db_connect_adapter(db_connect);
	};
	static check_db = async (db_connect) => {
		return check_db_connect_adapter(db_connect);
	};
	static update_item = async (db_connect,data_type,item_data,option) => {
		return [error,data] = await update_item_adapter(db_connect,data_type,item_data,option);
	};
	static get_item = async (db_connect,data_type,key,option) => {
		return [error,data] = await get_item_adapter(db_connect,data_type,key,option);
	};
	static delete_item = async (db_connect,data_type,id) => {
		return [error,data] = await delete_item_adapter(db_connect,data_type,id);
	};
	static delete_cache_item = async (db_connect,data_type,id) => {
		return [error,data] = await delete_item_cache(db_connect,data_type,id);
	};
	static update_list = async (db_connect,item_data_list) => {
		return [error,data] = await update_item_list_adapter(db_connect,item_data_list);
	};
	static get_list = async (db_connect,data_type,filter,sort_by,page_current,page_size) => {
		const [error,data,item_count,page_count] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size);
		return [error,data,item_count,page_count];
	};
	static delete_list = async (db_connect,data_type,filter) => {
		return [error,data_list] = await delete_item_list_adapter(db_connect,data_type,filter);
	};
	static count_list = async (db_connect,data_type,filter) => {
		return [error,data] = await count_item_list_adapter(db_connect,data_type,filter);
	};
}
module.exports = {
	Admin_Data,
	Business_Data,
	Blog_Post_Data,
	Category_Data,
	Cart_Data,
	Content_Data,
	Database,
	Data_Logic,
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
