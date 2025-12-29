/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const dayjs = require('dayjs');
const {get_db_connect_main,check_db_connect_main,delete_db_connect_main,post_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,get_count_item_list_main,post_bulk_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num,Obj,DateTime}=require("biz9-utility");
const {DataItem,DataType,Favorite_Logic,Stat_Logic,Review_Logic,Type,App_Logic,Product_Logic,Demo_Logic,Category_Logic,Cart_Logic,Order_Logic,Field_Logic,Item_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
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
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let blog_post = DataItem.get_new(DataType.BLOG_POST,0);
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.BLOG_POST,blog_posts:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let category = DataItem.get_new(DataType.CATEGORY,0);
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.CATEGORY,categorys:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let content = DataItem.get_new(DataType.CONTENT,0);
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.CONTENT,contents:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let page = DataItem.get_new(DataType.PAGE,0);
			let error = null;
			option = option ? option : {};
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.PAGE,pages:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let template = DataItem.get_new(DataType.TEMPLATE,0);
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.TEMPLATE,templates:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let gallery = DataItem.get_new(DataType.GALLERY,0);
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {gallery_count:0,page_count:1,filter:{},data_type:DataType.GALLERY,gallerys:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let event = DataItem.get_new(DataType.EVENT,0);
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {event_count:0,page_count:1,filter:{},data_type:DataType.EVENT,events:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {order:DataItem.get_new(DataType.ORDER,0, {
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
					const [biz_error,biz_data] = await Portal.post(database,DataType.ORDER,data.order);
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
							let post_order_item = DataItem.get_new(DataType.ORDER_ITEM,0);
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
								let post_order_sub_item = DataItem.get_new(DataType.ORDER_SUB_ITEM,0);
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
						let post_order_stat = Stat_Logic.get_new(DataType.ORDER,order.id,Type.STAT_ORDER,data.order.user_id,order);
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
							let post_order_item_stat = Stat_Logic.get_new(DataType.ORDER_ITEM,order_item.id,Type.STAT_ORDER_ITEM,order.user_id,order_item);
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
								let post_order_sub_item_stat = Stat_Logic.get_new(DataType.ORDER_SUB_ITEM,order_sub_item.id,Type.STAT_ORDER_SUB_ITEM,order.user_id,order_sub_item);
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
							let post_order_payment_stat = Stat_Logic.get_new(DataType.ORDER_PAYMENT,order_payment.id,Type.STAT_ORDER_PAYMENT,order.user_id,order_payment);
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
			let data = {order:DataItem.get_new(DataType.ORDER,0,{order_number:order_number,grand_total:0,order_items:[],user:DataItem.get_new(DataType.USER,0)})};
			let order_parent_item_query = { $or: [] };
			let order_sub_item_query = { $or: [] };
			let error = null;
			let order_sub_items = [];
			option = option ? option : {get_payment:true};
			async.series([
				//get_order
				async function(call){
					let filter = { order_number: order_number };
					const [biz_error,biz_data] = await Portal.get(database,DataType.ORDER,order_number,{filter:filter});
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.USER,data.order.user_id);
					data.order.user=biz_data;
				},
				//get_order_items
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						let filter = { order_number:order_number };
						let search = App_Logic.get_search(DataType.ORDER_ITEM,filter,{},1,0);
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
							query_field[Type.FIELD_ID] = { $regex:String(order_item.parent_id), $options: "i" };
							order_parent_item_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(data.order.parent_data_type,order_parent_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order.order_items.forEach(order_item => {
								order_item.parent_item = biz_data.items.find(item_find => item_find.id === order_item.parent_id) ? biz_data.items.find(item_find => item_find.id === order_item.parent_id):App_Logic.get_not_found(order_item.parent_data_type,order_item.parent_id);
							});
						}
					}
				},
				//get_order_sub_items
				async function(call){
					if(!Str.check_is_null(data.order.id)){
						let filter = { order_number: { $regex:String(order_number), $options: "i" } };
						let search = App_Logic.get_search(DataType.ORDER_SUB_ITEM,filter,{},1,0);
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
							query_field['id'] = { $regex:String(order_sub_item.parent_id), $options: "i" };
							order_sub_item_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(DataType.PRODUCT,order_sub_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							order_sub_items.forEach(order_sub_item => {
								order_sub_item.parent_item = biz_data.items.find(item_find => item_find.id === order_sub_item.parent_id) ? biz_data.items.find(item_find => item_find.id === order_sub_item.parent_id):App_Logic.get_not_found(order_sub_item.parent_data_type,order_sub_item.parent_id);
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
						let search = App_Logic.get_search(DataType.ORDER_PAYMENT,filter,sort_order,1,0);
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
			option = option ? option : {post_stat:false};
			data.cart = DataItem.get_new(DataType.CART,cart.id,{cart_number:cart.cart_number,parent_data_type:cart.parent_data_type,user_id:cart.user_id,grand_total: 0});
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
					const [biz_error,biz_data] = await Portal.post(database,DataType.CART,data.cart);
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
							let post_cart_item = DataItem.get_new(DataType.CART_ITEM,0);
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
								let post_cart_sub_item = DataItem.get_new(DataType.CART_SUB_ITEM,0);
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
						let post_cart_stat = Stat_Logic.get_new(DataType.CART,cart.id,Type.STAT_CART,data.cart.user_id,cart);
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
							let post_cart_item_stat = Stat_Logic.get_new(DataType.CART_ITEM,cart_item.id,Type.STAT_CART_ITEM,cart.user_id,cart_item);
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
								let post_cart_sub_item_stat = Stat_Logic.get_new(DataType.CART_SUB_ITEM,cart_sub_item.id,Type.STAT_CART_SUB_ITEM,cart.user_id,cart_sub_item);
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
			let data = {cart:DataItem.get_new(DataType.CART,0,{cart_number:cart_number,cart_items:[],user:DataItem.get_new(DataType.USER,0)})};
			let cart_parent_item_query = { $or: [] };
			let cart_sub_item_query = { $or: [] };
			let error = null;
			let cart_sub_items = [];
			async.series([
				//get_cart
				async function(call){
					let filter = { cart_number:cart_number };
					const [biz_error,biz_data] = await Portal.get(database,DataType.CART,cart_number,{filter:filter});
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.USER,data.cart.user_id);
					data.cart.user=biz_data;
				},
				//get_cart_items
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						let filter = { cart_number:cart_number };
						let search = App_Logic.get_search(DataType.CART_ITEM,filter,{},1,0);
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
							query_field[Type.FIELD_ID] = { $regex:String(cart_item.parent_id), $options: "i" };
							cart_parent_item_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(data.cart.parent_data_type,cart_parent_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart.cart_items.forEach(cart_item => {
								cart_item.parent_item = biz_data.items.find(item_find => item_find.id === cart_item.parent_id) ? biz_data.items.find(item_find => item_find.id === cart_item.parent_id):App_Logic.get_not_found(cart_item.parent_data_type,cart_item.parent_id);
							});
						}
					}
				},
				//get_cart_sub_items
				async function(call){
					if(!Str.check_is_null(data.cart.id)){
						let filter = { cart_number: cart_number };
						let search = App_Logic.get_search(DataType.CART_SUB_ITEM,filter,{},1,0);
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
							query_field[Type.FIELD_ID] = { $regex:String(cart_sub_item.parent_id), $options: "i" };
							cart_sub_item_query.$or.push(query_field);
						});
						let search = App_Logic.get_search(DataType.PRODUCT,cart_sub_item_query,{},1,0);
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							cart_sub_items.forEach(cart_sub_item => {
								cart_sub_item.parent_item = biz_data.items.find(item_find => item_find.id === cart_sub_item.parent_id) ? biz_data.items.find(item_find => item_find.id === cart_sub_item.parent_id):App_Logic.get_not_found(cart_sub_item.parent_data_type,cart_sub_item.parent_id);
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
			option = option ? option : {get_image:false};
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.PRODUCT,products:[]};
			let error = null;
			option = option ? option : {get_image:false};
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
			let data = {parent_item:DataItem.get_new(parent_data_type,parent_id),review:DataItem.get_new(DataType.REVIEW,0)};
			let review = Review_Logic.get_new(parent_data_type,parent_id,user_id,post_review.title,post_review.comment,post_review.rating);
			option = option ? option : {post_stat:false,user_id:0};
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
				//post-review-stat
				async function(call){
					if(option.post_stat && data.parent_item.id){
						let post_stat = Stat_Logic.get_new(DataType.REVIEW,data.review.id,Type.STAT_REVIEW,user_id,data.review);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.REVIEW,reviews:[]};
			let error = null;
			option = option ? option : {get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.REVIEW,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.REVIEW;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
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
					let search = App_Logic.get_search(DataType.REVIEW,query,sort_by,page_current,page_size);
					let option = {get_join:true,field_keys:[{foreign_data_type:parent_data_type,foreign_field:'id',item_field:'product',title:'parent_item'}],get_user:true};
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.option = option;
						data.data_type=biz_data.data_type;
						data.item_count=biz_data.item_count;
						data.page_count=biz_data.page_count;
						data.filter=biz_data.filter;
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
						if(Str.check_is_null(data.user.id) && biz_data.items.length<=0){
							data.email_resultOK = true;
						}else if(biz_data.items.length>0){
							if(data.user.id == biz_data.items[0].id){
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
						if(Str.check_is_null(data.user.id) && biz_data.items.length<=0){
							data.title_resultOK = true;
						}else if(biz_data.items.length>0){
							if(data.user.id == biz_data.items[0].id){
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
						if(biz_data<=0){
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
						if(biz_data<=0){
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
						let post_stat = Stat_Logic.get_new(DataType.USER,data.user.id,Type.STAT_REGISTER,data.user.id,data.stat);
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
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
			option = option ? option :{post_stat:true,post_ip_address:false,post_device:false,post_ip:false};
			async.series([
				//check email,password
				async function(call){
					let search = App_Logic.get_search(DataType.USER,{email:data.user.email,password:data.user.password},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data.items.length>0){
							data.user = biz_data.items[0];
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
						let post_stat = Stat_Logic.get_new(DataType.USER,data.user.id,Type.STAT_LOGIN,data.user.id,data.stat);
						let option = {post_unique:false};
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
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
	//9_favorite_get
	static get = (database,parent_data_type,parent_id,user_id) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			data.is_favorite = false;
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = App_Logic.get_search(DataType.FAVORITE,favorite_filter,{},1,0);
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
			data.unique_resultOK = false;
			data.favorite_add_resultOK = false;
			let favorite = Favorite_Logic.get_new(parent_data_type,parent_id,user_id);
			async.series([
				async function(call){
					let favorite_filter = Favorite_Logic.get_search_filter(parent_data_type,parent_id,user_id);
					let search = App_Logic.get_search(DataType.FAVORITE,favorite_filter,{},1,0);
					const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
					if(biz_error){
						error=Log.append(biz_error,error);
					}else{
						if(biz_data<=0){
							data.unique_resultOK = true;
						}
					}
				},
				async function(call){
					data.unique_resultOK = true;

					if(data.unique_resultOK){
						const [biz_error,biz_data] = await Portal.post(database,DataType.FAVORITE,favorite);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.favorite = biz_data;
							data.favorite_add_resultOK = true;
						}
					}
				},
				//post-favorite-stat
				async function(call){
					if(data.unique_resultOK){
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
				callback([error,data.favorite_add_resultOK]);
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
					let search = App_Logic.get_search(DataType.FAVORITE,favorite_filter,{},1,0);
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
	//9_portal_demo / required / type_logic.types
	static demo_post = (database,data_type,types) => {
		return new Promise((callback) => {
			let data = {resultOK:false};
			let error = null;
			async.series([
				//types
				async function(call){
					let post_types = [];
					for(const item of types) {
						post_types.push(Demo_Logic.get_new_type(item.title));
					};
					const [biz_error,biz_data] = await Portal.post_bulk(database,DataType.TYPE,post_types);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
					}
				},
				//categorys
				async function(call){
					let post_categorys = [];
					for(const item of types) {
						for(const cat_item of item.categorys) {
							post_categorys.push(Category_Logic.get_new(cat_item.title,cat_item.type,cat_item.category));
						};
					};
					if(post_categorys.length>0){
						const [biz_error,biz_data] = await Portal.post_bulk(database,DataType.CATEGORY,post_categorys);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.categorys = biz_data;
							data.resultOK = true;
						}
					}
				},
				//items
				async function(call){
					let post_items = [];
					for(const item of types) {
						if(!item.categorys){
							item.categorys=[];
						}
						for(const cat_item of item.categorys) {
							if(!cat_item.items){
								cat_item.items = [];
							}
							for(const item of cat_item.items) {
								post_items.push(item);
							};
						};
					};
					if(post_items.length>0){
						const [biz_error,biz_data] = await Portal.post_bulk(database,data_type,post_items);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.items = biz_data;
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
	static get = async(database,data_type,key,option) => {
		/* Options
		 * Fields
		   - get_field / type. bool / ex. true,false / default. false
		   - fields / type. string / ex. field1,field2 / default. throw error / notez. id must by type tbl_id
		   - delete_cache / type. bool / ex. true,false / default. false
		   - get_field_value / type. bool / ex. true,false / default. false
		 *  Join
			- get_join / type. bool / ex. true,false / default. false
			-- field_keys / type. obj items / ex. [
					{
						foreign_data_type:DataType.PRODUCT,
						foreign_field:'id',
						parent_field:'parent_id',
						title:'field_title',
						type:items,count
					}];
			-- make_flat / type. bool / true,false items / ex. true
		 * Photos
		   - get_image / bool / ex. true,false / def. true
		   - image_count / int / ex. 1-999 / def. 19
		   - image_sort_by / query obj / ex. {date_create:1}
		 * Favorite
		   - get_favorite / bool / ex. true,false / def. true
		   - user_id / bool / ex. true,false / def. true
		   - favorite_parent_id / id / ex. 123 / def. error
		   - favorite_parent_data_type / DataType / ex. DataType.PRODUCT / def. error
		 * Favorite
		   - get_favorite / bool / ex. true,false / def. true
	 	 * Group
		   - get_group / bool / ex. true,false / def. true
		   -- get_group_image / bool / ex. true,false / def. true
		   --
		 * Stat
		   - post_stat / bool / ex. true,false / def. true
		   - user_id / id / ex. 123 / def. error
		 * get_user / type. bool / ex. true,false / default. false
		   - user_fields / type. string / ex. field1,field2 / default. empty
			 - make_user_flat / type. bool / ex. true,false / default. false
			 */
		return new Promise((callback) => {
			let error = null;
			let data = DataItem.get_new(data_type,0,{key:key?key:Type.TITLE_BLANK});
			let stat_view = DataItem.get_new(DataType.STAT,0,{resultOK:false});
			//option = option ? option : {get_image:false,get_field:false,post_stat:false,user_id:0};
			option = option ? option : {};
			option.get_field = option.fields ? true : false;
			async.series([
				function(call){
					if(!Str.check_is_guid(key) && !Number.isInteger(key) && key){
						option.title_url = key.toLowerCase();
						key = key.toLowerCase();
					}
					call();
				},
				//delete_cache_item
				async function(call){
					if(option.delete_cache && Str.check_is_guid(key)){
						const [biz_error,biz_data] = await Portal.delete_cache(database,data_type,key);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							//data.delete_cache_item = biz_data;
						}
					}
				},
				//get_item_by_id
				function(call){
					Data.get(database,data_type,key,option).then(([biz_error,biz_data,option])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(!Str.check_is_null(biz_data.id)){
								data = biz_data;
							}else{
								data = data_type != DataType.USER ? App_Logic.get_not_found(data_type,key) : App_Logic.get_not_found(DataType.USER,key);
							}
						}
						call();
					}).catch(err => {
						Log.error("ERROR-PORTAL-GET-1",err);
						error = Log.append(error,err);
						call();
					});
				},
				//get_item_image
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
						if(biz_data.items.length > 0){
							data.images = biz_data.items;
						}
					}
				},
				//get_item_user
				async function(call){
					if(option.get_user && data.id){
						const [biz_error,biz_data] = await Portal.get(database,DataType.USER,data.user_id);
						if(biz_error){
							error=Log.append(biz_error,error);
						}else{
							if(!option.make_user_flat){
								data.user = biz_data;
							}else{
								for(const prop in biz_data) {
									data["user_"+prop] = biz_data[prop];
								}
							}
						}
					}
				},
				//get_item_favorite
				async function(call){
					if(option.get_favorite && data.id){
						data.is_favorite = false;
						const [biz_error,biz_data] = await Favorite_Data.get(database,data.data_type,data.id,option.user_id);
						if(biz_error){
							error=Log.append(biz_error,error);
						}else{
							if(biz_data==true){
								data.is_favorite = true;
							}
						}
					}
				},
				//get_item_field_values
				async function(call){
					if(option.get_field_value && data.id){
						data = Field_Logic.get_item_field_values(data);
					}
				},
				//get_join
				async function(call){
					if(option.get_join && data.id){
						option.foreEach(item => {
							parent_search_items.push({
								foreign_data_type : item.foreign_data_type,
								foreign_field : item.foreign_field,
								parent_field : item.parent_field,
								title : item.title,
								fields : item.fields ? item.fields : "",
								make_flat : item.make_flat ? item.make_flat : false,
								type : item.type ? item.type : Type.ITEMS,
								data : [],
							});
						});
						for(const parent_search_item of parent_search_items){
							let join_option = parent_search_item.fields ? {get_field:true,fields:parent_search_item.fields} : {};
							if(parent_search_item.type == Type.TITLE_ITEMS){
								let query = {};
								query[parent_search_item.foreign_field] = data[parent_search_item.parent_field];
								let search = App_Logic.get_search(parent_search_item.foreign_data_type,query,{},1,0);
								const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
								if(biz_error){
									error=Log.append(error,biz_error);
								}else{
									data[parent_search_item.title] = biz_data.items;
								}
							}else if(parent_search_item.type == Type.TITLE_COUNT){
								let query = {};
								query[parent_search_item.foreign_field] = data[parent_search_item.parent_field];
								let search = App_Logic.get_search(parent_search_item.foreign_data_type,query,{},1,0);
								const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
								if(biz_error){
									error=Log.append(error,biz_error);
								}else{
									data[parent_search_item.title] = biz_data;
								}
							}
						}
					}
				},
				//get_group -- groups
				async function(call){
					if(option.get_group && data.id){
						data.groups = [];
						let group_option = {};
						let query = {};
						if(!option.group){
							query = {parent_id:data.id}
						}else{
							let group_titles = option.group ? option.group.split(','):[];
							query = { $or: [] };
							group_titles.foreach(item => {
								let query_field = {};
								query_field[Type.FIELD_TITLE] = { $regex:String(item), $options: "i" };
								query.$or.push(query_field);
							});

						}
						console.log('aaaaaaaaaaa');
						let group_search = App_Logic.get_search(DataType.GROUP,query,{},1,0);
						console.log('bbbbbbbbbbbbbb');
						const [biz_error,biz_data] = await Portal.search(database,group_search.data_type,group_search.filter,group_search.sort_by,group_search.page_current,group_search.page_size,group_option);
						console.log('cccccccccc');
						if(biz_data.items.length> 0){
							console.log('dddddddd');
							data.groups = biz_data.items;
							console.log('eeeeeeeee');
							console.log(data);
							for(const group of biz_data.items){
								data[Str.get_title_url(group.title)] = group;
							}
						}
					}
				},
				//post-view-stat
				async function(call){
					if(option.post_stat && data.id){
						let post_stat_view = Stat_Logic.get_new(data.data_type,data.id,Type.STAT_VIEW,option.user_id,data);
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat_view,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							stat_view = biz_data;
						}
					}
				},
				//item-update-view-count
				async function(call){
					if(option.post_stat && data.id && stat_view.resultOK){
						data.view_count = parseInt(data.view_count) + 1  ? data.view_count : 1;
						let item_update = DataItem.get_new(data.data_type,data.id,{view_count:data.view_count ? parseInt(data.view_count) + 1 : 1});
						const [biz_error,biz_data] = await Portal.post(database,data.data_type,item_update);
						if(biz_error){
							error=Log.append(biz_error,error);
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
					let search = App_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					Data.get_items(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.data_type=data_type;
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
				//get_image
				async function(call){
					if(option.get_join && data.items.length>0){
						let query = { $or: [] };
						for(const data_item of data.items){
							let query_field = {};
							query_field[Type.FIELD_PARENT_ID] = { $regex:String(data_item.id), $options: "i" };
							query.$or.push(query_field);
						};
						let search = App_Logic.get_search(DataTyp.IMAGE,query,{},1,0);
						const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
						data.items.forEach(data_a =>{
							data_a.images = [];
							data.items.forEach(data_b =>{
								if(data_b.parent_id == data_a.id){
									data_a.images.push(data_b);
								}
							});
						});
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
		/* Options
		 * Distinct
		   - get_distinct / type. bool / ex. true,false / default. false
		   - distinct_field / type. string / ex. field1 / default. throw error
		   - distinct_sort / type. string / ex. asc,desc / default. asc
		 * Fields
		   - fields / type. string / ex. field1,field2 / default. throw error
		 * Photos
			- get_image / type. bool / ex. true,false / default. false
			- image_count / type. int / ex. 1-999 / default. 19
			- image_sort_by / type. {} / ex. {date_create:1} / default. {}
		 *  Count
			- get_count / type. bool / ex. true,false / default. false
			  - count_data_type / type. string / ex. PRODUCT / default. throw error
			  - count_field / type. number / ex. category /  default. throw error
			  - count_value / type. string / ex. title / default. throw error
		 *  Join
			- get_join / type. bool / ex. true,false / default. false
				- field_keys / type. obj items / ex. [
					{
						foreign_data_type:DataType.PRODUCT,
						foreign_field:'id',
						parent_field:'parent_id',
						title:'field_title',
						fields:'id,title,title_url',
						type:obj,items,count,
						get_image:false
					}]
		 * User
		 - get_user / type. bool / ex. true,false / default. false
		   - user_fields / type. string / ex. field1,field2 / default. empty
			 - make_user_flat / type. bool / ex. true,false / default. false
	 	 *  Group
			- get_group / type. bool / ex. true,false / default. false
				- group / type. obj items / ex. [
					{
						title:'group_title',
					}]

		 * Return
			- data_type
			- item_count
			- page_count
			- filter
			- items
			*/
		return new Promise((callback) => {
			let data = {data_type:data_type,item_count:0,page_count:1,filter:{},items:[]};
			let error=null;
			let parent_search_items = [];
			let groups = [];
			option = option ? option : {};
			async.series([
				//get items
				function(call){
					let search = App_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					Data.get_items(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.data_type=data_type;
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
				//get distinct
				function(call){
					if(option.get_distinct && data.items.length>0){
						data.items = data.items.filter((obj, index, self) =>
							index === self.findIndex((t) => t[option.distinct_field] === obj[option.distinct_field])
						);
						let distinct_sort_by = option.distinct_sort ? option.distinct_sort : Type.TITLE_SORT_BY_ASC;
						data.items = Obj.sort_list_by_field(data.items,Type.FIELD_TITLE,distinct_sort_by);
						call();
					}
					else{
						call();
					}
				},
				//get_image
				async function(call){
					if(option.get_join && data.items.length>0){
						let query = { $or: [] };
						for(const data_item of data.items){
							let query_field = {};
							query_field[Type.FIELD_PARENT_ID] = { $regex:String(data_item.id), $options: "i" };
							query.$or.push(query_field);
						};
						let search = App_Logic.get_search(DataType.IMAGE,query,{},1,0);
						const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);

						data.items.forEach(data_a =>{
							data_a.images = [];
							data.items.forEach(data_b =>{
								if(data_b.parent_id == data_a.id){
									data_a.images.push(data_b);
								}
							});
						});
					}
				},
				//get_join
				function(call){
					if(option.get_join && data.items.length>0){
							option.field_keys.forEach(option_item =>{
									data.items.forEach(data_item =>{
										parent_search_items.push({
											foreign_data_type : option_item.foreign_data_type,
											foreign_field : option_item.foreign_field,
											parent_value : data_item[option_item.parent_field],
											parent_field : option_item.parent_field,
											title : option_item.title,
											fields : option_item.fields ? option_item.fields : "",
											make_flat : option_item.make_flat ? option_item.make_flat : false,
											type : option_item.type ? option_item.type : Type.TITLE_OBJ,
											get_image : option_item.get_image ? option_item.get_image : false,
											items : []
										});
									});
							});
							call();
					}else{
						call();
					}
				},
				//get_join
				async function(call){
					if(option.get_join && data.items.length>0){
						for(const parent_search_item of parent_search_items){
							let query = { $or: [] };
							for(const data_item of data.items){
								let query_field = {};
								query_field[parent_search_item.foreign_field] = { $regex:String(parent_search_item.parent_value), $options: "i" };
								query.$or.push(query_field);
							};
							let search = App_Logic.get_search(parent_search_item.foreign_data_type,query,{},1,0);
							let join_option = parent_search_item.fields ? {get_field:true,fields:parent_search_item.fields} : {};
							join_option.get_image = parent_search_item.get_image;
							const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								parent_search_item.items = biz_data.items;
								if(parent_search_items.length> 0){
									for(const parent_search_item of parent_search_items){
										for(const data_item of data.items){
											if(parent_search_item.type == Type.TITLE_ITEMS){
												let query = {};
												query[parent_search_item.foreign_field] = data_item[parent_search_item.parent_field];
												let search = App_Logic.get_search(parent_search_item.foreign_data_type,query,{},1,0);
												const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,join_option);
												data_item[parent_search_item.title] = [];
												if(biz_error){
													error=Log.append(error,biz_error);
												}else{
													for(const sub_data_item of biz_data.items){
														data_item[parent_search_item.title].push(sub_data_item);
													}
												}
											}else if(parent_search_item.type == Type.TITLE_COUNT){
												let query = {};
												query[parent_search_item.foreign_field] = data_item[parent_search_item.parent_field];
												let search = App_Logic.get_search(parent_search_item.foreign_data_type,query,{},1,0);
												const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
												if(biz_error){
													error=Log.append(error,biz_error);
												}else{
													data_item[parent_search_item.title] = biz_data;
												}
											}
										}
									}
								}
							}
						}
					}
				},
				//get_group
				function(call){
					if(option.get_group && data.items.length>0){
						call();
					}else{
						call();
					}
				},
				//get_groups
				async function(call){
					if(option.get_group && data.items.length>0){
						let group_titles = option.group ? option.group.split(','):[];
						let query = { $or: [] };
						if(group_titles.length<=0){
							data.items.forEach(item =>{
									parent_search_items.push({
									foreign_data_type : DataType.GROUP,
									foreign_field : Type.FIELD_PARENT_ID,
									parent_value : item[Type.FIELD_ID],
									parent_field : Type.FIELD_ID,
									title : null,
									type :  Type.TITLE_ITEMS,
									items : []
								});
							});
							for(const parent_search_item of parent_search_items){
								let query_field = {};
								query_field[parent_search_item.foreign_field] = { $regex:String(parent_search_item.parent_value), $options: "i" };
								query.$or.push(query_field);
							}
						}else{
							group_titles.forEach(item =>{
								let query_field = {};
								query_field['title'] = { $regex:String(item), $options: "i" };
								query.$or.push(query_field);
							});
						}
						let search = App_Logic.get_search(DataType.GROUP,query,{},1,0);
						const [biz_error,biz_data] = await Portal.search_simple(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
						groups = biz_data.items;
					}
				},
				//get_group_bind
				async function(call){
					if(option.get_group && data.items.length>0){
						data.items.forEach(data_item =>{
							groups.forEach(group =>{
								if(data_item.id ==  group.parent_id){
									data_item.groups.push(group);
								}
							});
						});
					}
				},
				//get_user
				async function(call){
					if(option.get_user && data.items.length>0){
						let query = { $or: [] };
						data.items.forEach(item => {
							let query_field = {};
							query_field[Type.FIELD_ID] = { $regex:String(item[Type.FIELD_USER_ID]), $options: "i" };
							query.$or.push(query_field);
						});
						let search = App_Logic.get_search(DataType.USER,query,{},1,0);
						let user_option = option.user_fields ? {get_field:true,fields:option.user_fields? option.user_fields:""} : {};
						const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,user_option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(data.items.length> 0){
								data.items.forEach(item => {
									if(option.make_user_flat){
										let user = biz_data.items.find(item_find => item_find.id === item.user_id) ? biz_data.items.find(item_find => item_find.id === item.user_id):App_Logic.get_not_found(DataType.USER,item.user_id);
										for (const prop in user) {
											item["user_"+prop] = user[prop];
										}
									}else{
										item.user = biz_data.items.find(item_find => item_find.id === item.user_id) ? biz_data.items.find(item_find => item_find.id === item.user_id):App_Logic.get_not_found(DataType.USER,item.user_id);
									}

								});
							}
						}
					}
				},
				//get favorite
				async function(call){
					if(option.get_favorite && data.items.length>0){
						let query = { $or:[] };
						data.items.forEach(item => {
							let query_field = {$or:[],$and:[]};
							query_field.$or.push({parent_id:item.id});
							query_field.$and.push({user_id:option.user_id});
							query.$or.push(query_field);
						});
						let favorite_match_search = App_Logic.get_search(DataType.FAVORITE,query,{},1,0);
						let favorite_match_option =  {get_field:false,fields:'id,user_id,parent_id,parent_data_type'};
						const [biz_error,biz_data] = await Portal.search(database,
							favorite_match_search.data_type,
							favorite_match_search.filter,
							favorite_match_search.sort_by,
							favorite_match_search.page_current,
							favorite_match_search.page_size,
							favorite_match_option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(data.items.length> 0){
								data.items.forEach(item => {
									item.is_favorite = biz_data.items.find(item_find => item_find.parent_id === item.id && item_find.user_id == option.user_id) ? true:false
								});
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
	static post = async (database,data_type,item,option) => {
		/* option params
		 * Fields
		   - overwrite_data / type. bool / ex. true,false / default. false -- post brand new obj.deleteing old.
		   - get_update_data / type. bool / ex. true,false / default. false -- get update item aka recently saved item.
		   */
		return new Promise((callback) => {
			let error = null;
			let data = DataItem.get_new(data_type,0);
			option = option ? option : {}; //get_item:false,get_image:false,post_stat:false,user_id:0,stat_type:null,delete_cache:false
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
				//delete cache item
				async function(call){
					if(option.overwrite_data){
						const [biz_error,biz_data] = await Portal.delete_cache(database,data_type,item.id);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							//data.delete_cache_item = biz_data;
						}
					}
				},
				//get_save_data
				async function(call){
					if(option.get_update_data && data.id){
						const [biz_error,biz_data] = await Portal.get(database,data_type,item.id,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
						}
					}
				},
				async function(call){
					if(option.post_stat){
						let post_stat = Stat_Logic.get_new(data_type,item.id,option.stat_type,option.user_id,item);
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							//data.stat = biz_data;
						}
						//data.stat.resultOK = resultOK;
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
			let data = DataItem.get_new(data_type,0);
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
			let data = {};
			option = option ? option : {get_image:false};
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
			option = option ? option : {delete_resultOK:false,get_image:false,delete_item:true,delete_item_filter:{},delete_image:true,delete_group:true,delete_image_filter:{}};
			async.series([
				function(call){
					Data.delete(database,data_type,id).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.data = biz_data;
							data.delete_resultOK = true;
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
						let filter = {parent_id:id};
						data.delete_items_resultOK = false;
						Data.delete_items(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_items_resultOK = true;
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
					if(option.delete_group){
						let data_type = DataType.GROUP;
						let filter = {parent_id:id};
						data.delete_items_resultOK = false;
						Data.delete_items(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_items_resultOK = true;
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
						let filter = {parent_id:id};
						data.delete_image_resultOK = false;
						Data.delete_items(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_image_resultOK = true;
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
	//9_portal_post_items - 9_post_items
	static post_items = async (database,data_items) => {
		/* option params
		 * n/a
		 */
		return new Promise((callback) => {
			let error = null;
			let items = [];
			async.series([
				function(call){
					Data.post_items(database,data_items).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							items = biz_data;
						}
						call();
					}).catch(err => {
						error = Log.append(error,err);
						call();
					});
				},
			]).then(result => {
				callback([error,items]);
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
			let data = {delete_resultOK:false,delete_items_resultOK:false,delete_image_resultOK:false};
			option = option ? option : {delete_resultOK:false,get_image:false,delete_item:false,delete_item_filter:{},delete_image_resultOK:false,delete_image_filter:{}};
			async.series([
				//delete_items
				function(call){
					Data.delete_items(database,data_type,filter).then(([biz_error,biz_data])=> {
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
							data.delete_resultOK = true;
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
						data.delete_items_resultOK = false;
						Data.delete_items(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_items_resultOK = true;
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
						data.delete_image_resultOK = false;
						Data.delete_items(database,data_type,filter).then(([biz_error,biz_data])=> {
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.delete_image_resultOK = true;
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
			let data = DataItem.get_new(data_type,id);
			let top_data = DataItem.get_new(data_type,0);
			let copy_data = DataItem.get_new(data_type,0);
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
						copy_data = App_Logic.get_not_found(data_type,id);
					}
				},
				async function(call){
					if(top_data.id && top_data.groups.length > 0){
						copy_data.groups = [];
						let post_groups = [];
						for(const group of top_data.groups){
							let copy_group = Item_Logic.copy(DataType.GROUP,group);
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
			let data = {faq:DataItem.get_new(DataType.FAQ,0)};
			let questions = [];
			let error = null;
			option = option ? option : {question_count:19};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.FAQ,key,option);
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
			let data = {};
			let error = null;
			option = option ? option : {post_unique:false};
			let resultOK = true;
			data.stat = DataItem.get_new(DataType.STAT,stat.id,{parent_data_type:stat.parent_data_type,user_id:stat.user_id});
			async.series([
				async function(call){
					for(const key in stat) {
						if(Str.check_is_null(data.stat[key])){
							data.stat[key] = stat[key];
						}
					}
				},
				//get - stat
				async function(call){
					if(option.post_unique){
						const todayEnd = dayjs();
						const todayStart = todayEnd.subtract(1, 'day')
						let query_field = {$and:[]};
						query_field.$and.push({parent_id:stat.parent_id});
						query_field.$and.push({user_id:stat.user_id});
						query_field.$and.push({ date_create: {$gte: todayStart.toISOString(),$lte: todayEnd.toISOString()}});
						let search = App_Logic.get_search(DataType.STAT,query_field,{},1,0);
						const [biz_error,biz_data] = await Portal.count(database,search.data_type,search.filter);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(biz_data>=1){
								resultOK = false;
							}
						}
					}
				},
				//post - stat
				async function(call){
					if(resultOK){
						const [biz_error,biz_data] = await Portal.post(database,DataType.STAT,data.stat);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.stat = biz_data;
						}
					}
					data.stat.resultOK = resultOK;
				},
			]).then(result => {
				callback([error,data.stat]);
			}).catch(err => {
				Log.error("StatData-Stat-Update",err);
				callback([error,[]]);
			});
		});
	};
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
						data.stats = biz_data.items;
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
	static post_items = async (db_connect,items) => {
		return [error,data] = await post_item_list_adapter(db_connect,items);
	};
	static post_bulk = async (db_connect,data_type,items) => {
		return [error,data] = await post_bulk_adapter(db_connect,data_type,items);
	};
	static get_items = async (db_connect,data_type,filter,sort_by,page_current,page_size,option) => {
		const [error,data,item_count,page_count] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size,option);
		return [error,data,item_count,page_count];
	};
	static delete_items = async (db_connect,data_type,filter) => {
		return [error,items] = await delete_item_list_adapter(db_connect,data_type,filter);
	};
	static count_items = async (db_connect,data_type,filter) => {
		return [error,data] = await get_count_item_list_adapter(db_connect,data_type,filter);
	};
}
class Service_Data {
	//9_service_get
	static get = async (database,key,option) => {
		return new Promise((callback) => {
			let service = DataItem.get_new(DataType.SERVICE,0);
			let error = null;
			option = option ? option : {get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.get(database,DataType.SERVICE,key,option);
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
			let data = {item_count:0,page_count:1,filter:{},data_type:DataType.SERVICE,services:[]};
			let error = null;
			option = option ? option : {get_image:false};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,DataType.SERVICE,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.data_type = DataType.SERVICE;
						data.page_count = biz_data.page_count;
						data.filter = biz_data.filter;
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
			let data = DataItem.get_new(DataType.BLANK,0);
			data.test_resultOK = false;
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.post(database,DataType.BLANK,{});
				},
				async function(call){
					let post_stat_login = Stat_Logic.get_new(DataType.USER,data.user.id,Type.STAT_LOGIN,data.user.id,data.stat);
					let option = {post_unique:false};
					const [biz_error,biz_data] = await Stat_Data.post(database,post_stat_login,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.stat_login = biz_data;
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
