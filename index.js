/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../biz9_config.js'));
const dataz = require('./dataz/index.js');
const get_client_db = async () => {
    console.log('aaaaaaa');
    return [error,connect] = await dataz.get_db_connect();
};
module.exports = {
    get_client_db,
};
