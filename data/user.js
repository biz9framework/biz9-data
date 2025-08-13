
const async = require('async');

//const {DataItem,DataType,FieldType,Item_Logic,User_Logic,Favorite_Logic,Stat_Logic,Order_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Portal} = require("/home/think2/www/doqbox/biz9-framework/biz9-data/code/index.js");
//const {Portal} = require("../index");
console.log('aaaaaaaaaa');
console.log('bbbbbb');


	//9_user_register
	const register =  (database,user) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.email_found = false;
			cloud_data.title_found = false;
			cloud_data.user = user;
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
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("User-Data-Register",error);
				callback([error,[]]);
			});
		});
	};
	//9_user_login
	const login = async (database,email,password) => {
		return new Promise((callback) => {
			let error = null;
			let cloud_data = {};
			cloud_data.user_found = false;
			cloud_data.user = DataItem.get_new(DataType.USER,0,{email:email,password:password});
			async.series([
				//check email,passwrod
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
			]).then(result => {
				callback([error,cloud_data]);
			}).catch(error => {
				Log.error("User-Data-Login",error);
				callback([error,[]]);
			});
		});
	};

module.exports = {
	register,
};
