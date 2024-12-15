/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-AWZ
 */
module.exports = function(data_config){
    module.get_client_db=async function(callback){
        var reset_cmd = "sudo mongod --fork --config "+data_config.mongo_config;
        var error=null;
        async function run() {
            try {
                if(!dataz.db_connected(client_db)){
                    await client_db.connect();
                }
            } catch (e) {
                error=e;
                if(data_config.mongo_ip!='localhost'){
                    if(!data_config.ssh_key){
                        data_config.ssh_key='';
                    }else{
                        data_config.ssh_key=' -i '+ data_config.ssh_key;
                    }
                    reset_cmd='ssh '+ data_config.ssh_key + " " +data_config.mongo_server_user +"@"+data_config.mongo_ip +" -- "+reset_cmd;
                }
                dir = exec(reset_cmd, function(error,stdout,stderr){
                });
                dir.on('exit', function (code) {
                    callback(error,null);
                });
            } finally {
                callback(error,client_db);
            }
        }
        run();
    }
    module.db_connected=function(client_db){
        return !!client_db && !!client_db.topology && !!client_db.topology.isConnected()
    }
    module.db_client_connected=function(client_db){
        if(!db.client){
            return false;
        }else if(!db.client.topology){
            return false;
        }else if(!db.client.topology){
            return false;
        }else{
            return true;
        }
    }
    module.close_client_db=async function(client_db,callback){
        var error=null;
        async function run() {
            if(dataz.db_connected(client_db)){
                await client_db.close();
                callback();
            }else{
                callback('close_client_db_error');
            }
        }
        run();
    }
    module.update_list=function(db,data_item_list,callback){
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
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
                        data_mon.update(db,item.data_type,item,function(error,data)
                            {
                                item.tbl_id=data.tbl_id;
                                if(data){
                                    cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(item.data_type,data.tbl_id),function(error,data)
                                        {
                                            go();
                                        });
                                }else{
                                    go();
                                }
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
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,data_item_list);
            });
    }
    module.update_cache_item=function(db,data_type,data_item,callback){
        var cache_string_str='';
        var error=null;
        var client_redis = redis.createClient(redis_port,redis_url);
        var set_cache=false;
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
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
        ],
            function(err, result){
                callback(error,appz.set_biz_item(data_item));
            });
    }
    module.get_cache_item=function(db,data_type,tbl_id,callback) {
        var data_item = appz.get_new_item(data_type,tbl_id);
        var item_attr_list_str=null;
        var cache_found=false;
        var cache_key_list=null;
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                cache_red.get_cache_string(client_redis,get_cache_item_attr_list_key(data_type,tbl_id),function(error,data){
                    if(data){
                        cache_key_list=data;
                    }
                    call();
                });
            },
            function(call){
                var item_list_str=[];
                if(cache_key_list!=null){
                    item_list_str =cache_key_list.split(',');
                }
                async.forEachOf(item_list_str,(item,key,go)=>{
                    if(item){
                        cache_red.get_cache_string(client_redis,get_cache_item_attr_key(data_type,tbl_id,item),function(error,data){
                            if(data){
                                data_item[item] = data;
                                cache_found=true;
                            }else{
                                data_item[item] =null;
                            }
                            go();
                        });
                    }
                    else{
                        go();
                    }
                }, error => {
                    if(cache_found){
                        data_item.source='cache';
                    }
                    call();
                });
            },
            function(call){
                if(!cache_found){
                    data_mon.get(db,data_type,tbl_id,function(error,data_list){
                        if(data_list.length>0){
                            set_cache_item(client_redis,data_type,tbl_id,data_list[0],function(data){
                                data_item=data_list[0];
                                data_item.source='db';
                                call();
                            });
                        }
                        else{
                            data_item.source='not_found';
                            call();
                        }
                    });
                }else{
                    call();
                }
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,appz.set_biz_item(data_item));
            });
    }
    module.get_sql_paging_cache=function(db,data_type,sql_obj,sort_by,page_current,page_size,callback){
        var error=null;
        var data_tbl_id_list = [];
        var data_list=[];
        var total_count=0;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                data_mon.get_paging_sql_tbl_id(db,data_type,sql_obj,sort_by,page_current,page_size,function(error,_total_count,_data_list){
                    error=error;
                    total_count=_total_count;
                    data_tbl_id_list=_data_list;
                    call();
                });
            },
            function(call){
                bind_sql_cache_paging_cache(client_redis,data_type,data_tbl_id_list,function(error,_data_list){
                    if(error){
                        error=error;
                    }
                    data_list=_data_list;
                    call();
                });
            },
        ],
            function(err, result){
                callback(error,data_list,total_count,Math.round(total_count/page_size+1));
            });
    }
    module.get_sql_cache=function(db,data_type,sql_obj,sort_by,callback){
        var data_tbl_id_list = [];
        var data_list=[];
        var total_count=0;
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                data_mon.get_sql_tbl_id(db,data_type,sql_obj,sort_by,function(error,_data_list){
                    error=error;
                    total_count=_data_list.length;
                    data_tbl_id_list=_data_list;
                    call();
                });
            },
            function(call){
                bind_sql_cache_paging_cache(client_redis,data_type,data_tbl_id_list,function(error,_data_list){
                    if(error){
                        error=error;
                    }
                    data_list=_data_list;
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
        ],
            function(err, result){
                callback(error,data_list);
            });
    }
    bind_sql_cache_paging_cache=function(client_redis,data_type,data_tbl_id_list,callback){
        var data_list=[];
        var blank_tbl_id_list=[];
        var error=null;
        async.series([
            function(call){
                async.forEachOf(data_tbl_id_list,(item_1,key_1,go_1)=>{
                    blank_tbl_id_list.push({
                        data_type:item_1.data_type,
                        tbl_id:item_1.tbl_id,
                        source:null,
                        cache_key_list:null,
                        data:null
                    });
                    go_1();
                },error=>{
                    if(error){
                        error=error;
                    }
                    call();
                });
            },
            function(call){
                async.forEachOf(blank_tbl_id_list,(item,key,go)=>{
                    cache_red.get_cache_string(client_redis,get_cache_item_attr_list_key(data_type,item.tbl_id),function(error,data){
                        if(data){
                            item.cache_key_list=data;
                        }
                        else{
                            item.cache_key_list=null;
                        }
                        go();
                    });
                },error=>{
                    call();
                });
            },
            function(call){
                async.forEachOf(blank_tbl_id_list,(blank_item,key,go)=>{
                    var blank_item_list_str=[];
                    if(blank_item.cache_key_list!=null){
                        blank_item_list_str=blank_item.cache_key_list.split(',');
                    }
                    var cache_found=false;
                    var data_value = {};
                    async.forEachOf(blank_item_list_str,(blank_item_str,key,go_sub)=>{
                        if(blank_item_str){
                            cache_red.get_cache_string(client_redis,get_cache_item_attr_key(data_type,blank_item.tbl_id,blank_item_str),function(error,data){
                                if(data){
                                    data_value[blank_item_str]=data;
                                    cache_found=true;
                                }else{
                                    data_value[blank_item_str]=null;
                                }
                                go_sub();
                            });
                        }else{
                            go_sub();
                        }
                    }, error => {
                        if(cache_found){
                            data_value.source='cache';
                            blank_item.data=data_value;
                        }
                        go();
                    });
                }, error => {
                    call();
                });
            },
            function(call){
                async.forEachOf(blank_tbl_id_list,(item,key,go)=>{
                    if(!item.data){
                        data_mon.get(db,data_type,item.tbl_id,function(error,data_list){
                            if(data_list.length>0){
                                set_cache_item(client_redis,item.data_type,item.tbl_id,data_list[0],function(data_7){
                                    data_7.source='db';
                                    item.data=data_list[0];
                                    go();
                                });
                            }
                            else{
                                item.data=appz.get_new_item(item.data_type,item.tbl_id);
                                go();
                            }
                        });
                    }else{
                        go();
                    }
                }, error => {
                    if(error){
                        error = error;
                    }
                    call();
                });
            },
            function(call){
                async.forEachOf(blank_tbl_id_list,(item,key,go)=>{
                    if(item.data){
                        data_list.push(appz.set_biz_item(item.data));
                    }
                    go();
                }, error => {
                    if(error){
                        error=error;
                    }
                    call();
                });
            },
        ],
            function(err,result){
                callback(error,data_list);
            });
    }
    module.delete_cache_item=function(db,data_type,tbl_id,callback){
        var data_item=appz.get_new_item(data_type,tbl_id);
        var client_redis = redis.createClient(redis_port,redis_url);
        var error=null;
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(data_type,tbl_id),function(error,data)
                    {
                        data_item.cache_string=get_cache_item_attr_list_key(data_type,tbl_id);
                        data_item.cache_del=true;
                        call();
                    });
            },
            function (call){
                data_mon.delete(db,data_type,tbl_id,function(error,data)
                    {
                        error=error;
                        data_item.data_del=true;
                        data_item.data=data;
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
        ],
            function(err, result){
                callback(error,data_item);
            });
    }
    module.delete_sql=function(db,data_type,sql_obj,callback){
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                data_mon.get_sql_tbl_id(db,data_type,sql_obj,{},function(error,data_list){
                    if(data_list.length>0){
                        async.forEachOf(data_list,(item,key,go)=>{
                            if(item){
                                data_mon.delete(db,item.data_type,item.tbl_id,function(error,data)
                                    {
                                        error=error;
                                        cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(item.data_type,item.tbl_id),function(error,data)
                                            {
                                                go();
                                            });
                                    });
                            }else{
                                go();
                            }
                        }, error => {
                            if(error){
                                error = error;
                            }
                            call();
                        });
                    }
                    else{
                        call();
                    }
                });
            },
            function(call){
                data_mon.delete_sql(db,data_type,sql_obj,function(error,data){
                    if(error){
                        error=error;
                    }
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
        ],
            function(err, result){
                callback(error,[]);
            });
    }
    module.delete_cache_list = function(db,data_type,data_item_list,callback){
        var data_list=[];
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                async.forEachOf(data_item_list,(item,key,go)=>{
                    cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(item.data_type,item.tbl_id),function(error,data){
                        data_mon.delete(db,item.data_type,item.tbl_id,function(error,data)
                            {
                                error=error;
                                data_list.push(data);
                                go();
                            });
                    });
                }, error => {
                    if(error){
                        error=error;
                    }
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
        ],
            function(err, result){
                callback(error,data_list);
            });
    }
    module.drop=function(db,title,callback){
        data_mon.drop(db,title,function(error,data){
            callback(error,data);
        });
    }
    module.count=function(db,data_type,sql,callback){
        data_mon.count(db,data_type,sql,function(error,data){
            callback(error,data);
        });
    }
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
    function get_cache_item_attr_key(data_type,tbl_id,key){
        return data_type + "_" + key + "_" + String(tbl_id);
    }
    function get_cache_item_attr_list_key(data_type,tbl_id){
        return data_type+"_aik_"+String(tbl_id);
    }
    return module;
}

