/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Core-DataZ
*/
module.exports = function(){
    module.update =async function(db,data_type,item,callback){
        get_guid=function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        var error=null;
        var collection = {};
        if (String(item.tbl_id)=='0') {//insert
            item.tbl_id = get_guid();
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
    module.get=function(db,data_type,tbl_id,callback){
        var error=null;
        var data = {};
        var collection = {};
        async function run() {
            if(dataz.db_client_connected(db)){
                collection = db.collection(data_type);
                data = await collection.find({tbl_id:tbl_id}).toArray();
                callback(error,data);
            }else{
                callback('error_mongo_db_get',data);
            }
        }
        run();
    }
    module.get_sql_tbl_id=function(db,data_type,sql_obj,sort_by,callback){
        var error=null;
        var data_list = []
        var collection = {};
        async function run() {
            if(dataz.db_client_connected(db)){
                collection = db.collection(data_type);
                data_list = await collection.find(sql_obj).project({tbl_id:1,data_type:1}).sort(sort_by).collation({locale:"en_US",numericOrdering:true}).toArray();
                callback(null,data_list);
            }else{
                callback('error_mongo_db_get_sql_tbl_id',data_list);
            }
        }
        run();
    }
    module.delete=function(db,data_type,tbl_id,callback){
        var error=null;
        var collection={};
        async function run() {
            if(dataz.db_client_connected(db)){
                collection = db.collection(data_type);
                data = await collection.deleteMany({tbl_id:tbl_id});
                callback(null,data);
            }else{
                callback('error_mongo_db_delete',data);
            }
        }
        run();
    }
    module.delete_sql=function(db,data_type,sql_obj,callback){
        var error=null;
        var collection={};
        async function run() {
            if(dataz.db_client_connected(db)){
                collection = db.collection(data_type);
                data = await collection.deleteMany(sql_obj);
                callback(null,data);
            }else{
                callback('error_mongo_db_delete_sql',data);
            }
        }
        run();
    }
    module.get_paging_sql_tbl_id=function(db,data_type,sql_obj,sort_by,current_page,page_size,callback){
        var total_count = 0;
        var data_list = [];
        var current_page=current_page?current_page:1;
        var page_size=page_size?page_size:999;
        var error=null;
        async.series([
            function(call){
                const run = async function(a,b){
                    if(dataz.db_client_connected(db)){
                        total_count= await db.collection(data_type).countDocuments(sql_obj);
                        call();
                    }else{
                        call();
                    }
                }
                run();
            },
            function(call){
                async function run() {
                    if(dataz.db_client_connected(db)){
                        data_list = await db.collection(data_type).find(sql_obj,{tbl_id:1,data_type:1}).sort(sort_by).skip(current_page>0?((current_page-1)*page_size):0).limit(page_size).collation({locale:"en_US",numericOrdering:true}).toArray();
                        call();
                    }else{
                        call();
                    }
                }
                run();
            },
        ],
            function(errors,result){
                callback(error,total_count,data_list);
            });
    }
    module.drop=function(db,title,callback){
        var error=null;
        var collection={};
        async function run() {
            if(dataz.db_client_connected(db)){
                collection = db.collection(title);
                data = await collection.drop();
                callback(null,data);
            }else{
                callback('error_db_drop',data);
            }
        }
        run();
    }
    module.count=function(db,data_type,sql,callback){
        var total_count=0;
        var error=null;
        async.series([
            function(call){
                const run = async function(a,b){
                    if(dataz.db_client_connected(db)){
                        total_count= await db.collection(data_type).countDocuments(sql);
                        call();
                    }else{
                        call();
                    }
                }
                run();
            },
        ],
            function(errors,result){
                callback(error,total_count);
            });
    }
    return module;
}
