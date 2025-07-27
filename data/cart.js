const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Obj}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
const {Portal} = require("../index.js");
Log.w('fffff',Portal);
const {DataItem,DataType,FieldType,Item_Logic,User_Logic,Favorite_Logic,Stat_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");

class Cart {
	//cart_data_update
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
					let publish_cart = DataItem.get_new(DataType.CART,cart.id,{cart_number:cart.cart_number,user_id:user_id,parent_data_type:parent_data_type});
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
						cloud_data.stat_count = data.stat_count;
						cloud_data.stat_parent_item_list = data.stat_parent_item_list;
						cloud_data.stat_item_list = data.stat_item_list;
					}
				},
				//get cart
				async function(call){
						const [error,data] = await Cart_Data.get(database,parent_data_type,cart.cart_number);
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
	//cart_data_get
	static get = (database,cart_number,option) => {
        console.log('11111111');
		return new Promise((callback) => {
			let cloud_data = {cart:DataItem.get_new(DataType.CART,0,{cart_number:cart_number,cart_item_list:[],parent_data_type:DataType.BLANK,grand_total:0})};
            console.log('bbbbbbbbbbbbbbb');
			let cart_item_item_list_query = { $or: [] };
			let cart_sub_item_item_list_query = { $or: [] };
			let error = null;
			let cart_sub_item_list = [];
			option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,get_cart_item:true};
			async.series([
				//cart
				async function(call){
                    console.log('2222222222');
                    console.log(Portal);
                    /*
					option.filter = { cart_number: { $regex:String(cart_number), $options: "i" } };
					const [error,data] = await Portal.get(database,DataType.CART,cart_number,option);
                    console.log('ccccccccccc');
					if(error){
						error=Log.append(error,error);
					}else{
						cloud_data.cart = data.item;
					}
				},
                /*
				//cart_item_list
				async function(call){
                    console.log('3333333');
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
					let filter = { cart_number: { $regex:".*"+String(cart_number), $options: "i" } };
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
					for(let a = 0; a < cart_sub_item_list.length; a++){
						let query_field = {};
						query_field['id'] = { $regex:String(cart_sub_item_list[a]['parent_id']), $options: "i" };
						cart_sub_item_item_list_query.$or.push(query_field);
					}
					let search = Item_Logic.get_search(cloud_data.cart.parent_data_type,cart_sub_item_item_list_query,{},1,0);
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
                */
				}
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("Cart-Get",error);
				callback([error,[]]);
			});
		});
	};
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
}
module.exports = {
	Cart
};
