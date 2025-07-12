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
                    Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=>{
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.length>0){
                                child_item_list=data;
                                call();
                            }else{
                                call();
                            }
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
                    const [error,data] = await Portal.update(database,DataType.REVIEW,cloud.review);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud.review = data;
                    }
                },
                //review_list
                async function(call){
                    let query = {parent_id:cloud.id};
                    let review_search = Item_Logic.get_search(DataType.REVIEW,query,{},1,0);
                    const [error,data] = await Portal.search(database,review_search.data_type,review_search.filter,review_search.sort_by,review_search.page_current,review_search.page_size);
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
                    const [error,data] = await Portal.update(database,cloud.parent_item.data_type,cloud.parent_item);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud.parent_item = data;
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
    static search = async (database,parent_data_type,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let error=null;
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            let user_list = [];
            let parent_item_list = [];
            async.series([
                //review_list
                async function(call){
                    const [error,data] = await Portal.search(database,DataType.REVIEW,filter,sort_by,page_current,page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud_data = data;
                    }
                },
                //parent_item_list
                async function(call){
                    var query = { $or: [] };
                    for(let a = 0;a < cloud_data.item_list.length;a++){
                        query.$or.push({id: { $regex:cloud_data.item_list[a].parent_id, $options: "i" }});
                    }
                    let item_search = Item_Logic.get_search(parent_data_type,query,{},1,0);
                    const [error,data] = await Portal.search(database,item_search.data_type,item_search.filter,item_search.sort_by,item_search.page_current,item_search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        if(data.item_list.length>0){
                            parent_item_list=data.item_list;
                        }
                    }
                },
                //user_list
                async function(call){
                    var query = { $or: [] };
                    for(let a = 0;a < cloud_data.item_list.length;a++){
                        query.$or.push({id: { $regex:cloud_data.item_list[a].user_id, $options: "i" }});
                    }
                    let user_search = Item_Logic.get_search(DataType.USER,query,{date_create:-1},1,0);
                    const [error,data] = await Portal.search(database,user_search.data_type,user_search.filter,user_search.sort_by,user_search.page_current,user_search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        if(data.item_list.length>0){
                            user_list=data.item_list;
                        }
                    }
                },
                //bind parent_item_list
                function(call){
                    for(let a = 0;a<cloud_data.item_list.length;a++){
                        for(let b = 0;b<item_list.length;b++){
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
                    let favorite_search = Item_Logic.get_search(DataType.FAVORITE,query,{},1,0);
                    const [error,data] = await Portal.count(database,favorite_search.data_type,favorite_search.filter,favorite_search.sort_by,favorite_search.page_current,favorite_search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        if(data>0){
                            cloud_data.favorite_found = true;
                        }
                    }
                },
                async function(call){
                    if(!cloud_data.favorite_found){
                        const [error,data] = await Portal.update(database,favorite.data_type,favorite);
                        if(error){
                            cloud_error=Log.append(cloud_error,error);
                        }else{
                            cloud_data.favorite = data;
                        }
                    }
                },
            ]).then(result => {
                callback([error,favorite]);
            }).catch(error => {
                Log.error("Favorite-Data-Update",error);
                callback([error,[]]);
            });
        });
    };
    static search = async (database,parent_data_type,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
            let parent_item_list = [];
            let user_list = [];
            async.series([
                //favorite_list
                async function(call){
                    const [error,data] = await Portal.search(database,data_type,filter,sort_by,page_current,page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        cloud_data = data;
                    }
                },
                //parent_item_list
                async function(call){
                    var query = { $or: [] };
                    for(let a = 0;a < cloud_data.item_list.length;a++){
                        query.$or.push({id: { $regex:cloud_data.item_list[a].parent_id, $options: "i" }});
                    }
                    let item_search = Item_Logic.get_search(parent_data_type,query,{},1,0);
                    const [error,data] = await Portal.search(database,item_search.data_type,item_search.filter,item_search.sort_by,item_search.page_current,item_search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        if(data.item_list.length>0){
                            parent_item_list=data.item_list;
                        }
                    }
                },
                //user_list
                async function(call){
                    var query = { $or: [] };
                    for(let a = 0;a < cloud_data.item_list.length;a++){
                        query.$or.push({id: { $regex:cloud_data.item_list[a].user_id, $options: "i" }});
                    }
                    let user_search = Item_Logic.get_search(DataType.USER,query,{date_create:-1},1,0);
                    const [error,data] = await Portal.search(database,user_search.data_type,user_search.filter,user_search.sort_by,user_search.page_current,user_search.page_size);
                    if(error){
                        cloud_error=Log.append(cloud_error,error);
                    }else{
                        if(data.item_list.length>0){
                            user_list=data.item_list;
                        }
                    }
                },
                //bind parent_item_list
                function(call){
                    for(let a = 0;a<cloud_data.item_list.length;a++){
                        for(let b = 0;b<item_list.length;b++){
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
                callback([error,favorite_list]);
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
        /*
         *
         * Params
         * - title
         *   - description: n/a / type: n/a / example: n/a / required: n/a
         *
         * Option
         * - get_item
         *   - description: n/a / type: bool / example: true / required: false
         * - get_photo
         *   - description: n/a / type: bool / example: true / required: false
         * - photo_count
         *   - description: n/a / type: int / example: 19 / required: false
         * - photo_sort_by
         *   - description: n/a / type: obj / example: {date_create:1} / required: false
         * - get_group
         *   - description: n/a / type: bool / example : true / required: false
         * Return
         * - title
         *   - description: n/a / type: n/a
         *
         */
        return new Promise((callback) => {
            let error = null;
            let cloud_data = {};
            let full_item_list = [];
            let new_item_list = [];
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,title_url:null,get_group:false};
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
                        switch(item.setting_sort_order)
                        {
                            case 'title asc':
                                sort_order = {title:1};
                                break;
                            case 'title desc':
                                sort_order = {title:-1};
                                break;
                            case 'date asc':
                                sort_order = {date_create:1};
                                break;
                            case 'date desc':
                                sort_order = {date_create:-1};
                                break;
                            default:
                                sort_order = {};
                                break;
                        }
                        return sort_order;
                    }
                    let filter = {};
                    if(cloud_data.item.id && option.get_item || option.get_section){
                        if(Str.check_is_null(cloud_data.item.top_id)){
                            filter={top_id:cloud_data.item.id};
                        }else{
                            filter={top_id:item.top_id};
                        }
                        let data_type = DataType.ITEM;
                        let sort_by=get_sort(cloud_data.item);
                        let page_current = 1;
                        let page_size = 0;
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
                async function(call){
                    /* options
                     * get_item_count / true - false
                     * - item_count_data_type
                     * - item_count_filter
                    */

                     if(option.get_item_count){
                        let data_type = option.item_count_data_type;
                        let filter=option.item_count_filter;
                        let sort_by={};
                        let page_current = 1;
                        let page_size = 0;
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
        /* option params
         * Items
         *  - get_item / bool / ex. true,false / def. true
         * Photos
         *  - get_photo / bool / ex. true,false / def. true
         *  - photo_count / int / ex. 1-999 / def. 19
         *  - photo_sort_by / query obj / ex. {date_create:1}
         */
        return new Promise((callback) => {
            let cloud_data = {};
            let error=null;
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false};
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
            let cloud_data = {item:DataItem.get_new(data_type,0)};
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
            option = !Obj.check_is_empty(option) ? option : {get_item:false,get_photo:false,delete_items:false,delete_photos:false};
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
                        call();
                    });
                },
                function(call){
                    if(option.delete_items){
                        let data_type = DataType.ITEM;
                        let filter = {parent_id:item.id};
                        cloud_data.delete_items =false;
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
                        let filter = {parent_id:item.id};
                        cloud_data.delete_photos =false;
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
            let cloud_data = {item_list:[]};
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
            let cloud_data = {item_list:[]};
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
            let cloud_data = {};
            async.series([
                function(call){
                    Data.count_list(database,data_type,filter).then(([error,data])=> {
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
            let copy_top_item = DataItem.get_new(data_type,0);
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
                    copy_top_item[FieldType.TITLE] = 'Copy '+top_item[FieldType.TITLE];
                    copy_top_item[FieldType.TITLE_URL] = 'copy_'+top_item[FieldType.TITLE_URL];
                    copy_top_item[FieldType.SOURCE_ID] = top_item.id;
                    copy_top_item[FieldType.SOURCE_DATA_TYPE] = top_item.data_type;

                    for(const key in top_item) {
                        if(key!=FieldType.ID&&key!=FieldType.SOURCE&&key!=FieldType.TITLE&&key!=FieldType.TITLE_URL){
                            copy_top_item[key]=top_item[key];
                        }
                    }
                    call();
                },
                function(call){
                    Data.update_item(database,copy_top_item.data_type,copy_top_item).then(([error,data])=> {
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            copy_top_item=data;
                        }
                        call();
                    }).catch(error => {
                        error=Log.append(error,error);
                        call();
                    });
                },
                function(call){
                    if(top_item.id){
                        let filter={top_id:top_item.id};
                        let data_type=DataType.ITEM;
                        let sort_by={title:-1};
                        let page_current = 1;
                        let page_size = 0;
                        Data.get_list(database,data_type,filter,sort_by,page_current,page_size).then(([error,data,item_count,page_count])=> {
                            if(error){
                                error=Log.append(error,error);
                            }else{
                                if(data.length > 0){
                                    item_list = data;
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
                function(call){
                    let source_top_items = [];
                    for(let a=0;a<item_list.length;a++){
                        let copy_sub_item={data_type:DataType.ITEM,id:0,top_id:copy_top_item.id,top_data_type:copy_top_item.data_type};
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
                            copy_item_list[a][FieldType.PARENT_ID] = copy_top_item[FieldType.ID];
                            copy_item_list[a][FieldType.PARENT_DATA_TYPE] = copy_top_item[FieldType.DATA_TYPE];
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
                if(copy_top_item.id){
                    cloud_data.copy_top_item = copy_top_item;
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
                    if(data.item.id){
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
    static update_item_view_count = async (database,parent_data_type,parent_id,customer_id,option) => {
        return new Promise((callback) => {
            let cloud_data = {item: DataItem.get_new(parent_data_type,parent_id), stat:DataItem.get_new(DataType.STAT,0,{count:0,parent_data_type:parent_data_type,parent_id:parent_id,customer_id:customer_id,type_id:FieldType.STAT_VIEW_ID})};
            let new_view = false;
            let item_count = 0;
            let error = null;
            async.series([
                async function(call){
                    let filter = {
                        $and: [
                            { customer_id: { $regex:String(customer_id), $options: "i" } },
                            { parent_id: { $regex:id, $options: "i" } },
                            { parent_data_type: { $regex:parent_data_type, $options: "i" } }
                        ]
                    };
                    let search = Item_Logic.get_search(DataType.STAT,filter,{},1,1);
                    const [error,data] = await Portal.count(database,search.data_type,search.filter);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        new_view = data<=0 ? true : false;
                        item_count = data;
                    }
                },
                //get item
                async function(call){
                    if(new_view){
                        const [error,data] = await Portal.get(database,cloud_data.item.data_type,cloud_data.item.id,{get_item:false});
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.id){
                                cloud_data.item = data;
                            }
                        }
                    }
                },
                //save stat
                async function(call){
                    if(new_view){
                        const [error,data] = await Portal.update(database,DataType.STAT,cloud_data.stat);
                        if(error){
                            error=Log.append(error,error);
                        }else{
                            if(data.id){
                                cloud_data.stat = data;
                            }
                        }
                    }
                },
                //save item
                async function(call){
                    if(new_view){
                        cloud_data.item.view_count = !Str.check_is_null(cloud_data.item.view_count)  ?  parseInt(cloud_data.item.view_count)+1 : 1;
                        const [error,data] = await Portal.update(database,cloud_data.item.data_type,cloud_data.item);
                        if(error){
                            error=Log.append(error,error);
                        }
                        else{
                            cloud_data.item = data;
                        }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("-Update-Item-View-Count-",error);
                callback([error,[]]);
            });
        });
    };

    /*
    static get = async (database,key,option) => {
        return new Promise((callback) => {
            let cloud_data = {};
            cloud_data.blog_post = {data_type:DataType.BLOG_POST,id:0,photos:[],items:[]};
            let error = null;
            if(option == null){
                option = {get_item:false,get_photo:false}
            }
            if(option.get_item==null){
                option.get_item=false;
            }
            if(option.get_photo==null){
                option.get_photo=false;
            }
            async.series([
                async function(call){
                    const [error,data] = await Portal.get(database,DataType.BLOG_POST,key,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        if(data.id){
                            cloud_data.blog_post = data;
                        }
                    }
                },
            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post--Data-Get",error);
                callback([error,[]]);
            });
        });
    };
    static get_list = (database,filter,sort_by,page_current,page_size,option) => {
        return new Promise((callback) => {
            let cloud_data = {item_list:[],item_count:0,page_count:0};
            let error=null;
            if(option==null){
                option = {get_item:true};
            }
            async.series([
                async function(call){
                    const [error,data] = await List_Data.get_list(database,DataType.BLOG_POST,filter,sort_by,page_current,page_size,option);
                    if(error){
                        error=Log.append(error,error);
                    }else{
                        cloud_data = data;
                    }
                },

            ]).then(result => {
                callback([error,cloud_data]);
            }).catch(error => {
                Log.error("Blog_Post-Get-List",error);
                callback([error,[]]);
            });
        });
    };
module.exports = function(){
    // item = {item_data_type,item_tbl_id,customer_id,type_id}
    STAT_VIEW_ID='1';
    STAT_LIKE_ID='2';
    STAT_POST_ID='3';
    module.get_customer_item_like_list=function(customer_like_list,item_list,callback){
        for(var a=0;a<customer_like_list.length;a++){
            for(var b=0;b<item_list.length;b++){
                if(customer_like_list[a].item_tbl_id==item_list[b].tbl_id){
                    item_list[b].customer_like='true';
                }
            }
        }
            callback(null,item_list);
    }
    module.update_item_view_count=function(db,item_data_type,item_tbl_id,customer_id,callback){
        var new_view=true;
        var item_count=0;
        var update_item = biz9.get_new_item(item_data_type,item_tbl_id);
        var new_stat = biz9.get_new_item(DT_STAT,0);
        var error=null;
        async.series([
            function(call){
                if(customer_id){
                    sql = {customer_id:customer_id,item_tbl_id:item_tbl_id,type_id:STAT_VIEW_ID};
                    sort={};
                    dataz.get_sql_cache(db,DT_STAT,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            new_view=false;
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    new_stat.item_data_type=item_data_type;
                    new_stat.item_tbl_id=item_tbl_id;
                    new_stat.customer_id=customer_id;
                    new_stat.type_id=STAT_VIEW_ID;
                    biz9.update_item(db,DT_STAT,new_stat,function(error,data) {
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    sql={type_id:STAT_VIEW_ID,item_tbl_id:item_tbl_id};
                    biz9.count(db,DT_STAT,sql,function(error,data) {
                        if(!data){
                            item_count=0;
                        }else if(data==STAT_VIEW_ID){
                            item_count=0;//bug fix
                        }else{
                            item_count=parseInt(data);
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    update_item.view_count=parseInt(item_count)+1;
                    biz9.update_item(db,item_data_type,update_item,function(error,data) {
                        update_item=data;
                        call();
                    });
                }else{
                    call();
                }
            },
        ],
            function(err, result){
                update_item.new_view=new_view;
                callback(error,update_item);
            });
    }
    module.update_item_like_count=function(db,item_data_type,item_tbl_id,customer_id,callback){
        var new_like=true;
        var item_count=0;
        var update_item = biz9.get_new_item(item_data_type,item_tbl_id);
        var new_stat = biz9.get_new_item(DT_STAT,0);
        var error=null;
        async.series([
            function(call){
                if(customer_id){
                    sql = {customer_id:customer_id,item_tbl_id:item_tbl_id,type_id:STAT_LIKE_ID};
                    sort={};
                    dataz.get_sql_cache(db,DT_STAT,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            new_like=false;
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_like){
                    new_stat.item_data_type=item_data_type;
                    new_stat.item_tbl_id=item_tbl_id;
                    new_stat.customer_id=customer_id;
                    new_stat.type_id=STAT_LIKE_ID;
                    biz9.update_item(db,DT_STAT,new_stat,function(error,data) {
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_like){
                    sql={type_id:STAT_LIKE_ID,item_tbl_id:item_tbl_id};
                    biz9.count(db,DT_STAT,sql,function(error,data) {
                        if(!data){
                            item_count=1;
                        }else{
                            item_count=parseInt(data);
                        }
                        call();
                    });
                }else{
                    item_count=1;
                    call();
                }
            },
            function(call){
                update_item.like_count=item_count;
                    biz9.update_item(db,item_data_type,update_item,function(error,data) {
                        update_item=data;
                        call();
                    });
            },
        ],
            function(err, result){
                update_item.new_like=new_like;
                callback(error,update_item);
            });
    }
        return module;
}
*/
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
    //Category_Data,
    //Content_Data,
    Database,
    //Event_Data,
    Favorite_Data, //check
    //Page_Data,
    Portal,
    Product_Data,
    Review_Data, //check
    Search_Data,
    //Template_Data,
    Stat_Data, //check
};
