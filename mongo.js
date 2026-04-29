/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo
*/
const async = require('async');
const {Log,Str,Obj,DateTime} = require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Data_Field} = require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {MongoClient,ObjectId} = require("mongodb");
let client_db = {};
class Mongo {
    static get = async (data_config,option) => {
        return new Promise((callback) => {
            const mongo_full_url="mongodb://"+data_config.MONGO_USERNAME_PASSWORD+data_config.MONGO_IP+":"+data_config.MONGO_PORT_ID+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
            client_db = new MongoClient(mongo_full_url);
            client_db.connect(data_config.APP_ID).then((data)=> {
                callback(data.db(data_config.APP_ID));
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
                dir = exec(reset_cmd, function(stdout,stderr){
                });
                dir.on('exit', function (code) {
                    callback(null);
                });
            });
        });
    }
    static delete = (database,option) => {
        return new Promise((callback) => {
            client_db.close().then((data)=> {
                callback(null);
            }).catch(error => {
                Log.error("DATA-MONGO-BASE-ClOSE-DB-BASE-ERROR",error);
            });
        });
    }
    static get_item = (database,table,id,option) => {
        return new Promise((callback) => {
            let data = null;
            if(!id){
                id = '0';
            }
            if(Mongo.check_database(database)){
                const query = { _id: new ObjectId(id) };
                database.collection(table).findOne(query).then((data) => {
                    if(data){
                        data.id = id;
                        delete data[Data_Field._ID];
                    }
                    callback(data);
                }).catch(error => {
                    Log.error("DATA-BASE-GET-ITEM-BASE-ERROR",error);
                });
            }
        });
    }
    static check_database = (database) => {
        if(!database.client){
            return false;
        }else if(!database.client.topology){
            return false;
        }else if(!database.client.topology){
            return false;
        }else{
            return true;
        }
    }
    static check_db_client_connected = (database) => {
        return !!database && !!database.topology && !!database.topology.isConnected()
    }
    static post_item = (database,table,item,option) => {
        return new Promise((callback) => {
            option = !Obj.check_is_empty(option) ? option : {};
            if (Str.check_is_null(item.id)){// --insert --
               if(Mongo.check_database(database)){
                    delete item[Data_Field.ID];
                    item[Data_Field.DATE_CREATE] = DateTime.get();
                    item[Data_Field.DATE_SAVE] = DateTime.get();
                    item[Data_Field._ID] = new ObjectId();
                    item[Data_Field.ID] = item[Data_Field._ID].toString();
                    database.collection(table).insertOne(item).then((data) => {
                        delete item[Data_Field._ID];
                        callback(item);
                    }).catch(error => {
                        Log.error("DATA-MONGO-BASE-UPDATE-ITEM-BASE-ERROR",error);
                    });
                }
            }else{ // -- update --
                item.date_save = DateTime.get();
                if(!option.overwrite){
                    const update_id = new ObjectId(item[Data_Field.ID]);
                    const query = { _id: update_id };
                    delete item[Data_Field.ID];
                    database.collection(table).updateOne(query,{$set: item}).then((data) => {
                        item[Data_Field.ID] = update_id.toString();
                        callback(item);
                    }).catch(error => {
                        Log.error("DATA-MONGO-BASE-UPDATE-ITEM-BASE-ERROR",error);
                    });
                }else{
                    const update_id = new ObjectId(item[Data_Field.ID]);
                    const query = { _id: update_id };
                    delete item[Data_Field.ID];
                    database.collection(table).replaceOne(query,item).then((data) => {
                        item[Data_Field.ID] = update_id.toString();
                        callback(item);
                    }).catch(error => {
                        Log.error("DATA-MONGO-BASE-UPDATE-ITEM-BASE-ERROR",error);
                    });
                }
            }
        });
    }
    static post_bulk_base = (database,table,data_items) => {
        return new Promise((callback) => {
            let data = {result_OK:false};
            let bulk_items = [];
            let date_create = DateTime.get();
            for(let a = 0; a < data_items.length; a++){
                let item = {insertOne:{document:data_items[a]}};
                data_items[a].date_create = date_create;
                bulk_items.push(item);
            }

            if(Mongo.check_database(database)){
                try {
                    database.collection(table).bulkWrite(bulk_items,
                        { ordered: false } )
                } catch( error ) {
                    Log.w('bulk_write_error',error);
                    Log.error("DATA-MONGO-BASE-DELETE-ITEM-BASE-ERROR",error);
                }
                data.result_OK= true;
                callback(data);
            }
        });
    }
    static delete_item = (database,table,id,option) => {
        return new Promise((callback) => {
            let data = null;
            if(Mongo.check_database(database)){
                const query = { _id: new ObjectId(id) };
                database.collection(table).deleteOne(query).then((data) => {
                    if(data){
                        data = data.deletedCount;
                    };
                    callback(data);
                }).catch(error => {
                    Log.error("DATA-MONGO-BASE-DELETE-ITEM-BASE-ERROR",error);
                });
            }
        });
    }
    static delete_items = (database,table,filter) => {
        return new Promise((callback) => {
            let data = null;
            if(Mongo.check_database(database)){
                database.collection(table).deleteMany(filter).then((data) => {
                    if(data){
                        data = data;
                    }
                    callback(data);
                }).catch(error => {
                    Log.error("DATA-MONGO-BASE-DELETE-lIST-BASE-ERROR",error);
                });
            }
        });
    }
    static get_ids = (database,table,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let total_count = 0;
            let data_items = [];
            let collection = {};
            async.series([
                function(call) {
                    if(page_size>0){
                        if(Mongo.check_database(database)){
                            database.collection(table).countDocuments(filter).then((data) => {
                                if(data){
                                    total_count = data;
                                }
                                call();
                            }).catch(error => {
                                Log.error("DATA-MONGO-BASE-GET-SQL-PAGING-TBLiD-BASE-ERROR-1",error);
                            });
                        }else{
                            Log.error("DATA-MONGO-BASE-GET-SQL-PAGING-TBLID-BASE-ERROR-2",error);
                        }
                    }else{
                        call();
                    }
                },
                function(call) {
                    if(Mongo.check_database(database)){
                        page_current = parseInt(page_current);
                        page_size = parseInt(page_size);
                        database.collection(table).find(filter).sort(sort_by).collation({locale:"en_US",numericOrdering:true}).skip(page_current>0?((page_current-1)*page_size):0).limit(page_size).project({table:1,_id:1}).toArray().then((data) => {
                            if(data){
                                data_items = [...data];
                            }
                            call();
                        }).catch(error => {
                            Log.error("DATA-MONGO-BASE-GET-SQL-PAGING-TBlID-BASE-ERROR-3",error);
                        });
                    }else{
                        Log.error("DATA-Mongo-Base-Get-SQL-PAGING-TBLID-BASE-ERROR-4",error);
                    }
                },
                function(call) {
                    for(const item of data_items){
                        item[Data_Field.ID] = new ObjectId(item[Data_Field._ID]).toString();
                        delete item[Data_Field._ID];
                    }
                    call();
                },
                function(call) {
                    if(page_size==0){
                        total_count = data_items.length;
                    }
                    call();
                }

            ]).then(result => {
                callback([total_count,data_items]);
            }).catch(error => {
                Log.error("PROJECT-FILENAME-UPDATE-BLANK-ERROR-5",error);
            });
        });
    }
    static get_count_items = async (database,table,filter,option) => {
        return new Promise((callback) => {
            let data = 0;
            database.collection(table).countDocuments(filter).then((data) => {
                if(data){
                    data = data;
                }
                callback(data);
            }).catch(error => {
                Log.error("DATA-MONGO-BASE-COUNT-ITEM-LIST-BASE-ERROR",error);
            });
        });
    }
}
module.exports = {
    Mongo
};
