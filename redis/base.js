const redis = require('redis');
const {Log} = require("biz9-utility");
const get_cache = (data_config) => {
	return new Promise((callback) => {
		let error = null;
        let set_cache=false;
        let client_redis = redis.createClient(data_config.REDIS_PORT_ID,data_config.REDIS_URL);
		client_redis.connect().then((data) => {
			callback([null,data]);
        }).catch(error => {
            Log.error("Data-Redis-Base-Get-Cache-Base-Error",error);
			callback([null,error]);
		});
	});
}
const delete_cache = (cache_connect) => {
	return new Promise((callback) => {
		let error = null;
        let set_cache=false;
		cache_connect.disconnect().then((data) => {
			callback([null,data]);
        }).catch(error => {
            Log.error("Data-Redis-Base-Close-Cache-Base-Error",error);
			callback([null,error]);
		});
	});
}
const delete_cache_value = (client_redis,key) => {
	return new Promise((callback) => {
		let error = null;
		client_redis.del(key).then((data) => {
			callback([error,data]);
        }).catch(error => {
            Log.error("Data-Redis-Base-Delete-Cache-String-Base-Error",error);
			callback([null,error]);
		});
	});
}
const get_cache_value = (client_redis,key) => {
	return new Promise((callback) => {
		let error = null;
		client_redis.get(key).then((data) => {
			callback([error,data]);
        }).catch(error => {
            Log.error("Data-Redis-Base-Get-Cache-String-Base-Error",error);
			callback([null,error]);
		});
	});
}
const post_cache_value = (client_redis,key,value) => {
	return new Promise((callback) => {
		let error = null;
		let data = null;
        if(!value||value==null||value==undefined){
            value=" ";
        }
        value=String(value).trim();
		client_redis.set(key,value).then((data) => {
			callback([error,data]);
        }).catch(error => {
            Log.error("Data-Redis-Base-Set-Cache-String-Base-Error",error);
			callback([null,error]);
		});
	});
}
module.exports = {
	get_cache,
	delete_cache,
	get_cache_value,
	delete_cache_value,
	post_cache_value,
};
