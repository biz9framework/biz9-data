/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data-Redis
 */
const redis = require('redis');

const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));


const get_cache_base = () =>{
	return new Promise((callback) =>{
		let error=null;
	    let client_redis = redis.createClient(biz9_config_file.redis_port,biz9_config_file.redis_url);
		client_redis.connect().then((data)=> {
            if(error){
                throw 'GET_CACHE_BASE';
			}
		callback([null,data]);
		}).catch(err => handleError)
		function handleError(error) {
			error = error;
			console.error("--Error--"+error.message+"--Error--", error);
   		    callback([error,null]);
		}
	});
}
module.exports = {
	get_cache_base
};

