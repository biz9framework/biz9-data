/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Data - Mongo - Base
 */
const async = require('async');
const {Num,Log,Str,Obj,DateTime} = require("biz9-utility");
const {Type} = require("biz9-logic");
const {MongoClient} = require("mongodb");
let client_db = {};
const get_db_connect_base = (data_config,option) => {
    return new Promise((callback) => {
        const mongo_full_url="mongodb://"+data_config.MONGO_USERNAME_PASSWORD+data_config.MONGO_IP+":"+data_config.MONGO_PORT_ID+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
        client_db = new MongoClient(mongo_full_url);
        client_db.connect(data_config.APP_ID).then((data)=> {
            callback([null,data.db(data_config.APP_ID)]);
        }).catch(error => {
            Log.error("DATA-MONGO-BASE-GET-DB-BASE-ERROR--",error);
            var reset_cmd = "sudo mongod --fork --config "+data_config.MONGO_CONFIG;
            if(data_config.MONGO_IP!='0.0.0.0'){
                if(!data_config.MONGO_SSH_KEY){
                    data_config.MONGO_SSH_KEY='';
                }else{
                    data_config.MONGO_SSH_KEY=' -i '+ data_config.MONGO_SSH_KEY;
                }
                reset_cmd = 'ssh '+ data_config.MONGO_SSH_KEY + " " +data_config.MONGO_SERVER_USER +"@"+data_config.MONGO_IP +" -- "+reset_cmd;
            }
            dir = exec(reset_cmd, function(error,stdout,stderr){
            });
            dir.on('exit', function (code) {
                callback([error,null]);
            });
        });
    });
}
const delete_db_connect_base = (db_connect,option) => {
    return new Promise((callback) => {
        client_db.close().then((data)=> {
            callback([error,null]);
        }).catch(error => {
            Log.error("DATA-MONGO-BASE-ClOSE-DB-BASE-ERROR",error);
            callback([error,null]);
        });
    });
}
const get_item_base = (db_connect,data_type,id,option) => {
    return new Promise((callback) => {
        let data = null;
        if(check_db_connect_base(db_connect)){
            db_connect.collection(data_type).findOne({id:id}).then((data) => {
                if(data){
                    data = data;
                    delete data['_id'];
                }
                callback([error,data]);
            }).catch(error => {
                Log.error("DATA-BASE-GET-ITEM-BASE-ERROR",error);
                callback([error,null]);
            });
        }
    });
}
const check_db_connect_base = (db_connect) => {
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
const post_item_base = (db_connect,data_type,item,option) => {
    return new Promise((callback) => {
        option = !Obj.check_is_empty(option) ? option : {overwrite_data:false};
        if (Str.check_is_null(item.id)){//insert
            //item[Type.FIELD_ID] = Str.get_guid();
            item[Type.FIELD_ID] = Num.get_id(999);
            item[Type.FIELD_DATE_CREATE] = DateTime.get_new();
            item[Type.FIELD_DATE_SAVE] = DateTime.get_new();
            if(check_db_connect_base(db_connect)){
                db_connect.collection(data_type).insertOne(item).then((data) => {
                    if(data){
                        delete item['_id'];
                    }
                    callback([error,item]);
                }).catch(error => {
                    Log.error("DATA-MONGO-BASE-UPDATE-ITEM-BASE-ERROR",error);
                    callback([error,null]);
                });
            }
        }else{
            item.date_save = DateTime.get_new();
            if(!option.overwrite_data){
                db_connect.collection(data_type).updateOne({id:item.id},{$set: item}).then((data) => {
                    if(data){
                        delete item['_id'];
                    }
                    callback([error,item]);
                }).catch(error => {
                    Log.error("DATA-MONGO-BASE-UPDATE-ITEM-BASE-ERROR",error);
                    callback([error,null]);
                });
            }else{
                db_connect.collection(data_type).replaceOne({id:item.id},item).then((data) => {
                    if(data){
                        delete item['_id'];
                    }
                    callback([error,item]);
                }).catch(error => {
                    Log.error("DATA-MONGO-BASE-UPDATE-ITEM-BASE-ERROR",error);
                    callback([error,null]);
                });
            }
        }
    });
}
const post_bulk_base = (db_connect,data_type,data_list) => {
    return new Promise((callback) => {
        let data = {result_OK:false};
        let bulk_list = [];
        let date_create = DateTime.get_new();
        for(let a = 0; a < data_list.length; a++){
            let item = {insertOne:{document:data_list[a]}};
            data_list[a].id = Str.get_guid();
            data_list[a].date_create = date_create;
            bulk_list.push(item);
        }

        if(check_db_connect_base(db_connect)){
            try {
                db_connect.collection(data_type).bulkWrite(bulk_list,
                { ordered: false } )
                } catch( error ) {
                    Log.w('bulk_write_error',error);
                    Log.error("DATA-MONGO-BASE-DELETE-ITEM-BASE-ERROR",error);
                }
               data.result_OK= true;
                callback([error,data]);
            }
        });
}
const delete_item_base = (db_connect,data_type,id,option) => {
    return new Promise((callback) => {
        let data = null;
        if(check_db_connect_base(db_connect)){
            db_connect.collection(data_type).deleteMany({id:id}).then((data) => {
                if(data){
                    data = data;
                };
                callback([error,data]);
            }).catch(error => {
                Log.error("DATA-MONGO-BASE-DELETE-ITEM-BASE-ERROR",error);
                callback([error,null]);
            });
        }
    });
}
const delete_item_list_base = (db_connect,data_type,filter) => {
    return new Promise((callback) => {
        let data = null;
        if(check_db_connect_base(db_connect)){
            db_connect.collection(data_type).deleteMany(filter).then((data) => {
                if(data){
                    data = data;
                }
                callback([error,data]);
            }).catch(error => {
                Log.error("DATA-MONGO-BASE-DELETE-lIST-BASE-ERROR",error);
                callback([error,[]]);
            });
        }
    });
}
const get_id_list_base = (db_connect,data_type,filter,sort_by,page_current,page_size,option) => {
    return new Promise((callback) => {
        let total_count = 0;
        let data_list = [];
        let collection = {};
        async.series([
            function(call) {
                if(page_size>0){
                if(check_db_connect_base(db_connect)){
                    db_connect.collection(data_type).countDocuments(filter).then((data) => {
                        if(data){
                            total_count = data;
                        }
                        call();
                    }).catch(error => {
                        Log.error("DATA-MONGO-BASE-GET-SQL-PAGING-TBLiD-BASE-ERROR-1",error);
                        callback([error,0,[]]);
                    });
                }else{
                    Log.error("DATA-MONGO-BASE-GET-SQL-PAGING-TBLID-BASE-ERROR-2",error);
                    callback(['No connection',0,[]]);
                }
                }else{
                    call();
                }
            },
            function(call) {
                if(check_db_connect_base(db_connect)){
                    page_current = parseInt(page_current);
                    page_size = parseInt(page_size);
                    db_connect.collection(data_type).find(filter).sort(sort_by).collation({locale:"en_US",numericOrdering:true}).skip(page_current>0?((page_current-1)*page_size):0).limit(page_size).project({id:1,data_type:1,_id:0}).toArray().then((data) => {
                        if(data){
                            data_list = data;
                        }
                        call();
                    }).catch(error => {
                        Log.error("DATA-MONGO-BASE-GET-SQL-PAGING-TBlID-BASE-ERROR-3",error);
                        callback([error,0,[]]);
                    });
                }else{
                    Log.error("DATA-Mongo-Base-Get-SQL-PAGING-TBLID-BASE-ERROR-4",error);
                    callback(['No connection',0,[]]);
                }
            },
            function(call) {
               if(page_size==0){
                    total_count = data_list.length;
                }
                call();
            }

        ]).then(result => {
            callback([error,total_count,data_list]);
        }).catch(error => {
            Log.error("PROJECT-FILENAME-UPDATE-BLANK-ERROR-5",error);
            callback([error,0,[]]);
        });
    });
}
const get_count_item_list_base = async (db_connect,data_type,filter,option) => {
    return new Promise((callback) => {
        let data = 0;
        db_connect.collection(data_type).countDocuments(filter).then((data) => {
            if(data){
                data = data;
            }
            callback([error,data]);
        }).catch(error => {
            Log.error("DATA-MONGO-BASE-COUNT-ITEM-LIST-BASE-ERROR",error);
            callback([error,null]);
        });
    });
}
module.exports = {
    get_db_connect_base,
    check_db_connect_base,
    delete_db_connect_base,
    post_item_base,
    post_bulk_base,
    get_item_base,
    delete_item_base,
    delete_item_list_base,
    get_count_item_list_base,
    get_id_list_base
};
