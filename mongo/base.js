/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data - Mongo - Base
 */
const path = require('path');
const moment = require('moment');
const {get_guid} = require('biz9-utility')
const biz9_config_file = require(path.join(__dirname, '../../../biz9_config.js'));
const MONGO_FULL_URL="mongodb://"+biz9_config_file.MONGO_USERNAME_PASSWORD+biz9_config_file.MONGO_IP+":"+biz9_config_file.MONGO_PORT+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
const { MongoClient } = require("mongodb");
const client_db = new MongoClient(MONGO_FULL_URL);
const get_db_base = () => {
    return new Promise((callback) => {
        let error = null;
        client_db.connect().then((data)=> {
            callback([null,client_db]);
        }).catch(err => {
            error = error;
            console.error("--Error-Data-Mongo-Base-Get-DB-BASE-Error--",err);
            var reset_cmd = "sudo mongod --fork --config "+biz9_config_file.mongo_config;
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
                callback([error,null]);
            });
        });
    });
}
const close_db_base = (db_connect) => {
    return new Promise((callback) => {
        let error = null;

        console.log('aaaaaaaa');
        client_db.close().then((data)=> {

            console.log(data);
            console.log('bbbbbb');
            //callback([error,'closed']);
        }).catch(err => {
        });

        console.log('over');
    });
}
const check_db_base = (db_connect) => {
    if(!db_connect.client){
        return false;
    }else if(!db_connect.client.topology){
       return false;
    }else if(!db_connect.client.topology){
        return false;
    }else{
        return true;
    }
}
const check_db_client_connected = (db_connect) => {
    return !!db_connect && !!db_connect.topology && !!db_connect.topology.isConnected()
}
const update_item_base = (db_connect,data_type,item) => {
    return new Promise((callback) => {
        let error = null;
        let collection = {};

        if (String(item.tbl_id)=='0') {//insert
            item.tbl_id = get_guid();
            item.date_create = new moment().toISOString();
            item.date_save = new moment().toISOString();
            console.log('sssssss');
            console.log(check_db_client_connected(db_connect));

            collection = db_connect.collection(data_type);
            console.log('ffffffff');
            console.log(collection);

            //if(check_db_client_connected(db_connect)){
                /*
                run.method().then((data) => {
                    callback([null,data]);
                }).catch(err => {
                    console.error("--Error-Notez-FileName-Get-Blank-Error--",err);
                });
                */

            //}
        }


        /*
        run.method().then((data) => {
            callback([null,data]);
        }).catch(err => {
            console.error("--Error-Notez-FileName-Get-Blank-Error--",err);
        });
        */
    });
}


/*
  module.update =async function(db,data_type,item,callback){
        var error=null;
        var collection = {};
        if (String(item.tbl_id)=='0') {//insert
            item.tbl_id = utilityz.get_guid();
            item.date_create = new moment().toISOString();
            item.date_save = new moment().toISOString();
            async function run() {
                if(dataz.db_client_connected(db)){
                    collection = db.collection(data_type);
                    await collection.insertOne(item);
                    callback(error,item);
                }else{
                    callback('error_mongo_db_update',item);
                }
            }
            run();
        }else{
            item.date_save = new moment().toISOString();
            async function run() {
                if(dataz.db_client_connected(db)){
                    collection = db.collection(data_type);
                    await collection.updateOne({tbl_id:item.tbl_id},{$set: item});
                    callback(null,item);
                }else{
                    callback('error_mongo_db_update_2',item);
                }
            }
            run();
        }
    }
    */

module.exports = {
    get_db_base,
    check_db_base,
    close_db_base,
    update_item_base
};

