/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data - Mongo - Base
 */
const async = require('async');
const moment = require('moment');
const {get_guid,w_error} = require("biz9-utility");
const { MongoClient } = require("mongodb");
let client_db = {};
const get_db_connect_base = (data_config) => {
	return new Promise((callback) => {
    const mongo_full_url="mongodb://"+data_config.MONGO_USERNAME_PASSWORD+data_config.MONGO_IP+":"+data_config.MONGO_PORT_ID+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
        client_db = new MongoClient(mongo_full_url);
		client_db.connect(data_config.APP_TITLE_ID).then((data)=> {
			callback([null,data.db(data_config.APP_TITLE_ID)]);
		}).catch(error => {
			w_error("Data-Mongo-Base-Get-DB-BASE-Error--",error);
			var reset_cmd = "sudo mongod --fork --config "+data_config.MONGO_CONFIG;
			if(data_config.MONGO_IP!='0.0.0.0'){
				if(!data_config.SSH_KEY){
					data_config.SSH_KEY='';
				}else{
					data_config.SSH_KEY=' -i '+ data_config.SSH_KEY;
				}
				reset_cmd = 'ssh '+ data_config.SSH_KEY + " " +data_config.MONGO_SERVER_USER +"@"+data_config.MONGO_IP +" -- "+reset_cmd;
			}
			dir = exec(reset_cmd, function(error,stdout,stderr){
			});
			dir.on('exit', function (code) {
				callback([error,null]);
			});
		});
	});
}
const close_db_connect_base = (db_connect) => {
	return new Promise((callback) => {
		client_db.close().then((data)=> {
			callback([error,null]);
		}).catch(error => {
			w_error("Data-Mongo-Base-Close-DB-Base-Error",error);
			callback([error,null]);
		});
	});
}
const get_item_base = (db_connect,data_type,id) => {
	return new Promise((callback) => {
		let collection = {};
		if(check_db_connect_base(db_connect)){
			collection = db_connect.collection(data_type);
			collection.findOne({id:id}).then((data) => {
                delete data['_id'];
				callback([error,data]);
			}).catch(error => {
				console.log("Data-Base-Get-Item-Base-Error",error);
				callback([error,null]);
			});
		}
	});
}
const check_db_connect_base = (db_connect) => {
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
		let collection = db_connect.collection(data_type);
		if (String(item.id)=='0') {//insert
			item.id = get_guid();
			item.date_create = new moment().toISOString();
			item.date_save = new moment().toISOString();
			if(check_db_connect_base(db_connect)){
				collection.insertOne(item).then((data) => {
					delete item['_id'];
					callback([error,item]);
				}).catch(error => {
					w_error("Data-Mongo-Base-Update-Item-Base-Error",error);
					callback([error,null]);
				});
			}
		}else{
			item.date_save = new moment().toISOString();
			collection.updateOne({id:item.id},{$set: item}).then((data) => {
				delete item['_id'];
				callback([error,item]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Update-Item-Base-Error",error);
				callback([error,null]);
			});
		}
	});
}
const delete_item_base = (db_connect,data_type,id) => {
	return new Promise((callback) => {
		let collection = db_connect.collection(data_type);
		if(check_db_connect_base(db_connect)){
			collection.deleteMany({id:id}).then((data) => {
				callback([error,data]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Delete-Item-Base-Error",error);
				callback([error,null]);
			});
		}
	});
}
const delete_item_list_base = (db_connect,data_type,filter) => {
	return new Promise((callback) => {
		let collection = db_connect.collection(data_type);
		if(check_db_connect_base(db_connect)){
			collection.deleteMany(filter).then((data) => {
				callback([error,data]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Delete-List-Base-Error",error);
				callback([error,null]);
			});
		}
	});
}
const get_id_list_base = (db_connect,data_type,filter,sort_by,page_current,page_size) => {
	return new Promise((callback) => {
		let total_count = 0;
		let data_list = [];
		let collection = {};
		async.series([
			function(call) {
				if(check_db_connect_base(db_connect)){
					db_connect.collection(data_type).countDocuments(filter).then((data) => {
						total_count = data;
						call();
					}).catch(error => {
						w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Bas-Errore",error);
						callback([error,null]);
					});
				}else{
					w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Base-Error",error);
					callback(['No connection',null]);
				}
			},
			function(call) {
				if(check_db_connect_base(db_connect)){
					db_connect.collection(data_type).find(filter).sort(sort_by).skip(page_current>0?((page_current-1)*page_size):0).limit(page_size).collation({locale:"en_US",numericOrdering:true}).project({id:1,data_type:1,_id:0}).toArray().then((data) => {
						data_list = data;
						call();
					}).catch(error => {
						w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Base-Error",error);
						callback([error,null]);
					});
				}else{
					w_error("Data-Mongo-Base-Get-Sql-Paging-TblId-Base-Error",error);
                    callback(['No connection',null]);
				}
			}
		]).then(result => {
			callback([error,total_count,data_list]);
		}).catch(error => {
			w_error("Project-FileName-Update-Blank-Error",error);
			callback([error,null]);
		});
	});
}
const count_item_list_base = (db_connect,data_type,filter) => {
	return new Promise((callback) => {
		let collection = db_connect.collection(data_type);
		if(check_db_connect_base(db_connect)){
			collection.countDocuments(filter).then((data) => {
				callback([error,data]);
			}).catch(error => {
				w_error("Data-Mongo-Base-Count-Item-List-Base-Error",error);
				callback([error,null]);
			});
		}
	});
}
module.exports = {
	get_db_connect_base,
	check_db_connect_base,
	close_db_connect_base,
	update_item_base,
	get_item_base,
	delete_item_base,
	delete_item_list_base,
	count_item_list_base,
	get_id_list_base
};
