const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {get_cache} = require('./redis/base.js');
const {Data,Database,Portal} = require(".index.js");

const {Log,Str,Num,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/code");
const {Type,Favorite_Logic,Stat_Logic,Review_Logic,Data_Logic,Product_Logic,Demo_Logic,Category_Logic,Cart_Logic,Order_Logic,Field_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");

class Cart_Data_Logic  {
	//9_cart_post
	static post = async (database,cart,option) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			let cache = {};
			option = option ? option : {};
			data.cart = Data_Logic.get(Type.DATA_CART,cart.id,{data:{cart_number:cart.cart_number,user_id:cart.user_id,grand_total:0}});
			data.cart_items = [];
			data.cart_sub_items = [];
			async.series([
                async function(call) {
                    const [biz_error,biz_data] = await get_cache(database.data_config);
                    cache = biz_data;
                },
				//post - cart
				async function(call){
					for(const key in cart) {
						if(!Obj.check_is_array(cart[key]) && Obj.check_is_object(cart[key])
							&& key != Type.FIELD_ID && key != Type.FIELD_DATA_TYPE
							&& key != Type.FIELD_SOURCE && key != Type.FIELD_SOURCE_ID
							&& key != Type.FIELD_DATE_CREATE && key != Type.FIELD_DATE_SAVE)
                        {
							data.cart[key] = cart[key];
						}
					}
                    Log.w('post_me',data.cart);
                    Log.w('portal',Portal);
					const [biz_error,biz_data] = await Portal.post(database,Type.DATA_CART,data.cart);
					if(biz_error){
						error=Log.append(error,biz_error);
					}else{
						data.cart = biz_data;
                        Log.w('my_data',data.cart);
					}
				},
				//post - cart items
				/*
				async function(call){
					if(cart.cart_items.length>0){
						for(const cart_item of cart.cart_items){
							let post_cart_item = Data_Logic.get(Type.DATA_CART_ITEM,0);
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
						const [biz_error,biz_data] = await post_item_list_adapter(database,cache,data.cart_items);
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
								let post_cart_sub_item = Data_Logic.get(Type.DATA_CART_SUB_ITEM,0);
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
						const [biz_error,biz_data] = await post_item_list_adapter(database,cache,data.cart_sub_items);
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
				*/
			]).then(result => {
				//callback([error,data.cart]);
			}).catch(err => {
				Log.error("CartData-Cart-Item-Update",err);
				callback([error,[]]);
			});
		});
	};
	//9_cart_get
	static get = (database,cart_number) => {
		return new Promise((callback) => {
			let data = {cart:Data_Logic.get(Type.DATA_CART,0,{cart_number:cart_number,cart_items:[],user:Data_Logic.get_new(Type.DATA_USER,0)})};
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
module.exports = {
	Cart_Data_Logic,
}

