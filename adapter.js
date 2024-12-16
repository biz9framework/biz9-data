/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data - Mongo - Base
*/
const async = require('async')
const {get_title_url} = require('biz9-utility')
const {get_db_main,check_db_main,close_db_main,update_item_main} = require('./mongo/index.js');
const {get_cache_main} = require('./redis/index.js');
const get_db_adapter = () => {
    return new Promise((callback) => {
        let error=null;
        get_db_main().then(([error,data]) => {
            callback([error,data]);
        }).catch(err => {
            console.error("--Error-Adapter-Get-DB-Adapter-Error--",err);
        });
    });
}
const close_db_adapter = (db_connect) => {
    return new Promise((callback) => {
        let error=null;
        close_db_main(db_connect).then(([error,data])=> {
            callback([error,data]);
        }).catch(err => {
            console.error("--Error-Adapter-Close-DB-Adapter-Error--",err);
        });
    });
}
const check_db_adapter = (db_connect) => {
    return check_db_main(db_connect);
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
                       console.error("--Error-Redis-Adapter-Update-Item-Adapter-Error--",err);
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
                update_item_main(db_connect,data_type,item).then(([error,data]) => {
                    console.log('rrrr');
                    //cache_connect = data;
                    call();
                }).catch(err => {
                       console.error("--Error-Redis-Adapter-Update-Item-Adapter-Error--",err);
                });

                /*
               data_mon.update(db,data_type,data_item,function(error,data){
                    call();
                });
                */
                /*
                const update = () => {
                    return new Promise((callback) => {
                        let error = null;
                        const run = new();
                        run.method().then((data) => {
                            callback([null,data]);
                        }).catch(err => {
                            console.error("--Error-Get-Blank--"+err+"--Error--", err);
                        });
                    });
                }
                */

            },

        ]).then(result => {
            console.log(result);
        }).catch(err => {
            console.error("--Error-Notez-Update-Blank--"+err+"--Error--", err);
        });
    });
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
    update_item_adapter
};

