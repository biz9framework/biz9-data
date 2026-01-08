/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const dayjs = require('dayjs');
const {get_database_main,check_database_main,delete_database_main,post_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,get_count_item_list_main,post_bulk_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num,Obj,DateTime}=require("biz9-utility");
const {Type,Favorite_Logic,Stat_Logic,Review_Logic,Data_Logic,Product_Logic,Demo_Logic,Category_Logic,Cart_Logic,Order_Logic,Field_Logic,Item_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const { get_database_adapter,check_database_adapter,delete_database_adapter,post_item_adapter,post_item_list_adapter,post_bulk_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,get_count_item_list_adapter,delete_item_cache }  = require('./adapter.js');
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
	static info = async (database,option) => {
		/* return
		 * tbd
		 */
		return new Promise((callback) => {
			let data = [];
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const collections = await database.listCollections().toArray();
					for (const collectionInfo of collections) {
						const collectionName = collectionInfo.name;
						const collection = database.collection(collectionName);
						const count = await collection.estimatedDocumentCount();
						data.push({title:collectionName,item_count:count});
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Database-Info",err);
				callback([err,null]);
			});
		});
	}
}
class Blog_Post_Data {
	//9_blog_post_get
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let blog_post = Data_Logic.get_new(Type.DATA_BLOG_POST,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_BLOG_POST,id,option);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_BLOG_POST,blog_posts:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_BLOG_POST,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.blog_posts = biz_data.items;
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
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let category = Data_Logic.get_new(Type.DATA_CATEGORY,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_CATEGORY,id,option);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_CATEGORY,categorys:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_CATEGORY,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.categorys = biz_data.items;
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
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let content = Data_Logic.get_new(Type.DATA_CONTENT,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_CONTENT,id,option);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_CONTENT,contents:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_CONTENT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.contents = biz_data.items;
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
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let page = Data_Logic.get_new(Type.DATA_PAGE,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_PAGE,id,option);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_PAGE,pages:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_PAGE,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search =Type.search;
						data.pages = biz_data.items;
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
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let template = Data_Logic.get_new(Type.DATA_TEMPLATE,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_TEMPLATE,id,option);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_TEMPLATE,templates:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_TEMPLATE,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.templates = biz_data.items;
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
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let gallery = Data_Logic.get_new(Type.DATA_GALLERY,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_GALLERY,id,option);
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
			let data = {gallery_count:0,page_count:1,filter:{},data_type:Type.DATA_GALLERY,gallerys:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_GALLERY,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.gallerys = biz_data.items;
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
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let event = Data_Logic.get_new(Type.DATA_EVENT,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_EVENT,id,option);
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
			let data = {event_count:0,page_count:1,filter:{},data_type:Type.DATA_EVENT,events:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_EVENT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.events = biz_data.items;
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
	static post = async (database,order,order_payments,option) => {
		return new Promise((callback) => {
			let data = {order:Data_Logic.get_new(Type.DATA_ORDER,0, {
				order_number:0,
				parent_data_type:order.parent_data_type,
				user_id:0,
				cart_number:0,
				grand_total:0,
			}),order_items:[],order_sub_items:[]};
			async.series([
				//post - order
				async function(call){
					for(const key in order) {
						if(Str.check_is_null(data.order[key])
							&& key != Type.FIELD_ID && key != Type.DATA_TYPE
							&& key != Type.TITLE_PARENT_ITEM && key != Type.TITLE_USER
							&& key != Type.TITLE_CART_ITEMS && key != Type.TITLE_CART_SUB_ITEMS
							&& key != Type.TITLE_ORDER_ITEMS && key != Type.TITLE_ORDER_SUB_ITEMS
							&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
							&& key != Type.TITLE_STAT_ITEMS && key != Type.TITLE_STAT_SUB_ITEMS
							&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE){
							data.order[key] = order[key];
						}
					}
					const [biz_error,biz_data] = await Portal.post(database,Type.DATA_ORDER,data.order);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
					}
				},
				//post - order items
				async function(call){
					if(order.order_items.length>0){
						for(const order_item of order.order_items){
							let post_order_item = Data_Logic.get_new(Type.DATA_ORDER_ITEM,0);
							for(const key in order_item){
								order_item.temp_row_id = Num.get_id();
								if(!Str.check_is_null(order_item[key])
									&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
									&& key != Type.TITLE_PARENT_ITEM && key != Type.USER
									&& key != Type.TITLE_CART_ITEMS && key != Type.TITLE_CART_SUB_ITEMS
									&& key != Type.TITLE_ORDER_ITEMS && key != Type.TITLE_ORDER_SUB_ITEMS
									&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
									&& key != Type.TITLE_STAT_ITEMS && key != Type.TITLE_STAT_SUB_ITEMS
									&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE){
									post_order_item[key] = order_item[key];
								}
							}
							post_order_item.temp_row_id = order_item.temp_row_id;
							data.order_items.push(post_order_item);
						}
						const [biz_error,biz_data] = await Portal.post_items(database,data.order_items);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order_items = biz_data;
						}
					}
				},
				//post - order sub items
				async function(call){
					if(order.order_items.length>0){
						for(const order_item of order.order_items){
							for(const order_sub_item of order_item.order_sub_items){
								let post_order_sub_item = Data_Logic.get_new(Type.DATA_ORDER_SUB_ITEM,0);
								for(const key in order_sub_item){
									order_sub_item.temp_row_id = Num.get_id();
									if(!Str.check_is_null(order_sub_item[key])
										&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
										&& key != Type.TITLE_PARENT_ITEM && key != Type.USER
										&& key != Type.TITLE_ORDER_ITEMS && key != Type.TITLE_ORDER_SUB_ITEMS
										&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
										&& key != Type.TITLE_STAT_ITEMS && key != Type.TITLE_STAT_SUB_ITEMS
										&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE){
										post_order_sub_item[key] = order_sub_item[key];
									}
								}
								post_order_sub_item.order_item_id =data.order_items.find(item_find => item_find.temp_row_id === order_item.temp_row_id).id,
									data.order_sub_items.push(post_order_sub_item);
							}
						}
						const [biz_error,biz_data] = await Portal.post_items(database,data.order_sub_items);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order_sub_items = biz_data;
						}
					}
				},
				//post - order_payments
				async function(call){
					if(order_payments.length>0){
						const [biz_error,biz_data] = await Portal.post_items(database,order_payments);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order_payments = biz_data;
						}
					}
				},
				//post_stat_order
				async function(call){
					if(data.order.id && option.post_stat){
						data.stat_order = [];
						let post_order_stat = Stat_Logic.get_new(Type.DATA_ORDER,order.id,Type.STAT_ORDER,data.order.user_id,order);
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_order_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.stat_order =  biz_data;
						}
					}
				},
				//post stat order_items
				async function(call){
					if(data.order.id && option.post_stat){
						data.stat_order_items = [];
						for(const order_item of order.order_items){
							let post_order_item_stat = Stat_Logic.get_new(Type.DATA_ORDER_ITEM,order_item.id,Type.STAT_ORDER_ITEM,order.user_id,order_item);
							let option = {post_unique:false};
							const [biz_error,biz_data] = await Stat_Data.post(database,post_order_item_stat,option);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.stat_order_items.push(biz_data);
							}
						}
					}
				},
				//post stat order_sub_items
				async function(call){
					if(data.order.id && option.post_stat){
						data.stat_order_sub_items = [];
						for(const order_item of order.order_items){
							for(const order_sub_item of order_item.order_sub_items){
								let post_order_sub_item_stat = Stat_Logic.get_new(Type.DATA_ORDER_SUB_ITEM,order_sub_item.id,Type.STAT_ORDER_SUB_ITEM,order.user_id,order_sub_item);
								let option = {post_unique:false};
								const [biz_error,biz_data] = await Stat_Data.post(database,post_order_sub_item_stat,option);
								if(biz_error){
									error=Log.append(error,biz_error);
								}else{
									data.stat_order_sub_items.push(biz_data);
								}
							}
						}
						data.stat_order_sub_items = data.stat_order_sub_items
					}
				},
				//post stat order_payments
				async function(call){
					if(data.order.id && option.post_stat){
						data.stat_order_payments  = [];
						for(const order_payment of order_payments){
							let post_order_payment_stat = Stat_Logic.get_new(Type.DATA_ORDER_PAYMENT,order_payment.id,Type.STAT_ORDER_PAYMENT,order.user_id,order_payment);
							let option = {post_unique:false};
							const [biz_error,biz_data] = await Stat_Data.post(database,post_order_payment_stat,option);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.stat_order_payments.push(biz_data);
							}
						}
					}
				},
				//get - order
				async function(call){
					let option = {get_payment:true};
					const [biz_error,biz_data] = await Order_Data.get(database,data.order.order_number,option);
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
			let data = {order:Data_Logic.get_new(Type.DATA_ORDER,0,{order_number:order_number,grand_total:0,order_items:[],user:Data_Logic.get_new(Type.DATA_USER,0)})};
			let order_parent_item_query = { $or: [] };
			let order_sub_item_query = { $or: [] };
			let error = null;
			let order_sub_items = [];
			option = option ? option : {};
			async.series([
				//get_order
				async function(call){
					let filter = { order_number: order_number };
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_ORDER,order_number,{filter:filter});
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_USER,data.order.user_id);
					data.order.user=biz_data;
				},
				//get_order_items
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						let filter = { order_number:order_number };
						let search = Data_Logic.get_search(Type.DATA_ORDER_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order.order_items = biz_data.items;
						}
					}
				},
				//get_order_items - parent_items
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						data.order.order_items.forEach(order_item => {
							let query_field = {};
							query_field[Type.FIELD_ID] = order_item.parent_id;
							order_parent_item_query.$or.push(query_field);
						});
						let search = Data_Logic.get_search(data.order.parent_data_type,order_parent_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order.order_items.forEach(order_item => {
								order_item.parent_item = biz_data.items.find(item_find => item_find.id === order_item.parent_id) ? biz_data.items.find(item_find => item_find.id === order_item.parent_id):Data_Logic.get_not_found(order_item.parent_data_type,order_item.parent_id);
							});
						}
					}
				},
				//get_order_sub_items
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						let filter = { order_number:order_number };
						let search = Data_Logic.get_search(Type.DATA_ORDER_SUB_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							order_sub_items = biz_data.items;
						}
					}
				},
				//get_order_sub_items - parent_sub_items
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						order_sub_items.forEach(order_sub_item => {
							let query_field = {};
							query_field['id'] = order_sub_item.parent_id;
							order_sub_item_query.$or.push(query_field);
						});
						let search = Data_Logic.get_search(Type.DATA_PRODUCT,order_sub_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							order_sub_items.forEach(order_sub_item => {
								order_sub_item.parent_item = biz_data.items.find(item_find => item_find.id === order_sub_item.parent_id) ? biz_data.items.find(item_find => item_find.id === order_sub_item.parent_id):Data_Logic.get_not_found(order_sub_item.parent_data_type,order_sub_item.parent_id);
							});
						}
					}
				},
				// order_items - order_sub_items - bind
				async function(call){
					data.order.order_items.forEach(order_item => {
						order_item.order_sub_items = [];
						let item_filter = order_sub_items.filter(item_find=>item_find.order_item_id===order_item.id);
						order_item.order_sub_items = [...item_filter, ...order_item.order_sub_items];
					});
				},
				//get_order_payments
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						let filter = { order_number:order_number };
						let sort_order = option.order_payment_sort_by ? option.order_payment_sort_by : {date_create:-1};
						let search = Data_Logic.get_search(Type.DATA_ORDER_PAYMENT,filter,sort_order,1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order.order_payments = biz_data.items;
						}
					}
				},
			]).then(result => {
				callback([error,data.order]);
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
			data.order = Data_Logic.get_new(Type.DATA_ORDER,id);
			async.series([
				//get_order
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_ORDER,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.delete(database,Type.DATA_ORDER,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order_delete = biz_data.item;
					}
				},
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_ORDER_ITEM,{order_number:data.order.order_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_order_item_search = biz_data;
					}
				},
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_ORDER_SUB_ITEM,{order_number:data.order.order_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_order_sub_item_search = biz_data;
					}
				},
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_ORDER_PAYMENT,{order_number:data.order.order_number},{},1,0);
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
			option = option ? option : {};
			data.cart = Data_Logic.get_new(Type.DATA_CART,cart.id,{cart_number:cart.cart_number,parent_data_type:cart.parent_data_type,user_id:cart.user_id,grand_total: 0});
			data.cart_items = [];
			data.cart_sub_items = [];
			async.series([
				//post - cart
				async function(call){
					for(const key in cart) {
						if(Str.check_is_null(data.cart[key])
							&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
							&& key != Type.PARENT_ITEM && key != Type.USER
							&& key != Type.CART_ITEMS && key != Type.CART_SUB_ITEMS
							&& key != Type.ORDER_ITEMS && key != Type.ORDER_SUB_ITEMS
							&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
							&& key != Type.TITLE_STAT_ITEMS && key != Type.TITLE_STAT_SUB_ITEMS
							&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE){
							data.cart[key] = cart[key];
						}
					}
					const [biz_error,biz_data] = await Portal.post(database,Type.DATA_CART,data.cart);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				//post - cart items
				async function(call){
					if(cart.cart_items.length>0){
						for(const cart_item of cart.cart_items){
							let post_cart_item = Data_Logic.get_new(Type.DATA_CART_ITEM,0);
							for(const key in cart_item){
								cart_item.temp_row_id = Num.get_id();
								if(!Str.check_is_null(cart_item[key])
									&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
									&& key != Type.PARENT_ITEM && key != Type.USER
									&& key != Type.CART_ITEMS && key != Type.CART_SUB_ITEMS
									&& key != Type.ORDER_ITEMS && key != Type.ORDER_SUB_ITEMS
									&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
									&& key != Type.TITLE_STAT_ITEMS && key != Type.TITLE_STAT_SUB_ITEMS
									&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE){
									post_cart_item[key] = cart_item[key];
								}
							}
							post_cart_item.temp_row_id = cart_item.temp_row_id;
							data.cart_items.push(post_cart_item);
						}
						const [biz_error,biz_data] = await Portal.post_items(database,data.cart_items);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart_items = biz_data;
						}
					}
				},
				//post - cart sub items
				async function(call){
					if(cart.cart_items.length>0){
						for(const cart_item of cart.cart_items){
							for(const cart_sub_item of cart_item.cart_sub_items){
								let post_cart_sub_item = Data_Logic.get_new(Type.DATA_CART_SUB_ITEM,0);
								for(const key in cart_sub_item){
									cart_sub_item.temp_row_id = Num.get_id();
									if(!Str.check_is_null(cart_sub_item[key])
										&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
										&& key != Type.PARENT_ITEM && key != Type.USER
										&& key != Type.CART_ITEMS && key != Type.CART_SUB_ITEMS
										&& key != Type.ORDER_ITEMS && key != Type.ORDER_SUB_ITEMS
										&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
										&& key != Type.TITLE_STAT_ITEMS && key != Type.TITLE_STAT_SUB_ITEMS
										&& key != Type.FIELD_DATE_CREATE && key != Type.FILED_DATE_SAVE){
										post_cart_sub_item[key] = cart_sub_item[key];
									}
								}
								post_cart_sub_item.cart_item_id =data.cart_items.find(item_find => item_find.temp_row_id === cart_item.temp_row_id).id,
									data.cart_sub_items.push(post_cart_sub_item);
							}
						}
						const [biz_error,biz_data] = await Portal.post_items(database,data.cart_sub_items);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart_sub_items = biz_data;
						}
					}
				},
				//post_stat_cart
				async function(call){
					if(data.cart.id && option.post_stat){
						data.stat_cart = [];
						let post_cart_stat = Stat_Logic.get_new(Type.DATA_CART,cart.id,Type.STAT_CART,data.cart.user_id,cart);
						post_cart_stat.grand_total = Cart_Logic.get_total(cart).grand_total;
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_cart_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.stat_cart =  biz_data;
						}
					}
				},
				//post stat cart_items
				async function(call){
					if(data.cart.id && option.post_stat){
						data.stat_cart_items = [];
						for(const cart_item of cart.cart_items){
							let post_cart_item_stat = Stat_Logic.get_new(Type.DATA_CART_ITEM,cart_item.id,Type.STAT_CART_ITEM,cart.user_id,cart_item);
							let option = {post_unique:false};
							const [biz_error,biz_data] = await Stat_Data.post(database,post_cart_item_stat,option);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.stat_cart_items.push(biz_data);
							}
						}
					}
				},
				//post stat cart_sub_items
				async function(call){
					if(data.cart.id && option.post_stat){
						data.stat_cart_sub_items = [];
						for(const cart_item of cart.cart_items){
							for(const cart_sub_item of cart_item.cart_sub_items){
								let post_cart_sub_item_stat = Stat_Logic.get_new(Type.DATA_CART_SUB_ITEM,cart_sub_item.id,Type.STAT_CART_SUB_ITEM,cart.user_id,cart_sub_item);
								let option = {post_unique:false};
								const [biz_error,biz_data] = await Stat_Data.post(database,post_cart_sub_item_stat,option);
								if(biz_error){
									error=Log.append(error,biz_error);
								}else{
									data.stat_cart_sub_items.push(biz_data);
								}
							}
						}
					}
				},
				//get - cart
				async function(call){
					const [biz_error,biz_data] = await Cart_Data.get(database,data.cart.cart_number);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
			]).then(result => {
				callback([error,data.cart]);
			}).catch(err => {
				Log.error("CartData-Cart-Item-Update",err);
				callback([error,[]]);
			});
		});
	};
	//9_cart_get
	static get = (database,cart_number) => {
		return new Promise((callback) => {
			let data = {cart:Data_Logic.get_new(Type.DATA_CART,0,{cart_number:cart_number,cart_items:[],user:Data_Logic.get_new(Type.DATA_USER,0)})};
			let cart_parent_item_query = { $or: [] };
			let cart_sub_item_query = { $or: [] };
			let error = null;
			let cart_sub_items = [];
			async.series([
				//get_cart
				async function(call){
					let filter = { cart_number:cart_number };
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_CART,cart_number,{filter:filter});
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_USER,data.cart.user_id);
					data.cart.user=biz_data;
				},
				//get_cart_items
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						let filter = { cart_number:cart_number };
						let search = Data_Logic.get_search(Type.DATA_CART_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart.cart_items = biz_data.items;
						}
					}
				},
				//get_cart_items - parent_items
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						data.cart.cart_items.forEach(cart_item => {
							let query_field = {};
							query_field[Type.FIELD_ID] = cart_item.parent_id;
							cart_parent_item_query.$or.push(query_field);
						});
						let search = Data_Logic.get_search(data.cart.parent_data_type,cart_parent_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart.cart_items.forEach(cart_item => {
								cart_item.parent_item = biz_data.items.find(item_find => item_find.id === cart_item.parent_id) ? biz_data.items.find(item_find => item_find.id === cart_item.parent_id):Data_Logic.get_not_found(cart_item.parent_data_type,cart_item.parent_id);
							});
						}
					}
				},
				//get_cart_sub_items
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						let filter = { cart_number: cart_number };
						let search = Data_Logic.get_search(Type.DATA_CART_SUB_ITEM,filter,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							cart_sub_items = biz_data.items;
						}
					}
				},
				//get_cart_sub_items - parent_sub_items
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						cart_sub_items.forEach(cart_sub_item => {
							let query_field = {};
							query_field[Type.FIELD_ID] = cart_sub_item.parent_id;
							cart_sub_item_query.$or.push(query_field);
						});
						let search = Data_Logic.get_search(Type.DATA_PRODUCT,cart_sub_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							cart_sub_items.forEach(cart_sub_item => {
								cart_sub_item.parent_item = biz_data.items.find(item_find => item_find.id === cart_sub_item.parent_id) ? biz_data.items.find(item_find => item_find.id === cart_sub_item.parent_id):Data_Logic.get_not_found(cart_sub_item.parent_data_type,cart_sub_item.parent_id);
							});
						}
					}
				},
				// cart_items - cart_sub_items - bind
				async function(call){
					data.cart.cart_items.forEach(cart_item => {
						cart_item.cart_sub_items = [];
						let item_filter = cart_sub_items.filter(item_find=>item_find.cart_item_id===cart_item.id);
						cart_item.cart_sub_items = [...item_filter, ...cart_item.cart_sub_items];
					});
				},
				async function(call){
					data.cart = Cart_Logic.get_total(data.cart);
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
	static delete = async (database,id) => {
		return new Promise((callback) => {
			let data = {};
			let error = null;
			data.cart = Data_Logic.get_new(Type.DATA_CART,id);
			async.series([
				//get_cart
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_CART,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.delete(database,Type.DATA_CART,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart_delete = biz_data;
					}
				},
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_CART_ITEM,{cart_number:data.cart.cart_number},{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.delete_cart_item_search = biz_data;
					}
				},
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_CART_SUB_ITEM,{cart_number:data.cart.cart_number},{},1,0);
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
			let product = Data_Logic.get_new(Type.DATA_PRODUCT,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_PRODUCT,key,option);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_PRODUCT,products:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_PRODUCT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.products = biz_data.items;
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
	static post = async(database,parent_data_type,parent_id,user_id,post_review,option) => {
		return new Promise((callback) => {
			let error = null;
			let data = {parent_item:Data_Logic.get_new(parent_data_type,parent_id),review:Data_Logic.get_new(Type.DATA_REVIEW,0)};
			let review = Review_Logic.get_new(parent_data_type,parent_id,user_id,post_review.title,post_review.comment,post_review.rating);
			option = option ? option : {post_stat:false,user_id:0};
			async.series([
				//review_post
				async function(call){
					const [biz_error,biz_data] = await Portal.post(database,Type.DATA_REVIEW,review);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.review = biz_data;
					}
				},
				//get_parent_item
				async function(call){
					let option = {};
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
				//post-review-stat
				async function(call){
					if(option.post_stat && data.parent_item.id){
						let post_stat = Stat_Logic.get_new(Type.DATA_REVIEW,data.review.id,Type.STAT_REVIEW,user_id,data.review);
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.stat_review = biz_data;
						}
					}
				},
			]).then(result => {
				callback([error,data.review]);
			}).catch(err => {
				Log.error("Review-Data-Portal",err);
				callback([err,[]]);
			});
		});
	};
	//9_review_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_REVIEW,reviews:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_REVIEW,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.reviews = biz_data.items;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Search",err);
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
				//reviews
				async function(call){
					let query = {parent_id:'1',parent_data_type:parent_data_type};
					//let query = {};
					let search = Data_Logic.get_search(Type.DATA_REVIEW,query,sort_by,page_current,page_size);
					let option = {get_join:true,field_keys:[{foreign_data_type:parent_data_type,foreign_field:'id',item_field:'product',title:'parent_item'}],get_user:true};
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count=biz_data.item_count;
						data.page_count=biz_data.page_count;
						data.search=biz_data.search;
						data.reviews=biz_data.items;
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
			let data = {parent_item:Data_Logic.get_new(parent_data_type,parent_id),review:Data_Logic.get_new(Type.DATA_REVIEW,0)};
			let review = Data_Logic.get_new(Type.DATA_REVIEW,review_id);
			async.series([
				//review_post
				async function(call){
					const [biz_error,biz_data] = await Portal.delete(database,Type.DATA_REVIEW,review.id);
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
			if(!device){
				device = {};
			}
			let dev = {};
			dev.platform_name = !Str.check_is_null(device.name) ? device.name : Type.TITLE_N_A;
			dev.platform_version = !Str.check_is_null(device.version) ? device.version : Type.TITLE_N_A;
			dev.platform_layout = !Str.check_is_null(device.layout) ? device.layout : Type.TITLE_N_A;
			dev.platform_os = !Str.check_is_null(device.os) ? device.os : Type.TITLE_N_A;
			dev.platform_description = !Str.check_is_null(device.description) ? device.description : Type.TITLE_N_A;
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
				let ip_info ={country_name:Type.TITLE_N_A,region_name:Type.TITLE_N_A,district:Type.TITLE_N_A,city_name:Type.TITLE_N_A,latitude:Type.TITLE_N_A,longitude:Type.TITLE_N_A,zip_code:Type.TITLE_N_A,isp:Type.TITLE_N_A,ip_address:Type.TITLE_N_A};
				var https = require('https');
				let url = 'https://api.ip2location.io/?key=' + geo_key + '&ip=' + ip_address + '&format=json';
				let response = '';
				let req = https.get(url, function (res) {
					res.on('error', (e) => console.error('GEO_LOCATION ERROR: ' + e));
					var https = require('https');
					var key = geo_key;
					var ip = !Str.check_is_null(ip_address) ? ip_address : "0.0.0.0" ;
					let url = 'https://api.ip2location.io/?key=' + key + '&ip=' + ip + '&format=json';
					let response = '';
					let req = https.get(url, function (res) {
						res.on('data', (chunk) => (response = response + chunk));
						res.on('error', (e) => console.error('ERROR: ' + e));
						res.on("end", function () {
							try {
								let geo_data = JSON.parse(response);
								ip_info =
									{
										country_name: ! Str.check_is_null(geo_data.country_name) ? geo_data.country_name : Type.TITLE_N_A,
										region_name: ! Str.check_is_null(geo_data.region_name) ?geo_data.region_name: Type.TITLE_N_A,
										is_proxy: ! Str.check_is_null(geo_data.is_proxy) ?geo_data.is_proxy : Type.TITLE_N_A,
										district: ! Str.check_is_null(geo_data.district) ?geo_data.district : Type.TITLE_N_A,
										city_name: ! Str.check_is_null(geo_data.city_name) ?geo_data.city_name : Type.TITLE_N_A,
										latitude: ! Str.check_is_null(geo_data.latitude) ?geo_data.latitude : Type.TITLE_N_A,
										longitude: ! Str.check_is_null(geo_data.longitude) ?geo_data.longitude : Type.TITLE_N_A,
										zip_code: ! Str.check_is_null(geo_data.zip_code) ?geo_data.zip_code : Type.TITLE_N_A,
										isp: ! Str.check_is_null(geo_data.as) ?geo_data.as : Type.TITLE_N_A,
										ip_address: ! Str.check_is_null(geo_data.ip) ? geo_data.ip : Type.TITLE_N_A,
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
	static post = async (database,data,option) => {
		/* Post Data
		 *  - user / type. obj / ex. {email:myemail@gmail.com,title:my_title} / default. error
		 *
			/* Options
			*/
		return new Promise((callback) => {
			let error = null;
			let data = {data:{user:post_data}};
			data[Type.FIELD_RESULT_OK_EMAIL] = false;
			data[Type.FIELD_RESULT_OK_TITLE] = false;
			async.series([
				//check email
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_USER,{email:data.email},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(Str.check_is_null(data.id) && biz_data.items.length<=0){
							data[Type.FIELD_RESULT_OK_EMAIL] = true;
						}else if(biz_data.items.length>0){
							if(data.id == biz_data.items[0].id){
								data[Type.FIELD_RESULT_OK_EMAIL]  = true;
							}
						}else{
							data[Type.FIELD_RESULT_OK_EMAIL] = true;
						}
					}
				},
				//check title
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_USER,{title:data.title},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(Str.check_is_null(data.id) && biz_data.items.length<=0){
							data[Type.FIELD_RESULT_OK_TITLE] = true;
						}else if(biz_data.items.length>0){
							if(data.id == biz_data.items[0].id){
								data[Type.FIELD_RESULT_OK_TITLE] = true;
							}
						}else{
							data[Type.FIELD_RESULT_OK_TITLE] = true;
						}
					}
				},
				//post user
				async function(call){
					if(data[Type.FIELD_RESULT_OK_EMAIL] && data[Type.FIELD_RESULT_OK_TITLE]){
						data.last_login = DateTime.get_new();
						const [biz_error,biz_data] = await Portal.post(database,Type.DATA_USER,post_data);
						if(biz_error){
							biz_error=Log.append(error,biz_error);
						}else{
							data = biz_data;
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
	static register = async (database,data,option) => {
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
			let stat = Data_Logic.get_new(Type.DATA_STAT,0);
			data[Type.FIELD_RESULT_OK_USER] = false;
			data[Type.FIELD_RESULT_OK_USER_NAME] = false;
			data[Type.FIELD_RESULT_OK_EMAIL] = false;
			//let post_ip_address = post_data.ip_address?post_data.ip_address:null;
			//let post_geo_key = post_data.geo_key?post_data.geo_key:null;
			//let post_device = post_data.device?post_data.device:null;
			async.series([
				//check email
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_USER,{email:data.email},{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(biz_data<=0){
							data[Type.FIELD_RESULT_OK_EMAIL]  = true;
						}
					}
				},
				//check title
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_USER,{title:data.title},{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						biz_error=Log.append(error,biz_error);
					}else{
						if(biz_data<=0){
							data[Type.FIELD_RESULT_OK_USER_NAME] = true;
						}
					}
				},
				//post user
				async function(call){
					if(data[Type.FIELD_RESULT_OK_EMAIL] && data[Type.FIELD_RESULT_OK_USER_NAME]){
						data.last_login = DateTime.get_new();
						const [biz_error,biz_data] = await Portal.post(database,Type.DATA_USER,data);
						if(biz_error){
							biz_error=Log.append(error,biz_error);
						}else{
							data = biz_data;
							data[Type.FIELD_RESULT_OK_USER] = true;
							data[Type.FIELD_RESULT_OK_USER_NAME] = true;
							data[Type.FIELD_RESULT_OK_EMAIL] = true;
						}
					}
				},
				/*
				//get stat - ip - merge
				async function(call){
					if(data[Type.FIELD_RESULT_OK_EMAIL] && data[Type.FIELD_RESULT_OK_USER_NAME] && option.post_ip_address){
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
					if(data[Type.FIELD_RESULT_OK_EMAIL] && data[Type.FIELD_RESULT_OK_USER_NAME] && option.post_device){
						data.device = post_device;
						const biz_data = await User_Data.get_device(data.device);
						data.stat = Obj.merge(data.stat,biz_data);
					}
				},
				//post stat
				async function(call){
					if(data[Type.FIELD_RESULT_OK_EMAIL] && data[Type.FIELD_RESULT_OK_USER_NAME] && option.post_stat && option.post_device || option.post_ip){
						let post_stat = Stat_Logic.get_new(Type.DATA_USER,data.id,Type.STAT_REGISTER,data.id,data.stat);
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							stat = biz_data;
						}
					}
				},
				*/
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("User-Data-Register",err);
				callback([error,{}]);
			});
		});
	};
	//9_user_login
	static login = async (database,data,option) => {
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
			data[Type.FIELD_RESULT_OK_USER] = false;
			//let post_ip_address = post_data.ip_address?post_data.ip_address:null;
			//let post_geo_key = post_data.geo_key?post_data.geo_key:null;
			//let post_device = post_data.device?post_data.device:null;
			option = option ? option : {};
			async.series([
				//check email,password
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_USER,{email:data.email,password:data.password},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data.items.length>0){
							data = biz_data.items[0];
							data[Type.FIELD_RESULT_OK_USER] = true;
						}
					}
				},
				//post user
				async function(call){
					if(data[Type.FIELD_RESULT_OK_USER]){
						data.last_login = DateTime.get_new();
						const [biz_error,biz_data] = await Portal.post(database,Type.DATA_USER,data);
						if(biz_error){
							error=Log.append(error,biz_error);
						}
					}
				},
				/*
				//get stat - ip - merge
				async function(call){
					if(data[Type.FIELD_RESULT_OK_USER] && option.post_ip_address){
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
					if(data[Type.FIELD_RESULT_OK_USER] && option.post_device){
						data.device = post_device;
						const biz_data = await User_Data.get_device(data.device);
						data.stat = Obj.merge(data.stat,biz_data);
					}
				},
				//post stat
				async function(call){
					if(data[Type.FIELD_RESULT_OK_USER] && option.post_stat && option.post_device || option.post_ip){
						let post_stat = Stat_Logic.get_new(Type.DATA_USER,data.id,Type.STAT_LOGIN,data.id,data.stat);
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.stat = biz_data;
						}
					}
				},
				*/
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
	//9_favorite_get
	static get = (database,parent_data_type,parent_id,user_id) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			data.is_favorite = false;
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = Data_Logic.get_search(Type.DATA_FAVORITE,favorite_filter,{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(biz_error,error);
					}else{
						if(biz_data>0){
							data.is_favorite = true;
						}
					}
				},
			]).then(result => {
				callback([error,data.is_favorite]);
			}).catch(err => {
				Log.error("Favorite-Get",err);
				callback([error,[]]);
			});
		});
	};
	//9_favorite_post
	static post = async (database,parent_data_type,parent_id,user_id) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			data[Type.FIELD_RESULT_OK_UNIQUE] = false;
			data[Type.FIELD_RESULT_OK_FAVORITE_ADD] = false;
			let favorite = Favorite_Logic.get_new(parent_data_type,parent_id,user_id);
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = Data_Logic.get_search(Type.DATA_FAVORITE,favorite_filter,{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(biz_error,error);
					}else{
						if(biz_data<=0){
							data[Type.FIELD_RESULT_OK_UNIQUE] = true;
						}
					}
				},
				async function(call){
					if(data[Type.FIELD_RESULT_OK_UNIQUE]){
						const [biz_error,biz_data] = await Portal.post(database,Type.DATA_FAVORITE,favorite);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.favorite = biz_data;
							data[Type.FIELD_RESULT_OK_FAVORITE_ADD] = true;
						}
					}
				},
				//post-favorite-stat
				async function(call){
					if(data[Type.FIELD_RESULT_OK_UNIQUE]){
						let post_stat = Stat_Logic.get_new(parent_data_type,parent_id,Type.STAT_FAVORITE,user_id,data.favorite);
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.stat_favorite = biz_data;
						}
					}
				},
			]).then(result => {
				callback([error,data[Type.FIELD_RESULT_OK_FAVORITE_ADD]]);
			}).catch(err => {
				Log.error("Favorite-Data-Update",err);
				callback([err,{}]);
			});
		});
	};
	//9_favorite_delete
	static delete = (database,parent_data_type,parent_id,user_id) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			data.is_favorite = false;
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = Data_Logic.get_search(Type.DATA_FAVORITE,favorite_filter,{},1,0);
					const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(biz_error,error);
					}else{
						data = biz_data;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Favorite-Delete",err);
				callback([error,[]]);
			});
		});
	};

}
class Portal {
	//9_portal_get
	static get = async(database,data_type,id,option) => {
		/* Options
		 * ID
		   - id_field / type. str / ex. title_url / default. id
		   - id_field_value / type. str / ex. 'theboss' / default. throw error
		 * Cache
		   - cache_delete / type. bool / ex. true/false / default. false
		 * Fields
		   - field / type. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
 		 *  Group
			-- groups / type. obj. group_search / ex. [
					{
						type:Type.Type.TITLE_ITEMS,Type.TITLE_COUNT,
						field:{field_show_1:1,field_hide_2:0},
						title:{group_show_1:1,group_hide_2:0},
						page_current:1,
						page_size:0,
					}];
		 *  Foreign
			-- foreigns / type. obj. foreign_search / ex. [
					{
						type:Type.Type.TITLE_ITEMS,Type.TITLE_COUNT,
						foreign_data_type:Type.DATA_PRODUCT,
						foreign_field:'id',
						parent_field:'parent_id',
						field:{field_show_1:1,field_hide_2:0},
						title:'field_title',
						page_current:1,
						page_size:0,
					}];
		*  Join
			-- joins / type. obj. join_search / ex. [
					{
						type:Type.Type.TITLE_ITEMS,Type.TITLE_COUNT
						search:search_obj,
						title:'field_title',
						page_current:1,
						page_size:0
					}];
		   --
		 * Stat
 		 *  Stat
			-- stat / type. obj / ex. [
					{
						user_id:123,
						type:Type.STAT_VIEW,
						unique:true/false
					};
		 */
		return new Promise((callback) => {
			let error = null;
			let data = Data_Logic.get_new(data_type,0);
			let stat_view = Data_Logic.get_new(Type.DATA_STAT,0);
			let field_result_ok = false;
			option = option ? option : {};
			async.series([
				//delete_cache_item
				async function(call){
					if(option.cache_delete){
						const [biz_error,biz_data] = await Portal.delete_cache(database,data_type,id,option);
					}
				},
				//item_by_id
				async function(call){
 					const [biz_error,biz_data] = await Data.get(database,data_type,id,option);
					data = biz_data;
				},
				//field_values
				async function(call){
					/*-old?
					if(option.get_field_value && data.id){
						data = Field_Logic.get_item_field_values(data);
					}
					*/
				},
				//9_get_item_join
				async function(call){
					if(option.joins){
						const [biz_error,biz_data] = await Portal.get_data_joins(database,data,option);
						if(!biz_error){
							data = biz_data;
						}
					}
				},
				//9_get_item_groups
				async function(call){
					if(option.groups && data.id){
						data.groups = [];
						let search_items = [];
					for(const item of option.groups){
						search_items.push({
								field : item.field ? item.field : {},
								title : item.title ? item.title : {}, // {groupShow:1,groupHide:0},{0:all}
								image : item.image ? item.image : {count:0,sort_by:Type.TITLE_SORT_BY_ASC},
								page_current : item.page_current ? item.page_current : 1,
								page_size : item.page_current ? item.page_current : 0,
							});
						}
						for(const search_item of search_items){
							let group_list = [];
							let hide_group_list = [];
							let group_query = {$or:[],$and:[]};
							//let group_query = {$and:[]};
							for(const field in search_item.title) {
                        		let new_item = {};
                        		new_item[field] = search_item.title[field];
                        		if(new_item[field]){
									let query_field = {};
									query_field[Type.FIELD_TITLE_URL] = field;
									group_query.$and.push(query_field);
                        		}else{
									let query_field = {};
									query_field[Type.FIELD_TITLE_URL] = {$ne:field};
									group_query.$and.push(query_field);
                        		}
                    		}
							//add_parent_id
							let query_field = {};
							query_field[Type.FIELD_PARENT_ID] = data.id;
							group_query.$and.push(query_field);

							if(group_query.$or.length <= 0){
								delete group_query.$or;
							}
							let item_group_join_option = {field:search_item.field,page_current:search_item.page_current,page_size:search_item.page_size};
							let item_group_join_search = Data_Logic.get_search(Type.DATA_GROUP,group_query,{},search_item.page_current,search_item.page_size);
							const [biz_error,biz_data] = await Portal.search(database,item_group_join_search.data_type,item_group_join_search.filter,item_group_join_search.sort_by,item_group_join_search.page_current,item_group_join_search.page_size,item_group_join_option);
									if(biz_error){
										error=Log.append(error,biz_error);
									}else{
										for(const group of biz_data.items){
											data[Str.get_title_url(group.title_url)] = group;
										}
										data.groups = biz_data.items.length>0?biz_data.items:[];
									}
							}
					}
				},
				//9_get_item_foreigns
				async function(call){
					if(option.foreigns && data.id){
						let search_items = [];
						for(const item of option.foreigns){
								search_items.push({
									type : item.type ? item.type : Type.TITLE_ITEMS,
									foreign_data_type : item.foreign_data_type,
									foreign_field : item.foreign_field,
									parent_field : item.parent_field,
									field : item.field ? item.field : {},
									title : item.title ? item.title : Str.get_title_url(Type.get_title(item.foreign_data_type,{plural:true})),
									page_current: item.page_current ? item.page_current : 1,
									page_size: item.page_size ? item.page_size : 0,
								});
						}
						for(const search_item of search_items){
							let foreign_option = {field:search_item.field};
							if(search_item.type == Type.TITLE_ITEMS){
								let query = {};
								query[search_item.foreign_field] = data[search_item.parent_field];
								let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},1,0);
								const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option);
								if(biz_error){
									error=Log.append(error,biz_error);
								}else{
									data[search_item.title] = biz_data.items.length>0?biz_data.items:[];
								}
							}
							else if(search_item.type == Type.TITLE_COUNT){
								let query = {};
								query[search_item.foreign_field] = data[search_item.parent_field];
								let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},1,0);
								const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
								if(biz_error){
									error=Log.append(error,biz_error);
								}else{
									data[search_item.title] = biz_data?biz_data:0;
								}
							}
							else if(search_item.type == Type.TITLE_ONE){
								let query = {};
								query[search_item.foreign_field] = data[search_item.parent_field];
								let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},1,0);
								const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option);
								if(biz_error){
									error=Log.append(error,biz_error);
								}else{
									data[search_item.title] = biz_data.items.length>0 ? biz_data.items[0] : Data_Logic.get_not_found(search_item.foreign_data_type,0);
								}
							}
						}
					}
				},
				//post-stat
				async function(call){
					if(option.stat && data.id){
						let post_stat = Stat_Logic.get_new(data.data_type,data.id,option.stat.type?option.stat.type:Type.STAT_VIEW,option.stat.user_id?option.stat.user_id:0,data);
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							stat_view = biz_data;
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("ERROR-PORTAL-GET-2",err);
				callback([error,{}]);
			});
		});
	};
	//9_get_data_groups 9_data_groups
	static get_data_groups = (database,data,option) => {
		return new Promise((callback) => {
			let search_items = [];
			async.series([
				async function(call){
					if(option.groups){
						for(const item of option.groups){
							search_items.push({
								type : item.type ? item.type : Type.TITLE_ITEMS,
								field : item.field ? item.field : {},
								title : item.title ? item.title : {}, // {groupShow:1,groupHide:0},{0:all}
								image : item.image ? item.image : {},
								page_current : item.page_current ? item.page_current : 1,
								page_size : item.page_current ? item.page_current : 0,
							});
						}
						for(const search_item of search_items){
							let group_option = {field:search_item.field};
							let group_query = {};
							let group_list = [];
							let hide_group_list = [];
							if(search_item.type == Type.TITLE_ITEMS){
								for(const field in search_item.title) {
                        			let new_item = {};
                        			new_item[field] = search_item.title[field];
                        			if(new_item[field]){
                            			group_list.push({field:field,value:new_item[field]});
                        			}else{
                            			hide_group_list.push({field:field,value:new_item[field]});
                        			}
                    			}
								//get_all_groups
								if(group_list.length <= 0){
									//items list
									if(Obj.check_is_array(data.items)){
										//item
									}else{
										group_query = {parent_id:data.id}


									}
								}
								/*
								for(const group of group_list) {
									let query_field = {};
									query_field[Type.FIELD_TITLE_URL] = { $regex:String(group.field), $options: "i" };
									group_query.$or.push(query_field);
								};
								let group_search = Data_Logic.get_search(Type.DATA_GROUP,group_query,{},search_item.page_current,search_item.page_size);
								const [biz_error,biz_data] = await Portal.search(database,group_search.data_type,group_search.filter,group_search.sort_by,group_search.page_current,group_search.page_size,group_option);
								if(biz_data.items.length> 0){
									if(group_list.length>0){
										for(const group_title of group_list) {
											for(const group of biz_data.items) {
												if(group_title.field == group.title_url){
													let match_hide_group = hide_group_list.find(item=>item.field == group.title_url);
														if(!match_hide_group){

															if(data.items.length>0){
																for(const item of data.items) {
																}

															}
															data.groups = [];
															//add to get
															data[Str.get_title_url(group.title)] = group;
															data.groups.push(group);
															//add toi list
														}
												}
											}
										}
									}else{
										for(const group of biz_data.items) {
											let match_hide_group = hide_group_list.find(item=>item.field == group.title_url);
												if(!match_hide_group){
													data[Str.get_title_url(group.title)] = group;
													data.groups.push(group);
												}
										}
									}
								}
								*/

							}
							}
						}

				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Blank-Get",err);
				callback([error,[]]);
			});
		});
	};

	//9_items_join //9_get_items_join //9_joins 9_get_data_joins //9_data_joins
	static get_data_joins = (database,data,option) => {
		return new Promise((callback) => {
			let join_search_items = [];
			async.series([
				async function(call){
					for(const join_item of option.joins){
							join_search_items.push({
								type : join_item.type ?  join_item.type : Type.TITLE_LIST,
								search : join_item.search ? join_item.search : Data_Logic.get_search(Type.DATA_BLANK,{},{},1,0),
								field : join_item.field ? join_item.field : {},
								title : join_item.title ? join_item.title : Str.get_title_url(Type.get_title(join_item.foreign_data_type,{plural:true})),
								page_current : join_item.page_current ? join_item.page_current : 1,
								page_size : join_item.page_size ? join_item.page_size : 0,
								items : []
							});
						}
						for(const search_item of join_search_items){
							let search = Data_Logic.get_search(search_item.search.data_type,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
							let join_option = search_item.field ? {} : {};
							const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								if(search_item.type == Type.TITLE_ITEMS){
									let title = Str.get_title_url(search_item.title);
									data[title+'_item_count'] = biz_data.item_count;
									data[title+'_page_count'] = biz_data.page_count;
									data[title+'_search'] = biz_data.search;
									data[title] = biz_data.items;
								}else if(search_item.type == Type.TITLE_COUNT){
									let search = Data_Logic.get_search(search_item.search.data_type,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
									const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
									if(biz_error){
										error=Log.append(error,biz_error);
									}else{
										data[search_item.title] = biz_data;
									}
								}else if(search_item.type == Type.TITLE_ONE){
										let search = Data_Logic.get_search(search_item.search.data_type,search_item.search.filter,search_item.search.sort_by,search_item.search.page_current,search_item.search.page_size);
										let join_option = search_item.field ? {} : {};
										const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
										if(biz_error){
											error=Log.append(error,biz_error);
										}else{
											data[search_item.title] = biz_data.items.length ? biz_data.items[0] : Data_Logic.get_not_found(search_item.search.data_type,0);
										}
									}
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Get-Data-Join",err);
				callback([error,[]]);
			});
		});
	};

	//9_portal_search_simple
	static search_simple = async (database,data_type,filter,sort_by,page_current,page_size,option) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data = {data_type:data_type,item_count:0,page_count:1,filter:{},items:[]};
			option = option ? option : {};
			async.series([
				function(call){
					let search = Data_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					Data.get_items(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.item_count=item_count;
							data.page_count=page_count;
							data.search=search;
							data.filter=filter;
							data.items=items;
							call();
						}
					}).catch(err => {
						Log.error('DATA-SEARCH-ERROR-1',err);
						error=Log.append(error,err);
					});
				},
				//9_get_items_join
				async function(call){
					if(option.joins){
						const [biz_error,biz_data] = await Portal.get_data_joins(database,data,option);
						if(!biz_error){
							biz_data = biz_data;
						}
					}
				},
				]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Count-List-Data",err);
				callback([err,{}]);
			});
		});
	};
	//9_portal_search
	static search = (database,data_type,filter,sort_by,page_current,page_size,option) => {
		/* OPTIONS - START
		 * Fields
		   - field / type. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
 		* Distinct
			-- distinct / type. obj / ex. [
					{
						field:{field_distinct:1};
						sort_by:Type.TITLE_SORT_BY_ASC,Type.TITLE_SORT_BY_DESC / ASC default
					}];
		*  Foreign
			-- foreigns / type. obj items / ex. [
					{
						type:Type.Type.TITLE_ITEMS,Type.TITLE_COUNT,Type.TITLE_ONE
						foreign_data_type:Type.DATA_ITEM,
						foreign_field:'id',
						parent_field:'parent_id',
						field:{field_show_1:1,field_hide_2:0},
						title:'field_title',
					}];
		*  Join
			-- joins / type. obj. join_search / ex. [
					{
						type:Type.Type.TITLE_ITEMS,Type.TITLE_COUNT
						search:search_obj,
						title:'field_title',
						page_current:1,
						page_size:0
					}];
	    *  Group
			-- groups / type. obj. group_search / ex. [
					{
						type:Type.Type.TITLE_ITEMS,Type.TITLE_COUNT,
						field:{field_show_1:1,field_hide_2:0},
						title:{group_show_1:1,group_hide_2:0},
						page_current:1,
						page_size:0,
					}];

		 * Return
			- data_type
			- item_count
			- page_count
			- filter
			- items
		 /* OPTIONS - END*/
		return new Promise((callback) => {
			let data = {data_type:data_type,item_count:0,page_count:1,filter:{},items:[]};
			let error=null;
			option = option ? option : {};
			async.series([
				//9_get_items
				function(call){
					let search = Data_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					Data.get_items(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.item_count=item_count;
							data.page_count=page_count;
							data.search=search;
							data.items=items;
							call();
						}
					}).catch(err => {
						Log.error('DATA-SEARCH-ERROR-1',err);
						error=Log.append(error,err);
					});
				},
				//9_get_items_distinct
				function(call){
					if(option.distinct && data.items.length>0){
						data.items = data.items.filter((obj, index, self) =>
							index === self.findIndex((t) => t[option.distinct.field] === obj[option.distinct.field])
						);
						let distinct_sort_by = option.distinct.sort_by ? option.distinct.sort_by : Type.TITLE_SORT_BY_ASC;
						data.items = Obj.sort_list_by_field(data.items,Type.FIELD_TITLE,distinct_sort_by);
						call();
					}
					else{
						call();
					}
				},
				//9_get_items_foreign
				async function(call){
					if(option.foreigns && data.items.length>0){
						let foreign_search_items = [];
						for(const foreign_item of option.foreigns){
							for(const data_item of data.items){
								foreign_search_items.push({
									type : foreign_item.type ? foreign_item.type : Type.TITLE_ITEMS,
									foreign_data_type : foreign_item.foreign_data_type,
									foreign_field : foreign_item.foreign_field,
									parent_field : foreign_item.parent_field,
									parent_value : data_item[foreign_item.parent_field],
									field : foreign_item.field ? foreign_item.field : {},
									title : foreign_item.title ? foreign_item.title : foreign_item.foreign_data_type,
									page_current : foreign_item.page_current ? foreign_item.page_current : 1,
									page_size : foreign_item.page_size ? foreign_item.page_size : 0,
									items : []
								});
							}
						}
						for(const search_item of foreign_search_items){
							let query = { $or: [] };
							for(const data_item of data.items){
								let query_field = {};
								query_field[search_item.foreign_field] = search_item.parent_value;
								query.$or.push(query_field);
							};
							let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},1,0);
							let foreign_option = search_item.field ? {} : {};
							const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								search_item.items = biz_data.items;
								if(foreign_search_items.length> 0){
									for(const search_item of foreign_search_items){
										for(const data_item of data.items){
											if(search_item.type == Type.TITLE_ITEMS){
												let query = {};
												query[search_item.foreign_field] = data_item[search_item.parent_field];
												let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},1,0);
												data_item[search_item.title] = [];
												const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option);
												if(biz_error){
													error=Log.append(error,biz_error);
												}else{
													for(const sub_data_item of biz_data.items){
														data_item[search_item.title].push(sub_data_item);
													}
												}
											}else if(search_item.type == Type.TITLE_COUNT){
												let query = {};
												query[search_item.foreign_field] = data_item[search_item.parent_field];
												let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},1,0);
												const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
												if(biz_error){
													error=Log.append(error,biz_error);
												}else{
													data_item[search_item.title] = biz_data;
												}
											}else if(search_item.type == Type.TITLE_ONE){
												let query = {};
												query[search_item.foreign_field] = data_item[search_item.parent_field];
												let search = Data_Logic.get_search(search_item.foreign_data_type,query,{},1,1);
												const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,foreign_option);
												if(biz_error){
													error=Log.append(error,biz_error);
												}else{
													data_item[search_item.title] = biz_data.items.length ? biz_data.items[0] : Data_Logic.get_not_found(search_item.foreign_data_type,0);
												}
											}

										}
									}
								}
							}
							}
						}
				},
				//9_get_items_join
				async function(call){
					if(option.joins){
						const [biz_error,biz_data] = await Portal.get_data_joins(database,data,option);
						if(!biz_error){
							data = biz_data;
						}
					}
				},
				//9_get_items_group
				async function(call){
					if(option.groups && data.items.length>0){
						let search_items = [];
					for(const item of option.groups){
						search_items.push({
								field : item.field ? item.field : {},
								title : item.title ? item.title : {}, // {groupShow:1,groupHide:0},{0:all}
								image : item.image ? item.image : {count:0,sort_by:Type.TITLE_SORT_BY_ASC},
								page_current : item.page_current ? item.page_current : 1,
								page_size : item.page_current ? item.page_current : 0,
							});
						}
						for(const search_item of search_items){
							let group_list = [];
							let hide_group_list = [];
							let group_query = {$or:[],$and:[]};
							for(const field in search_item.title) {
                        		let new_item = {};
                        		new_item[field] = search_item.title[field];
                        		if(new_item[field]){
									let query_field = {};
									query_field[Type.FIELD_TITLE_URL] = field;
									group_query.$or.push(query_field);
                        		}else{
									let query_field = {};
									query_field[Type.FIELD_TITLE_URL] = {$ne:field};
									group_query.$and.push(query_field);
                        		}
                    		}
							//add_parents_id
							for(const item of data.items){
								let query_field = {};
								query_field[Type.FIELD_PARENT_ID] = item.id;
								group_query.$and.push(query_field);
							}
							if(group_query.$or.length <= 0){
								delete group_query.$or;
							}
							let item_group_join_option = {field:search_item.field,page_current:search_item.page_current,page_size:search_item.page_size};
							let item_group_join_search = Data_Logic.get_search(Type.DATA_GROUP,{},{},search_item.page_current,search_item.page_size);
						const [biz_error,biz_data] = await Portal.search_simple(database,item_group_join_search.data_type,item_group_join_search.filter,item_group_join_search.sort_by,item_group_join_search.page_current,item_group_join_search.page_size,item_group_join_option);
									if(biz_error){
										error=Log.append(error,biz_error);
									}else{
										for(const data_item of data.items){
											data_item.groups = [];
											for(const group of biz_data.items){
												if(data_item.id == group.parent_id){
													if(!data_item[Str.get_title_url(group.title)]){
														data_item[Str.get_title_url(group.title)] = [];
													}
													data_item[Str.get_title_url(group.title)].push(group);
													data_item.groups.push(group);
												}
											}
										}
									}
							}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error('DATA-SEARCH-ERROR-7',err);
				callback([err,[]]);
			});
		});
	};
	//9_portal_post
	static post = async (database,data_type,data,option) => {
		/* option params
		 * Fields
		   - overwrite_data / type. bool / ex. true,false / default. false -- post brand new obj.deleteing old.
		   - get_update_data / type. bool / ex. true,false / default. false -- get update item aka recently saved item.
		   */
		return new Promise((callback) => {
			let error = null;
			option = option ? option : {};
			async.series([
				function(call){
					Data.post(database,data_type,data,option).then(([biz_error,biz_data])=> {
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
				//delete cache item
				async function(call){
					if(option.overwrite_data){
						const [biz_error,biz_data] = await Portal.delete_cache(database,data_type,data.id);
						if(biz_error){
							error=Log.append(error,biz_error);
						}
					}
				},
				//get_save_data
				async function(call){
					if(option.get_update_data && data.id){
						const [biz_error,biz_data] = await Portal.get(database,data_type,data.id,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
						}
					}
				},
				async function(call){
					if(option.post_stat){
						let post_stat = Stat_Logic.get_new(data_type,data.id,option.stat_type,option.user_id,item);
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}
					}
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
	static post_bulk = async (database,data_type,items) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let data = Data_Logic.get_new(data_type,0);
			async.series([
				function(call){
					Data.post_bulk(database,data_type,items).then(([biz_error,biz_data])=> {
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
			let data = Data_Logic.get_new(data_type,id);
			data[Type.FIELD_RESULT_OK_DELETE] = false;
			option = option ? option : {};
			async.series([
				function(call){
					Data.delete_cache(database,data_type,id).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
								data = biz_data;
								data[Type.FIELD_RESULT_OK_DELETE] = true;
							}
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
		 * Return
		 * - title
		 *   - description / type /
		 */
		return new Promise((callback) => {
			let error = null;
			let data = Data_Logic.get_new(data_type,id);
			data[Type.FIELD_RESULT_OK_DELETE] = false;
			data[Type.FIELD_RESULT_OK_DELETE_CACHE] = false;
			data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = false;
			data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
			option = option ? option : {};
			async.series([
				function(call){
					Data.delete(database,data_type,id).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
								data[Type.FIELD_RESULT_OK_DELETE]  = true;
								data[Type.FIELD_RESULT_OK_DELETE_CACHE] = true;
								data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = true;
							}
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
				async function(call){
					let filter = {parent_id:data.id};
					let data_type = Type.DATA_GROUP;
					const [biz_error,biz_data] = await Portal.delete_search(database,data_type,filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
							data[Type.FIELD_RESULT_OK_GROUP_DELETE] = true;
						}
					}
				},
				async function(call){
					let filter = {parent_id:data.id};
					let data_type = Type.DATA_IMAGE;
					const [biz_error,biz_data] = await Portal.delete_search(database,data_type,filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
							data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = true;
						}
					}
				},
				async function(call){
					if(data[Type.FIELD_RESULT_OK_GROUP_DELETE] && data[Type.FIELD_RESULT_OK_IMAGE_DELETE]){
						data[Type.FIELD_RESULT_OK_DELETE] = true;
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
	//9_portal_post_items - 9_post_items
	static post_items = async (database,data_items) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			async.series([
				function(call){
					Data.post_items(database,data_items).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data_items = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
			]).then(result => {
				callback([error,data_items]);
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
			let data = Data_Logic.get_new(data_type,0);
			data[Type.FIELD_RESULT_OK_DELETE] = false;
			data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
			data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = false;
			let delete_item_query = { $or: [] };
			option = option ? option : {};
			async.series([
				async function(call){
					let search = Data_Logic.get_search(data_type,filter,{},1,0);
					let parent_option = {};
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search,search.page_size,search.parent_option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data.items.length>0){
						let query = { $or: [] };
						for(const data_item of biz_data.items){
							let query_field = {};
							query_field[Type.FIELD_PARENT_ID] = data_item.id
							delete_item_query.$or.push(query_field);
						};
						}
				}
				},
				async function(call){
					if(delete_item_query.$or.length > 0){
						let data_type = Type.DATA_GROUP;
						let search = Data_Logic.get_search(data_type,delete_item_query,{},1,0);
						const [biz_error,biz_data] = await Data.delete_items(database,data_type,search.filter);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data[Type.FIELD_RESULT_OK_GROUP_DELETE] = true;
						}
					}else{
							data[Type.FIELD_RESULT_OK_GROUP_DELETE] = true;
					}
				},
				async function(call){
					if(delete_item_query.$or.length > 0){
					let data_type = Type.DATA_IMAGE;
					let search = Data_Logic.get_search(data_type,delete_item_query,{},1,0);
					const [biz_error,biz_data] = await Data.delete_items(database,data_type,search.filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = true;
					}

					}else{
						data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = true;
					}

				},
				async function(call){
					if(data[Type.FIELD_RESULT_OK_GROUP_DELETE] && data[Type.FIELD_RESULT_OK_IMAGE_DELETE]){
						data[Type.FIELD_RESULT_OK_DELETE] = true;
					}
				}
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
					Data.count_items(database,data_type,filter).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data.count;
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
	static copy = async (database,data_type,id,option) => {
		/*
		 * params
		 * - title_tbd
		 *   - description. / type / ex.
		 * options
		 * - copy_group
		 *   - description. / type / ex. true/false
		 * return
		 * - title_tbd
		 *   - description. / type / ex.
		 *
		 */
		return new Promise((callback) => {
			let error = null;
			let data = Data_Logic.get_new(data_type,id);
			let top_data = Data_Logic.get_new(data_type,0);
			let copy_data = Data_Logic.get_new(data_type,0);
			option = option ? option : {copy_group:true};
			option.get_group =  option.copy_group  ? option.copy_group : true;
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,data_type,id,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						top_data=biz_data;
					}
				},
				//top_item
				async function(call){
					if(top_data.id){
					copy_data = Item_Logic.copy(data_type,top_data);
					copy_data[Type.FIELD_TITLE] = 'Copy '+top_data[Type.FIELD_TITLE];
					copy_data[Type.FIELD_TITLE_URL] = 'copy_'+top_data[Type.FIELD_TITLE_URL];
					copy_data[Type.FIELD_SOURCE_ID] = top_data.id;
					copy_data[Type.FIELD_SOURCE_DATA_TYPE] = top_data.data_type;
					const [biz_error,biz_data] = await Portal.post(database,copy_data.data_type,copy_data);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						copy_data=biz_data;
					}
					}else{
						copy_data = Data_Logic.get_not_found(data_type,id);
					}
				},
				async function(call){
					if(top_data.id && top_data.groups.length > 0){
						copy_data.groups = [];
						let post_groups = [];
						for(const group of top_data.groups){
							let copy_group = Item_Logic.copy(Type.DATA_GROUP,group);
							copy_group[Type.FIELD_TITLE] = 'Copy '+group[Type.FIELD_TITLE];
							copy_group[Type.FIELD_TITLE_URL] = 'copy_'+group[Type.FIELD_TITLE_URL];
							copy_group[Type.FIELD_SOURCE_ID] = group.id;
							copy_group[Type.FIELD_SOURCE_DATA_TYPE] = group.data_type;
							post_groups.push(copy_group);
						}
						const [biz_error,biz_data] = await Portal.post_items(database,post_groups);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								copy_data.groups=biz_data;
							}
						}
				},
			]).then(result => {
					data = copy_data;
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
			let data = {faq:Data_Logic.get_new(Type.DATA_FAQ,0)};
			let questions = [];
			let error = null;
			option = option ? option : {question_count:19};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_FAQ,key,option);
					data.faq = biz_data;
				},
				async function(call){
					if(!Str.check_is_null(data.faq.id)){
						option.question_count(option_item =>{
							if(data.faq["field_"+a]){
								let new_item = {};
								new_item.id = a+1;
								let ans = data.faq[Str.get_title_url(data.faq["field_"+a])];
								new_item['question'] = data.faq["field_"+a];
								new_item['answer'] = ans;
								questions.push(new_item);
							}
						});
					}
				},
			],
				function(error, result){
					callback([error,questions]);
				});
		});
	}
}
class Stat_Data {
	//9_stat_post
	static post = async (database,stat,option) => {
		return new Promise((callback) => {
			let error = null;
			option = option ? option : {};
			data = Data_Logic.get_new(Type.DATA_STAT,stat.id,{parent_data_type:stat.parent_data_type,user_id:stat.user_id,type:stat.type});
			field_result_ok = false;
			async.series([
				async function(call){
					for(const key in stat) {
						if(Str.check_is_null(data[key])){
							data[key] = stat[key];
						}
					}
				},
				//get - stat
				async function(call){
					if(option.stat.unique){
						const todayEnd = dayjs();
						const todayStart = todayEnd.subtract(1, 'day')
						let query_field = {$and:[]};
						query_field.$and.push({parent_id:stat.parent_id});
						query_field.$and.push({user_id:stat.user_id});
						query_field.$and.push({ date_create: {$gte: todayStart.toISOString(),$lte: todayEnd.toISOString()}});
						let search = Data_Logic.get_search(Type.DATA_STAT,query_field,{},1,0);
						const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(biz_data>=1){
								field_result_ok = true;
							}
						}
					}
				},
				//post - stat
				async function(call){
					if(data[FIELD_RESULT_OK]){
						const [biz_error,biz_data] = await Portal.post(database,Type.DATA_STAT,data);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
						}
					}
				},
				//get_item_by_id
				async function(call){
					if(field_result_ok){
						let field = {};
						field[stat.type] = 1;
						field[Type.FIELD_ID] = 1;
						field[Type.FIELD_TITLE] = 1;
						field[Type.FIELD_DATA_TYPE] = 1;
						let data_option = {field};
 						const [biz_error,biz_data] = await Data.get(database,data.parent_data_type,stat.parent_id,data_option);
						data = biz_data;
					}
				},
				//update_item_by_id
				async function(call){
					if(field_result_ok){
						if(data[stat.type]){
							data[stat.type] = parseInt(data[stat.type]) + 1
						}else{
							data[stat.type] = 1;
						}
						const [biz_error,biz_data] = await Portal.post(database,data.data_type,data);
						if(biz_error){
							error=Log.append(biz_error,error);
						}
					}
				}
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("StatData-Stat-Update",err);
				callback([error,[]]);
			});
		});
	};
	static post_user = (database,user_id,stat_type,post_data,option) => {
		return new Promise((callback) => {
			let post_stat = Data_Logic.get_new(Type.DATA_STAT,0,{user_id:user_id,type:stat_type});
			post_stat = Obj.merge(post_stat,post_data);
			let data = Data_Logic.get_new(Type.DATA_STAT,0);
			let error = null;
			async.series([
				//post_stat
				async function(call){
					const [biz_error,biz_data] = await Portal.post(database,Type.DATA_STAT,post_stat);
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
			let data = Data_Logic.get_new(Type.DATA_BLANK,0);
			let error = null;
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_STAT,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.stats = biz_data.items;
					}
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
class Data {
	//9_data
	static open_db = async (data_config) => {
		return [error,data] = await get_database_adapter(data_config);
	};
	static delete_db = async (database) => {
		return [biz_error,biz_data] = await delete_database_adapter(database);
	};
	static check_db = async (database) => {
		return check_database_adapter(database);
	};
	static post = async (database,data_type,data,option) => {
		return [error,data] = await post_item_adapter(database,data_type,data,option);
	};
	static get = async (database,data_type,id,option) => {
		return [error,data] = await get_item_adapter(database,data_type,id,option);
	};
	static delete = async (database,data_type,id) => {
		return [error,data] = await delete_item_adapter(database,data_type,id);
	};
	static delete_cache = async (database,data_type,id) => {
		return [error,data] = await delete_item_cache(database,data_type,id);
	};
	static post_items = async (database,items) => {
		return [error,data] = await post_item_list_adapter(database,items);
	};
	static post_bulk = async (database,data_type,items) => {
		return [error,data] = await post_bulk_adapter(database,data_type,items);
	};
	static get_items = async (database,data_type,filter,sort_by,page_current,page_size,option) => {
		const [error,data,item_count,page_count] = await get_item_list_adapter(database,data_type,filter,sort_by,page_current,page_size,option);
		return [error,data,item_count,page_count];
	};
	static delete_items = async (database,data_type,filter) => {
		return [error,data] = await delete_item_list_adapter(database,data_type,filter);
	};
	static count_items = async (database,data_type,filter) => {
		return [error,data] = await get_count_item_list_adapter(database,data_type,filter);
	};
}
class Service_Data {
	//9_service_get
	static get = async (database,id,option) => {
		return new Promise((callback) => {
			let service = Data_Logic.get_new(Type.DATA_SERVICE,0);
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_SERVICE,id,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						service = biz_data;
					}
				},
			]).then(result => {
				callback([error,service]);
			}).catch(err => {
				Log.error("Service-Get",err);
				callback([err,null]);
			});
		});
	};
	//9_service_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},data_type:Type.DATA_SERVICE,services:[]};
			let error = null;
			option = option ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_SERVICE,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.services = biz_data.items;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Service-Search",err);
				callback([err,[]]);
			});
		});
	};
}
class Blank_Data {
	//9_blank
	static blank = (database) => {
		return new Promise((callback) => {
			let error = null;
			let data = Data_Logic.get_new(Type.DATA_BLANK,0);
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Data.get(database,data.data_type,data.id,option);
					data = biz_data;
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
	Service_Data,
	Stat_Data,
};
