/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Data
 */
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const get_blank=()=>{
     return new Promise((resolve) =>{
    });
}
const get_db_connect=()=>{
    return new Promise((resolve) =>{
        let error=null;
        MONGO_FULL_URL="mongodb://"+biz9_config_file.MONGO_USERNAME_PASSWORD+biz9_config_file.MONGO_IP+":"+biz9_config_file.MONGO_PORT+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
        const { MongoClient } = require("mongodb");
        const client_db = new MongoClient(MONGO_FULL_URL);
        client_db.connect().then((result)=> {
            resolve([null,result]);
        }).catch(err => handleError)
        function handleError(error) {
            error = error;
            console.error("--Error-Get-DB-Connect--"+error.message+"--Error--", error);
            var reset_cmd = "sudo mongod --fork --config "+biz9_config_file.mongo_config;
            error=e;
            if(data_config.mongo_ip!='0.0.0.0'){
                if(!data_config.ssh_key){
                    data_config.ssh_key='';
                }else{
                    biz9_config_file.ssh_key=' -i '+ biz9_config_file.ssh_key;
                }
                reset_cmd='ssh '+ biz9_config_file.ssh_key + " " +biz9_config_file.mongo_server_user +"@"+biz9_config_file.mongo_ip +" -- "+reset_cmd;
            }
            dir = exec(reset_cmd, function(error,stdout,stderr){
            });
            dir.on('exit', function (code) {
                resolve([error,null]);
            });
        }
    });
}
module.exports = {
    get_db_connect,
};

