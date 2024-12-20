/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Base
*/
const async = require('async')
const {get_title_url} = require(process.env.BIZ9_HOME+'/biz9-utility/src/code/index.js')
const {get_new_item,set_biz_item} = require(process.env.BIZ9_HOME+'/biz9-app/src/code/index.js')
const {get_db_connect_main,check_db_main,close_db_connect_main,update_item_main,get_item_main} = require('./mongo/index.js');
const {get_cache_connect_main,close_cache_main,get_cache_string_main,delete_cache_string_main,set_cache_string_main} = require('./redis/index.js');
const DB_TITLE='DB';
const CACHE_TITLE='CACHE';
const NOT_FOUND_TITLE='NOT-FOUND';
const get_db_connect_adapter = () => {
    return new Promise((callback) => {
        let error=null;
        get_db_connect_main().then(([error,data]) => {
            callback([error,data]);
        }).catch(err => {
            console.error("--Error-Data-Adapter-Get-DB-Adapter-Error--",err);
        });
    });
}
const close_db_connect_adapter = (db_connect) => {
    return new Promise((callback) => {
        let error=null;
        close_db_connect_main(db_connect).then(([error,data])=> {
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
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Blank-Error--",err);
                });
            },
            function(call) {
                go().then(([error,data]) => {
                    item = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Blank-2-Error--",err);
                });
            },
            function(call) {
                close_cache_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Blank-3-Error--",err);
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
                get_cache_connect_main().then(([error,data]) => {
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
                get_cache_connect_main().then(([error,data]) => {
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
const get_item_adapter = (db_connect,data_type,tbl_id,options) => {
    return new Promise((callback) => {
        let error = null;
        let cache_connect = {};
        let cache_found = false;
        let cache_key_list = null;
        let data_item = get_new_item(data_type,tbl_id);
        //let item_attr_list_str = null;
        let cache_string_list = [];
        async.series([
            function(call) {
                //1
                get_cache_connect_main().then(([error,data]) => {
                    cache_connect = data;
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Get-Item-Adapter-Error--",err);
                });
            },
            function(call) {
                //2
                get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,tbl_id)).then(([error,data]) => {
                    cache_key_list=data;
                    call();
                }).catch(err => {
                    console.error("--Error-Project-FileName-Get-Blank-Error--",err);
                    error = err;
                    callback([error,null]);
                });
            },
            async function(call) {
                //3
                if(cache_key_list!=null){
                    cache_string_list =cache_key_list.split(',');
                }
                for(const item of cache_string_list) {
                    const [error,val] = await get_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,tbl_id,item));
                    if(val){
                        data_item[item] = val;
                        cache_found=true;
                    }else{
                        data_item[item] =null;
                    }
                }
            },
            function(call){
                //4
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
                        }).catch(err => {
                            console.error("--Error-Project-FileName-Get-Blank-Error--",err);
                            error = err;
                            callback([error,null]);
                        });
                    }).catch(err => {
                        console.error("--Error-Project-FileName-Get-Blank-Error--",err);
                        error = err;
                        callback([error,null]);
                    });
                }else{
                    call();
                }
            },
            function(call) {
                close_cache_main(cache_connect).then(([error,data]) => {
                    call();
                }).catch(err => {
                    console.error("--Error-Data-Adapter-Blank-3-Error--",err);
                });
            },
        ]).then(result => {
            set_biz_item(data_item,options).then(([error,data]) => {
                callback([error,data]);
            }).catch(err => {
                console.error("--Error-Data-Adapter-Update-DB-Adapter-4-Error--",err);
            });
        }).catch(err => {
            console.error("--Error-Project-FileName-Update-Blank-Error--",err);
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
                    }).catch(err => {
                        console.error("--Error-Project-FileName-Get-Blank-Error--",err);
                        call([err,null]);
                    });
                });
            },
            function(call) {
                call();
            }
        ]).then(result => {
            callback([error,data_item]);
        }).catch(err => {
            console.error("--Error-Project-FileName-Update-Blank-Error--",err);
            callback(error,null);
        });
    });
}

/*
function set_cache_item(client_redis,data_type,tbl_id,data_item,callback){
        var cache_string_str='';
        async.series([
            function(call){
                for (property in data_item) {
                    if(String(property)){
                        cache_red.set_cache_string(client_redis,get_cache_item_attr_key(data_type,tbl_id,property),data_item[property],function(error,data){
                        });
                        cache_string_str=cache_string_str+property+',';
                    }
                }
                call();
            },
            function(call){
                cache_red.set_cache_string(client_redis,get_cache_item_attr_list_key(data_type,tbl_id),cache_string_str,function(error,data){
                    call();
                });
            },
        ],
            function(err, result){
                callback(data_item);
            });
            */

/*
const set_cache_item_old = (cache_connect,data_type,tbl_id,data_item) => {
    return new Promise((callback) => {
        let error = null;
        let cache_string_str = '';
        async.series([
            function(call) {
                for (property in data_item) {
                    if(String(property)){
                        //new Promise((callback2) => {
                            let error = null;
                            set_cache_string_main(cache_connect,get_cache_item_attr_key(data_type,tbl_id,property),data_item[property]).then(([error,data]) => {

                                console.log('start');
                        //console.log(property);
                        //console.log(data_item[property]);
                                console.log(get_cache_item_attr_key(data_type,tbl_id,property));
                                console.log('end');
        //console.log(data);
        //console.log(error);
        //callback2([error,data]);
        //callback2();
        //}).catch(err => {
        //console.error("--Error-Project-FileName-Get-Blank-Error--",err);
        //callback2([err,null]);
        //});
        //});
        //}
                })
    //call();
            },
             function(call) {
                for (property in data_item) {
                    if(String(property)){
                        new Promise((callback2) => {
                            let error = null;
                            get_cache_string_main(cache_connect,get_cache_item_attr_list_key(data_type,tbl_id)).then(([error,data]) => {

                                console.log('rrrr');
                                console.log(data);
                            //callback2([error,data]);
                            }).catch(err => {
                                console.error("--Error-Project-FileName-Get-Blank-Error--",err);
                                callback2([err,null]);
                            });
                        });
                    }
                }
                call();
            },
        ]).then(result => {
            callback([error,data_item]);
        }).catch(err => {
            console.error("--Error-Project-FileName-Update-Blank-Error--",err);
            callback([err,null]);
        });
    });
}
*/

                            /*
function set_cache_item(client_redis,data_type,tbl_id,data_item,callback){
        var cache_string_str='';
        async.series([
            function(call){
                for (property in data_item) {
                    if(String(property)){
                        cache_red.set_cache_string(client_redis,get_cache_item_attr_key(data_type,tbl_id,property),data_item[property],function(error,data){
                        });
                        cache_string_str=cache_string_str+property+',';
                    }
                }
                call();
            },
            function(call){
                cache_red.set_cache_string(client_redis,get_cache_item_attr_list_key(data_type,tbl_id),cache_string_str,function(error,data){
                    call();
                });
            },
        ],
            function(err, result){
                callback(data_item);
            });
        function get_cache_key_item(org_key_parm_str,data_item){
            if(!org_key_parm_str){
                org_key_parm_str='';
            }
            new_key_obj = {};
            f = org_key_parm_str.split(',');
            for(a = 0; a < f.length; a++) {
                if(f[a]){
                    new_key_obj[f[a]] = null;
                }
            }
            for(property in data_item){
                new_key_obj[property] = null;
            }
            return new_key_obj;
        }
    }
    */



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
    get_item_adapter
};

