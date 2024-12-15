/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data-Mongo
 */
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const async = require("async");
const MONGO_FULL_URL="mongodb://"+biz9_config_file.MONGO_USERNAME_PASSWORD+biz9_config_file.MONGO_IP+":"+biz9_config_file.MONGO_PORT+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
const { MongoClient } = require("mongodb");
const client_db = new MongoClient(MONGO_FULL_URL);
const { get_title_url } = require(process.env.BIZ9_HOME + "/biz9-utility/src/code");
const {update}  = require('../libz/mongo_db.js');
const get_db_base = () => {
	return new Promise((callback) => {
		var error=null;
		client_db.connect().then((data)=> {
			if(error){
				throw 'GET_DB_CONNECT';
			}else{
				callback([error,data]);
			}
		}).catch(err => {
			error = error;
			console.error("--Error-Get-DB-Connect--"+error.message+"--Error--", error);
			var reset_cmd = "sudo mongod --fork --config "+biz9_config_file.mongo_config;
			if(data_config.mongo_ip!='0.0.0.0'){
				if(!data_config.ssh_key){
					data_config.ssh_key='';
				}else{
					biz9_config_file.ssh_key=' -i '+ biz9_config_file.ssh_key;
				}
				reset_cmd='ssh '+ biz9_config_file.ssh_key + " " +biz9_config_file.mongo_server_user +"@"+biz9_config_file.mongo_ip +" -- "+reset_cmd;
			}
			dir = exec(reset_cmd, function(error,stdout,stderr){
			});
			dir.on('exit', function (code) {
				callback([error,null]);
			});
		});
	});
}
const close_db_base = (db_connect) => {
	return new Promise((callback) => {
		let error = null;
		client_db.close().then((data) => {
			callback([null,data]);
		}).catch(err => {
			console.error("--Error-Close-DB-Base--"+err+"--Error--", err);
		});
	});
}
const check_db_base=(db_connect)=>{
	return !!db_connect && !!db_connect.topology && !!db_connect.topology.isConnected()
}
const update_item_base_old=(db_connect,data_type,data_item)=>{
	return new Promise((resolve) =>{
		let error=null;
		let cache_connect = {};
		//let cache_string_str='';
		//let set_cache=false;
		async.series([
			function(call) {
				console.log('11111111111111');
				get_cache_base().then((data)=> {
					if(error){
						throw 'UPDATE_CACHE_ITEM';
					}
					cache_connect=data;
					console.log(cache_connect);
					console.log('rrrrrrrrrrr');
					//call();
				}).catch(err => handleError(err))
				function handleError(error) {
					error = error;
					console.error("--Error--UPDATE-CACHE-ITEM--"+error.message+"--Error--", error);
					//call();
				}
			},
			function(call) {
				console.log('22222222222222222');
				if(data_item.photo_obj){
					delete data_item.photo_obj;
				}
				if(data_item.date_obj){
					delete data_item.date_obj;
				}
				if(data_item.title){
					data_item.title_url=get_title_url(data_item.title);
				}
				call();
			},
			function(call) {
				console.log('33333333333333333333333333');
				//update(db_connect,data_type,data_item).then((data)=> {
				/*
				update().then((data)=> {
				console.log('555555555555555');
					console.log('rrrrrrr');
		//resolve([null,data]);
				}).catch(err => handleError)
				function handleError(error) {
					error = error;
					console.error("--Error--"+error.message+"--Error--", error);
				}
				*/
		/*
				update_cache_item(client_db,data_type,data_item).then((data)=> {
					resolve([null,data]);
				}).catch(err => handleError)
				function handleError(error) {
					error = error;
					console.error("--Error--"+error.message+"--Error--", error);
				}

				data_mon.update(db,data_type,data_item,function(error,data){
					call();
				});
				*/
	}
		]).then(results => {
			console.log(results);
		}).catch(err => {
			console.log(err);
		});
		/*
		const run = new();
		run.method().then((data)=> {
			resolve([null,data]);
		}).catch(err => handleError)
		function handleError(error) {
			error = error;
			console.error("--Error--"+error.message+"--Error--", error);
		}
		*/
	});
}

/*
module.update_cache_item=function(db,data_type,data_item,callback){
		var cache_string_str='';
		var error=null;
		var client_redis = redis.createClient(redis_port,redis_url);
		var set_cache=false;
		async.series([
			function(call){
				const run = async function(a,b){
					await client_redis.connect();
					call();
				}
				run();
			},
			function(call){
				if(data_item.photo_obj){
					delete data_item.photo_obj;
				}
				if(data_item.date_obj){
					delete data_item.date_obj;
				}
				if(data_item.title){
					data_item.title_url=biz9.get_title_url(data_item.title);
				}
				call();
			},
			function(call){
		   data_mon.update(db,data_type,data_item,function(error,data){
					call();
				});
			},
			function(call){
				cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(data_item.data_type,data_item.tbl_id),function(error,data)
					{
						call();
					});
			},
			function(call){
				const run = async function(a,b){
					await client_redis.disconnect();
					call();
				}
				run();
			},
		],
			function(err, result){
				callback(error,appz.set_biz_item(data_item));
			});
	}
	*/

module.exports = {
	get_db_base,
	close_db_base,
	check_db_base,
	update_item_base
};

