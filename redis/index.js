/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data-Redis
 */
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const {get_cache_base}  = require('./base.js');
const get_cache_main = async () => {
    return [error,data] = await get_cache_base();
}
module.exports = {
    get_cache_main
};

