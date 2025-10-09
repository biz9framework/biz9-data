/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Adapter
*/
const async = require('async');
const {get_db_connect_main,check_db_connect_main,delete_db_connect_main,post_item_main,post_bulk_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,get_count_item_list_main} = require('./mongo/index.js');
const {get_cache_connect_main,delete_cache_connect_main,get_cache_string_main,delete_cache_string_main,post_cache_string_main} = require('./redis/index.js');
const {DataItem}=require("biz9-logic");
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
            function(call) {
                get_cache_connect_main(db_connect.data_config,option).then(([error,data])=>{
                    cache_connect=data;
                    call();
                }).catch(error=>{
                    Log.error("Data-Adapter-Update-Item-List-Adapter",error);
                    callback([error,[]]);
                });
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
                            item.id=data.id;
                            if(data){
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
                    item.app_id = db_connect.data_config.APP_ID;
                    item_data_new_list.push(item);
                }
            },
            function(call){
                delete_cache_connect_main(cache_connect).then(([error,data])=>{
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Update-Item-List-4-Error",error);
                    callback([error,[]]);
                });
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
            function(call){
                get_cache_connect_main(db_connect.data_config,option).then(([error,data])=>{
                    cache_connect=data;
                    call();
                }).catch(error=>{
                    Log.error("Data-Adapter-Update-Item-Adapter",error);
                    callback([error,[]]);
                });
            },
            function(call){
                post_item_main(db_connect,data_type,item_data,option).then(([error,data])=>{
                    call();
                }).catch(error=>{
                    Log.error("Data-Adapter-Update-Item-Adapter-2",error);
                    callback([error,[]]);
                });
            },
            function(call){
                item_data.app_id=db_connect.data_config.APP_ID;
                if(item_data.id){
                    item_data.source=DB_TITLE;
                }
                call();
            },
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(item_data.data_type,item_data.id)).then(([error,data]) => {
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Update-Item-Adapter-3",error);
                    callback([error,[]]);
                });
            },
            function(call) {
                delete_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Update-Item-Adapter-4",error);
                    callback([error,[]]);
                });
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
            function(call) {
                get_cache_connect_main(db_connect.data_config,option).then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    Log.error("Get-Item-List-Adapter",error);
                    callback([error,[]]);
                });
            },
            function(call) {
                if(!page_current){
                    page_current=1;
                }
                get_id_list_main(db_connect,data_type,filter,sort_by,page_current,page_size,option).then(([error,total_count,data_list]) => {
                    error=error;
                    if(data_list.length>0){
                        item_count=total_count;
                        item_id_list=data_list;
                    }
                    call();
                }).catch(error => {
                    Log.error("Get-Item-List-Adapter-2",error);
                    callback([error,[]]);
                });
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
        item_data = DataItem.get_new(data_type,0,{app_id:db_connect.app_id,key:key});
        async.series([
            function(call) {
                get_cache_connect_main(db_connect.data_config).then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    Log.error("Adapter-Get-Item-Adapter",error);
                    callback([error,null]);
                });
            },
            function(call) {
                if(option.filter){
                    let sort_by={};
                    let page_current=1;
                    let page_size=0;
                    get_item_list_adapter(db_connect,data_type,option.filter,sort_by,page_current,page_size,option).then(([error,data]) => {
                        if(data.length>0){
                            item_data = data[0];
                        }else{
                            item_data.source = NOT_FOUND_TITLE;
                            item_data.filter = option.filter;
                        }
                        item_data.app_id = db_connect.app_id;
                        call();
                    }).catch(error => {
                        Log.error("Adapter-Get-Item-Adapter-1",error);
                        callback([error,null]);
                    });
                }
                else if(option.title_url && !Str.check_is_guid(option.title_url)){
                    item_data.title_url = option.title_url;
                    item_data.key = option.title_url;
                    let filter={title_url:{ $regex: item_data.key, $options: 'i' }};
                    let sort_by={};
                    let page_current=1;
                    let page_size=0;
                    get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size,option).then(([error,data]) => {
                        if(data.length>0){
                            item_data = data[0];
                        }else{
                            item_data.source = NOT_FOUND_TITLE;
                        }
                        item_data.app_id = db_connect.app_id;
                        call();
                    }).catch(error => {
                        Log.error("Adapter-Get-Item-Adapter-2",error);
                        callback([error,null]);
                    });
                }else{
                    get_item_cache_db(cache_connect,db_connect,item_data.data_type,item_data.key,option).then(([error,data]) => {
                        if(data){
                            item_data = data;
                        }else{
                            item_data.source = NOT_FOUND_TITLE;
                        }
                        item_data.app_id = db_connect.app_id;
                        call();
                    }).catch(error => {
                        Log.error("Adapter-Get-Item-Adapter-3",error);
                        callback([error,null]);
                    });
                }
            },
            function(call) {
                delete_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    Log.error("Adapter-Get-Item-Adapter-4",error);
                    callback([error,null]);
                });
            }
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
                for (prop in item_data) {
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
            function(call) {
                post_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id),cache_string_str).then(([error,data]) => {
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Set-Cache-Item",error);
                    callback([error,null]);
                });
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
            function(call) {
                delete_item_cache_db(db_connect,data_type,id).then(([error,data]) => {
                    item_data = data;
                    call();
                }).catch(error => {
                    Log.error("Adapter-Get-Item-Adapter-2",error);
                    callback([error,null]);
                });
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
        let cache_found = false;
        let cache_key_list = null;
        let item_data = DataItem.get_new(data_type,id,{app_id:db_connect.app_id});
        let cache_string_list = [];
        option = option ? option : {get_field:false};
        async.series([
            function(call) {
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    cache_key_list=data;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Get-Item-Cache-DB",error);
                    callback([error,null]);
                });
            },
            async function(call) {
                if(!option.get_field){
                    if(cache_key_list!=null){
                        cache_found = true;
                        cache_string_list =cache_key_list.split(',');
                    }
                    for(const item of cache_string_list) {
                        if(item){
                            const [error,val] = await get_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item));
                            if(val){
                                item_data[item] = val;
                            }else{
                                item_data[item] = null;
                            }
                        }
                    }
                }else{
                    if(cache_key_list!=null){
                        cache_found = true;
                        cache_string_list =option.fields.split(',');
                    }
                    for(const item of cache_string_list) {
                        if(item){
                            const [error,val] = await get_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,id,item));
                            if(val){
                                item_data[item] = val;
                            }else{
                                item_data[item] = null;
                            }
                        }
                    }
                }
            },
            function(call){
                if(cache_found){
                    item_data.source=CACHE_TITLE;
                    call();
                }
                else{
                    get_item_main(db_connect,data_type,id).then(([error,data]) => {
                        if(data){
                            if(!option.get_field){
                                item_data = data;
                                item_data.source = DB_TITLE;
                                post_cache_item(cache_connect,data_type,id,data).then(([error,data2]) => {
                                    call();
                                }).catch(error => {
                                    Log.error("Data-Adapter-Get-Item-Cache-DB-2",error);
                                    callback([error,null]);
                                });
                            }else{
                                for(const item of option.fields.split(',')) {
                                    if(item){
                                        item_data[item] = data[item];
                                    }else{
                                        item_data[item] = null;
                                    }
                                }
                                post_cache_item(cache_connect,data_type,id,data).then(([error,data2]) => {
                                    call();
                                }).catch(error => {
                                    Log.error("Data-Adapter-Get-Item-Cache-DB-2",error);
                                    callback([error,null]);
                                });

                            }

                        }else{
                            item_data.source = NOT_FOUND_TITLE;
                            call();
                        }
                    }).catch(error => {
                        Log.error("Data-Adapter-Get-Item-Cache-DB-3",error);
                        callback([error,null]);
                    });
                }
            },
            function(call) {
                item_data.app_id=db_connect.data_config.APP_ID;
                call();
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
            function(call) {
                get_id_list_main(db_connect,data_type,filter,{},0,9999,option).then(([error,total_count,data_list]) => {
                    error=error;
                    total_count=total_count;
                    item_id_list=data_list;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-List-Adapter-2",error);
                    callback([error,[]]);
                });
            },
            function(call){
                delete_item_list_main(db_connect,data_type,filter).then(([error,data]) => {
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-List-Adapter",error);
                    callback([error,[]]);
                });
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
        let item_data = DataItem.get_new(data_type,id,{app_id:db_connect.app_id});
        async.series([
            function(call) {
                get_cache_connect_main(db_connect.data_config).then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-Cache-1",error);
                    callback([error,null]);
                });
            },
            function(call) {
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    cache_key_list=data;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Get-Item-Cache-2",error);
                    callback([error,null]);
                });
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
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    item_data.cache_del = true;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-Cache-3",error);
                    callback([error,null]);
                });
            },
            function(call) {
                delete_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-Cache-DB-4",error);
                    callback([error,null]);
                });
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
        let item_data = DataItem.get_new(data_type,id,{app_id:db_connect.app_id});
        async.series([
            function(call) {
                get_cache_connect_main(db_connect.data_config).then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-Cache-DB",error);
                    callback([error,null]);
                });
            },
            function(call) {
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    cache_key_list=data;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Get-Item-Cache-DB",error);
                    callback([error,null]);
                });
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
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,id)).then(([error,data]) => {
                    item_data.cache_del = true;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-Cache-DB-2",error);
                    callback([error,null]);
                });
            },
            function(call){
                delete_item_main(db_connect,data_type,id).then(([error,data]) => {
                    item_data.db_del = true;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-Cache-DB-3",error);
                    callback([error,null]);
                });
            },
            function(call) {
                delete_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Delete-Item-Cache-DB-4",error);
                    callback([error,null]);
                });
            },
            function(call) {
                item_data.app_id=db_connect.data_config.APP_ID;
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
            function(call) {
                get_count_item_list_main(db_connect,data_type,filter).then(([error,data]) => {
                    item_data.count = data;
                    item_data.app_id = db_connect.app_id;
                    item_data.data_type = data_type;
                    item_data.filter = filter;
                    call();
                }).catch(error => {
                    Log.error("Data-Adapter-Count-Item-List",error);
                    callback([error,null]);
                });
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
            function(call){
                post_bulk_main(db_connect,data_type,item_data_list).then(([biz_error,biz_data])=>{
                    if(biz_data.result_OK){
                        data = biz_data;
                    }
                    Log.w('aaaaaa22',data);
                    call();
                }).catch(error=>{
                    Log.error("Data-Adapter-Bulk-Item-Adapter-2",error);
                    callback([error,data]);
                });
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
