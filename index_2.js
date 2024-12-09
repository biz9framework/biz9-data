/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
module.exports =async(data_config) =>{
    async = require('async');
    arraySort = require('array-sort');
    Promise = require('bluebird');
    moment = require('moment');
    prettydate = require("pretty-date");
    redis = require('redis');
    exec = require('child_process').exec;

    //works
    //work_end

    const MONGO_FULL_URL="mongodb://"+data_config.mongo_username_password+data_config.mongo_ip+":"+data_config.mongo_port+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
    const { MongoClient } = require("mongodb");
    const uri = MONGO_FULL_URL;
    client_db = new MongoClient(uri);

    /*
    */

    //
    //client_db = new mongo_client(MONGO_FULL_URL, {useNewUrlParser: true,useUnifiedTopology: true});

    //console.log('mongo_url');
    //console.log(MONGO_FULL_URL);
    //console.log(client_db);
    //console.log('mongo_url');


    //old
    //MONGO_FULL_URL="mongodb://"+data_config.mongo_username_password+data_config.mongo_ip+":"+data_config.mongo_port+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
    //mongo_client = require('mongodb').MongoClient;
    //client_db = new mongo_client(MONGO_FULL_URL, {useNewUrlParser: true,useUnifiedTopology: true});
    //old end


    data_mon = require('./dataz/lib/mongo_db.js')();
    cache_red = require('./dataz/lib/redis_cache.js')();
    dataz = require('./dataz/index.js')(data_config);
    redis_url = data_config.redis_url;
    redis_port = data_config.redis_port;

    module.get_client_db_odl=async ()=>{

        const cool3=()=>{
            return new Promise((resolve) =>{
                MONGO_FULL_URL="mongodb://"+data_config.mongo_username_password+data_config.mongo_ip+":"+data_config.mongo_port+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
                const { MongoClient } = require("mongodb");
                const uri = MONGO_FULL_URL;
                const client_db = new MongoClient(uri);
                resolve(client_db.connect());
            });
        }

        console.log('get_client_db_2');
        const sum = await cool3();
        //return sum;
    }
    async function get_client_db() {
        const data = await something();
    }
    module.get_client_db_2=function(callback){
        const get_db_session=()=>{
            return new Promise((resolve) =>{
                MONGO_FULL_URL="mongodb://"+data_config.mongo_username_password+data_config.mongo_ip+":"+data_config.mongo_port+"?retryWrites=true&w=majority&maxIdleTimeMS=60000&connectTimeoutMS=150000&socketTimeoutMS=90000&maxPoolSize=900000&maxConnecting=10000";
                const { MongoClient } = require("mongodb");
                const uri = MONGO_FULL_URL;
                const client_db = new MongoClient(uri);
                resolve(client_db.connect());
            });
        }
        //const sum = await get_db_session();
        //return sum;
        /*
        get_client_db(function(error,client_db)
            {
                callback(error,client_db);
            });
            */

    }
    module.close_client_db=function(client_db,callback){
        dataz.close_client_db(client_db,function(error)
            {
                callback(error);
            });
    }
    module.update_item=function(db,document_title,data_item,callback){
        dataz.update_cache_item(db,document_title,data_item,function(error,data)
            {
                callback(error,data);
            });
    }
    module.update_list=function(db,data_item_list,callback){
        dataz.update_list(db,data_item_list,function(error,data_list)
            {
                callback(error,data_list);
            });
    }
    module.get_item=function(db,data_type,tbl_id,callback){
        dataz.get_cache_item(db,data_type,tbl_id,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_sql=function(db,data_type,sql_obj,sort_by,callback){
        dataz.get_sql_cache(db,data_type,sql_obj,sort_by,function(error,data_list)
            {
                callback(error,data_list);
            });
    }
    module.get_sql_paging=function(db,data_type,sql_obj,sort_by,page_current,page_size,callback){
        dataz.get_sql_paging_cache(db,data_type,sql_obj,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.delete_item=function(db,data_type,tbl_id,callback){
        dataz.delete_cache_item(db,data_type,tbl_id,function(error,data)
            {
                callback(error,data);
            });
    }
    module.delete_sql=function(db,data_type,sql_obj,callback){
        dataz.delete_sql(db,data_type,sql_obj,function(error,data)
            {
                callback(error,data);
            });
    }
    module.delete_list = function(db,data_type,data_item_list,callback){
        dataz.delete_cache_list(db,data_type,data_item_list,function(error,data)
            {
                callback(error,data);
            });
    }
    module.count=function(db,data_type,sql,callback){
        dataz.count(db,data_type,sql,function(error,data)
            {
                callback(error,data);
            });
    }
    module.drop=function(db,title,callback){
        dataz.drop(db,title,function(error,data)
            {
                callback(error,data);
            });
    }
    return module;
}


