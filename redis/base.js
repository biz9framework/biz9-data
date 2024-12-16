const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const redis = require('redis');
const client_redis = redis.createClient(biz9_config_file.redis_port,biz9_config_file.redis_url);
const get_cache_base = () => {
	return new Promise((callback) => {
		let error = null;
        var set_cache=false;
		client_redis.connect().then((data) => {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Redis-Base-Get-Cache-Base-Error--",err);
		});


        /*
        const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
        */



	});
}

module.exports = {
	get_cache_base
};

