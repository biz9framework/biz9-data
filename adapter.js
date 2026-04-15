/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Adapter
*/
const async = require('async');
const {Mongo}= require("./mongo.js");
const {Cache} = require('./redis.js');
const {Data_Logic,Data_Title,Data_Field,Data_Type}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Log,Str,Num,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
class Adapter {
    static get_database=(data_config,option)=>{
        return new Promise((callback) => {
            (async () => {
                const biz_data = await Mongo.get(data_config);
                biz_data.data_config=data_config;
                callback(biz_data);
            })();
        });
    }
    static delete_database=(database,option)=>{
        return new Promise((callback) => {
            (async () => {
                const biz_data = await Mongo.delete(database);
                biz_data.data_config=data_config;
                callback(biz_data);
            })();
        });
    }
    static check_database=(database,option)=>{
        return Mongo.check(database,option);
    }
    static post_items=(database,cache,items,option)=>{
        return new Promise((callback) => {
            let item_data_new_list=[];
            async.series([
                async function(call){
                    for(const item of items){
                        for(const property in item){
                            if(property!=Data_Field.ID&&property!=Data_Field.TABLE){
                                if(!item[property]){
                                    delete item[property];
                                }
                            }
                        }
                    }
                },
                async function(call){
                    for(const item of items){
                        const data = await Mongo.post_item(database,item.table,item);
                        if(!Str.check_is_null(data.id)){
                            item_data_new_list.push(data);
                            Cache.delete_value(cache,Adapter.get_cache_item_attr_list_key(item.table,data.id)).then((data) => {
                            }).catch(error => {
                                Log.error("Data-Adapter-Update-Item-List-2",error);
                            });
                        }
                    }
                },
                async function(call){
                    for(const item of item_data_new_list) {
                        item.source=Data_Title.SOURCE_DATABASE;
                        delete item._id;
                    }
                },
            ]).then(result=>{
                callback(item_data_new_list);
            }).catch(error => {
                Log.error("Data-Adapter-Update-Item-List-5",error);
            });
        });
    }
    static post_item=(database,cache,table,item_data,option) => {
        return new Promise((callback) => {
            async.series([
                async function(call){
                    const biz_data = await Mongo.post_item(database,table,item_data,option);
                },
                async function(call){
                    if(item_data.id){
                        item_data.source=Data_Title.SOURCE_DATABASE;
                    }
                },
                async function(call){
                    const data = await Cache.delete_value(cache,Adapter.get_cache_item_attr_list_key(item_data.table,item_data.id));
                },
            ]).then(result => {
                callback(item_data);
            }).catch(error => {
                Log.error("Data-Adapter-Update-Item-Adapter-2",error);
            });
        });
    }
    static get_item_list = (database,cache,table,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let item_id_list = [];
            let items = [];
            let item_count = 0;
            let page_count = 0;
            async.series([
                async function(call) {
                    if(!page_current){
                        page_current=1;
                    }
                    const [total_count,data_list] = await Mongo.get_id_list(database,table,filter,sort_by,page_current,page_size,option);
                    if(data_list.length>0){
                        item_count=total_count;
                        item_id_list=data_list;
                    }
                },
                async function(call) {
                    if(item_id_list.length>0){
                        for(const item of item_id_list) {
                            const biz_data = await Adapter.get_item_cache_db(database,cache,table,item.id,option);
                            if(biz_data){
                                delete biz_data['_id'];
                                items.push(biz_data);
                            }
                        }
                    }
                },
                //distinct
                async function(call){
                    if(option.distinct){
                        items = items.filter((obj, index, self) =>
                            index === self.findIndex((t) => t[option.distinct.field] === obj[option.distinct.field])
                        );
                        let distinct_sort_by = option.distinct.sort_by ? option.distinct.sort_by : Data_Type.SORT_BY_ASC;
                        items = Obj.sort_items_by_field(items,option.distinct.field,distinct_sort_by);
                        item_count=items.length;
                    }
                },
                async function(call) {
                    page_count = !Str.check_is_null(Math.round(item_count/page_size+1)) ? Math.round(item_count/page_size+1) : 0;
                    page_count = page_count == "Infinity" || Str.check_is_null(page_count) ? 1 : page_count;
                    item_count = Str.check_is_null(item_count) ? "0" : item_count;
                    page_size = Str.check_is_null(page_size) ? "0" : page_size;
                }
            ]).then(result => {
                callback([items,item_count,page_count]);
            }).catch(error => {
                Log.error("Get-Item-List-Adapter-3",error);
            });
        });
    }
    static get_item = (database,cache,table,id,option) => {
        return new Promise((callback) => {
            if(!option){
                option = {};
            }
            let data = Data_Logic.get(table,id);
            option = option ?? {};
            async.series([
                async function(call) {
                    // --- option-id_field-logic --
                    if(!option.id_field){
                        const biz_data = await Adapter.get_item_cache_db(database,cache,data.table,data.id,option);
                        if(biz_data.id){
                            data = biz_data;
                        }else{
                            data = Data_Logic.get_not_found(table,id);
                        }
                    }else{
                        let query_field={};
                        query_field[option.id_field] = id;
                        let page_current=1;
                        let page_size=0;
                        const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,table,query_field,{},page_current,page_size,option);
                        if(items.length>0){
                            delete items[0]['_id'];
                            data = items[0];
                        }else{
                            data = Data_Logic.get_not_found(table,id);
                            data.id_field = option.id_field ? option.id_field : Data_Field.ID;
                        }
                    }
                },
            ]).then(result => {
                callback(data);
            }).catch(error => {
                Log.error("Adapter-Get-Item-Adapter-5",error);
            });
        });
    }
    static post_cache_item = (cache,table,id,item_data) => {
        return new Promise((callback) => {
            let cache_string_str = '';
            let prop_list = [];
            async.series([
                async function(call) {
                    for (const prop in item_data) { if(prop != Data_Field.SOURCE){
                        prop_list.push({title:prop,value:item_data[prop]});
                    }
                    }
                },
                async function(call) {
                    for(const item of prop_list) {
                        cache_string_str=cache_string_str+item.title+',';
                        await Cache.post_value(cache,Adapter.get_cache_item_attr_key(table,id,item.title),item.value);
                    }
                },
                async function(call) {
                    const data = await Cache.post_value(cache,Adapter.get_cache_item_attr_list_key(table,id),cache_string_str);
                },
            ]).then(result => {
                callback(item_data);
            }).catch(error => {
                Log.error("Data-Adapter-Set-Cache-Item-2",error);
            });
        });
    }
    static delete_item = (database,cache,table,id,option) => {
        return new Promise((callback) => {
            let data = Data_Logic.get(table,id);
            async.series([
                async function(call) {
                    const biz_data = await Adapter.delete_item_cache_db(database,cache,table,id);
                    data = biz_data;
                },
            ]).then(result => {
                callback(data);
            }).catch(error => {
                Log.error("Adapter-Get-Item-Adapter-4",error);
            });
        });
    }
    static get_item_cache_db = (database,cache,table,id,option) => {
        return new Promise((callback) => {
            let cache_key_list = [];
            let item_data = Data_Logic.get(table,id);
            let field_list = [];
            let hide_field_list = [];
            option = option ? option : {};
            async.series([
                //cache_field_list
                async function(call) {
                    const data = await Cache.get_value(cache,Adapter.get_cache_item_attr_list_key(table,id));
                    if(data){
                        cache_key_list=data.split(',');
                    }
                },
                async function(call) {
                    if(cache_key_list.length==0){
                        // -- db-logic
                        const data = await Mongo.get_item(database,table,id);
                        if(data){
                            delete data['_id'];
                            item_data = data;
                            const data2 = await Adapter.post_cache_item(cache,table,id,data);
                            item_data[Data_Type.SOURCE] = Data_Title.SOURCE_DATABASE;
                        }else{
                            item_data  = Data_Logic.get_not_found(table,id);
                        }
                    }else{
                        // -- cache-logic
                        for(const item of cache_key_list) {
                            if(item){
                                const val = await Cache.get_value(cache,Adapter.get_cache_item_attr_key(table,id,item));
                                if(val){
                                    item_data[item] = val;
                                }else{
                                    item_data[item] = null;
                                }
                            }
                        }
                        item_data[Data_Field.SOURCE] = Data_Title.SOURCE_CACHE;
                    }
                },
                async function(call) {
                    // -- option-field-logic
                    if(option.field){
                        //option.field = Obj.merge(option.field,{id:1});
                        for(const field in option.field) {
                            if(field){
                                let new_item = {};
                                new_item[field] = option.field[field];
                                if(new_item[field]){
                                    field_list.push({field:field,value:new_item[field]});
                                }else{
                                    if(field != Data_Field.ID){
                                        hide_field_list.push({field:field,value:new_item[field]});
                                    }
                                }
                            }
                        }
                    }
                },
                async function(call) {
                    if(field_list.length>0){
                        let field_data = {};
                        for(const item of field_list) {
                            if(item_data[item.field]){
                                field_data[item.field] = item_data[item.field]
                            }else{
                                field_data[item.field] = '';
                            }
                        }
                        field_data[Data_Field.ID] = item_data[Data_Field.ID];
                        item_data = field_data;
                    }
                },
                async function(call) {
                    if(hide_field_list.length>0){
                        let field_data = {};
                        for(const item of hide_field_list) {
                            if(item.field != Data_Field.ID){
                                delete item_data[item.field];
                            }
                        }
                    }
                },

            ]).then(result => {
                callback(item_data);
            }).catch(error => {
                Log.error("Data-Adapter-Get-Item-Cache-DB",error);
            });
        });
    }
    static delete_item_list = (database,cache,table,filter,option) => {
        return new Promise((callback) => {
            let item_id_list = [];
            let item_count = 0;
            let item_data_new_list = [];
            option = option ? option : {};
            async.series([
                async function(call) {
                    const [total_count,data_list] = await Mongo.get_id_list(database,table,filter,{},0,9999,option);
                    item_count=total_count;
                    item_id_list=data_list;
                },
                async function(call){
                    const data = await Mongo.delete_item_list(database,table,filter);
                },
                async function(call) {
                    var list = [];
                    for(const item of item_id_list) {
                        const biz_data = await Adapter.delete_item_cache_db(database,cache,table,item.id);
                        item_data_new_list.push(biz_data);
                    };
                },
            ]).then(result => {
                callback(item_data_new_list);
            }).catch(error => {
                Log.error("Data-Adapter-Delete-Item-List-Adapter-3",error);
            });
        });
    }
    static delete_item_cache=(database,cache,table,id,option)=>{
        return new Promise((callback)=>{
            let cache_key_list = '';
            let cache_string_list = '';
            let item_data = Data_Logic.get(table,id);
            async.series([
                async function(call) {
                    const data = await Cache.get_value(cache,Adapter.get_cache_item_attr_list_key(table,id));
                    cache_key_list=data;
                },
                async function(call) {
                    if(cache_key_list!=null){
                        cache_string_list =cache_key_list.split(',');
                    }
                    for(const item of cache_string_list) {
                        if(item){
                            const val = await Cache.delete_value(cache,Adapter.get_cache_item_attr_key(table,id,item));
                        }
                    }
                },
                async function(call){
                    const data = await Cache.delete_value(cache,Adapter.get_cache_item_attr_list_key(table,id));
                },
            ]).then(result => {
                callback(item_data);
            }).catch(error => {
                Log.error("Data-Adapter-Delete-Item-Cache-5",error);
            });
        });
    }
    static delete_item_cache_db = (database,cache,table,id) => {
        return new Promise((callback) => {
            let cache_key_list = '';
            let cache_string_list = '';
            let data = Data_Logic.get(table,id);
            let delete_count = 0;
            async.series([
                async function(call) {
                    const biz_data = await Cache.get_value(cache,Adapter.get_cache_item_attr_list_key(table,id));
                    cache_key_list=biz_data;
                },
                async function(call) {
                    if(cache_key_list!=null){
                        cache_string_list =cache_key_list.split(',');
                    }
                    for(const item of cache_string_list) {
                        if(item){
                            const val = await Cache.delete_value(cache,Adapter.get_cache_item_attr_key(table,id,item));
                        }
                    }
                },
                async function(call){
                    const biz_data = await Cache.delete_value(cache,Adapter.get_cache_item_attr_list_key(table,id));
                },
                async function(call){
                    const biz_data = await Mongo.delete_item(database,table,id);
                    delete_count = biz_data;
                },
            ]).then(result => {
                callback(delete_count);
            }).catch(error => {
                Log.error("Data-Adapter-Delete-Item-Cache-DB-5",error);
            });
        });
    }
    static get_count_item_list = (database,table,filter) => {
        return new Promise((callback) => {
            let data = {};
            async.series([
                async function(call) {
                    const biz_data = await Mongo.get_count_item_list(database,table,filter);
                    data =  Str.check_is_null(biz_data) ?0 : biz_data;
                },
            ]).then(result => {
                callback(data);
            }).catch(error => {
                Log.error("Data-Adapter-Count-Item-List",error);
            });
        });
    }
    static post_bulk=(database,cache,table,items) => {
        return new Promise((callback) => {
            let data ={result_OK:false};
            async.series([
                async function(call){
                    const biz_data = await post_bulk_main(database,table,items);
                    if(biz_data.result_OK){
                        data = biz_data;
                    }
                },
            ]).then(result => {
                callback(data);
            }).catch(error => {
                Log.error("Data-Adapter-Update-Item-Adapter-END",error);
            });
        });
    }
    static get_cache_item_attr_key = (table,id,key) => {
        return table + "_" + key + "_" + String(id);
    }
    static get_cache_item_attr_list_key = (table,id) => {
        return table+"_aik_"+String(id);
    }
}
module.exports = {
    Adapter
};
