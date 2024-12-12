/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Data
 */
const path = require('path')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
/*
const get_blank=()=>{
    return new Promise((resolve) =>{
        let error=null;
        const run = new();
        run.method().then((data)=> {
            resolve([null,data]);
        }).catch(err => handleError)
        function handleError(error) {
            error = error;
            console.error("--Error--"+error.message+"--Error--", error);
        }
    });
}
*/
const get_db_connect=()=>{
    return new Promise((resolve) =>{
        let error=null;
   if(!check_db_connect()){
          client_db.connect().then((data)=> {
            resolve(data);
        }).catch(err => handleError)
        function handleError(error) {
            error = error;
            console.error("--Error-Get-DB-Connect--"+error.message+"--Error--", error);
            throw new Error(error);
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
                resolve(null);
            });
        }
   }else{
       resolve(null);
   }
    });
}
const close_db_connect=()=>{
    return new Promise((resolve) =>{
        let error=null;
        client_db.close().then((data)=> {
            console.log(check_db_connect(client_db.isConnected));
            resolve(data);
        }).catch(err => handleError)
        function handleError(error) {
            error = error;
            throw new Error(error);
            console.error("--Error--"+error.message+"--Error--", error);
            resolve(error);
        }
    });
}
const check_db_connect=()=>{
        let is_conn = !!client_db && !!client_db.topology && !!client_db.topology.isConnected()
        return is_conn;
}
module.exports = {
    get_db_connect,
    close_db_connect,
    check_db_connect
};

