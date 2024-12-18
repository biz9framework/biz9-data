/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data-Redis
 */
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const {get_cache_base,close_cache_base,get_cache_string_base,delete_cache_string_base,set_cache_string_base}  = require('./base.js');
const get_cache_main = async () => {
    return [error,data] = await get_cache_base();
}
const close_cache_main = async (cache_connect) => {
    return [error,data] = await close_cache_base(cache_connect);
}
const set_cache_string_main = async (cache_connect,key,value) => {
    return [error,data] = await set_cache_string_base(cache_connect,key,value);
}
const get_cache_string_main = async (cache_connect,key) => {
    return [error,data] = await get_cache_string_base(cache_connect,key);
}
const delete_cache_string_main = async (cache_connect,key) => {
    return [error,data] = await delete_cache_string_base(cache_connect,key);
}
module.exports = {
    get_cache_main,
    close_cache_main,
    get_cache_string_main,
    set_cache_string_main,
    delete_cache_string_main
};

