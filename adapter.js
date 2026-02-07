/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Adapter
*/
const async = require('async');
const {get_database,delete_database,check_database,get_id_list,post_item,get_item,delete_item,delete_item_list,get_count_item_list}= require("./mongo/base.js");
const {delete_cache,get_cache_value,post_cache_value,delete_cache_value} = require('./redis/base.js');
const {Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Str,Num,Obj}=require("biz9-utility");
const  get_database_adapter=(data_config,option)=>{
    return new Promise((callback) => {
        async function main() {
            const [error,biz_data] = await get_database(data_config);
            biz_data.data_config=data_config;
            callback([error,biz_data]);
        }
        main();
    });
}
const delete_database_adapter=(database,option)=>{
    return new Promise((callback) => {
        async function main() {
            const [error,biz_data] = await delete_database(database);
            biz_data.data_config=data_config;
            callback([error,biz_data]);
        }
        main();
    });
}
const check_database_adapter=(database,option)=>{
    return check_database(database,option);
}
const post_item_list_adapter=(database,cache,item_data_list,option)=>{
    return new Promise((callback) => {
        let error = null;
        let item_data_new_list=[];
        async.series([
            function(call){
                async.forEachOf(item_data_list,(item,key,go)=>{
                    for(property in item[key]){
                        if(property!=Type.FIELD_ID&&property!=Type.FIELD_DATA_TYPE){
                            if(!item[key][property]){
                                delete item[key][property];
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
            async function(call){
                async.forEachOf(item_data_list,(item,key,go)=>{
                    if(item){
                        async function main() {
                            const [error,data] = await post_item(database,item.data_type,item);
                                if(data){
                                    item.id=data.id;
                                    delete_cache_value(cache,get_cache_item_attr_list_key(item.data_type,data.id)).then(([error,data]) => {
                                        go();
                                    }).catch(error => {
                                        Log.error("Data-Adapter-Update-Item-List-2",error);
                                        callback([error,null]);
                                    });
                                }else{
                                    go();
                                }
                        };
                            main();
                    }else{
                        go();
                    }
                }, error => {
                    if(error){
                        error=error;
                    }
                });
            },
            function(call){
                for(const item of item_data_list) {
                    item.source=Type.TITLE_SOURCE_DATABASE;
                    item_data_new_list.push(item);
                }
                call();
            },
        ]).then(result=>{
            callback([error,item_data_new_list]);
        }).catch(error => {
            Log.error("Data-Adapter-Update-Item-List-5",error);
            callback([error,[]]);
        });
    });
}
const post_item_adapter=(database,cache,data_type,item_data,option) => {
    return new Promise((callback) => {
        let error = null;
        async.series([
            async function(call){
                const [biz_error,biz_data] = await post_item(database,data_type,item_data,option);
            },
            function(call){
                if(item_data.id){
                    item_data.source=Type.TITLE_SOURCE_DATABASE;
                }
                call();
            },
            async function(call){
                const [error,data] = await delete_cache_value(cache,get_cache_item_attr_list_key(item_data.data_type,item_data.id));
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Update-Item-Adapter-END",error);
            callback([error,[]]);
        });
    });
}
const get_item_list_adapter = (database,cache,data_type,filter,sort_by,page_current,page_size,option) => {
    return new Promise((callback) => {
        let error = null;
        let item_id_list = [];
        let item_data_list = [];
        let item_count = 0;
        let page_count = 0;
        async.series([
            async function(call) {
                if(!page_current){
                    page_current=1;
                }
                const [error,total_count,data_list] = await get_id_list(database,data_type,filter,sort_by,page_current,page_size,option);
                if(data_list.length>0){
                    item_count=total_count;
                    item_id_list=data_list;
                }
            },
            async function(call) {
                if(item_id_list.length>0){
                    for(const item of item_id_list) {
                        [error,data] = await get_item_cache_db(database,cache,data_type,item.id,option);
                        if(data){
                            delete data['_id'];
                            item_data_list.push(data);
                        }
                    }
                }
            },
			//distinct
			function(call){
				if(option.distinct){
					item_data_list = item_data_list.filter((obj, index, self) =>
						index === self.findIndex((t) => t[option.distinct.field] === obj[option.distinct.field])
					);
						let distinct_sort_by = option.distinct.sort_by ? option.distinct.sort_by : Type.TITLE_SORT_BY_ASC;
						item_data_list = Obj.sort_list_by_field(item_data_list,option.distinct.field,distinct_sort_by);
	    				item_count=item_data_list.length;
                        call();
					}else{
                        call();
                    }
				},
            function(call) {
                page_count = !Str.check_is_null(Math.round(item_count/page_size+1)) ? Math.round(item_count/page_size+1) : 0;
                page_count = page_count == "Infinity" || Str.check_is_null(page_count) ? 1 : page_count;
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
const get_item_adapter = (database,cache,data_type,id,option) => {
    return new Promise((callback) => {
        let error = null;
        if(!option){
            option = {};
        }
        let data = Data_Logic.get(data_type,id);
        option = option ? option : {};
        async.series([
            async function(call) {
                if(!option.id_field){
                    const [biz_error,biz_data] = await get_item_cache_db(database,cache,data.data_type,data.id,option);
                    if(biz_data.id){
                        data = biz_data;
                    }else{
                        data = Data_Logic.get_not_found(data_type,id);
                    }
                }else{
                    let query_field={};
                    query_field[option.id_field] = id;
                    let page_current=1;
                    let page_size=0;
                    const [biz_error,biz_data] = await get_item_list_adapter(database,cache,data_type,query_field,{},page_current,page_size,option);
                    if(biz_data.length>0){
                        delete biz_data['_id'];
                        data = biz_data[0];
                    }else{
                        data = Data_Logic.get_not_found(data_type,id);
                        data.id_field = option.id_field ? option.id_field : Type.FIELD_ID;
                    }
                }
            },
        ]).then(result => {
            callback([error,data]);
        }).catch(error => {
            Log.error("Adapter-Get-Item-Adapter-5",error);
            callback([error,null]);
        });
    });
}
const post_cache_item = (cache,data_type,id,item_data) => {
    return new Promise((callback) => {
        let error = null;
        let cache_string_str = '';
        let prop_list = [];
        async.series([
            function(call) {
                for (const prop in item_data) {
                    if(prop != Type.FIELD_SOURCE){
                        prop_list.push({title:prop,value:item_data[prop]});
                    }
                }
                call();
            },
            async function(call) {
                for(const item of prop_list) {
                    cache_string_str=cache_string_str+item.title+',';
                    await post_cache_value(cache,get_cache_item_attr_key(data_type,id,item.title),item.value);
                }
            },
            async function(call) {
                const [error,data] = await post_cache_value(cache,get_cache_item_attr_list_key(data_type,id),cache_string_str);
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Set-Cache-Item-2",error);
            callback([error,null]);
        });
    });
}
const delete_item_adapter = (database,cache,data_type,id,option) => {
    return new Promise((callback) => {
        let error = null;
        let data = Data_Logic.get(data_type,id);
        data[Type.FIELD_RESULT_OK_DELETE] = false;
        data[Type.FIELD_RESULT_OK_DELETE_CACHE] = false;
        data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = false;
        async.series([
            async function(call) {
                const [biz_error,biz_data] = await delete_item_cache_db(database,cache,data_type,id);
                if(biz_error){
                    error = biz_error;
                }else{
                    data = biz_data;
                    data[Type.FIELD_RESULT_OK_DELETE] = true;
                    data[Type.FIELD_RESULT_OK_DELETE_CACHE] = true;
                    data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = true;
                }
            },
        ]).then(result => {
            callback([error,data]);
        }).catch(error => {
            Log.error("Adapter-Get-Item-Adapter-4",error);
            callback([error,null]);
        });
    });
}
const get_item_cache_db = (database,cache,data_type,id,option) => {
    return new Promise((callback) => {
        let error = null;
        let cache_key_list = [];
        let item_data = Data_Logic.get(data_type,id);
        let field_list = [];
        let hide_field_list = [];
        option = option ? option : {};
        async.series([
            //cache_field_list
            async function(call) {
                const [error,data] = await get_cache_value(cache,get_cache_item_attr_list_key(data_type,id));
                if(data){
                    cache_key_list=data.split(',');
                }
            },
            async function(call) {
                if(cache_key_list.length==0){
                    //db
                    const [error,data] = await get_item(database,data_type,id);
                    if(data){
                        delete data['_id'];
                        item_data = data;
                        const [error,data2] = await post_cache_item(cache,data_type,id,data);
                        item_data[Type.FIELD_SOURCE] = Type.TITLE_SOURCE_DATABASE;
                    }else{
                        item_data  = Data_Logic.get_not_found(data_type,id);
                    }
                }else{
                    //cache
                    for(const item of cache_key_list) {
                        if(item){
                            const [error,val] = await get_cache_value(cache,get_cache_item_attr_key(data_type,id,item));
                            if(val){
                                item_data[item] = val;
                            }else{
                                item_data[item] = null;
                            }
                        }
                    }
                    item_data[Type.FIELD_SOURCE] = Type.TITLE_SOURCE_CACHE;
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
const delete_item_list_adapter = (database,cache,data_type,filter,option) => {
    return new Promise((callback) => {
        let error = null;
        let item_id_list = [];
        let item_count = 0;
        let item_data_new_list = [];
        option = option ? option : {};
        async.series([
            async function(call) {
                const [error,total_count,data_list] = await get_id_list(database,data_type,filter,{},0,9999,option);
                item_count=total_count;
                item_id_list=data_list;
            },
            async function(call){
                const [error,data] = await delete_item_list(database,data_type,filter);
            },
            async function(call) {
                var list = [];
                for(const item of item_id_list) {
                    [error,data] = await delete_item_cache_db(database,cache,data_type,item.id);
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
const delete_item_cache=(database,cache,data_type,id,option)=>{
    return new Promise((callback)=>{
        let error = null;
        let cache_key_list = '';
        let cache_string_list = '';
        let item_data = Data_Logic.get(data_type,id);
        async.series([
           async function(call) {
                const [error,data] = await get_cache_value(cache,get_cache_item_attr_list_key(data_type,id));
                cache_key_list=data;
            },
            async function(call) {
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    if(item){
                        const [error,val] = await delete_cache_value(cache,get_cache_item_attr_key(data_type,id,item));
                    }
                }
            },
            async function(call){
                const [error,data] = await delete_cache_value(cache,get_cache_item_attr_list_key(data_type,id));
                item_data.delete_cache_resultOK = true;
                item_data.cache_item_attr_list = get_cache_item_attr_list_key(data_type,id);
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Data-Adapter-Delete-Item-Cache-5",error);
            callback([error,null]);
        });
    });
}
const delete_item_cache_db = (database,cache,data_type,id) => {
    return new Promise((callback) => {
        let error = null;
        let cache_key_list = '';
        let cache_string_list = '';
        let data = Data_Logic.get(data_type,id);
        data[Type.FIELD_RESULT_OK_DELETE] = false;
        data[Type.FIELD_RESULT_OK_DELETE_CACHE] = false;
        data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = false;
        async.series([
            async function(call) {
                const [error,data] = await get_cache_value(cache,get_cache_item_attr_list_key(data_type,id));
                cache_key_list=data;
            },
            async function(call) {
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    if(item){
                        const [error,val] = await delete_cache_value(cache,get_cache_item_attr_key(data_type,id,item));
                    }
                }
            },
            async function(call){
                const [error,data] = await delete_cache_value(cache,get_cache_item_attr_list_key(data_type,id));
                if(!error){
                    data[Type.FIELD_RESULT_OK_DELETE_CACHE] = true;
                }
            },
            async function(call){
                const [error,data] = await delete_item(database,data_type,id);
                if(!error){
                    data[Type.FIELD_RESULT_OK_DELETE_DATABASE] = true;
                }
            },
            async function(call){
                if(data[Type.FIELD_RESULT_OK_DELETE_DATABASE] && data[Type.FIELD_RESULT_OK_DELETE_CACHE]){
                    data[Type.FIELD_RESULT_OK_DELETE] = true;
                }
            }
        ]).then(result => {
            callback([error,data]);
        }).catch(error => {
            Log.error("Data-Adapter-Delete-Item-Cache-DB-5",error);
            callback([error,null]);
        });
    });
}
const get_count_item_list_adapter = (database,data_type,filter) => {
    return new Promise((callback) => {
        let error = null;
        let item_data = {};
        async.series([
            async function(call) {
                const [error,data] = await get_count_item_list(database,data_type,filter);
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
const post_bulk_adapter=(database,cache,data_type,item_data_list) => {
    return new Promise((callback) => {
        let data ={result_OK:false};
        async.series([
            async function(call){
                const [biz_error,biz_data] = await post_bulk_main(database,data_type,item_data_list);
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
    get_database_adapter,
    check_database_adapter,
    delete_database_adapter,
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
