/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data - Mongo - Base
 */
const path = require('path');
const moment = require('moment');
const {get_guid} = require(process.env.BIZ9_HOME+'/biz9-utility/src/code/index.js')
const {get_new_item} = require(process.env.BIZ9_HOME+'/biz9-app/src/code/index.js')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const MONGO_FULL_URL="mongodb://"+biz9_config_file.MONGO_USERNAME_PASSWORD+biz9_config_file.MONGO_IP+":"+biz9_config_file.MONGO_PORT+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
const { MongoClient } = require("mongodb");
const client_db = new MongoClient(MONGO_FULL_URL);
const get_db_base = () => {
	return new Promise((callback) => {
		let error = null;
		client_db.connect().then((data)=> {
			callback([null,client_db]);
		}).catch(err => {
			error = error;
			console.error("--Error-Data-Mongo-Base-Get-DB-BASE-Error--",err);
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
		client_db.close().then((data)=> {
			callback([error,null]);
		}).catch(err => {
		});
	});
}
const get_item_base = (db_connect,data_type,tbl_id) => {
	return new Promise((callback) => {
		let error = null;
		let data = {};
		let collection = {};
		if(check_db_base(db_connect)){
			collection = db_connect.collection(data_type);
			collection.findOne({tbl_id:tbl_id}).then((data) => {
				callback([error,data]);
			}).catch(err => {
				console.error("--Error-Data-Base-Get-Item-Base-Error--",err);
				callback([err,null]);
			});
		}
	});
}
const check_db_base = (db_connect) => {
	if(!db_connect.client){
		return false;
	}else if(!db_connect.client.topology){
		return false;
	}else if(!db_connect.client.topology){
		return false;
	}else{
		return true;
	}
}
const check_db_client_connected = (db_connect) => {
	return !!db_connect && !!db_connect.topology && !!db_connect.topology.isConnected()
}

const update_item_base = (db_connect,data_type,item) => {
	return new Promise((callback) => {
		let error = null;
		let collection = db_connect.collection(data_type);
		if (String(item.tbl_id)=='0') {//insert
			item.tbl_id = get_guid();
			item.date_create = new moment().toISOString();
			item.date_save = new moment().toISOString();
			if(check_db_base(db_connect)){
				collection.insertOne(item).then((data) => {
					callback([null,item]);
				}).catch(err => {
					console.error("--Error-Notez-Base-Insert-Item-Base-Error--",err);
				});
			}
		}else{
			item.date_save = new moment().toISOString();
			collection.updateOne(item).then((data) => {
				callback([null,item]);
			}).catch(err => {
				console.error("--Error-Notez-Base-Update-Item-Base-Error--",err);
			});
		}
	});
}
module.exports = {
	get_db_base,
	check_db_base,
	close_db_base,
	update_item_base,
	get_item_base
};

