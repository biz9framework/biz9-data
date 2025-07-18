/*
Copyright 2023 Certified CoderZ
Author: certifiedcoderz@gmail.com (Certified CoderZ)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {get_db_connect_main,check_db_connect_main,close_db_connect_main,update_item_main,get_item_main,delete_item_main,get_id_list_main,delete_item_list_main,count_item_list_main} = require('./mongo/index.js');
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Number,Obj}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
const {DataItem,DataType,FieldType,Item_Logic,User_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const { get_db_connect_adapter,check_db_connect_adapter,close_db_connect_adapter,update_item_adapter,update_item_list_adapter,get_item_adapter,delete_item_adapter,get_item_list_adapter,delete_item_list_adapter,count_item_list_adapter,delete_item_cache }  = require('./adapter.js');
const {get_database_main} = require("./main");
class Database {
    static get = async (data_config,option) => {
        /* return
         * - n/a
         * option params
         * - biz9_config_file
         *   - source file for data config. / obj / ex. root folder biz9_config.
         * - app_id
         *   - database id. / string / ex. project_500
         */
        let cloud_error=null;
        return new Promise((callback) => {
            option = !Obj.check_is_empty(option) ? option : {biz9_config_file:null,app_id:null};
            if(option.biz9_config_file==null){
                option.biz9_config_file=null;
            }else{
                data_config = Scriptz.get_biz9_config(option);
            }
            if(option.app_id){
                data_config.app_id = option.app_id;
            }
            if(data_config.app_id==null){
                cloud_error=Log.append(cloud_error,"Database Error: Missing app_id.");
            }
            Data.open_db(data_config).then(([error,data])=>{
                cloud_error=Log.append(cloud_error,error);
                data.data_config=data_config;
                data.app_id=data_config.APP_ID;
                callback([error,data]);
            }).catch(error => {
                cloud_error=Log.append(cloud_error,error);
                Log.error("BiZItem-Get-Connect",error);
                callback([error,null]);
            });
        });
    }
    static close = async (database) => {
        /* option params
         * - database
         *      - connected database. / obj / ex. mongo db connection.
         * return objects
         *  - database
         *      - Disconnect database. / obj / ex. null. dispose db obj.
         *  - app_id
         *      - database id. / string / ex. project_500
         */
        let cloud_error=null;
        return new Promise((callback) => {
            Data.close_db(database).then(([error,data])=>{
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
class Data_Logic {
    static get_parent_child_list = (full_item_list) => {
        /* option params
         * - full_item_list
         *      - List of objects. Bind all child id values to matching parent id. / list / ex. Products and child attributes items.
         * return objects
         * - full_item_list
         *      - Binded list of objects. / list / ex. Products now binded to child items.
         */
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
    static get_child_list = (database,item_list,data_type,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            /*
             * - option
             *    - get_group / bool / ex. true,false / def. false /n/a
             *    - group_search / search obj / ex. {} /n/a
             *
             *    - group_child_data_type / data_type /
             *    - group_parent_field / field_title /
             *    - group_child_field / field_title /
             *    */

            let error=null;
            let child_item_list = [];
            async.series([
                function(call){
                    let search = Item_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
                    Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=>{
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            child_item_list=data;
                            call();
                        }
                    }).catch(error => {
                        error=Log.append(error,error);
                    });
                },
                function(call){
                    for(let a = 0; a<item_list.length;a++){
                        item_list[a].items = [];
                        for(let b = 0; b<child_item_list.length;b++){
                            if(item_list[a][option.group_parent_field] == child_item_list[b][option.group_child_field]){
                                item_list[a].items.push(child_item_list[b]);
                            }
                        }
                    }
                    call();
                }
            ]).then(result => {
                callback([error,item_list]);
            }).catch(error => {
                Log.error("Get-Child-List",error);
                callback([error,[]]);
            });
        });
    };
}
class Blog_Post_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.BLOG_POST,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.BLOG_POST,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Category_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.CATEGORY,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Category-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.CATEGORY,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Category-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Content_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.CONTENT,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Content-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.CONTENT,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Content-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Page_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.PAGE,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Page-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.PAGE,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Page-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Template_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.TEMPLATE,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Template-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.TEMPLATE,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Template-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Event_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.EVENT,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Event-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.EVENT,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Event-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Order_Data {
    static order_item_update = async (database,data_type,user_id,order,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            cloud_data.order = DataItem.get_new(DataType.ORDER,0);
            cloud_data.order_item_list = [];
            cloud_data.order_sub_item_list = [];
            cloud_data.publish_stat_list = [];
            cloud_data.publish_parent_item_list = [];
            let order_item_item_list = [];
            async.series([
                async function(call){
                    Object.keys(order).forEach(key => {
                        if(key!='order_item_list'){
                            cloud_data.order[key] = order[key]
                        }
                    });
                },
                //get order
                async function(call){
                    if(Str.check_is_null(cloud_data.order.id)){
                        const [error,data] = await Portal.update(database,DataType.ORDER,cloud_data.order);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.order = data.item;
                        }
                    }
                },

                //bind order_item_list
                async function(call){
                    for(let a = 0; a < order.order_item_list.length; a++){
                        let order_item = {};
                        Object.keys(order.order_item_list[a]).forEach(key => {
                            if(key!='order_sub_item_list'){
                                order_item[key] = order.order_item_list[a][key];
                            }
                        });
                        order_item.order_item_id = cloud_data.order.id;
                        cloud_data.order_item_list.push(order_item);
                    }
                },
                //update order_item_list
                async function(call){
                    if(cloud_data.order_item_list.length>0){
                        const [error,data] = await Portal.update_list(database,cloud_data.order_item_list);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.order_item_list = data.item_list;
                        }
                    }
                },
                //bind order_sub_item_list
                function(call){
                    for(let a = 0; a < order.order_item_list.length; a++){
                        for(let b = 0; b < order.order_item_list[a].order_sub_item_list.length;b++){
                            let order_sub_item = {};
                            Object.keys(order.order_item_list[a].order_sub_item_list[b]).forEach(key => {
                                order_sub_item[key] =  order.order_item_list[a].order_sub_item_list[b][key];
                            });
                            order_sub_item.order_item_data_type = cloud_data.order_item_list[a].data_type;
                            order_sub_item.order_item_id = cloud_data.order_item_list[a].id;
                            cloud_data.order_sub_item_list.push(order_sub_item);
                        }
                    }
                    call();
                },
                //update order_sub_item_list
                async function(call){
                    if(cloud_data.order_sub_item_list.length>0){
                        const [error,data] = await Portal.update_list(database,cloud_data.order_sub_item_list);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.order_sub_item_list = data.item_list;
                        }
                    }
                },
                async function(call){
                    let stat_list = [];
                    for(let a = 0; a < cloud_data.order_item_list.length; a++){
                        stat_list.push(DataItem.get_new(DataType.STAT,0,{parent_id:cloud_data.order_item_list[a].parent_id,parent_data_type:cloud_data.order_item_list[a].parent_data_type}));
                    }
                    const [error,data] = await Stat_Data.update_item_list(database,data_type,user_id,FieldType.STAT_ORDER_ADD_ID,stat_list);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.publish_stat_list = data.publish_stat_list;
                        cloud_data.publish_parent_item_list = data.publish_parent_item_list;
                    }
                },
                //get order
                async function(call){
                        const [error,data] = await Order_Data.order_get(database,data_type,order.order_id);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                                cloud_data.order = data.order;
                        }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("OrderData-Order-Item-Update",error);
                callback([error,[]]);
            });
        });
    };
    static order_get = (database,data_type,order_id,option) => {
        return new Promise((callback) => {
            let cloud_data = {order:DataItem.get_new(DataType.ORDER,0,{order_id:order_id,order_item_list:[]})};
            let order_item_item_list_query = { $or: [] };
            let order_sub_item_item_list_query = { $or: [] };
            cloud_data.user = DataItem.get_new(DataType.USER,0,
                {
                    title:"User Not Found",
                    first_name:"First Name Not Found",
                    last_name:"Last Name Not Found",
                    app_id:database.app_id
                });
            let error = null;
            let order_item_list = [];
            let parent_item_list = [];
            let order_sub_item_list = [];
            let parent_sub_item_list = [];
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,get_order_item:true};
            async.series([
                //order
                async function(call){
                    option.filter = { order_id: { $regex:".*"+order_id, $options: "i" } };
                    const [error,data] = await Portal.get(database,DataType.ORDER,order_id,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.order = data.item;
                    }
                },
                //order_item_list
                async function(call){
                    let filter = { order_id: { $regex:".*"+order_id, $options: "i" } };
                    let search = Item_Logic.get_search(DataType.ORDER_ITEM,filter,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.order.order_item_list = data.item_list;
                    }
               },
                //order_item_item_list - parent_item_list
                async function(call){
                    for(let a = 0;a < cloud_data.order.order_item_list.length; a++){
                        let query_field = {};
                        query_field['id'] = { $regex:cloud_data.order.order_item_list[a]['parent_id'], $options: "i" };
                        order_item_item_list_query.$or.push(query_field);
                    }
                    let search = Item_Logic.get_search(data_type,order_item_item_list_query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    Log.w('my_data',data);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        for(let a = 0; a < cloud_data.order.order_item_list.length; a++){
                            cloud_data.order.order_item_list[a].parent_item = DataItem.get_new(cloud_data.order.order_item_list[a].parent_data_type,0,{title:'Item Not Found',parent_id: cloud_data.order.order_item_list[a].parent_id});
                            for(let b = 0; b < data.item_list.length; b++){
                                if(cloud_data.order.order_item_list[a].parent_id == data.item_list[b].id){
                                    cloud_data.order.order_item_list[a].parent_item = data.item_list[b];
                                }
                            }
                        }
                    }

                },
                //order_sub_item_list
                async function(call){
                    let filter = { order_id: { $regex:".*"+order_id, $options: "i" } };
                    let search = Item_Logic.get_search(DataType.ORDER_SUB_ITEM,filter,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        order_sub_item_list = data.item_list;
                        for(let a = 0; a < cloud_data.order.order_item_list.length; a++){
                            cloud_data.order.order_item_list[a].order_sub_item_list = [];
                            for(let b = 0; b < order_sub_item_list.length; b++){
                                if(cloud_data.order.order_item_list[a].id == order_sub_item_list[b].order_item_id){
                                    cloud_data.order.order_item_list[a].order_sub_item_list.push(order_sub_item_list[b]);
                                }
                            }
                        }
                    }
                },
                //order_sub_item_item_list - parent_item_list
                async function(call){
                    for(let a = 0; a < order_sub_item_list.length; a++){
                        let query_field = {};
                        query_field['id'] = { $regex:order_sub_item_list[a]['parent_id'], $options: "i" };
                        order_sub_item_item_list_query.$or.push(query_field);
                    }
                    let search = Item_Logic.get_search(DataType.ITEM,order_sub_item_item_list_query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        for(let a = 0; a < cloud_data.order.order_item_list.length; a++){
                            for(let b = 0; b < cloud_data.order.order_item_list[a].order_sub_item_list.length; b++){
                                cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_item = DataItem.get_new(DataType.ITEM,0,{parent_id: cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_id});
                                for(let c = 0; c < data.item_list.length; c++){
                                    if(cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_id == data.item_list[c].id){
                                        cloud_data.order.order_item_list[a].order_sub_item_list[b].parent_item = data.item_list[c];
                                    }
                                }
                            }
                        }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Order-Get",error);
                callback([error,[]]);
            });
        });
    };
    static order_delete = async (database,id,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            cloud_data.order = DataItem.get_new(DataType.ORDER,id);
            async.series([
                async function(call){
                    if(Str.check_is_null(cloud_data.order.id)){
                        const [error,data] = await Portal.delete(database,DataType.ORDER,id);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.order = data.item;
                        }
                    }
                },
                async function(call){
                    let search = Item_Logic.get_search(DataType.ORDER_ITEM,{order_item_id:id},{},1,0);
                    const [error,data] = await Portal.delete_search(database,DataType.ORDER_ITEM,search.filter);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.delete_search = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("OrderData-Order-Item-Update",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.ORDER,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product-Search",error);
                callback([error,[]]);
            });
        });
    };
}

class Cart_Data {
    static cart_item_update = async (database,data_type,user_id,cart,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            cloud_data.cart = DataItem.get_new(DataType.CART,0);
            cloud_data.cart_item_list = [];
            cloud_data.cart_sub_item_list = [];
            cloud_data.publish_stat_list = [];
            cloud_data.publish_parent_item_list = [];
            let cart_item_item_list = [];
            async.series([
                async function(call){
                    Object.keys(cart).forEach(key => {
                        if(key!='cart_item_list'){
                            cloud_data.cart[key] = cart[key]
                        }
                    });
                },
                //get cart
                async function(call){
                    if(Str.check_is_null(cloud_data.cart.id)){
                        const [error,data] = await Portal.update(database,DataType.CART,cloud_data.cart);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.cart = data.item;
                        }
                    }
                },

                //bind cart_item_list
                async function(call){
                    for(let a = 0; a < cart.cart_item_list.length; a++){
                        let cart_item = {};
                        Object.keys(cart.cart_item_list[a]).forEach(key => {
                            if(key!='cart_sub_item_list'){
                                cart_item[key] = cart.cart_item_list[a][key];
                            }
                        });
                        cart_item.cart_item_id = cloud_data.cart.id;
                        cloud_data.cart_item_list.push(cart_item);
                    }
                },
                //update cart_item_list
                async function(call){
                    if(cloud_data.cart_item_list.length>0){
                        const [error,data] = await Portal.update_list(database,cloud_data.cart_item_list);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.cart_item_list = data.item_list;
                        }
                    }
                },
                //bind cart_sub_item_list
                function(call){
                    for(let a = 0; a < cart.cart_item_list.length; a++){
                        for(let b = 0; b < cart.cart_item_list[a].cart_sub_item_list.length;b++){
                            let cart_sub_item = {};
                            Object.keys(cart.cart_item_list[a].cart_sub_item_list[b]).forEach(key => {
                                cart_sub_item[key] =  cart.cart_item_list[a].cart_sub_item_list[b][key];
                            });
                            cart_sub_item.cart_item_data_type = cloud_data.cart_item_list[a].data_type;
                            cart_sub_item.cart_item_id = cloud_data.cart_item_list[a].id;
                            cloud_data.cart_sub_item_list.push(cart_sub_item);
                        }
                    }
                    call();
                },
                //update cart_sub_item_list
                async function(call){
                    if(cloud_data.cart_sub_item_list.length>0){
                        const [error,data] = await Portal.update_list(database,cloud_data.cart_sub_item_list);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.cart_sub_item_list = data.item_list;
                        }
                    }
                },
                async function(call){
                    let stat_list = [];
                    for(let a = 0; a < cloud_data.cart_item_list.length; a++){
                        stat_list.push(DataItem.get_new(DataType.STAT,0,{parent_id:cloud_data.cart_item_list[a].parent_id,parent_data_type:cloud_data.cart_item_list[a].parent_data_type}));
                    }
                    const [error,data] = await Stat_Data.update_item_list(database,data_type,user_id,FieldType.STAT_CART_ADD_ID,stat_list);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.publish_stat_list = data.publish_stat_list;
                        cloud_data.publish_parent_item_list = data.publish_parent_item_list;
                    }
                },
                //get cart
                async function(call){
                        const [error,data] = await Order_Data.cart_get(database,data_type,cart.cart_id);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                                cloud_data.cart = data.cart;
                        }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("OrderData-Cart-Item-Update",error);
                callback([error,[]]);
            });
        });
    };
    static cart_get = (database,data_type,cart_id,option) => {
        return new Promise((callback) => {
            let cloud_data = {cart:DataItem.get_new(DataType.CART,0,{cart_id:cart_id,cart_item_list:[]})};
            let cart_item_item_list_query = { $or: [] };
            let cart_sub_item_item_list_query = { $or: [] };
            cloud_data.user = DataItem.get_new(DataType.USER,0,
                {
                    title:"User Not Found",
                    first_name:"First Name Not Found",
                    last_name:"Last Name Not Found",
                    app_id:database.app_id
                });
            let error = null;
            let cart_item_list = [];
            let parent_item_list = [];
            let cart_sub_item_list = [];
            let parent_sub_item_list = [];
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,get_cart_item:true};
            async.series([
                //cart
                async function(call){
                    option.filter = { cart_id: { $regex:".*"+cart_id, $options: "i" } };
                    const [error,data] = await Portal.get(database,DataType.CART,cart_id,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.cart = data.item;
                    }
                },
                //cart_item_list
                async function(call){
                    let filter = { cart_id: { $regex:".*"+cart_id, $options: "i" } };
                    let search = Item_Logic.get_search(DataType.CART_ITEM,filter,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.cart.cart_item_list = data.item_list;
                    }
               },
                //cart_item_item_list - parent_item_list
                async function(call){
                    for(let a = 0;a < cloud_data.cart.cart_item_list.length; a++){
                        let query_field = {};
                        query_field['id'] = { $regex:cloud_data.cart.cart_item_list[a]['parent_id'], $options: "i" };
                        cart_item_item_list_query.$or.push(query_field);
                    }
                    let search = Item_Logic.get_search(data_type,cart_item_item_list_query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    Log.w('my_data',data);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        for(let a = 0; a < cloud_data.cart.cart_item_list.length; a++){
                            cloud_data.cart.cart_item_list[a].parent_item = DataItem.get_new(cloud_data.cart.cart_item_list[a].parent_data_type,0,{title:'Item Not Found',parent_id: cloud_data.cart.cart_item_list[a].parent_id});
                            for(let b = 0; b < data.item_list.length; b++){
                                if(cloud_data.cart.cart_item_list[a].parent_id == data.item_list[b].id){
                                    cloud_data.cart.cart_item_list[a].parent_item = data.item_list[b];
                                }
                            }
                        }
                    }

                },
                //cart_sub_item_list
                async function(call){
                    let filter = { cart_id: { $regex:".*"+cart_id, $options: "i" } };
                    let search = Item_Logic.get_search(DataType.CART_SUB_ITEM,filter,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,{});
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cart_sub_item_list = data.item_list;
                        for(let a = 0; a < cloud_data.cart.cart_item_list.length; a++){
                            cloud_data.cart.cart_item_list[a].cart_sub_item_list = [];
                            for(let b = 0; b < cart_sub_item_list.length; b++){
                                if(cloud_data.cart.cart_item_list[a].id == cart_sub_item_list[b].cart_item_id){
                                    cloud_data.cart.cart_item_list[a].cart_sub_item_list.push(cart_sub_item_list[b]);
                                }
                            }
                        }
                    }
                },
                //cart_sub_item_item_list - parent_item_list
                async function(call){
                    for(let a = 0; a < cart_sub_item_list.length; a++){
                        let query_field = {};
                        query_field['id'] = { $regex:cart_sub_item_list[a]['parent_id'], $options: "i" };
                        cart_sub_item_item_list_query.$or.push(query_field);
                    }
                    let search = Item_Logic.get_search(DataType.ITEM,cart_sub_item_item_list_query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        for(let a = 0; a < cloud_data.cart.cart_item_list.length; a++){
                            for(let b = 0; b < cloud_data.cart.cart_item_list[a].cart_sub_item_list.length; b++){
                                cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_item = DataItem.get_new(DataType.ITEM,0,{parent_id: cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_id});
                                for(let c = 0; c < data.item_list.length; c++){
                                    if(cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_id == data.item_list[c].id){
                                        cloud_data.cart.cart_item_list[a].cart_sub_item_list[b].parent_item = data.item_list[c];
                                    }
                                }
                            }
                        }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Cart-Get",error);
                callback([error,[]]);
            });
        });
    };
    static cart_delete = async (database,id,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            cloud_data.cart = DataItem.get_new(DataType.CART,id);
            async.series([
                async function(call){
                    if(Str.check_is_null(cloud_data.cart.id)){
                        const [error,data] = await Portal.delete(database,DataType.CART,id);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.cart = data.item;
                        }
                    }
                },
                async function(call){
                    let search = Item_Logic.get_search(DataType.CART_ITEM,{cart_item_id:id},{},1,0);
                    const [error,data] = await Portal.delete_search(database,DataType.CART_ITEM,search.filter);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data.delete_search = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("OrderData-Cart-Item-Update",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.ORDER,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Product_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.PRODUCT,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.PRODUCT,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Product-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Review_Data {
    static update = async (database,parent_data_type,parent_id,user_id,review) => {
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            cloud_data.parent_item = DataItem.get_new(parent_data_type,parent_id,{parent_data_type:parent_data_type,parent_id:parent_id,user_id:user_id});
            cloud_data.review = review;
            let review_list = [];
            let review_count = 0;
            let review_avg = 0;
            async.series([
                //review_update
                async function(call){
                    const [error,data] = await Portal.update(database,DataType.REVIEW,cloud_data.review);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud_data.review = data.item;
                    }
                },
                //review_list
                async function(call){
                    let query = {parent_id:parent_id};
                    let search = Item_Logic.get_search(DataType.REVIEW,query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        if(data.item_list.length>0){
                            review_list = data.item_list;
                        }
                    }
                },
                function(call){
                    let review_rating_total = 0;
                    for(let a = 0; a < review_list.length;a++){
                        review_rating_total = review_rating_total + parseInt(review_list[a].rating);
                    }
                    review_avg = !Str.check_is_null(review_rating_total) ? parseInt(review_rating_total/review_list.length) : 1;
                    review_count = !Str.check_is_null(review_list.length) ? review_list.length : 1;
                    call();
                },
                async function(call){
                    cloud_data.parent_item.review_count = review_count;
                    cloud_data.parent_item.review_avg = review_avg;
                    const [error,data] = await Portal.update(database,cloud_data.parent_item.data_type,cloud_data.parent_item);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud_data.parent_item = data.item;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Review-Data-Update",error);
                callback([error,[]]);
            });
        });
    };
    static search = async (database,parent_data_type,parent_id,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let error=null;
            let cloud_data = {item_list:0,item_count:0,page_count:1};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            let parent_item = [];
            let user_list = [];
            async.series([
                //review_list
                async function(call){
                    let search = Item_Logic.get_search(DataType.REVIEW,{parent_id:parent_id},sort_by,page_current,page_size);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud_data.item_list = data.item_list;
                        cloud_data.item_count = data.item_count;
                        cloud_data.page_count = data.page_count;
                    }
                },
                //parent_item
                async function(call){
                    if(cloud_data.item_list.length>0){
                        const [error,data] = await Portal.get(database,parent_data_type,parent_id);
                        if(error){
                            cloud_error = Log.append(cloud_error,error);
                        }else{
                            parent_item = data.item;
                        }
                    }
                },
                //user_list
                async function(call){
                    if(cloud_data.item_list.length>0){
                        var query = { $or: [] };
                        for(let a = 0;a < cloud_data.item_list.length;a++){
                            query.$or.push({id: { $regex:cloud_data.item_list[a].user_id, $options: "i" }});
                        }
                        let search = Item_Logic.get_search(DataType.USER,query,{date_create:-1},1,0);
                        const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                        if(error){
                            cloud_error=Log.append(cloud_error,error);
                        }else{
                            user_list=data.item_list;
                        }
                    }
                },
                //bind parent_item, user_list
                function(call){
                    if(cloud_data.item_list.length>0){
                        for(let a = 0;a<cloud_data.item_list.length;a++){
                            cloud_data.item_list[a].parent_id = parent_item.id;
                            cloud_data.item_list[a].parent_photo_data = parent_item.photo_data ? parent_item.photo_data : "";
                            cloud_data.item_list[a].parent_title = parent_item.title;
                            for(let b = 0;b<user_list.length;b++){
                                if(cloud_data.item_list[a].user_id == user_list[b].id){
                                    cloud_data.item_list[a].user_photo_data = !Str.check_is_null(user_list[b].photo_data) ? user_list[b].photo_data : "";
                                    cloud_data.item_list[a].user_title = !Str.check_is_null(user_list[b].title) ? user_list[b].title : "N/A";
                                    cloud_data.item_list[a].user_location = User_Logic.get_user_country_state_city(user_list[b]);
                                }
                            }
                        }
                        call();
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Review-Data-List",error);
                callback([error,[]]);
            });
        });
    };
}
class Favorite_Data {
    static update = async (database,parent_data_type,parent_id,user_id) => {
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            cloud_data.favorite_found = false;
            cloud_data.favorite = DataItem.get_new(DataType.FAVORITE,0,{parent_data_type:parent_data_type,parent_id:parent_id,user_id:user_id});
            async.series([
                async function(call){
                    var query = { $and: [] };
                    query.$and.push({parent_id: { $regex:parent_id, $options: "i" }});
                    query.$and.push({user_id: { $regex:user_id, $options: "i" }});
                    let search = Item_Logic.get_search(DataType.FAVORITE,query,{},1,0);
                    const [error,data] = await Portal.count(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        if(data.count>0){
                            cloud_data.favorite_found = true;
                        }
                    }
                },
                async function(call){
                    if(!cloud_data.favorite_found){
                        const [error,data] = await Portal.update(database,cloud_data.favorite.data_type,cloud_data.favorite);
                        if(error){
                            cloud_error=Log.append(cloud_error,error);
                        }else{
                            cloud_data.favorite = data.item;
                        }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Favorite-Data-Update",error);
                callback([error,[]]);
            });
        });
    };
    static search = async (database,parent_data_type,user_id,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            let parent_item_list = [];
            let user_list = [];
            async.series([
                //favorite_list
                async function(call){
                    let query = {user_id:user_id,parent_data_type:parent_data_type};
                    let search = Item_Logic.get_search(DataType.FAVORITE,query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud_data.item_list = data.item_list;
                    }
                },
                //parent_item_list
                async function(call){
                    var query = { $or: [] };
                    for(let a = 0;a < cloud_data.item_list.length;a++){
                        query.$or.push({id: { $regex:cloud_data.item_list[a].parent_id, $options: "i" }});
                    }
                    let search = Item_Logic.get_search(parent_data_type,query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        parent_item_list=data.item_list;
                    }
                },
                //user_list
                async function(call){
                    var query = { $or: [] };
                    for(let a = 0;a < cloud_data.item_list.length;a++){
                        query.$or.push({id: { $regex:cloud_data.item_list[a].user_id, $options: "i" }});
                    }
                    let search = Item_Logic.get_search(DataType.USER,query,{},1,0);
                    const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        user_list=data.item_list;
                    }
                },
                //bind parent_item_list
                function(call){
                    for(let a = 0;a<cloud_data.item_list.length;a++){
                        for(let b = 0;b<parent_item_list.length;b++){
                            if(cloud_data.item_list[a].parent_id == parent_item_list[b].id){
                                cloud_data.item_list[a].parent_photo_data = !Str.check_is_null(parent_item_list[b].photo_data) ? parent_item_list[b].photo_data : "";
                                cloud_data.item_list[a].parent_title = !Str.check_is_null(parent_item_list[b].title) ? parent_item_list[b].title : "N/A";
                            }
                        }
                    }
                    call();
                },
                //bind user_list
                function(call){
                    for(let a = 0;a<cloud_data.item_list.length;a++){
                        for(let b = 0;b<user_list.length;b++){
                            if(cloud_data.item_list[a].user_id == user_list[b].id){
                                cloud_data.item_list[a].user_photo_data = !Str.check_is_null(user_list[b].photo_data) ? user_list[b].photo_data : "";
                                cloud_data.item_list[a].user_title = !Str.check_is_null(user_list[b].title) ? user_list[b].title : "N/A";
                                cloud_data.item_list[a].user_location = User_Logic.get_user_country_state_city(user_list[b]);
                            }
                        }
                    }
                    call();
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Favorite-Data-List",error);
                callback([error,[]]);
            });
        });
    };
}
class Business_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.BUSINESS,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Business-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.BUSINESS,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Business-Search",error);
                callback([error,[]]);
            });
        });
    };
}

class Admin_Data {
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.ADMIN,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Admin-Get",error);
                callback([error,[]]);
            });
        });
    };
    static search = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.ADMIN,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Admin-Search",error);
                callback([error,[]]);
            });
        });
    };
}
class Portal {
    static get = async (database,data_type,key,option) => {
        /* Options
         * Items
         *  - get_item / bool / ex. true,false / def. true
         * Photos
         *  - get_photo / bool / ex. true,false / def. true
         *    - photo_count / int / ex. 1-999 / def. 19
         *    - photo_sort_by / query obj / ex. {date_create:1}
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            let full_item_list = [];
            let new_item_list = [];
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,title_url:null,get_group:false,filter:false};
            async.series([
                function(call){
                    if(!Number.check_is_guid(key)){
                        option.title_url = key;
                    }
                    call();
                },
                function(call){
                    Data.get_item(database,data_type,key,option).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item = data;
                        }
                        call();
                    }).catch(error => {
                        Log.error("Portal-Get-Key-A",error);
                        error = Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    function get_sort(item){
                        let sort_order = {};
                        switch(item.setting_sort_type)
                        {
                            case 'title':
                                sort_order = item.setting_sort_order == 'desc' ? {title:1} :  {title:-1};
                                break;
                            case 'order':
                                sort_order = item.setting_sort_order == 'asc' ? {setting_order:1} : {setting_order:-1};
                                break;
                            case 'date':
                                sort_order = item.setting_sort_order == 'desc' ? {date_create:1} : {date_create:-1};
                                break;
                            default:
                                sort_order = item.setting_sort_order == 'desc' ? {title:-1} :  {title:1};
                                break;
                        }
                        return sort_order;
                    }
                    let filter = {};
                    if(cloud_data.item.id && option.get_item || option.get_section){
                        if(Str.check_is_null(cloud_data.item.top_id)){
                            filter={top_id:cloud_data.item.id};
                        }else{
                            filter={top_id:cloud_data.item.top_id};
                        }
                        let search = Item_Logic.get_search(DataType.ITEM,filter,get_sort(cloud_data.item),1,0);
                        Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                full_item_list = data;
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
                    if(cloud_data.item.id && option.get_item || option.get_section){
                        const [error,data] = await Data_Logic.get_parent_child_list(full_item_list);
                        new_item_list = data;
                    }
                },
                function(call){
                    if(cloud_data.item.id && option.get_item || option.get_section){
                        cloud_data.item.items = [];
                        for(let a=0; a<new_item_list.length; a++){
                            if(new_item_list[a].parent_id == cloud_data.item.id){
                                let item_title_url = Str.get_title_url(new_item_list[a].title);
                                cloud_data.item[item_title_url] = new Object();
                                cloud_data.item[item_title_url] = new_item_list[a];
                                cloud_data.item.items.push(new_item_list[a]);
                            }
                        }
                        call();
                    }
                    else{
                        call();
                    }
                },
                async function(call){
                    if(option.get_photo){
                        cloud_data.item.photos = [];
                        if(option.photo_count == null){
                            option.photo_count = 19;
                        }
                        if(option.photo_sort_by == null){
                            option.photo_sort_by = {date_create:1};
                        }
                        let filter = {parent_id:cloud_data.item.id};
                        let sort_by = option.photo_sort_by;
                        let page_current = 1;
                        let page_size = option.photo_count;
                        const [error,data] = await Portal.search(database,DataType.PHOTO,filter,sort_by,page_current,page_size,option);
                        if(data.item_list.length > 0){
                            cloud_data.item.photos = data.item_list;
                        }
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
    static search = (database,data_type,filter,sort_by,page_current,page_size,option) => {
        /* Options
         * Items
         *  - get_item / bool / ex. true,false / def. true
         * Photos
         *  - get_photo / bool / ex. true,false / def. true
         *    - photo_count / int / ex. 1-999 / def. 19
         *    - photo_sort_by / query obj / ex. {date_create:1}
         *  Count
         *  - get_item_count / true - false
              - item_count_data_type / Product
              - item_count_filter / {category:category}
              - item_count_field / title
              - item_count_value / 'beauty'
         *  Search
         *  - get_item_search / true - false
              - item_search_data_type / Product
              - item_search_field / category_title
              - item_search_value / 'beauty'
              */
        return new Promise((callback) => {
            let cloud_data = {};
            let error=null;
            let item_count_list =[];
            let item_search_list =[];
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                function(call){
                    let search = Item_Logic.get_search(data_type,filter,sort_by,page_current,page_size);
                    Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=>{
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item_count=item_count;
                            cloud_data.page_count=page_count;
                            cloud_data.filter=filter;
                            cloud_data.data_type=data_type;
                            cloud_data.item_list=data;
                            call();
                        }
                    }).catch(error => {
                        error=Log.append(error,error);
                    });
                },
                async function(call){
                    if(option.get_item){
                        const [error,data] = await Data_Logic.get_parent_child_list(cloud_data.item_list);
                        cloud_data.item_list = data;
                    }
                },
                function(call){
                    if(option.get_item_count){
                        let query = { $or: [] };
                        for(let a = 0;a < cloud_data.item_list.length;a++){
                            let query_field = {};
                            query_field[option.item_count_field] = { $regex:cloud_data.item_list[a][option.item_count_value], $options: "i" };
                            query.$or.push(query_field);
                        }
                        let search = Item_Logic.get_search(option.item_count_data_type,query,{},1,0);
                        Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                item_count_list = data;
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
                function(call){
                    if(option.get_item_count){
                        for(let a = 0; a < cloud_data.item_list.length; a++){
                            cloud_data.item_list[a].item_count = 0;
                            for(let b = 0; b < item_count_list.length; b++){
                                if(cloud_data.item_list[a][option.item_count_value] == item_count_list[b][option.item_count_field]){
                                    cloud_data.item_list[a].item_count = cloud_data.item_list[a].item_count + 1;
                                }
                            }
                        }
                        call();
                    }else{
                        call();
                    }
                },
                function(call){
                    if(option.get_item_search){
                        let query = { $or: [] };
                        for(let a = 0;a < cloud_data.item_list.length;a++){
                            let query_field = {};
                            query_field[option.item_search_field] = { $regex:cloud_data.item_list[a][option.item_search_value], $options: "i" };
                            query.$or.push(query_field);
                        }
                        Log.w('rrr',query.$or);
                        let search = Item_Logic.get_search(option.item_search_data_type,query,{},1,0);
                        cloud_data.item_search_search = search;

                        Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {

                            if(error){
                                error=Log.append(error,error);
                            }else{
                                cloud_data.item_search_item_list = data;
                                cloud_data.item_search_item_count = item_count;
                                cloud_data.item_search_page_count = page_count;
                                cloud_data.item_search_data_type = search.data_type;
                                cloud_data.item_search_search = search;
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
                function(call){
                    if(option.get_item_search){
                        for(let a = 0; a < cloud_data.item_list.length; a++){
                            cloud_data.item_list[a].item_search_list = [];
                            for(let b = 0; b < item_search_list.length; b++){
                                if(cloud_data.item_list[a][option.item_search_value] == item_search_list[b][option.item_search_field]){
                                    cloud_data.item_list[a].item_search_list.push(item_search_list[b]);
                                }
                            }
                        }
                        call();
                    }else{
                        call();
                    }
                }
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Portal-Get",error);
                callback([error,[]]);
            });
        });
    };
    static update = async (database,data_type,item_data,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                function(call){
                    Data.update_item(database,data_type,item_data).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Update-Item",error);
                callback([error,[]]);
            });
        });
    };
    static delete_cache = async (database,data_type,id,option) => {
        /*
         * params
         * - title_tbd
         *   - description. / type / ex.
         * option
         * - title_tbd
         *   - description. / type / ex.
         * return
         * - title_tbd
         *   - description. / type / ex.
         *
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                function(call){
                    Data.delete_cache_item(database,data_type,id).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Delete-Cache-Item",error);
                callback([error,[]]);
            });
        });
    };
    static delete = async (database,data_type,id,option) => {
        /*
         * Params
         * - title
         *   - description / type / example / required
         * Option
         * - delete_items
         *   - description / bool / example / default: false
         * - delete_photos
         *   - description / bool / example / default: false
         * Return
         * - title
         *   - description / type /
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,delete_items:true,delete_photos:true};
            async.series([
                function(call){
                    Data.delete_item(database,data_type,id).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        Log.w('error',error);
                        call();
                    });
                },
                function(call){
                    if(option.delete_items){
                        let data_type = DataType.ITEM;
                        let filter = {parent_id:id};
                        cloud_data.delete_items = false;
                        Data.delete_list(database,data_type,filter).then(([error,data])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                cloud_data.delete_items = true;
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
                function(call){
                    if(option.delete_photos){
                        let data_type = DataType.PHOTO;
                        let filter = {parent_id:id};
                        cloud_data.delete_photos = false;
                        Data.delete_list(database,data_type,filter).then(([error,data])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                cloud_data.delete_photos = true;
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
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Delete-Item",error);
                callback([error,[]]);
            });
        });
    };
    static update_list = async (database,item_data_list,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                function(call){
                    Data.update_list(database,item_data_list).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item_list = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Update-List-Data",error);
                callback([error,[]]);
            });
        });
    };
    static delete_search = async (database,data_type,filter,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            async.series([
                function(call){
                    Data.delete_list(database,data_type,filter).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.item_list = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },

            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Delete-List-Data",error);
                callback([error,[]]);
            });
        });
    };
    static count = async (database,data_type,filter) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {count:0};
            async.series([
                function(call){
                    Data.count_list(database,data_type,filter).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.count = data;
                        }
                        call();
                    }).catch(error => {
                        error = Log.append(error,error);
                        call();
                    });
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Count-List-Data",error);
                callback([error,[]]);
            });
        });
    };
    static copy = async (database,data_type,id) => {
        /*
         * params
         * - title_tbd
         *   - description. / type / ex.
         * options
         * - title_tbd
         *   - description. / type / ex.
         * return
         * - title_tbd
         *   - description. / type / ex.
         *
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {copy_success:false,app_id:database.app_id};
            let top_item = DataItem.get_new(data_type,0);
            let copy_item = DataItem.get_new(data_type,0);
            let item_list = [];
            let copy_item_list = [];
            async.series([
                function(call){
                    Data.get_item(database,data_type,id).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }
                        top_item=data;
                        call();
                    })
                },
                function(call){
                    copy_item[FieldType.TITLE] = 'Copy '+top_item[FieldType.TITLE];
                    copy_item[FieldType.TITLE_URL] = 'copy_'+top_item[FieldType.TITLE_URL];
                    copy_item[FieldType.SOURCE_ID] = top_item.id;
                    copy_item[FieldType.SOURCE_DATA_TYPE] = top_item.data_type;

                    for(const key in top_item) {
                        if(key!=FieldType.ID&&key!=FieldType.SOURCE&&key!=FieldType.TITLE&&key!=FieldType.TITLE_URL){
                            copy_item[key]=top_item[key];
                        }
                    }
                    call();
                },
                function(call){
                    Data.update_item(database,copy_item.data_type,copy_item).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            copy_item=data;
                        }
                        call();
                    }).catch(error => {
                        error=Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    if(top_item.id){
                        let search = Item_Logic.get_search(DataType.ITEM,{top_id:top_item.id},{title:-1},1,0);
                        Data.get_list(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                item_list = data;
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
                function(call){
                    let source_top_items = [];
                    for(let a=0;a<item_list.length;a++){
                        let copy_sub_item={data_type:DataType.ITEM,id:0,top_id:copy_item.id,top_data_type:copy_item.data_type};
                        copy_sub_item[FieldType.SOURCE_ID] = item_list[a].id;
                        copy_sub_item[FieldType.SOURCE_DATA_TYPE] = item_list[a].data_type;
                        copy_sub_item[FieldType.SOURCE_PARENT_ID] = item_list[a].parent_id;
                        copy_sub_item[FieldType.SOURCE_PARENT_DATA_TYPE] = item_list[a].parent_data_type;
                        copy_sub_item[FieldType.SOURCE_TOP_ID] = item_list[a].top_id;
                        copy_sub_item[FieldType.SOURCE_TOP_DATA_TYPE] = item_list[a].top_data_type;
                        for(const key in item_list[a]) {
                            if( key != FieldType.ID && key != FieldType.SOURCE && key != FieldType.PARENT_ID && key != FieldType.PARENT_DATA_TYPE ){
                                copy_sub_item[key] = item_list[a][key];
                            }
                        }
                        copy_item_list.push(copy_sub_item);
                    }
                    call();
                },
                function(call){
                    Data.update_list(database,copy_item_list).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }
                        copy_item_list=data;
                        call();
                    })
                },
                function(call){
                    for(let a=0;a<copy_item_list.length;a++){
                        if(copy_item_list[a][FieldType.SOURCE_PARENT_ID] == top_item.id){
                            copy_item_list[a][FieldType.PARENT_ID] = copy_item[FieldType.ID];
                            copy_item_list[a][FieldType.PARENT_DATA_TYPE] = copy_item[FieldType.DATA_TYPE];
                        }else{
                            for(let b=0;b<copy_item_list.length;b++){
                                if(copy_item_list[a][FieldType.SOURCE_PARENT_ID] == copy_item_list[b][FieldType.SOURCE_ID] && !copy_item_list[a][FieldType.PARENT_ID] ){
                                    copy_item_list[a][FieldType.PARENT_ID] = copy_item_list[b][FieldType.ID];
                                    copy_item_list[a][FieldType.PARENT_DATA_TYPE] = copy_item_list[b][FieldType.DATA_TYPE];
                                }
                            }
                        }
                    }
                    call();
                },
                function(call){
                    Data.update_list(database,copy_item_list).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }
                        copy_item_list=data;
                        call();
                    })
                },
            ]).then(result => {
                if(copy_item.id){
                    cloud_data.copy_item = copy_item;
                    cloud_data.copy_success = true;
                }
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blank-Get",error);
                callback([error,[]]);
            });
        });
    };
}
class Faq{
    static get = (database,title_url,option) => {
        return new Promise((callback) => {
            let cloud_data = {item:DataItem.get_new(DataType.FAQ,0,{questions:[],app_id:database.app_id})};
            let error = null;
            let items = [];
            series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.FAQ,title_url,option);
                    if(!Str.check_is_null(data.item.id)){
                        cloud_data.item=data;
                        cloud_data.item.questions=[];
                    }
                    call();
                },
                async function(call){
                    for(let a=0;a<19;a++){
                        if(cloud_data.item[cloud_data.item["field_"+a]]){
                            cloud_data.item.questions.push({question:cloud_data.item["field_"+a],answer:cloud_data.item[cloud_data.item["field_"+a]]});
                        }
                    }
                    call();
                },
            ],
                function(error, result){
                    callback([error,cloud_data]);
                });
        });
    }
}
class Stat_Data {
    static update_item_list = (database,parent_data_type,user_id,stat_type_id,stat_list,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.new_stat = true;
            cloud_data.stat_count = 0;
            cloud_data.publish_parent_item_list = [];
            cloud_data.publish_stat_list = [];
            let error = null;
            if(!stat_list){
                stat_list = [];
            }
            async.series([
                //get parent items
                async function(call){
                    if(stat_list.length>0){
                        let query = { $or: [] };
                        for(let a = 0;a < stat_list.length;a++){
                            let query_field = {};
                            query_field['id'] = { $regex:stat_list[a].parent_id, $options: "i" };
                            query.$or.push(query_field);
                        }
                        let search = Item_Logic.get_search(parent_data_type,query,{},1,0);
                        const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            for(let a = 0; a < stat_list.length; a++){
                                stat_list[a].parent_item = DataItem.get_new(parent_data_type,0);
                                for(let b = 0; b < data.item_list.length; b++){
                                    if(stat_list[a].parent_id == data.item_list[b].id){
                                        stat_list[a].parent_item = data.item_list[b];
                                    }
                                }
                            }
                        }
                    }
                },
                //get user stats
                async function(call){
                    if(stat_list.length>0){
                        let query = { $or: [] };
                        for(let a = 0;a < stat_list.length;a++){
                            let query_field = {};
                            query_field['user_id'] = { $regex:String(user_id), $options: "i" };
                            query.$or.push(query_field);
                        }
                        let search = Item_Logic.get_search(DataType.STAT,query,{},1,0);
                        const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            for(let a = 0; a < stat_list.length; a++){
                                stat_list[a][get_stat_type_id(stat_type_id)] = !Str.check_is_null(stat_list[a].parent_item[get_stat_type_id(stat_type_id)]) ? parseInt(stat_list[a].parent_item[get_stat_type_id(stat_type_id)]) + 1 : 1;
                                stat_list[a].parent_item[get_stat_type_id(stat_type_id)] = stat_list[a][get_stat_type_id(stat_type_id)];
                                stat_list[a].new_stat = true;
                                for(let b = 0; b < data.item_list.length; b++){
                                    if(stat_list[a].id == data.item_list[b].parent_id && stat_list[a].data_type == data.item_list[b].parent_data_type && stat_type_id== data.item_list[b].type_id){
                                        stat_list[a].new_stat = false;
                                    }
                                }
                            }
                        }
                    }
                },
                //save stat list
                async function(call){
                    if(stat_list.length>0){
                        for(let a = 0; a < stat_list.length; a++){
                            if(stat_list[a].new_stat){
                                let stat_item = DataItem.get_new(stat_list[a].data_type,0,{parent_data_type:stat_list[a].parent_data_type,parent_id:stat_list[a].parent_id,new_stat:stat_list[a].new_stat});
                                stat_item[get_stat_type_id(stat_type_id)] = stat_list[a][get_stat_type_id(stat_type_id)];
                                cloud_data.publish_stat_list.push(stat_item);
                            }
                        }
                        const [error,data] = await Portal.update_list(database,cloud_data.publish_stat_list);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.publish_stat_list = data.item_list;
                        }
                    }
                },
                //save parent_item list
                async function(call){
                    if(stat_list.length>0){
                        let publish_parent_item_list = [];
                        for(let a = 0; a < stat_list.length; a++){
                            if(stat_list[a].new_stat){
                                let parent_item = DataItem.get_new(stat_list[a].parent_item.data_type,stat_list[a].parent_item.id);
                                parent_item[get_stat_type_id(stat_type_id)] = stat_list[a].parent_item[get_stat_type_id(stat_type_id)];
                                cloud_data.publish_parent_item_list.push(parent_item);
                            }
                        }
                        const [error,data] = await Portal.update_list(database,cloud_data.publish_parent_item_list);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            cloud_data.publish_parent_item_list = data.item_list;
                        }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("-Update-Item-View-Count-",error);
                callback([error,[]]);
            });
            function get_stat_type_id(stat_type_id){
                const STAT_VIEW_ID='1';
                const STAT_LIKE_ADD_ID='2';
                const STAT_FAVORITE_ADD_ID='3';
                const STAT_CART_ADD_ID='4';
                const STAT_ORDER_ADD_ID='5';
                const STAT_REVIEW_ADD_ID='6';
                let str = '';
                switch(stat_type_id){
                    case FieldType.STAT_CART_ADD_ID:
                        str = 'cart_add_count';
                        break;
                    case FieldType.STAT_VIEW_ADD_ID:
                        str = 'view_add_count';
                        break;
                    case FieldType.STAT_LIKE_ADD_ID:
                        str = 'like_add_count';
                        break;
                    case FieldType.STAT_FAVORITE_ADD_ID:
                        str = 'favorite_add_count';
                        break;
                    case FieldType.STAT_ORDER_ADD_ID:
                        str = 'order_add_count';
                        break;
                };
                return str;
            }


            function get_stat_type_id_old(stat_type_id,item){
                item.parent_item.cart_add_count = '0';
                const STAT_VIEW_ID='1';
                const STAT_LIKE_ADD_ID='2';
                const STAT_FAVORITE_ADD_ID='3';
                const STAT_CART_ADD_ID='4';
                const STAT_ORDER_ADD_ID='5';
                const STAT_REVIEW_ADD_ID='6';
                switch(stat_type_id){
                    case FieldType.STAT_CART_ADD_ID:
                        item.cart_add_count = !Str.check_is_null(item.parent_item.cart_add_count) ? parseInt(item.parent_item.cart_add_count) + 1 : 1;
                        item.parent_item.cart_add_count = !Str.check_is_null(item.parent_item.cart_add_count)  ? parseInt(item.parent_item.cart_add_count) + 1 : 1;
                        Log.w('item',item);
                        break;
                    case FieldType.STAT_VIEW_ADD_ID:
                        item.view_add_count = !Str.check_is_null(item.parent_item.view_add_count) ? parseInt(item.parent_item.view_add_count) + 1 : 1;
                        item.parent_item.view_add_count = !Str.check_is_null(item.parent_item.view_add_count)  ? parseInt(item.parent_item.view_add_count) + 1 : 1;
                        break;
                    case FieldType.STAT_LIKE_ADD_ID:
                        item.like_add_count = !Str.check_is_null(item.parent_item.like_add_count) ? parseInt(item.parent_item.like_add_count) + 1 : 1;
                        item.parent_item.like_add_count = !Str.check_is_null(item.parent_item.like_add_count)  ? parseInt(item.parent_item.like_add_count) + 1 : 1;
                        break;
                    case FieldType.STAT_FAVORITE_ADD_ID:
                        item.favorite_add_count = !Str.check_is_null(item.parent_item.favorite_add_count) ? parseInt(item.parent_item.favorite_add_count) + 1 : 1;
                        item.parent_item.favorite_add_count = !Str.check_is_null(item.parent_item.favorite_add_count)  ? parseInt(item.parent_item.favorite_add_count) + 1 : 1;
                        break;
                    case FieldType.STAT_ORDER_ADD_ID:
                        item.order_add_count = !Str.check_is_null(item.parent_item.order_add_count) ? parseInt(item.parent_item.order_add_count) + 1 : 1;
                        item.parent_item.order_add_count = !Str.check_is_null(item.parent_item.order_add_count)  ? parseInt(item.parent_item.order_add_count) + 1 : 1;
                        break;
                };
                return item;
            }

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
    static get_item = async (db_connect,data_type,key,option) => {
        return [error,data] = await get_item_adapter(db_connect,data_type,key,option);
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
    Admin_Data,
    Business_Data,
    Blog_Post_Data,
    Category_Data,
    Cart_Data,
    Content_Data,
    Database,
    Event_Data,
    Favorite_Data,
    Order_Data,
    Page_Data,
    Portal,
    Product_Data,
    Review_Data,
    Template_Data,
    Stat_Data,
};
