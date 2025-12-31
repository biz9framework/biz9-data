/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Adapter
*/
const async = require('async');
const {get_db_connect_main,check_db_connect_main,delete_db_connect_main,post_item_main,post_bulk_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,get_count_item_list_main} = require('./mongo/index.js');
const {get_cache_connect_main,delete_cache_connect_main,get_cache_string_main,delete_cache_string_main,post_cache_string_main} = require('./redis/index.js');
const {DataItem,Type}=require("biz9-logic");
const {Log,Str,Num,Obj}=require("biz9-utility");
const DB_TITLE='DB';
const CACHE_TITLE='CACHE';
const NOT_FOUND_TITLE='NOT-FOUND';
const get_db_connect_adapter=(data_config,option)=>{
    return new Promise((callback) => {
        get_db_connect_main(data_config).then(([error,data])=>{
            data.data_config=data_config;
            callback([error,data]);
        }).catch(error => {
            Log.error("Data-Adapter-Get-DB-Adapter",error);
            callback([error,null]);
        });
    });
}
const delete_db_connect_adapter=(db_connect,option)=>{
    return new Promise((callback) => {
        delete_db_connect_main(db_connect).then(([error,data])=>{
            callback([error,data]);
        }).catch(error => {
            Log.error("Data-Adapter-Close-DB-Connect-Adapter",error);
            callback([error,null]);
        });
    });
}
const check_db_connect_adapter=(db_connect,option)=>{
    return check_db_connect_main(db_connect,option);
}
const post_item_list_adapter=(db_connect,item_data_list,option)=>{
    return new Promise((callback) => {
        let cache_connect = {};
        let item_data_new_list=[];
        async.series([
          async function(call) {
                const [error,data] = await get_cache_connect_main(db_connect.data_config);
                cache_connect = data;
            },
              function(call){
                async.forEachOf(item_data_list,(item,key,go)=>{
                    for(property in item[key]){
                        if(row!='id'&&row!='data_type'){
                            if(!item[key][row]){
                                delete item[key][row];
                            }
                        }
                    }
                    go();
                }, error => {
                    if(error){
                        error=error;
                    }
                    call();
                });
            },
            function(call){
                async.forEachOf(item_data_list,(item,key,go)=>{
                    if(item){
                        post_item_main(db_connect,item.data_type,item).then(([error,data]) => {
                            if(data){
                                item.id=data.id;
                                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(item.data_type,data.id)).then(([error,data]) => {
                                    go();
                                }).catch(error => {
                                    Log.error("Data-Adapter-Update-Item-List-2",error);
                                    callback([error,null]);
                                });
                            }else{
                                go();
                            }
                        }).catch(error => {
                            Log.error("Data-Adapter-Update-Item-List-3",error);
                            callback([error,[]]);
                        });
                    }else{
                        go();
                    }
                }, error => {
                    if(error){
                        error=error;
                    }
                    call();
                });
            },
            async function(call){
                for(const item of item_data_list) {
                    item.source=DB_TITLE;
                    item_data_new_list.push(item);
                }
            },
        ]).then(result=>{
            callback([error,item_data_new_list]);
        }).catch(error => {
            Log.error("Data-Adapter-Update-Item-List-5",error);
            callback([error,[]]);
        });
    });
}
const post_item_adapter=(db_connect,data_type,item_data,option) => {
    return new Promise((callback) => {
        let cache_connect={};
        async.series([
            async function(call) {
                const [error,data] = await get_cache_connect_main(db_connect.data_config);
                cache_connect = data;
            },
            async function(call){
                const [error,data] = await post_item_main(db_connect,data_type,item_data,option);
            },
            function(call){
                if(item_data.id){
                    item_data.source=DB_TITLE;
                }
                call();
            },
            async function(call){
                const [error,data] = await delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(item_data.data_type,item_data.id));
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Update-Item-Adapter-END",error);
            callback([error,[]]);
        });
    });
}
const get_item_list_adapter = (db_connect,data_type,filter,sort_by,page_current,page_size,option) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let item_id_list = [];
        let item_data_list = [];
        let item_count = 0;
        let page_count = 0;
        async.series([
         async function(call) {
                const [error,data] = await get_cache_connect_main(db_connect.data_config);
                cache_connect = data;
            },
            async function(call) {
                if(!page_current){
                    page_current=1;
                }
                const [error,total_count,data_list] = await get_id_list_main(db_connect,data_type,filter,sort_by,page_current,page_size,option);
                    if(data_list.length>0){
                        item_count=total_count;
                        item_id_list=data_list;
                    }
            },
            async function(call) {
                if(item_id_list.length>0){
                    for(const item of item_id_list) {
                        [error,data] = await get_item_cache_db(cache_connect,db_connect,data_type,item.id,option);
                        if(data){
                            item_data_list.push(data);
                        }
                    }
                }
            },
            function(call) {
                page_count = !Str.check_is_null(Math.round(item_count/page_size+1)) ? Math.round(item_count/page_size+1) : 0;
                page_count = page_count == "Infinity" || Str.check_is_null(page_count) ? "1" : page_count;
                item_count = Str.check_is_null(item_count) ? "0" : item_count;
                page_size = Str.check_is_null(page_size) ? "0" : page_size;
                call();
            }
        ]).then(result => {
            callback([error,item_data_list,item_count,page_count]);
        }).catch(error => {
            Log.error("Get-Item-List-Adapter-3",error);
            callback([error,[]]);
        });
    });
}
const get_item_adapter = (db_connect,data_type,key,option) => {
    return new Promise((callback) => {
        if(!option){
            option = {};
        }
        let cache_connect = {};
        item_data = DataItem.get_new(data_type,0,{key:key});
        async.series([
            async function(call) {
                const [error,data] = await get_cache_connect_main(db_connect.data_config);
                cache_connect = data;
            },
            async function(call) {
                if(option.filter){
                    let sort_by={};
                    let page_current=1;
                    let page_size=0;
                    const [error,data] = await get_item_list_adapter(db_connect,data_type,option.filter,sort_by,page_current,page_size,option);
                        if(data.length>0){
                            item_data = data[0];
                        }else{
                            item_data[Type.FIELD_ID] = 0;
                            item_data[Type.FIELD_SOURCE_KEY] = key;
                            item_data[Type.FIELD_SOURCE] = DB_TITLE;
                            item_data[Type.FIELD_TITLE] = NOT_FOUND_TITLE;
                            item_data[Type.FIELD_TITLE_URL] = Str.get_title_url(NOT_FOUND_TITLE);
                            item_data.filter = option.filter;
                        }
                }
                else if(option.title_url && !Str.check_is_guid(option.title_url)){
                    item_data.title_url = option.title_url;
                    item_data.key = option.title_url;
                    //let filter={title_url:{ $regex: item_data.key, $options: 'i' }};
                    let filter={title_url:item_data.key};
                    let sort_by={title:1};
                    let page_current=1;
                    let page_size=0;
                    const [error,data] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size,option);
                        if(data.length>0){
                            item_data = data[0];
                        }else{
                            item_data[Type.FIELD_ID] = 0;
                            item_data[Type.FIELD_SOURCE_KEY] = key;
                            item_data[Type.FIELD_SOURCE] = DB_TITLE;
                            item_data[Type.FIELD_TITLE] = NOT_FOUND_TITLE;
                            item_data[Type.FIELD_TITLE_URL] = Str.get_title_url(NOT_FOUND_TITLE);
                        }
                }else{
                    const [error,data] = await get_item_cache_db(cache_connect,db_connect,item_data.data_type,item_data.key,option);
                    item_data = data;
                }
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Adapter-Get-Item-Adapter-5",error);
            callback([error,null]);
        });
    });
}
const post_cache_item = (cache_connect,data_type,id,item_data) => {
    return new Promise((callback) => {
        let cache_string_str = '';
        let prop_list = [];
        async.series([
            function(call) {
                for (const prop in item_data) {
                    if(prop != '_id' && prop != 'source'){
                        prop_list.push({title:prop,value:item_data[prop]});
                    }
                }
                call();
            },
            async function(call) {
                for(const item of prop_list) {
                    cache_string_str=cache_string_str+item.title+',';
                    await post_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item.title),item.value);
                }
            },
            async function(call) {
                const [error,data] = await post_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id),cache_string_str);
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Set-Cache-Item-2",error);
            callback([error,null]);
        });
    });
}
const delete_item_adapter = (db_connect,data_type,id,option) => {
    return new Promise((callback) => {
        let item_data = DataItem.get_new(data_type,id);
        async.series([
            async function(call) {
                const [error,data] = await delete_item_cache_db(db_connect,data_type,id);
                item_data = data;
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Adapter-Get-Item-Adapter-4",error);
            callback([error,null]);
        });
    });
}
const get_item_cache_db = (cache_connect,db_connect,data_type,id,option) => {
    return new Promise((callback) => {
        let cache_key_list = [];
        let item_data = DataItem.get_new(data_type,id,{source:NOT_FOUND_TITLE});
        let field_list = [];
        let hide_field_list = [];
        option = option ? option : {};
        function get_blank_item(item){
            item[Type.FIELD_ID] = 0;
            item[Type.FIELD_SOURCE_KEY] = id;
            item[Type.FIELD_SOURCE] = DB_TITLE;
            item[Type.FIELD_TITLE] = NOT_FOUND_TITLE;
            item[Type.FIELD_TITLE_URL] = Str.get_title_url(NOT_FOUND_TITLE);
        }
        async.series([
            //cache_field_list
            async function(call) {
                const [error,data] = await get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id));
                    if(data){
                        cache_key_list=data.split(',');
                    }
            },
            async function(call) {
                if(cache_key_list.length==0){
                    //db
	                const [error,data] = await get_item_main(db_connect,data_type,id);
                    if(data){
                        item_data = data;
                        const [error,data2] = await post_cache_item(cache_connect,data_type,id,data);
                       item_data[Type.FIELD_SOURCE] = DB_TITLE;
                    }else{
                        item_data[Type.FIELD_SOURCE] = get_blank_item(item_data);
                    }
                }else{
                    //cache
                     for(const item of cache_key_list) {
                        if(item){
                            const [error,val] = await get_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item));
                            if(val){
                                item_data[item] = val;
                            }else{
                                item_data[item] = null;
                            }
                        }
                    }
                    item_data[Type.FIELD_SOURCE] = CACHE_TITLE;
                }
            },
            async function(call) {
                if(option.field){
                    for(const field in option.field) {
                        let new_item = {};
                        new_item[field] = option.field[field];
                        if(new_item[field]){
                            field_list.push({field:field,value:new_item[field]});
                        }else{
                            hide_field_list.push({field:field,value:new_item[field]});
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
                    item_data = field_data;
                }
            },
            async function(call) {
                if(hide_field_list.length>0){
                    let field_data = {};
                    for(const item of hide_field_list) {
                        delete item_data[item.field];
                    }
                }
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Get-Item-Cache-DB",error);
            callback([error,null]);
        });
    });
}
const delete_item_list_adapter = (db_connect,data_type,filter,option) => {
    return new Promise((callback) => {
        let item_id_list = [];
        let item_data_new_list = [];
        async.series([
            async function(call) {
                const [error,total_count,data_list] = await get_id_list_main(db_connect,data_type,filter,{},0,9999,option);
                    error=error;
                    total_count=total_count;
                    item_id_list=data_list;
            },
            async function(call){
                const [error,data] = await delete_item_list_main(db_connect,data_type,filter);
            },
            async function(call) {
                var list = [];
                for(const item of item_id_list) {
                    [error,data] = await delete_item_cache_db(db_connect,data_type,item.id);
                    item_data_new_list.push(data);
                };
            },
        ]).then(result => {
            callback([error,item_data_new_list]);
        }).catch(error => {
            Log.error("Data-Adapter-Delete-Item-List-Adapter-3",error);
            callback([error,[]]);
        });
    });
}
const delete_item_cache=(db_connect,data_type,id,option)=>{
    return new Promise((callback)=>{
        let cache_connect = {};
        let cache_key_list = '';
        let cache_string_list = '';
        let item_data = DataItem.get_new(data_type,id);
        async.series([
             async function(call) {
                const [error,data] = await get_cache_connect_main(db_connect.data_config);
                cache_connect = data;
            },
            async function(call) {
                const [error,data] = await get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id));
                    cache_key_list=data;
            },
            async function(call) {
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    if(item){
                        const [error,val] = await delete_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item));
                    }
                }
            },
            async function(call){
                const [error,data] = await delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id));
                item_data.cache_del = true;
                item_data.cache_item_attr_list = get_cache_item_attr_list_key(data_type,id);
            },
            function(call) {
                call();
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Delete-Item-Cache-5",error);
            callback([error,null]);
        });
    });
}
const delete_item_cache_db = (db_connect,data_type,id) => {
    return new Promise((callback) => {
        let cache_connect = {};
        let cache_key_list = '';
        let cache_string_list = '';
        let item_data = DataItem.get_new(data_type,id);
        async.series([
            async function(call) {
                const [error,data] = await get_cache_connect_main(db_connect.data_config);
                cache_connect = data;
            },
            async function(call) {
                const [error,data] = await get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id));
                    cache_key_list=data;
            },
            async function(call) {
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    if(item){
                        const [error,val] = await delete_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item));
                    }
                }
            },
            async function(call){
                const [error,data] = await delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id));
                item_data.cache_del = true;
            },
            async function(call){
                const [error,data] = await delete_item_main(db_connect,data_type,id);
                item_data.db_del = true;
            },
            function(call) {
                call();
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Delete-Item-Cache-DB-5",error);
            callback([error,null]);
        });
    });
}
const get_count_item_list_adapter = (db_connect,data_type,filter,option) => {
    return new Promise((callback) => {
        let item_data = {};
        async.series([
            async function(call) {
                const [error,data] = await get_count_item_list_main(db_connect,data_type,filter);
                    item_data.count = data;
                    item_data.data_type = data_type;
                    item_data.filter = filter;
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Count-Item-List",error);
            callback([error,null]);
        });
    });
}
const post_bulk_adapter=(db_connect,data_type,item_data_list) => {
    return new Promise((callback) => {
        let cache_connect={};
        let data ={result_OK:false};
        async.series([
            async function(call){
                const [biz_error,biz_data] = await post_bulk_main(db_connect,data_type,item_data_list);
                if(biz_data.result_OK){
                        data = biz_data;
                    }
            },
        ]).then(result => {
            callback([error,data]);
        }).catch(error => {
            Log.error("Data-Adapter-Update-Item-Adapter-END",error);
            callback([error,[]]);
        });
    });
}
const get_cache_item_attr_key = (data_type,id,key) => {
    return data_type + "_" + key + "_" + String(id);
}
const get_cache_item_attr_list_key = (data_type,id) => {
    return data_type+"_aik_"+String(id);
}
module.exports = {
    get_db_connect_adapter,
    check_db_connect_adapter,
    delete_db_connect_adapter,
    post_item_adapter,
    post_item_list_adapter,
    post_bulk_adapter,
    get_item_adapter,
    get_item_list_adapter,
    delete_item_list_adapter,
    get_count_item_list_adapter,
    delete_item_adapter,
    delete_item_cache
};
