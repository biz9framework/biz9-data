/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Base
*/
const async = require('async')
const {get_title_url} = require(process.env.BIZ9_HOME+'/biz9-utility/src/code/index.js')
const {get_new_item,set_biz_item} = require(process.env.BIZ9_HOME+'/biz9-app/src/code/index.js')
const {get_db_connect_main,check_db_connect_main,close_db_connect_main,update_item_main,get_item_main,delete_item_main,get_sql_paging_main} = require('./mongo/index.js');
const {get_cache_connect_main,close_cache_connect_main,get_cache_string_main,delete_cache_string_main,set_cache_string_main} = require('./redis/index.js');
const DB_TITLE='DB';
const CACHE_TITLE='CACHE';
const NOT_FOUND_TITLE='NOT-FOUND';
const get_db_connect_adapter = () => {
    return new Promise((callback) => {
        let error=null;
        get_db_connect_main().then(([error,data]) => {
            callback([error,data]);
        }).catch(error => {
            console.error("--Error-Data-Adapter-Get-DB-Adapter-Error--",error);
            callback([error,null]);
        });
    });
}
const close_db_connect_adapter = (db_connect) => {
    return new Promise((callback) => {
        let error=null;
        close_db_connect_main(db_connect).then(([error,data])=> {
            callback([error,data]);
        }).catch(error => {
            console.error("--Error-Data-Adapter-Close-DB-Adapter-Error--",error);
            callback([error,null]);
        });
    });
}
const check_db_connect_adapter = (db_connect) => {
    return check_db_connect_main(db_connect);
}
const blank = (data_type,data_item) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Blank-Error--",error);
                    callback([error,null]);
                });
            },
            function(call) {
                go().then(([error,data]) => {
                    item = data;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Blank-2-Error--",error);
                    callback([error,null]);
                });
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Blank-3-Error--",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            callback([error,null]);
        }).catch(error => {
            console.error("--Error-Data-Adapter-Blank-END-Error--",error);
            callback([err,null]);
        });
    });
}
const update_item_list_adapter = (db_connect,data_item_list,options) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        let new_data_item_list = [];
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Update-Item-List-Error--",error);
                    callback([error,null]);
                });
            },
            function(call){
                async.forEachOf(data_item_list,(item,key,go)=>{
                    for(property in item[key]){
                        if(property!='tbl_id'&&property!='data_type'){
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
            function(call){
                async.forEachOf(data_item_list,(item,key,go)=>{
                    if(item){
                        update_item_main(db_connect,item.data_type,item).then(([error,data]) => {
                            item.tbl_id=data.tbl_id;
                            if(data){
                                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(item.data_type,data.tbl_id)).then(([error,data]) => {
                                    go();
                                }).catch(error => {
                                    console.error("--Error-Data-Adapter-Update-Item-List-2-Error--",error);
                                    callback([error,null]);
                                });
                            }else{
                                go();
                            }
                        }).catch(err => {
                            console.error("--Error-Data-Adapter-Update-Item-List-3-Error--",error);
                            callback([error,null]);
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
            async function(call) {
                for(const item of data_item_list) {
                    const [error,data] = await set_biz_item(item,options);
                    new_data_item_list.push(data);
                }
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Update-Item-List-4-Error--",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            callback([error,new_data_item_list]);
        }).catch(error => {
            console.error("--Error-Data-Adapter-Update-Item-List-5-Error--",error);
            callback([error,null]);
        });
    });
}
const update_item_adapter = (db_connect,data_type,data_item,options) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-Error--",error);
                    callback([error,null]);
                });
            },
            function(call) {
                if(data_item.photo_obj){
                    delete data_item.photo_obj;
                }
                if(data_item.date_obj){
                    delete data_item.date_obj;
                }
                if(data_item.title){
                    data_item.title_url=get_title_url(data_item.title);
                }
                call();
            },
            function(call){
                update_item_main(db_connect,data_type,data_item).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-2-Error--",error);
                    callback([error,null]);
                });
            },
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_item.data_type,data_item.tbl_id)).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-3-Error--",error);
                    callback([error,null]);
                });
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-4-Error--",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            set_biz_item(data_item,options).then(([error,data]) => {
                callback([error,data]);
            }).catch(error => {
                console.error("--Error-Data-Adapter-Update-Item-Adapter-5-Error--",error);
                callback([error,null]);
            });
        }).catch(error => {
            console.error("--Error-Data-Adapter-Update-Item-Adapter-END-Error--",error);
            callback([error,null]);
        });
    });
}
const get_item_adapter = (db_connect,data_type,tbl_id,options) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        let cache_found = false;
        let cache_key_list = null;
        let data_item = get_new_item(data_type,tbl_id);
        let cache_string_list = [];
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Get-Item-Adapter-Error--",error);
                    callback([error,null]);
                });
            },
            function(call) {
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,tbl_id)).then(([error,data]) => {
                    cache_key_list=data;
                    call();
                }).catch(error => {
                    console.error("--Error-Project-FileName-Get-Item-Adapter-2-Error--",error);
                    callback([error,null]);
                });
            },
            async function(call) {
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    if(item){
                        const [error,val] = await get_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,tbl_id,item));
                        if(val){
                            data_item[item] = val;
                            cache_found=true;
                        }else{
                            data_item[item] =null;
                        }
                    }
                }
            },
            function(call){
                if(!cache_found){
                    get_item_main(db_connect,data_type,tbl_id).then(([error,data]) => {
                        set_cache_item(cache_connect,data_type,tbl_id,data).then(([error,data]) => {
                            if(data){
                                data_item == data;
                                data_item.source=DB_TITLE;
                            }else{
                                data_item.source=NOT_FOUND_TITLE;
                            }
                            call();
                        }).catch(error => {
                            console.error("--Error-Data-Adapter-Get-Item-Adpater-3-Error--",error);
                            callback([error,null]);
                        });
                    }).catch(error => {
                        console.error("--Error-Data-Adapter-Get-Item-Adpater-4-Error--",error);
                        callback([error,null]);
                    });
                }else{
                    call();
                }
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Get-Item-Adpater-5-Error--",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            set_biz_item(data_item,options).then(([error,data]) => {
                callback([error,data]);
            }).catch(error => {
                console.error("--Error-Data-Adapter-Get-Item-Adpater-6-Error--",error);
                callback([error,null]);
            });
        }).catch(err => {
            console.error("--Error-Data-Adapter-Get-Item-Adpater-7-Error--",error);
            callback([error,null]);
        });
    });
}
const set_cache_item = (cache_connect,data_type,tbl_id,data_item) => {
    return new Promise((callback) => {
        let error = null;
        let cache_string_str = '';
        let prop_list = [];
        async.series([
            function(call) {
                for (prop in data_item) {
                    prop_list.push({title:prop,value:data_item[prop]});
                }
                call();
            },
            async function(call) {
                for(const item of prop_list) {
                    cache_string_str=cache_string_str+item.title+',';
                    await set_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,tbl_id,item.title), item.value);
                }
            },
            function(call) {
                new Promise((callback2) => {
                    let error = null;
                    set_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,tbl_id),cache_string_str).then(([error,data]) => {
                        call();
                    }).catch(error => {
                        console.error("--Error-Data-Adapter-Set-Cache-Item-Error--",error);
                        callback([error,null]);
                    });
                });
            },
        ]).then(result => {
            callback([error,data_item]);
        }).catch(error => {
            console.error("--Error-Data-Adapter-Set-Cache-Item-2-Error--",error);
            callback([error,null]);
        });
    });
}
const delete_item_adapter = (db_connect,data_type,tbl_id) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        let data_item = get_new_item(data_type,tbl_id);
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Delete-Item-Adapter-Error--",error);
                    callback([error,null]);
                });
            },
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,tbl_id)).then(([error,data]) => {
                    data_item.cache_del = true;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Delete-Item-Adapter-2-Error--",error);
                    callback([error,null]);
                });
            },
               function(call){
                delete_item_main(db_connect,data_type,tbl_id).then(([error,data]) => {
                    data_item = data;
                    data_item.db_del = true;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Delete-Item-Adapter-3-Error--",error);
                    callback([error,null]);
                });
            },
         function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Delete-Item-Adapter-4-Error--",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            callback([error,null]);
        }).catch(error => {
            console.error("--Error-Data-Adapter-Delete-Item-Adapter-5-Error--",error);
            callback([err,null]);
        });
    });
}
const get_sql_paging_adapter = (db_connect,data_type,sql_obj,sort_by,page_current,page_size) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        let data_list_id_list = [];
        let total_count = 0;
        async.series([
            function(call) {
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Blank-Error--",error);
                    callback([error,null]);
                });
            },
            function(call) {
                console.log('here');
                get_sql_paging_main(db_connect,data_type,sql_obj,sort_by,page_current,page_size).then(([error,data]) => {
                    error = error;
                    total_count = total_count;
                    item = data;
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Blank-2-Error--",error);
                    callback([error,null]);
                });
            },
            function(call) {
                close_cache_connect_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(error => {
                    console.error("--Error-Data-Adapter-Blank-3-Error--",error);
                    callback([error,null]);
                });
            },
        ]).then(result => {
            callback([error,null]);
        }).catch(error => {
            console.error("--Error-Data-Adapter-Blank-END-Error--",error);
            callback([err,null]);
        });
    });
}
const get_cache_item_attr_key = (data_type,tbl_id,key) => {
    return data_type + "_" + key + "_" + String(tbl_id);
}
const get_cache_item_attr_list_key = (data_type,tbl_id) => {
    return data_type+"_aik_"+String(tbl_id);
}
module.exports = {
    get_db_connect_adapter,
    check_db_connect_adapter,
    close_db_connect_adapter,
    update_item_adapter,
    update_item_list_adapter,
    get_item_adapter,
    get_sql_paging_adapter,
    delete_item_adapter
};
