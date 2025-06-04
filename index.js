/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {get_db_connect_main,check_db_connect_main,close_db_connect_main,update_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,count_item_list_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");

const {Log,Str}=require("biz9-utility");
const {DataType}=require("biz9-logic");
const { get_db_connect_adapter,check_db_connect_adapter,close_db_connect_adapter,update_item_adapter,update_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,count_item_list_adapter,delete_item_cache }  = require('./adapter.js');


const {get_database_main} = require("./main");
class Database {
    static get = async (option) => {
        let cloud_error=null;
        return new Promise((callback) => {
            if(option==null){
                option = {biz9_config_file:null,app_id:null};
            }
            if(option.biz9_config_file==null){
                //option.biz9_config_file=null;
                option.biz9_config_file="/home/think2/www/doqbox/biz9-framework/biz9-service/code/biz9_config"; //test
            }
            if(option.app_id==null){
                option.app_id=null;
                cloud_error=Log.append(cloud_error,"Database Error: Missing app_id.");
            }
            let biz9_config = Scriptz.get_biz9_config({biz9_config_file:option.biz9_config_file,app_id:(option.app_id)?option.app_id:null});
            Data.open_db(biz9_config).then(([error,data])=>{
                cloud_error=Log.append(cloud_error,error);
                data.data_config=biz9_config;
                data.app_id=biz9_config.APP_ID;
                callback([error,data]);
            }).catch(error => {
                cloud_error=Log.append(cloud_error,error);
                Log.error("BiZItem-Get-Connect",error);
                callback([error,null]);
            });
        });
    }
    static close = async (database) => {
        return new Promise((callback) => {
        Data.close(database).then(([error,data])=>{
                cloud_error=Log.append(cloud_error,error);
                callback([error,data]);
            }).catch(error => {
                cloud_error=Log.append(cloud_error,error);
                Log.error("DB-Close",error);
                callback([error,null]);
            });
    });

    }
}

class Portal {
 static get_parent_child_list = (full_item_list) => {
    return new Promise((callback) => {
        let new_item_list=[];
        async.series([
              function(call){
                    for(let a=0; a<full_item_list.length; a++){
                        let item_title_url = Str.get_title_url(full_item_list[a].title);
                        let new_item = full_item_list[a];
                        new_item.items = [];
                        new_item_list[item_title_url] = full_item_list[a];
                        new_item_list[item_title_url].items = [];
                        for(let b=0;b<full_item_list.length;b++){
                            if(full_item_list[a].id == full_item_list[b].parent_id){
                                new_item.items.push(full_item_list[b]);
                            }
                        }
                        new_item_list.push(new_item);
                    }
                    call();
                },
                function(call){
                    for(let a=0; a<new_item_list.length; a++){
                        let item_title_url = Str.get_title_url(new_item_list[a].title);
                        let new_item = new_item_list[a];
                        new_item.items=[];
                        new_item_list[item_title_url] = new_item_list[a];
                        new_item_list[item_title_url].items =[];
                        for(let b=0;b<new_item_list.length;b++){
                            let sub_item_title_url = Str.get_title_url(new_item_list[b].title);
                            if(new_item_list[a].id == new_item_list[b].parent_id){
                                let sub_item = new_item_list[b];
                                sub_item.items = [];
                                new_item.items.push(sub_item);
                                new_item_list[a][sub_item_title_url] = sub_item;
                                new_item_list[a][sub_item_title_url].items = [];
                            }
                        }
                    }
                    call();
                },
        ]).then(result => {
            callback([error,new_item_list]);
        }).catch(error => {
            Log.error("Portal-Get",error);
            callback([error,[]]);
        });
    });

    };
    //class Portal
    static get_list = (database,data_type,filter,sort_by,page_current,page_size,option) => {
        /* option params
         * Items
         *  - get_items / bool / ex. true,false / def. true
         * Photos
         *  - get_photos / bool / ex. true,false / def. true
         *  - photo_count / int / ex. 1-999 / def. 19
         *  - photo_sort_by / query obj / ex. {date_create:1}
         */
    return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            let error=null;
            if(option==null){
              option = {get_items:true};
            }
        async.series([
                function(call){
                    Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=>{
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item_count=item_count;
                            cloud_data.page_count=page_count;
                            cloud_data.filter=filter;
                            cloud_data.data_type=data_type;
                            if(data.length>0){
                                cloud_data.item_list=data;
                                call();
                            }else{
                                call();
                            }
                        }
                    }).catch(error => {
                        error=Log.append(error,error);
                    });
                },
                async function(call){
                    if(option.get_items){
                        const [error,data] = await Portal.get_parent_child_list(cloud_data.item_list);
                        cloud_data.item_list = data;
                    }
                },
        ]).then(result => {
            callback([error,cloud_data]);
        }).catch(error => {
            Log.error("Portal-Get",error);
            callback([error,[]]);
        });
    });
    };
    static get = async (database,data_type,title_url,option) => {
    //static get = async () => {
        /* option params
         * Items
         *  - get_items / bool / ex. true,false / def. true
         * Photos
         *  - get_photos / bool / ex. true,false / def. true
         *  - photo_count / int / ex. 1-999 / def. 19
         *  - photo_sort_by / query obj / ex. {date_create:1}
         */
    return new Promise((callback) => {
            let error = null;
            let top_item = {data_type:data_type,id:0,photos:[],items:[]};
            let full_item_list = [];
            let new_item_list = [];
            if(option == null){
             option = {get_items:false,get_photos:false}
            }
            if(option.get_items==null){
                option.get_items=false;
            }
            if(option.get_photos==null){
                option.get_photos=false;
            }
        async.series([
                function(call){
                    let filter = {};
                    if(title_url){
                        filter = {title_url:title_url};
                    }
                    let sort_by = {title:-1};
                    let page_current = 1;
                    let page_size = 3;
                    Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.length>0){
                                top_item = data[0];
                                top_item.items = [];
                                top_item.photos = [];
                            }
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    if(top_item.id && option.get_items){
                        let filter={top_id:top_item.id};
                        let data_type = DataType.ITEM;
                        let sort_by={title:-1};
                        let page_current = 1;
                        let page_size = 999;
                        Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                if(data.length > 0){
                                    full_item_list = data;
                                }
                            }
                            call();
                        }).catch(error => {
                            error = Log.append(error,error);
                            call();
                        });
                    }else{
                        call();
                    }
                },
                async function(call){
                    if(top_item.id && option.get_items){
                        const [error,data] = await Portal.get_parent_child_list(full_item_list);
                        new_item_list = data;
                    }
                },
                function(call){
                    if(top_item.id && option.get_items){
                        for(let a=0; a<new_item_list.length; a++){
                            new_item_list[a].items = [];
                            let item_title_url = Str.get_title_url(new_item_list[a].title);
                            top_item[item_title_url] = new Object();
                            for(let b=0;b<new_item_list.length;b++){
                                if(new_item_list[a].parent_id == new_item_list[b].id){
                                    new_item_list[a].items.push(new_item_list[b]);
                                }
                            }
                            top_item[item_title_url] = new_item_list[a];
                            top_item.items.push(new_item_list[a]);
                        }
                        call();
                    }
                    else{
                        call();
                    }
                },
                async function(call){
                    if(option.get_photos){
                        if(option.photo_count == null){
                            option.photo_count = 19;
                        }
                        if(option.photo_sort_by == null){
                            option.photo_sort_by = {date_create:1};
                        }
                        let filter = {parent_id:top_item.id};
                        let sort_by = option.photo_sort_by;
                        let page_current = 1;
                        let page_size = option.photo_count;
                        const [error,data] = await Portal.get_list(database,DataType.PHOTO,filter,sort_by,page_current,page_size,option);
                        if(data.item_list.length > 0){
                            top_item.photos = data.item_list;
                        }
                    }
                },
         ]).then(result => {
            callback([error,top_item]);
        }).catch(error => {
            Log.error("Portal-Get",error);
            callback([error,[]]);
        });
    });
    };
}


class Blank {

    //static get = async (database,data_type,title_url,option) => {
    static get = async () => {
        console.log('11111111111');
        /* option params
         * Items
         *  - get_items / bool / ex. true,false / def. true
         * Photos
         *  - get_photos / bool / ex. true,false / def. true
         *  - photo_count / int / ex. 1-999 / def. 19
         *  - photo_sort_by / query obj / ex. {date_create:1}
         */
    return new Promise((callback) => {
        let cache_connect={};
        async.series([
            function(call){
                console.log('222222222222');
            },
            function(call){
            },
        ]).then(result => {
            callback([error,item_data]);
        }).catch(error => {
            Log.error("Blank-Get",error);
            callback([error,[]]);
        });
    });


    };
}

class Data {
    static open_db = async (data_config) => {
        return [error,data] = await get_db_connect_adapter(data_config);
    };
    static close_db = async (db_connect) => {
        return [error,data] = await close_db_connect_adapter(db_connect);
    };
    static check_db = async (db_connect) => {
        return check_db_connect_adapter(db_connect);
    };
    static update_item = async (db_connect,data_type,item_data) => {
        return [error,data] = await update_item_adapter(db_connect,data_type,item_data);
    };
    static get_item = async (db_connect,data_type,id,option) => {
        return [error,data] = await get_item_adapter(db_connect,data_type,id,option);
    };
    static delete_item = async (db_connect,data_type,id) => {
        return [error,data] = await delete_item_adapter(db_connect,data_type,id);
    };
    static delete_cache_item = async (db_connect,data_type,id) => {
        return [error,data] = await delete_item_cache(db_connect,data_type,id);
    };
    static update_list = async (db_connect,item_data_list) => {
        return [error,data] = await update_item_list_adapter(db_connect,item_data_list);
    };
    static get_list = async (db_connect,data_type,filter,sort_by,page_current,page_size) => {
        const [error,data,item_count,page_count] = await get_item_list_adapter(db_connect,data_type,filter,sort_by,page_current,page_size);
        return [error,data,item_count,page_count];
    };
    static delete_list = async (db_connect,data_type,filter) => {
        return [error,data_list] = await delete_item_list_adapter(db_connect,data_type,filter);
    };
    static count_list = async (db_connect,data_type,filter) => {
        return [error,data] = await count_item_list_adapter(db_connect,data_type,filter);
    };
}
module.exports = {
    Data,
    Database,
    Portal
};
