const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const redis = require('redis');
const get_cache_connect_base = () => {
	return new Promise((callback) => {
		let error = null;
        let set_cache=false;
        let client_redis = redis.createClient(biz9_config_file.redis_port,biz9_config_file.redis_url);
		client_redis.connect().then((data) => {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Data-Redis-Base-Get-Cache-Base-Error--",err);
		});
	});
}
const close_cache_connect_base = (cache_connect) => {
	return new Promise((callback) => {
		let error = null;
        let set_cache=false;
		cache_connect.disconnect().then((data) => {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Data-Redis-Base-Close-Cache-Base-Error--",err);
		});
	});
}
const delete_cache_string_base = (client_redis,key) => {
	return new Promise((callback) => {
		let error = null;
		client_redis.del(key).then((data) => {
			callback([error,data]);
        }).catch(err => {
            console.error("--Error-Data-Redis-Base-Delete-Cache-String-Base-Error--",err);
		});
	});
}
const get_cache_string_base = (client_redis,key) => {
	return new Promise((callback) => {
		let error = null;
		client_redis.get(key).then((data) => {
			callback([error,data]);
        }).catch(err => {
            console.error("--Error-Data-Redis-Base-Get-Cache-String-Base-Error--",err);
		});
	});
}
const set_cache_string_base = (client_redis,key,value) => {
	return new Promise((callback) => {
		let error = null;
		let data = null;
        if(!value||value==null||value==undefined){
            value=" ";
        }
        value=String(value).trim();
		client_redis.set(key,value).then((data) => {
			callback([error,data]);
        }).catch(err => {
            console.error("--Error-Data-Redis-Base-Set-Cache-String-Base-Error--",err);
		});
	});
}
module.exports = {
	get_cache_connect_base,
	get_cache_string_base,
	set_cache_string_base,
	close_cache_connect_base,
	delete_cache_string_base,
};
