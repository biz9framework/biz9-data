/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Redis
*/
const redis = require('redis');
const {Log} = require("biz9-utility");
class Cache {
    static get = (data_config) => {
        return new Promise((callback) => {
            let set_cache=false;
            let client_redis = redis.createClient(data_config.REDIS_PORT_ID,data_config.REDIS_URL);
            client_redis.connect().then((data) => {
                callback([null,data]);
            }).catch(error => {
                Log.error("Data-Redis-Base-Get-Cache-Base-Error",error);
            });
        });
    }
    static delete = (cache_connect) => {
        return new Promise((callback) => {
            let set_cache=false;
            cache_connect.disconnect().then((data) => {
                callback([null,data]);
            }).catch(error => {
                Log.error("Data-Redis-Base-Close-Cache-Base-Error",error);
            });
        });
    }
    static delete_value = (client_redis,key) => {
        return new Promise((callback) => {
            let response = {};
            client_redis.del(key).then((data) => {
                callback([response,data]);
            }).catch(error => {
                Log.error("Data-Redis-Base-Delete-Cache-String-Base-Error",error);
            });
        });
    }
    static get_value = (client_redis,key) => {
        return new Promise((callback) => {
            let response = {};
            client_redis.get(key).then((data) => {
                callback([response,data]);
            }).catch(error => {
                Log.error("Data-Redis-Base-Get-Cache-String-Base-Error",error);
            });
        });
    }
    static post_value = (client_redis,key,value) => {
        return new Promise((callback) => {
            let response = {};
            let data = null;
            if(!value||value==null||value==undefined){
                value=" ";
            }
            value=String(value).trim();
            client_redis.set(key,value).then((data) => {
                callback([response,data]);
            }).catch(error => {
                Log.error("Data-Redis-Base-Set-Cache-String-Base-Error",error);
            });
        });
    }
}
module.exports = {
    Cache
};
