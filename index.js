/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../biz9_config.js'));
const dataz = require('./dataz/index.js');
MONGO_FULL_URL="mongodb://"+biz9_config_file.MONGO_USERNAME_PASSWORD+biz9_config_file.MONGO_IP+":"+biz9_config_file.MONGO_PORT+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
const { MongoClient } = require("mongodb");
client_db = new MongoClient(MONGO_FULL_URL);
const get_client_db = async () => {
    return data = await dataz.get_db_connect();
};
const close_client_db = async () => {
    return data = await dataz.close_db_connect();
};
const check_client_db = async () => {
    return data = await dataz.check_db_connect();
};
module.exports = {
    get_client_db,
    close_client_db,
    check_client_db
};

