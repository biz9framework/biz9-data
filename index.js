/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const dayjs = require('dayjs');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Type,Favorite_Logic,Stat_Logic,Review_Logic,Data_Logic,Product_Logic,Demo_Logic,Category_Logic,Cart_Logic,Order_Logic,Field_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/source");
const {get_cache} = require('./redis/base.js');
const {Foreign} = require('./foreign.js');
const {Group} = require('./group.js');
const {Join} = require('./join.js');
const {get_database_adapter,check_database_adapter,delete_database_adapter,post_item_adapter,post_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,get_count_item_list_adapter,delete_item_cache }  = require('./adapter.js');
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
			option = !Obj.check_is_empty(option) ? option : {biz9_config_file:null,app_id:null};
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
			get_database_adapter(data_config).then(([biz_error,biz_data])=>{
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					biz_data.data_config=data_config;
					biz_data.app_id=data_config.APP_ID;
					callback([error,biz_data]);
				}
			}).catch(err => {
				Log.error('Data-Database-Get',err);
				error=Log.append(error,err);
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
			delete_database_adapter(data_config).then(([biz_error,biz_data])=>{
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					biz_data.data_config=data_config;
					biz_data.app_id=data_config.APP_ID;
					callback([err,null]);
				}
			}).catch(err => {
				Log.error('Data-Db-Delete',err);
				error=Log.append(error,err);
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
			option = !Obj.check_is_empty(option) ? option : {};
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
class Order_Data {
	//9_order_post
	// -- ORDER-POST-START -- //
	// - Order_Logic.get(cart);
	// -- ORDER-POST-END -- //

	static post = async (database,order,order_payments,option) => {
		return new Promise((callback) => {
			let error = null;
			let cache = {};
			let data = {};
			option = !Obj.check_is_empty(option)  ? option : {};
			data.order = Data_Logic.get(Type.DATA_ORDER,0,{data:{order_number:order.order_number,cart_number:order.cart_number,user_id:order.user_id,grand_total:order.grand_total}});
			data.order_items = [];
			data.order_sub_items = [];
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				//post - order
				function(call){
					for(const key in order) {
						if(!Obj.check_is_array(order[key]) && Obj.check_is_object(order[key])
							&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
							&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
							&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE)
						{
							data.order[key] = order[key];
						}
					}
					data.order[Type.FIELD_GRAND_TOTAL] = Order_Logic.get_total(order).grand_total;
					post_item_adapter(database,cache,Type.DATA_ORDER,data.order).then(([biz_error,biz_data])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order = biz_data;
							call();
						}
					}).catch(err => {
						Log.error('Data-Order-Post',err);
						error=Log.append(error,err);
					});
				},
				//post - order items
				function(call){
					if(order.order_items.length>0){
						for(const order_item of order.order_items){
							let post_order_item = Data_Logic.get(Type.DATA_ORDER_ITEM,0);
							for(const key in order_item){
								order_item.temp_row_id = Num.get_id();
								if(!Obj.check_is_array(order_item[key]) && Obj.check_is_object(order_item[key])
									&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
									&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
									&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE){
									post_order_item[key] = order_item[key];
								}
							}
							post_order_item[Type.FIELD_ORDER_ID] = data.order.id;
							post_order_item[Type.FIELD_ORDER_NUMBER] = data.order.order_number;
							post_order_item.temp_row_id = order_item.temp_row_id;
							data.order_items.push(post_order_item);
						}
						post_item_list_adapter(database,cache,data.order_items).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.order_items = biz_data;
								call();
							}
						}).catch(err => {
							Log.error('Data-Order-Post',err);
							error=Log.append(error,err);
						});
					}
				},
				//post - order sub items
				async function(call){
					if(order.order_items.length>0){
						for(const order_item of order.order_items){
							for(const order_sub_item of order_item.order_sub_items){
								let post_order_sub_item = Data_Logic.get(Type.DATA_ORDER_SUB_ITEM,0);
								for(const key in order_sub_item){
									order_sub_item.temp_row_id = Num.get_id();
									if(!Obj.check_is_array(order_item[key]) && Obj.check_is_object(order_item[key])
										&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
										&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
										&& key != Type.FIELD_DATE_CREATE && key != Type.FILED_DATE_SAVE){
										post_order_sub_item[key] = order_sub_item[key];
									}
								}
								post_order_sub_item[Type.FIELD_ORDER_ITEM_ID]  =data.order_items.find(item_find => item_find.temp_row_id === order_item.temp_row_id).id;
								post_order_sub_item[Type.FIELD_ORDER_ID] = data.order.id;
								post_order_sub_item[Type.FIELD_ORDER_NUMBER] = data.order.order_number;
								data.order_sub_items.push(post_order_sub_item);
							}
						}
						const [biz_error,biz_data] = await post_item_list_adapter(database,cache,data.order_sub_items);
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
						const [biz_error,biz_data] = await post_item_list_adapter(database,cache,order_payments);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order_payments = biz_data;
						}
					}
				},
				/*
				//post_stat_order
				async function(call){
					if(data.order.id && option.post_stat){
						data.stat_order = [];
						let post_order_stat = Stat_Logic.get(Type.DATA_ORDER,order.id,Type.STAT_ORDER,data.order.user_id,order);
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
							let post_order_item_stat = Stat_Logic.get(Type.DATA_ORDER_ITEM,order_item.id,Type.STAT_ORDER_ITEM,order.user_id,order_item);
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
								let post_order_sub_item_stat = Stat_Logic.get(Type.DATA_ORDER_SUB_ITEM,order_sub_item.id,Type.STAT_ORDER_SUB_ITEM,order.user_id,order_sub_item);
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
							let post_order_payment_stat = Stat_Logic.get(Type.DATA_ORDER_PAYMENT,order_payment.id,Type.STAT_ORDER_PAYMENT,order.user_id,order_payment);
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
				*/
				//get - order
				async function(call){
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
	static get = (database,order_number) => {
		return new Promise((callback) => {
			let error = null;
			let cache = {};
			let data = {order:Data_Logic.get(Type.DATA_ORDER,0,{data:{order_number:order_number,order_items:[],user:Data_Logic.get(Type.DATA_USER,0)}})};
			let order_parent_item_query = { $or: [] };
			let order_sub_item_query = { $or: [] };
			let order_sub_items = [];
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				//get_order
				async function(call){
					let foreign_order_item = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_ORDER_ITEM,Type.FIELD_ORDER_ID,Type.FIELD_ID);
					let foreign_user = Data_Logic.get_search_foreign(Type.SEARCH_ONE,Type.DATA_USER,Type.FIELD_ID,Type.FIELD_USER_ID,{title:'user'});
					let order_option = { id_field:Type.FIELD_ORDER_NUMBER,foreigns:[foreign_order_item,foreign_user] };
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_ORDER,order_number,order_option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.order = biz_data;
					}
				},
				//9_foreigns //9_get_foreigns get_order_foreigns
				function(call){
					let foreign_order_sub_item = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_ORDER_SUB_ITEM,Type.FIELD_ORDER_ITEM_ID,Type.FIELD_ID);
					let option_order_sub_item = { foreigns:[foreign_order_sub_item] };
					Foreign.get_data(database,cache,data.order.order_items,option_order_sub_item).then(([biz_error,biz_data])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.order.order_items = biz_data;
							call();
						}
					}).catch(err => {
						Log.error('Data-Portal-Search-Simple-Foreign',err);
						error=Log.append(error,err);
					});
				},
				async function(call){
					data.order = Order_Logic.get_total(data.order);
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
			data.order = Data_Logic.get(Type.DATA_ORDER,id);
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
class Review_Data {
	//9_review_post
	static post = async(database,parent_data_type,parent_id,user_id,post_review,option) => {
		return new Promise((callback) => {
			let error = null;
			let data = {parent_item:Data_Logic.get(parent_data_type,parent_id),review:Data_Logic.get(Type.DATA_REVIEW,0)};
			let review = Review_Logic.get(parent_data_type,parent_id,user_id,post_review.title,post_review.comment,post_review.rating);
			option = !Obj.check_is_empty(option) ? option : {post_stat:false,user_id:0};
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
						let post_stat = Stat_Logic.get(Type.DATA_REVIEW,data.review.id,Type.STAT_REVIEW,user_id,data.review);
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
			option = !Obj.check_is_empty(option)  ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Type.DATA_REVIEW,filter,sort_by,page_current,page_size,option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count = biz_data.item_count;
						data.page_count = biz_data.page_count;
						data.search = biz_data.search;
						data.reviews = biz_data[Type.FIELD_ITEMS];
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
					let query = {parent_id:parent_id,parent_data_type:parent_data_type};
					let search = Data_Logic.get_search(Type.DATA_REVIEW,query,sort_by,page_current,page_size);
					let foreign_user = Data_Logic.get_search_foreign(Type.SEARCH_ONE,Type.DATA_USER,Type.FIELD_ID,Type.FIELD_USER_ID,{title:'user'});
					let option = {foreigns:[foreign_user]};
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);

					/*
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.item_count=biz_data.item_count;
						data.page_count=biz_data.page_count;
						data.search=biz_data.search;
						data.reviews=biz_data[Type.FIELD_ITEMS];
					}
					*/
				},
			]).then(result => {
				//callback([error,data]);
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
			let data = {parent_item:Data_Logic.get(parent_data_type,parent_id),review:Data_Logic.get(Type.DATA_REVIEW,0)};
			let review = Data_Logic.get(Type.DATA_REVIEW,review_id);
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
						if(Str.check_is_null(data.id) && biz_data[Type.FIELD_ITEMS].length<=0){
							data[Type.FIELD_RESULT_OK_EMAIL] = true;
						}else if(biz_data[Type.FIELD_ITEMS].length>0){
							if(data.id == biz_data[Type.FIELD_ITEMS][0].id){
								data[Type.FIELD_RESULT_OK_EMAIL] = true;
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
						if(Str.check_is_null(data.id) && biz_data[Type.FIELD_ITEMS].length<=0){
							data[Type.FIELD_RESULT_OK_TITLE] = true;
						}else if(biz_data[Type.FIELD_ITEMS].length>0){
							if(data.id == biz_data[Type.FIELD_ITEMS][0].id){
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
						data.last_login = DateTime.get();
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
			let stat = Data_Logic.get(Type.DATA_STAT,0);
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
						data.last_login = DateTime.get();
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
						let post_stat = Stat_Logic.get(Type.DATA_USER,data.id,Type.STAT_REGISTER,data.id,data.stat);
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
			option = !Obj.check_is_empty(option) ? option : {};
			async.series([
				//check email,password
				async function(call){
					let search = Data_Logic.get_search(Type.DATA_USER,{email:data.email,password:data.password},{},1,0);
					const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data[Type.FIELD_ITEMS].length>0){
							data = biz_data[Type.FIELD_ITEMS][0];
							data[Type.FIELD_RESULT_OK_USER] = true;
						}
					}
				},
				//post user
				async function(call){
					if(data[Type.FIELD_RESULT_OK_USER]){
						data.last_login = DateTime.get();
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
						let post_stat = Stat_Logic.get(Type.DATA_USER,data.id,Type.STAT_LOGIN,data.id,data.stat);
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
			let favorite = Favorite_Logic.get(parent_data_type,parent_id,user_id);
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
						let post_stat = Stat_Logic.get(parent_data_type,parent_id,Type.STAT_FAVORITE,user_id,data.favorite);
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
		 * Cache
		   - cache_delete / type. bool / ex. true/false / default. false
		 * Fields
		   - field / type. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
		 * Sub Values ( Page Edit )
		   - sub_value / type. bool / ex. true/false / default. throw error
		 *  Group
			-- groups / type. obj. group_search / ex. [
					{
						type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,
						field:{field_show_1:1,field_hide_2:0},
						title:{group_show_1:1,group_hide_2:0},
						page_current:1,
						page_size:0,
					}];
		 *  Foreign
			-- foreigns / type. obj. foreign_search / ex. [
					{
						type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,
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
						type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE
						search:search_obj,
						title:'field_title',
						page_current:1,
						page_size:0
					}];
		   --
		 * Stat
			-- stat / type. obj / ex. [
					{
						user_id:123,
						type:Type.STAT_VIEW,
						unique:true/false,
						print:true/false
					};
					*/
		return new Promise((callback) => {
			let error= null;
			let cache = {};
			let data = Data_Logic.get(data_type,0);
			let field_result_ok = false;
			option = !Obj.check_is_empty(option) ? option : {};
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				function(call){
					if(option.cache_delete){
						delete_item_cache(database,cache,data.data_type,data.id,option).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								call();
							}
						}).catch(err => {
							Log.error('Data-Portal-Delete-Cache',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				//item_by_id
				function(call){
					get_item_adapter(database,cache,data_type,id,option).then(([biz_error,biz_data])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
							call();
						}
					}).catch(err => {
						Log.error('Data-Portal-Get',err);
						error=Log.append(error,err);
					});
				},
				//9_get_item_join 9_join get_item
				function(call){
					if(option.joins){
						Join.get_data(database,cache,option).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
                                for(const search_item of biz_data){
                                    data[search_item.title] = search_item.data;
                                }
								call();
							}
						}).catch(err => {
							Log.error('Data-Portal-Get-Item-Join',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				//9_group //9_get_group get_item_group
				function(call){
					if(option.groups && data.id){
						Group.get_data(database,cache,[data],option).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data = biz_data[0];
							}
							call();
						}).catch(err => {
							Log.error('Data-Portal-Item-Group',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				//sub_value
				function(call){
					if(option.sub_value && data.id){
						if(!option.foreigns){
							option.foreigns = [];
						}
						option.foreigns.push(Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_SUB_VALUE,Type.Field_PARENT_ID,Type.FIELD_ID));
						call();
					}else{
						call();
					}
				},
				//9_foreigns //9_get_foreigns get_item_foreign
				function(call){
					if(option.foreigns && data.id){
						Foreign.get_data(database,cache,[data],option).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data = biz_data[0];
							}
							call();
						}).catch(err => {
							Log.error('Data-Portal-Search-Foreign',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				async function(call){
					if(option.sub_value && data.id){
						data.sub_values = Data_Logic.get_sub_value_items(data.sub_values);;
					}
				},
				//post-stat
				async function(call){
					if(option.stat && data.id){
						let post_stat = Stat_Logic.get(data.data_type,data.id,option.stat.type?option.stat.type:Type.STAT_VIEW,option.stat.user_id?option.stat.user_id:0,data);
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(option.stat.print){
								data.stat = biz_data;
							}
						}
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("ERROR-PORTAL-GET",err);
				callback([error,{}]);
			});
		});
	};
	//9_portal_search
	static search = (database,data_type,filter,sort_by,page_current,page_size,option) => {
		/* OPTIONS - START
		 * Fields
		   - field / type. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
		 * Distinct
		   - distinct / type. obj.
					{
						field:'title'
						sort_by:Type.SEARCH_SORT_BY_ASC,
					};
		 *  Foreign
			-- foreigns / type. obj items / ex. [
					{
						type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,Type.SEARCH_ONE
						foreign_data_type:Type.DATA_ITEM,
						foreign_field:'id',
						parent_field:'parent_id',
						field:{field_show_1:1,field_hide_2:0},
						title:'field_title',
					}];
		 *  Join
			-- joins / type. obj. join_search / ex. [
					{
						type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE
						search:search_obj,
						title:'field_title',
						page_current:1,
						page_size:0
					}];
		 *  Group
			-- groups / type. obj. group_search / ex. [
					{
						type:Type.Type.SEARCH_ITEMS,Type.SEARCH_ONE,
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
			let cache = {};
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {};
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				function(call){
					let search = Data_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
					get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.item_count=item_count;
							data.page_count=page_count;
							data.search=search;
							data[Type.FIELD_ITEMS]=items;
						}
						call();
					}).catch(err => {
						Log.error('Data-Portal-Search',err);
						error=Log.append(error,err);
					});
				},
				//9_get_item_join 9_join get_item
				function(call){
					if(option.joins){
						Join.get_data(database,cache,data,option).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data = biz_data;
								call();
							}
						}).catch(err => {
							Log.error('Data-Portal-Get-Items-Join',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				//9_foreigns //9_get_foreigns get_items_foreign
				function(call){
					if(option.foreigns && data[Type.FIELD_ITEMS].length > 0){
						Foreign.get_data(database,cache,data[Type.FIELD_ITEMS],option).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data[Type.FIELD_ITEMS] = biz_data;
								call();
							}
						}).catch(err => {
							Log.error('Data-Portal-Search-Foreign',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				//9_get_items_group 9_group
				function(call){
					if(option.groups && data[Type.FIELD_ITEMS].length>0){
						Group.get_data(database,cache,data[Type.FIELD_ITEMS],option).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data[Type.FIELD_ITEMS] = biz_data;
							}
							call();
						}).catch(err => {
							Log.error('Data-Portal-Item-Group',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error('DATA-PORTAL-SEARCH-ERROR',err);
				callback([err,[]]);
			});
		});
	};
	//9_portal_post
	static post = async (database,data_type,data,option) => {
		/* option params
		 * Fields
		   - overwrite / type. bool / ex. true,false / default. false -- post brand new obj.deleteing old.
		   - reset / type. bool / ex. true,false / default. false -- get update item aka recently saved item.
		   - clean / type. bool / ex. true,false / default. false -- checks and removes any list, groups, etc.
		   - delete_cache / type. bool / ex. true,false / default. false -- clear cache.
		   */
		return new Promise((callback) => {
			let error = null;
			let cache = {};
			option = !Obj.check_is_empty(option) ? option : {};
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				//clean
				function(call){
					if(option.clean){
						let new_data = {};
						for(const field in data){
							if(!Obj.check_is_array(data[field]) &&
								!Obj.check_is_array(data[field]) &&
								Obj.check_is_value(data[field]) &&
								!Str.check_if_str_exist(field,'_item_count') &&
								!Str.check_if_str_exist(field,'_page_count'))
							{
								new_data[field] = data[field];
							}
						}
						data = new_data;
						call();
					}else{
						call();
					}
				},
				//delete cache item
				function(call){
					if(option.overwrite || option.delete_cache){
						delete_item_cache(database,cache,data_type,data.id).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								call();
							}
						}).catch(err => {
							Log.error('Data-Post-Delete-Cache',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				function(call){
					post_item_adapter(database,cache,data_type,data,option).then(([biz_error,biz_data])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data = biz_data;
							call();
						}
					}).catch(err => {
						Log.error('Data-Post-Post-Item-Apapter',err);
						error=Log.append(error,err);
					});
				},
				//reset
				function(call){
					if(option.reset && data.id){
						get_item_adapter(database,cache,data.data_type,data.id).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data = biz_data;
								call();
							}
						}).catch(err => {
							Log.error('Data-Portal-Get-Reset',err);
							error=Log.append(error,err);
						});
					}else{
						call();
					}
				},
				/*
				async function(call){
					if(option.post_stat){
						let post_stat = Stat_Logic.get(data_type,data.id,option.stat_type,option.user_id,item);
						const [biz_error,biz_data] = await Stat_Data.post(database,post_stat,option);
						if(biz_error){
							error=Log.append(error,biz_error);
						}
					}
				},
				*/
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
			let data = Data_Logic.get(data_type,0);
			async.series([
				async function(call){
					const [biz_error,biz_data] = await post_bulk_adapter(database,data_type,items);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data = biz_data;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Post-Bulk-Data",err);
				callback([err,{}]);
			});
		});
	};
	//9_portal_delete
	static delete = async(database,data_type,id,option) => {
		/*
		 * Params
		 * - title
		 *   - description / type / example / required
		 * Option
		 *   - delete_group / bool / true/false / default: false - delete Type.DATA_GROUP
		 *   - delete_image / bool / true/false / default: false - delete Type.DATA_GROUP
		 * Return
		 * - tbd
		 */
		return new Promise((callback) => {
			let error = null;
			let cache = null;
			let data = Data_Logic.get(data_type,id);
			data[Type.FIELD_RESULT_OK_DELETE] = false;
			data[Type.FIELD_RESULT_OK_DELETE_CACHE] = false;
			data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = false;
			data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
			data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = false;
			option = !Obj.check_is_empty(option) ? option : {delete_group:true,delete_image:true};
			let delete_group_list = [];
			async.series([
				async function(call){
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				async function(call){
					const [biz_error,biz_data] = await delete_item_adapter(database,cache,data_type,id);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
							data[Type.FIELD_RESULT_OK_DELETE]  = true;
							data[Type.FIELD_RESULT_OK_DELETE_CACHE] = true;
							data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = true;
						}
					}
				},
				async function(call){
					if(option.delete_group){
						data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
						let filter = {parent_id:data.id};
						let data_type = Type.DATA_GROUP;
						const [biz_error,biz_data] = await Portal.delete_search(database,data_type,filter);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							if(biz_data[Type.FIELD_RESULT_OK_DELETE]){
								data[Type.FIELD_RESULT_OK_GROUP_DELETE] = true;
								data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = true;
							}
						}
					}
				},
				async function(call){
					if(option.delete_image){
						data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = false;
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
			let cache = {};
			let error = null;
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				async function(call){
					const [biz_error,biz_data] = await post_item_list_adapter(database,cache,data_items);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data_items = biz_data;
					}
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
			let data = Data_Logic.get(data_type,0,{data:{filter:filter}});
			let cache = {};
			data[Type.FIELD_RESULT_OK_DELETE] = false;
			data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = false;
			let delete_item_query = { $or: [] };
			let delete_group_list = [];
			let delete_items = [];
			option = !Obj.check_is_empty(option) ? option : {delete_group:true,delete_image:true};
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				function(call){
					let search = Data_Logic.get_search(data_type,filter,{},1,0);
					get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						if(items.length>0){
							delete_items = items;
						}
						call();
					}
					}).catch(err => {
						Log.error('Data-Portal-Search',err);
						error=Log.append(error,err);
					});
				},
				async function(call){
                	for(const data_item of delete_items){
						let query_field = {};
						query_field[Type.FIELD_PARENT_ID] = data_item.id
						delete_item_query.$or.push(query_field);
						data[Type.FIELD_RESULT_OK_DELETE] = true;
						const [biz_error,biz_data] = await delete_item_adapter(database,cache,data_item.data_type,data_item.id);
                    }
				},
				//get_group_ids
				function(call){
					if(option.delete_group && delete_item_query.$or.length > 0){
						let data_type = Type.DATA_GROUP;
						let search = Data_Logic.get_search(data_type,{},{},1,0,{field:{id:1,title:1,data_type:1}});
						get_item_list_adapter(database,cache,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								delete_group_list = items;
								call();
							}
						});
					}else{
						call();
					}
				},
				//delete_group_photo
				async function(call){
					if(option.delete_group && delete_group_list.length > 0){
						let query = { $or: [] };
						let delete_group_photo_query = { $or: [] };
						for(const data_item of delete_group_list){
							let query_field = {};
							query_field[Type.FIELD_PARENT_ID] = data_item.id
							delete_group_photo_query.$or.push(query_field);
						};
						let data_type = Type.DATA_IMAGE;
						let search = Data_Logic.get_search(data_type,delete_group_photo_query,{},1,0);
						const [biz_error,biz_data] = await delete_item_list_adapter(database,cache,data_type,search.filter);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data[Type.FIELD_RESULT_OK_GROUP_IMAGE_DELETE] = true;
						}
					}
				},
				async function(call){
					if(option.delete_group && delete_item_query.$or.length > 0){
						data[Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
						let data_type = Type.DATA_GROUP;
						let search = Data_Logic.get_search(data_type,delete_item_query,{},1,0);
						const [biz_error,biz_data] = await delete_item_list_adapter(database,cache,data_type,search.filter);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data[Type.FIELD_RESULT_OK_GROUP_DELETE] = true;
						}
					}
				},
				async function(call){
					if(option.delete_image && delete_item_query.$or.length > 0){
						data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = false;
						let data_type = Type.DATA_IMAGE;
						let search = Data_Logic.get_search(data_type,delete_item_query,{},1,0);
						const [biz_error,biz_data] = await delete_item_list_adapter(database,cache,data_type,search.filter);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data[Type.FIELD_RESULT_OK_IMAGE_DELETE] = true;
						}
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
			let cache = {};
			let data = {};
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				async function(call){
					const [biz_error,biz_data] = await get_count_item_list_adapter(database,cache,data_type,filter);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data = biz_data.count;
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
			let cache = {};
			let data = Data_Logic.get(data_type,id);
			let top_data = Data_Logic.get(data_type,0);
			let copy_data = Data_Logic.get(data_type,0);
			option = !Obj.check_is_empty(option) ? option : {};
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				async function(call){
					let data_group_option = Data_Logic.get_search_group();
					const [biz_error,biz_data] = await Portal.get(database,data_type,id,{groups:[data_group_option]});
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						top_data=biz_data;
					}
				},
				//top_item
				async function(call){
					if(top_data.id){
						copy_data = Data_Logic.copy(data_type,top_data);
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
							let copy_group = Data_Logic.copy(Type.DATA_GROUP,group);
							copy_group[Type.FIELD_TITLE] = 'Copy '+group[Type.FIELD_TITLE];
							copy_group[Type.FIELD_TITLE_URL] = 'copy_'+group[Type.FIELD_TITLE_URL];
							copy_group[Type.FIELD_SOURCE_ID] = group.id;
							copy_group[Type.FIELD_SOURCE_DATA_TYPE] = group.data_type;

							copy_group[Type.FIELD_PARENT_DATA_TYPE] = copy_data.data_type;
							copy_group[Type.FIELD_PARENT_ID] = copy_data.id;
							post_groups.push(copy_group);
						}
						const [biz_error,biz_data] = await post_item_list_adapter(database,cache,post_groups);
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
			let data = {faq:Data_Logic.get(Type.DATA_FAQ,0)};
			let questions = [];
			let error = null;
			option = !Obj.check_is_empty(option) ? option : {question_count:19};
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
	/* Stat
		-- stat / type. obj / ex. [
			{
				user_id:123,
				type:Type.STAT_VIEW,
				unique:true/false
			};
			*/
	static post = async (database,stat,option) => {
		return new Promise((callback) => {
			let error = null;
			let cache = {};
			let field_result_ok_unique = true;
			option = !Obj.check_is_empty(option) ? option : {};
			data = Data_Logic.get(Type.DATA_STAT,stat.id,{data:{parent_data_type:stat.parent_data_type,user_id:stat.user_id,type:stat.type}});
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
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
								field_result_ok_unique = false;
							}
						}
					}
				},
				//post - stat
				async function(call){
					if(field_result_ok_unique){
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
					if(field_result_ok_unique){
						let field = {};
						field[stat.stat_type] = 1;
						field[Type.FIELD_ID] = 1;
						field[Type.FIELD_TITLE] = 1;
						field[Type.FIELD_DATA_TYPE] = 1;
						let data_option = {field};
						const [biz_error,biz_data] = await get_item_adapter(database,cache,data.parent_data_type,stat.parent_id,data_option);
						data = biz_data;
					}
				},
				//update_item_by_id
				async function(call){
					if(field_result_ok_unique){
						if(data[stat.stat_type]){
							data[stat.stat_type] = parseInt(data[stat.stat_type]) + 1
						}else{
							data[stat.stat_type] = 1;
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
			let post_stat = Data_Logic.get(Type.DATA_STAT,0,{user_id:user_id,type:stat_type});
			post_stat = Obj.merge(post_stat,post_data);
			let data = Data_Logic.get(Type.DATA_STAT,0);
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
			let data = Data_Logic.get(Type.DATA_BLANK,0);
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
						data.stats = biz_data[Type.FIELD_ITEMS];
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
class Cart_Data  {
	//9_cart_post
	// -- CART -- //
	// --- Cart_Logic.get_cart_item(parent_data_type,parent_id,quanity,cost)
	// --- Cart_Logic.get_cart_sub_item(cart_item_id,type,quanity,cost)

	static post = async (database,cart,option) => {
		return new Promise((callback) => {
			let error = null;
			let cache = {};
			let data = {};
			option = !Obj.check_is_empty(option) ? option : {};
			data.cart = Data_Logic.get(Type.DATA_CART,cart.id,{data:{cart_number:cart.cart_number,user_id:cart.user_id,grand_total:0}});
			data.cart_items = [];
			data.cart_sub_items = [];
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				//post - cart
				function(call){
					for(const key in cart) {
						if(!Obj.check_is_array(cart[key]) && Obj.check_is_object(cart[key])
							&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
							&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
							&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE)
						{
							data.cart[key] = cart[key];
						}
					}
					data.cart[Type.FIELD_GRAND_TOTAL] = Cart_Logic.get_total(cart).grand_total;
					post_item_adapter(database,cache,Type.DATA_CART,data.cart).then(([biz_error,biz_data])=>{
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart = biz_data;
							call();
						}
					}).catch(err => {
						Log.error('Data-Cart-Post',err);
						error=Log.append(error,err);
					});
				},
				//post - cart items
				function(call){
					if(cart.cart_items.length>0){
						for(const cart_item of cart.cart_items){
							let post_cart_item = Data_Logic.get(Type.DATA_CART_ITEM,0);
							for(const key in cart_item){
								cart_item.temp_row_id = Num.get_id();
								if(!Obj.check_is_array(cart_item[key]) && Obj.check_is_object(cart_item[key])
									&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
									&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
									&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE){
									post_cart_item[key] = cart_item[key];
								}
							}
							post_cart_item[Type.FIELD_CART_ID] = data.cart.id;
							post_cart_item[Type.FIELD_CART_NUMBER] = data.cart.cart_number;
							post_cart_item.temp_row_id = cart_item.temp_row_id;
							data.cart_items.push(post_cart_item);
						}
						post_item_list_adapter(database,cache,data.cart_items).then(([biz_error,biz_data])=>{
							if(biz_error){
								error=Log.append(error,biz_error);
							}else{
								data.cart_items = biz_data;
								call();
							}
						}).catch(err => {
							Log.error('Data-Cart-Post',err);
							error=Log.append(error,err);
						});
					}
				},
				//post - cart sub items
				async function(call){
					if(cart.cart_items.length>0){
						for(const cart_item of cart.cart_items){
							for(const cart_sub_item of cart_item.cart_sub_items){
								let post_cart_sub_item = Data_Logic.get(Type.DATA_CART_SUB_ITEM,0);
								for(const key in cart_sub_item){
									cart_sub_item.temp_row_id = Num.get_id();
									if(!Obj.check_is_array(cart_item[key]) && Obj.check_is_object(cart_item[key])
										&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
										&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
										&& key != Type.FIELD_DATE_CREATE && key != Type.FILED_DATE_SAVE){
										post_cart_sub_item[key] = cart_sub_item[key];
									}
								}
								post_cart_sub_item[Type.FIELD_CART_ITEM_ID]  =data.cart_items.find(item_find => item_find.temp_row_id === cart_item.temp_row_id).id;
								post_cart_sub_item[Type.FIELD_CART_ID] = data.cart.id;
								post_cart_sub_item[Type.FIELD_CART_NUMBER] = data.cart.cart_number;
								data.cart_sub_items.push(post_cart_sub_item);
							}
						}
						const [biz_error,biz_data] = await post_item_list_adapter(database,cache,data.cart_sub_items);
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							data.cart_sub_items = biz_data;
						}
					}
				},
				/*
				//post_stat_cart
				async function(call){
					if(data.cart.id && option.post_stat){
						data.stat_cart = [];
						let post_cart_stat = Stat_Logic.get(Type.DATA_CART,cart.id,Type.STAT_CART,data.cart.user_id,cart);
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
							let post_cart_item_stat = Stat_Logic.get(Type.DATA_CART_ITEM,cart_item.id,Type.STAT_CART_ITEM,cart.user_id,cart_item);
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
								let post_cart_sub_item_stat = Stat_Logic.get(Type.DATA_CART_SUB_ITEM,cart_sub_item.id,Type.STAT_CART_SUB_ITEM,cart.user_id,cart_sub_item);
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
				*/
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
			let error = null;
			let cache = {};
			let data = {cart:Data_Logic.get(Type.DATA_CART,0,{data:{cart_number:cart_number,cart_items:[],user:Data_Logic.get(Type.DATA_USER,0)}})};
			let cart_parent_item_query = { $or: [] };
			let cart_sub_item_query = { $or: [] };
			let cart_sub_items = [];
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				//get_cart
				async function(call){
					let foreign_cart_item_parent = Data_Logic.get_search_foreign(Type.SEARCH_ONE,Type.DATA_PRODUCT,Type.FIELD_ID,Type.FIELD_PARENT_ID,{title:'parent'});
					let foreign_cart_item = Data_Logic.get_search_foreign(Type.SEARCH_COUNT,Type.DATA_CART_ITEM,Type.FIELD_CART_ID,Type.FIELD_ID,{foreigns:[foreign_cart_item_parent]});
					let foreign_user = Data_Logic.get_search_foreign(Type.SEARCH_ONE,Type.DATA_USER,Type.FIELD_ID,Type.FIELD_USER_ID,{title:'user'});
					let cart_option = { id_field:Type.FIELD_CART_NUMBER,foreigns:[foreign_cart_item,foreign_user] };
					const [biz_error,biz_data] = await Portal.get(database,Type.DATA_CART,cart_number,cart_option);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
					}
				},
				/*
				function(call){
					let foreign_cart_sub_item = Data_Logic.get_search_foreign(Type.SEARCH_ITEMS,Type.DATA_CART_SUB_ITEM,Type.FIELD_CART_ITEM_ID,Type.FIELD_ID);
					let option_cart_sub_item = { foreigns:[foreign_cart_sub_item] };
					Portal.get_data_foreigns(database,cache,data.cart.cart_items,option_cart_sub_item).then(([biz_error,biz_data])=>{
							if(biz_error){
								 error=Log.append(error,biz_error);
							 }else{
								 data.cart.cart_items = biz_data;
								 call();
							 }
					}).catch(err => {
						Log.error('Data-Portal-Search-Simple-Foreign',err);
						error=Log.append(error,err);
					});
				},
				async function(call){
					data.cart = Cart_Logic.get_total(data.cart);
				},
				*/
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
			data.cart = Data_Logic.get(Type.DATA_CART,id);
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
class Blank_Data {
	//9_blank
	static blank_more = (database) => {
		return new Promise((callback) => {
			let error = null;
			let cache = {};
			let data = Data_Logic.get(Type.DATA_BLANK,0);
			let option = {};
			get_blank(database,data.data_type,data.id,option).then(([biz_error,biz_data])=>{
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					//data logic here
					call();
					callback([error,data]);
				}
			}).catch(err => {
				Log.error('Data-Blank',err);
				error=Log.append(error,err);
			});
		}).catch(err => {
			Log.error("Blank-Get",err);
			callback([error,[]]);
		});
	};
	//9_blank
	static blank = (database) => {
		return new Promise((callback) => {
			let error = null;
			let cache = {};
			let data = Data_Logic.get(Type.DATA_BLANK,0);
			let option = {};
			//top
			async.series([
				async function(call) {
					const [biz_error,biz_data] = await get_cache(database.data_config);
					cache = biz_data;
				},
				//await
				async function(call){
					const [biz_error,biz_data] = await get_item_adapter(database,cache,data.data_type,data.id,option);
					data = biz_data;
				},
				//plain
				function(call){
					get_item_adapter(database,cache,data.data_type,data.id,option).then(([biz_error,biz_data])=>{
						//logic
						if(biz_error){
							error=Log.append(error,biz_error);
						}else{
							call();
						}
					}).catch(err => {
						Log.error('Data-Blank',err);
						error=Log.append(error,err);
					});
				},
				//then
				function(call){
					function get_data() {
						return new Promise((resolve) => {
							//logic
							resolve();
						});
					}
					get_data().then((value) => {
						//done
					})
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Blank-Get",err);
				callback([error,[]]);
			});
			//end
		});
		function blank_more_more_more() {
			return new Promise((callback) => {
				let error = null;
				let data = null;
				async.series([
					async function(call) {
						const biz_data = await get_items_data(search_item);
						callback(search_item);
					},
				]).then(result => {
					callback();
				}).catch(err => {
					Log.error("Blank-Get",err);
					callback([error,[]]);
				});
			});
		}
	};
}
module.exports = {
	Cart_Data,
	Database,
	Favorite_Data,
	Faq_Data,
	Order_Data,
	Portal,
	Review_Data,
	User_Data,
	Stat_Data,
};
