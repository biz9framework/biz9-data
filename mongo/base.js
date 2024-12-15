/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data - Mongo - Base
 */
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const { MongoClient } = require("mongodb");
const get_db_base = () => {
    return new Promise((callback) => {
        let error = null;
        const MONGO_FULL_URL="mongodb://"+biz9_config_file.MONGO_USERNAME_PASSWORD+biz9_config_file.MONGO_IP+":"+biz9_config_file.MONGO_PORT+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
        let client_db = new MongoClient(MONGO_FULL_URL);
        client_db.connect().then((data) => {
            if(error){
                throw 'GET_DB_BASE_CONNECT';
            }else{
                callback([error,data]);
            }
        }).catch(err => {
            error = error;
            console.error("--Error-Get-DB-Connect--"+error.message+"--Error--", error);
            let reset_cmd = "sudo mongod --fork --config "+biz9_config_file.mongo_config;
            if(data_config.mongo_ip!='0.0.0.0'){
                if(!data_config.ssh_key){
                    data_config.ssh_key='';
                }else{
                    biz9_config_file.ssh_key=' -i '+ biz9_config_file.ssh_key;
                }
                reset_cmd='ssh '+ biz9_config_file.ssh_key + " " +biz9_config_file.mongo_server_user +"@"+biz9_config_file.mongo_ip +" -- "+reset_cmd;
            }
            dir = exec(reset_cmd,function(error,stdout,stderr){
            });
            dir.on('exit', function(code){
                callback([error,null]);
            });
        });
    });
}
const close_db_base = (db_connect) => {
	return new Promise((callback) => {
		let error=null;
        console.log('111111111');
        /*
		db_connect.close().then((data)=> {
			callback([null,data]);
        }).catch(err => {
            console.error("--Error-Close-DB-Base--"+err+"--Error--", err);
		});
        */
	});
}
const check_db_base = (db_connect) => {
    return !!db_connect && !!db_connect.topology && !!db_connect.topology.isConnected()
}
module.exports = {
	get_db_base,
	check_db_base,
	close_db_base
};

