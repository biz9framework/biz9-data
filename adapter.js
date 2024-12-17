/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Base
*/
const async = require('async')

const {get_title_url} = require(process.env.BIZ9_HOME+'/biz9-utility/src/code/index.js')
const {get_new_item,set_biz_item} = require(process.env.BIZ9_HOME+'/biz9-app/src/code/index.js')
const {get_db_main,check_db_main,close_db_main,update_item_main} = require('./mongo/index.js');

const {get_cache_main,close_cache_main,get_cache_string_main,delete_cache_string_main} = require('./redis/index.js');

const get_db_adapter = () => {
    return new Promise((callback) => {
        let error=null;
        get_db_main().then(([error,data]) => {
            callback([error,data]);
        }).catch(err => {
            console.error("--Error-Data-Adapter-Get-DB-Adapter-Error--",err);
        });
    });
}
const close_db_adapter = (db_connect) => {
    return new Promise((callback) => {
        let error=null;
        close_db_main(db_connect).then(([error,data])=> {
            callback([error,data]);
        }).catch(err => {
            console.error("--Error-Data-Adapter-Close-DB-Adapter-Error--",err);
        });
    });
}
const check_db_adapter = (db_connect) => {
    return check_db_main(db_connect);
}
const blank = (data_type,data_item) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        async.series([
            function(call) {
                get_cache_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Blank-Error--",err);
                });
            },
            function(call) {
                close_cache_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Blank-2-Error--",err);
                });
            },
        ]).then(result => {
            callback([error,null]);
        }).catch(err => {
            console.error("--Error-Data-Adapter-Blank-END-Error--",err);
            callback([err,null]);
        });
    });
}
const update_item_list_adapter = (db_connect,data_item_list) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        async.series([
            function(call) {
                get_cache_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Update-Item-List-Error--",err);
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
                                }).catch(err => {
                                    console.error("--Error-Data-Adapter-Update-Item-List-2-Error--",err);
                                });
                            }else{
                                go();
                            }
                        }).catch(err => {
                            console.error("--Error-Data-Adapter-Update-Item-List-3-Error--",err);
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
            function(call) {
                close_cache_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Update-Item-List-4-Error--",err);
                });
            },

        ]).then(result => {
            callback([error,data_item_list]);
        }).catch(err => {
            console.error("--Error-Data-Adapter-Update-Item-List-5-Error--",err);
            callback([err,null]);
        });
    });
}
const update_item_adapter = (db_connect,data_type,data_item) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        async.series([
            function(call) {
                get_cache_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-Error--",err);
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
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-2-Error--",err);
                });
            },
            function(call){
                delete_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_item.data_type,data_item.tbl_id)).then(([error,data]) => {
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-3-Error--",err);
                });
            },
            function(call) {
                close_cache_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Update-Item-Adapter-4-Error--",err);
                });
            },
        ]).then(result => {
            set_biz_item(data_item).then(([error,data]) => {
                callback([error,data]);
            }).catch(err => {
                console.error("--Error-Data-Adapter-Update-Item-Adapter-5-Error--",err);
            });
        }).catch(err => {
            console.error("--Error-Data-Adapter-Update-Item-Adapter-END-Error--",err);
        });
    });
}
const get_item_adapter = (db_connect,data_type,tbl_id) => {
    return new Promise((callback) => {
        let error = null;
        let cache_key_list = null;
        let cache_connect = {};
        let data_item = get_new_item(data_type,tbl_id);
        async.series([
            function(call) {
                get_cache_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Get-Item-DB-Adapter-Error--",err);
                });
            },
            function(call) {
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,tbl_id)).then(([error,data]) => {
                    cache_key_list = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Get-Item-DB-Adapter-Error--",err);
                });
            },
            function(call) {
                let item_list_str = [];
                if(cache_key_list!=null){
                    item_list_str = cache_key_list.split(',');
                }
                async.forEachOf(item_list_str,(item,key,go) => {
                    if(item){
                        get_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,tbl_id,item), function(error,data){
                            if(data){
                                data_item[item] = data;
                                cache_found = true;
                            }else{
                                data_item[item] = null;
                            }
                            go();
                        });
                    }else{
                        go();
                    }
                }, error => {
                    if(cache_found){
                        data_item.source = 'cache';
                    }
                    call();
                });
            },
            function(call) {
                close_cache_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Update-DB-Adapter-3-Error--",err);
                });
            }
        ]).then(result => {
            console.log(result);
        }).catch(err => {
            console.error("--Error-Project-FileName-Update-Blank-Error--",err);
        });
    });
}
const get_cache_item_attr_key = (data_type,tbl_id,key) => {
    return data_type + "_" + key + "_" + String(tbl_id);
}
const get_cache_item_attr_list_key = (data_type,tbl_id) => {
    return data_type+"_aik_"+String(tbl_id);
}


/*
 function(call){
                if(data_item.photo_obj){
                    delete data_item.photo_obj;
                }
                if(data_item.date_obj){
                    delete data_item.date_obj;
                }
                if(data_item.title){
                    data_item.title_url=biz9.get_title_url(data_item.title);
                }
                call();
            },
            function(call){
               data_mon.update(db,data_type,data_item,function(error,data){
                    call();
                });
            },
            function(call){
                cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(data_item.data_type,data_item.tbl_id),function(error,data)
                    {
                        call();
                    });
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
            */

module.exports = {
    get_db_adapter,
    check_db_adapter,
    close_db_adapter,
    update_item_adapter,
    update_item_list_adapter
};

