/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Data_Logic,Data_Response_Field,Data_Field,Data_Type,Data_Table,Data_Value_Type}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Log,Str,Obj,Response_Logic,Response_Field,Status_Type}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Cache} = require('./redis.js');
const {Foreign} = require('./foreign.js');
const {Group} = require('./group.js');
const {Join} = require('./join.js');
const {Adapter}  = require('./adapter.js');
class Database {
    static get = async (data_config,option) => {
        /* options
        - none
        */
        let response=Response_Logic.get();
        let data={};
        return new Promise((callback) => {
            option = !Obj.check_is_empty(option) ? option : {biz9_config_file:null,app_id:null};
            if(option.biz9_config_file==null){
                option.biz9_config_file=null;
            }else{
                data_config = Scriptz.get_biz9_config(option);
            }
            if(option.app_id){
                data_config.APP_ID = option.app_id;
            }
            if(data_config.APP_ID==null){
                Log.error('Database-Get-1',"Database Error: Missing app_id.");
            }
            (async () => {
                const biz_data = await Adapter.get_database(data_config);
                biz_data.data_config=data_config;
                biz_data.app_id=data_config.APP_ID;
                callback([response,biz_data]);
            })();
        });
    }
    static delete = async (database) => {
        /* options
            - none
            */
        let response={};
        return new Promise((callback) => {
            (async () => {
                const biz_data = await Adapter.delete_database(data_config);
                biz_data.data_config=data_config;
                biz_data.app_id=data_config.APP_ID;
                callback([biz_response,null]);
            })();
        });
    }
    static info = async (database,option) => {
        /* options
            - none
            */
        return new Promise((callback) => {
            let data = [];
            let response = {};
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call){
                    const collections = await database.listCollections().toArray();
                    for (const collectionInfo of collections) {
                        const collectionName = collectionInfo.name;
                        const collection = database.collection(collectionName);
                        const count = await collection.estimatedDocumentCount();
                        data.push({title:collectionName,item_count:count});
                    }
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Database-Info",err);
            });
        });
    }
}
class Data {
    //9_count
    static count = async (database,table,search_filter) => {
        /* --- requried ---
         * - search  / obj filter
         * option
         * - none
         */
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let cache = {};
            let data = {};
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_SEARCH,Status_Type.OK,search_filter));
                },
                async function(call) {
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const biz_data = await Adapter.get_count_item_list(database,table,search_filter);
                    data = biz_data;
                    response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_COUNT_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Data_Response_Field.ITEMS_COUNT_CONFIRM)));
                    response.messages.push(Response_Logic.get_message(Data_Response_Field.RESPONSE_ITEMS_COUNT,Status_Type.OK,data));
                },
                 async function(call){
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Count-List-Data",err);
            });
        });
    };
    //9_copy
    static copy = async (database,table,id,option) => {
        /* requried
         * - table
         * - id
         * option
         * - copy_group / bool
         */
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let cache = {};
            let data = Data_Logic.get(table,id);
            let top_data = Data_Logic.get(table,0);
            let copy_data = Data_Logic.get(table,0);
            option = !Obj.check_is_empty(option) ? option : {copy_group:true};
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_ID,Status_Type.OK,id));
                },
                async function(call) {
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    let data_group_option = Data_Logic.get_group();
                    const [biz_response,biz_data] = await Data.get(database,table,id,{groups:[data_group_option]});
                    top_data=biz_data;
                },
                //top_item
                async function(call){
                    if(top_data.id){
                        copy_data = Data_Logic.copy(table,top_data);
                        copy_data[Data_Field.TITLE] = 'Copy '+top_data[Data_Field.TITLE];
                        copy_data[Data_Field.TITLE_URL] = 'copy_'+top_data[Data_Field.TITLE_URL];
                        copy_data[Data_Field.SOURCE_ID] = top_data.id;
                        copy_data[Data_Field.SOURCE_TABLE] = top_data.table;
                        const [biz_response,biz_data] = await Data.post(database,copy_data.table,copy_data);
                        copy_data=biz_data;
                    }else{
                        copy_data = Data_Logic.get_not_found(table,id);
                    }
                },
                //group
                async function(call){
                    if(top_data.id && top_data.groups.length > 0 && option.copy_group){
                        copy_data.groups = [];
                        let post_groups = [];
                        for(const group of top_data.groups){
                            let copy_group = Data_Logic.copy(Data_Table.GROUP,group);
                            copy_group[Data_Field.TITLE] = group[Data_Field.TITLE];
                            copy_group[Data_Field.TITLE_URL] = group[Data_Field.TITLE_URL];
                            copy_group[Data_Field.SOURCE_ID] = group.id;
                            copy_group[Data_Field.SOURCE_TABLE] = group.table;
                            copy_group[Data_Field.PARENT_TABLE] = copy_data.table;
                            copy_group[Data_Field.PARENT_ID] = copy_data.id;
                            post_groups.push(copy_group);
                        }
                        const biz_data = await Adapter.post_items(database,cache,post_groups);
                        copy_data.groups=biz_data;
                    }
                },
                async function(call){
                    if(!Str.check_is_null(copy_data.id)){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_COPY_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Data_Response_Field.ITEM_COPY_CONFIRM)));
                        }else{
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_COPY_FAIL,Status_Type.FAIL,Data_Logic.get_message_by_response(Data_Response_Field.ITEM_COPY_FAIL)));
                        }
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                data = copy_data;
                callback([response,data]);
            }).catch(err => {
                Log.error("Data-Copy",err);
            });
        });
    };
    //9_delete
    static delete = async(database,table,id,option) => {
        /* requried
         * - table
         * - id
         * option
         * - delete_group / bool
         */
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let cache = null;
            let data = Data_Logic.get(table,id);
            option = !Obj.check_is_empty(option) ? option : {delete_group:true};
            let delete_group_list = [];
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_ID,Status_Type.OK,id));
                },
                async function(call){
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const biz_data = await Adapter.delete_item(database,cache,data.table,data.id);
                        if(!Str.check_is_null(biz_data)){
                            response.messages.push(Response_Logic.get_message(Response_Field.DELETE_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Response_Field.DELETE_CONFIRM)));
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_DELETE_COUNT,Status_Type.OK,biz_data));
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_CACHE_DELETE,Status_Type.OK,true));
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_DATABASE_DELETE,Status_Type.OK,true));
                        }else{
                            response.messages.push(Response_Logic.get_message(Response_Field.DELETE_FAIL,Status_Type.FAIL,Data_Logic.get_message_by_response(Response_Field.DELETE_FAIL)));
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_CACHE_DELETE,Status_Type.OK,null));
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_DATABASE_DELETE,Status_Type.OK,null));
                        }
                },
                async function(call){
                    if(option.delete_group){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_GROUP_DELETE,Status_Type.OK,null));
                        let filter = {parent_id:data.id};
                        const biz_data = await Data.delete_search(database,Data_Table.GROUP,filter);
                        if(biz_data > 0){
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEM_GROUP_DELETE,Status_Type.OK,null));
                        }
                    }
                },
                //check all
                async function(call){
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Data-Delete-Item",err);
            });
        });
    };
    //9_delete_search
    static delete_search = async (database,table,filter,option) => {
        /* requried
         * - table
         * - search_filter
         * option
         * - delete_group / bool
         */
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let data = Data_Logic.get(table,0,{data:{filter:filter}});
            let cache = {};
            let delete_item_query = { $or: [] };
            let delete_group_items = [];
            let delete_items = [];
            let delete_item_count = 0;
            option = !Obj.check_is_empty(option) ? option : {delete_group:true};
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_SEARCH,Status_Type.OK,filter));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_OPTION,Status_Type.OK,option));
                },
                async function(call) {
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    let search = Data_Logic.get_search(table,filter,{},1,0);
                    const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                    if(items.length>0){
                        delete_items = items;
                    }
                },
                async function(call){
                    if(delete_items.length>0){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_DELETE_COUNT,Status_Type.OK,delete_items.length));
                    for(const data_item of delete_items){
                        let query_field = {};
                        query_field[Data_Field.PARENT_ID] = data_item.id
                        delete_item_query.$or.push(query_field);
                        const biz_data = await Adapter.delete_item(database,cache,data_item.table,data_item.id);
                    }
                    }
                },
                async function(call){
                    if(option.delete_group && delete_item_query.$or.length > 0){
                        let search = Data_Logic.get_search(table,delete_item_query,{},1,0,{field:{id:1,title:1,table:1}});
                        const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                        delete_group_items = items;
                    }
                },
                async function(call){
                    if(delete_group_items.length>0){
                    for(const data_item of delete_group_items){
                        let query_field = {};
                        query_field[Data_Field.ID] = data_item.id;
                        const biz_data = await Adapter.delete_item(database,cache,data_item.table,data_item.id);
                    }
                    }
                },
                async function(call){
                    if(delete_items.length>0){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_DELETE_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Data_Response_Field.ITEMS_DELETE_CONFIRM)));
                    }else{
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_DELETE_CONFIRM,Status_Type.FAIL,Data_Logic.get_message_by_response(Data_Response_Field.ITEMS_DELETE_FAIL)));
                    }
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Delete-List-Data",err);
            });
        });
    };
    //9_get
    static get = async(database,table,id,option) => {
     /* requried
          - table
          - id
        * option
           - cache_delete
           - field
           - foreigns
           - groups
           - id_field
           - joins
           - title
      */
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let cache = null;
            let data = Data_Logic.get(table,id);
            let field_result_ok = false;
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_ID,Status_Type.OK,id));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_OPTION,Status_Type.OK,option));
                    if(option.field){
                         response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_FIELD,Status_Type.OK,option.field));
                    }
                },
                async function(call) {
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    if(option.cache_delete){
                        const biz_data = await Adapter.delete_item_cache(database,cache,data.table,data.id,option);
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_CACHE_DELETE,Status_Type.OK,true));
                    }
                },
                //item_by_id
                //title
                async function(call){
                    const biz_data = await Adapter.get_item(database,cache,data.table,data.id,option);
                        if(!option.title){
                            data = biz_data;
                        }else{
                            data = biz_data;
                            data[option.title] = Obj.merge({},biz_data);;
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_TITLE,Status_Type.OK,option.title));
                        }
                },
                //9_get_join 9_join
                function(call){
                    if(option.joins){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_JOINS,Status_Type.OK,option.joins));
                        Join.get_data(database,cache,option).then(([biz_response,biz_data])=>{
                            for(const search_item of biz_data){
                                data[search_item.title+"_"+Data_Type.JOIN] = search_item.data;
                                if(search_item.value_type == Data_Value_Type.ITEMS){
                                    data[search_item.title] = search_item.data.items;
                                }else{
                                    data[search_item.title] = search_item.data;
                                }
                            }
                            call();
                        }).catch(err => {
                            Log.error('Data-Get-Item-Join',err);
                        });
                    }else{
                        call();
                    }
                },
                //9_group 9_item_group
                async function(call){
                    if(option.groups && data.id){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_GROUPS,Status_Type.OK,option.groups));
                        const [biz_response,biz_data] = await Group.get_data(database,cache,[data],option);
                        data = biz_data[0];
                    }
                },
                //9_foreigns 9_item_foreign
                async function(call){
                    if(option.foreigns && data.id){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_FOREIGNS,Status_Type.OK,option.foreigns));
                        const [biz_response,biz_data] = await Foreign.get_data(database,cache,[data],option);
                        data = biz_data[0];
                    }
                },
                async function(call){
                        if(!Str.check_is_null(data.id)){
                            response.messages.push(Response_Logic.get_message(Response_Field.GET_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Response_Field.GET_CONFIRM)));
                        }else{
                            response.messages.push(Response_Logic.get_message(Response_Field.GET_FAIL,Status_Type.FAIL,Data_Logic.get_message_by_response(Response_Field.GET_FAIL)));
                        }

                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("DATA-GET-ERROR",err);
            });
        });
    };
    //9_post
    static post = async (database,table,data,option) => {
        /* requried
          - table
          - data / obj
        * option
           - reset
           - clean
           - cache_delete
           - overwrite
        */
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let cache = {};
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
            async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_DATA,Status_Type.OK,data));
            },
            async function(call) {
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                //clean
                function(call){
                    if(option.clean){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_CLEAN,Status_Type.OK,true));
                        let new_data = {};
                        for(const field in data){
                            if(!Obj.check_is_array(data[field]) &&
                                Obj.check_is_value(data[field]) &&
                                !Str.check_if_str_exist(field,'_item_count') &&
                                !Str.check_if_str_exist(field,'_page_count'))
                            {
                                new_data[field] = data[field];
                            }
                        }
                        data = new_data;
                        call();
                    }else{
                        call();
                    }
                },
                //delete cache item
                async function(call){
                    if(option.cache_delete || option.overwrite){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_CACHE_DELETE,Status_Type.OK,true));
                        const biz_data = await Adapter.delete_item_cache(database,cache,table,data.id);
                    }
                },
                async function(call){
                    const biz_data = await Adapter.post_item(database,cache,table,data,option);
                    data = biz_data;
                },
                //reset
                async function(call){
                    if(option.reset && data.id){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_RESET,Status_Type.OK,true));
                        const biz_data = await Adapter.get_item(database,cache,data.table,data.id);
                        data = biz_data;
                    }
                },
                async function(call){
                    if(!Str.check_is_null(data.id)){
                        response.messages.push(Response_Logic.get_message(Response_Field.POST_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Response_Field.POST_CONFIRM)));
                        }else{
                        response.messages.push(Response_Logic.get_message(Response_Field.POST_FAIL,Status_Type.FAIL,Data_Logic.get_message_by_response(Response_Field.POST_FAIL)));
                        }
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Post-Data",err);
            });
        });
    };
    //9_post_items
    static post_items = async (database,data_items) => {
        /* requried
          - data_items / []
        * option
           - none
        */
        return new Promise((callback) => {
            let cache = {};
            let response=Response_Logic.get();
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_DATA_ITEMS,Status_Type.OK,data_items));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_DATA_ITEMS_COUNT,Status_Type.OK,data_items.length));
                },
                async function(call) {
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const biz_data = await Adapter.post_items(database,cache,data_items);
                    data_items = biz_data;
                },
                async function(call){
                    if(data_items.length>0){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_POST_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Data_Response_Field.ITEMS_POST_CONFIRM)));
                    }else{
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_POST_FAIL,Status_Type.FAIL,Data_Logic.get_message_by_response(Data_Response_Field.ITEMS_POST_FAIL)));
                    }
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data_items]);
            }).catch(err => {
                Log.error("Post-Items-Data",err);
            });
        });
    };
   //9_search
    static search = (database,table,filter,sort_by,page_current,page_size,option) => {
        /* options
           - field
           - distinct
           - foreigns
           - joins
           - groups
           */
        return new Promise((callback) => {
            let data = {table:table,item_count:0,page_count:1,filter:{},items:[]};
            let cache = null;
            let response=Response_Logic.get();
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_SEARCH,Status_Type.OK,filter));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_SORT_BY,Status_Type.OK,sort_by));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PAGE_CURRENT,Status_Type.OK,page_current));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PAGE_SIZE,Status_Type.OK,page_size));
                },
                async function(call) {
                    const biz_data = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    let search = Data_Logic.get_search(table,filter,sort_by,page_current,page_size);
                        const [items,item_count,page_count] = await Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                        data.item_count=item_count;
                        data.page_count=page_count;
                        data.search=search;
                        data[Data_Field.ITEMS]=items;
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.RESPONSE_ITEMS_COUNT,Status_Type.OK,item_count));
                },
                //9_items_join 9_search_join 9_joins
                async function(call){
                    if(option.joins){
                        const [biz_response,biz_data] = await Join.get_data(database,cache,option);
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_JOINS,Status_Type.SUCCESS,option.joins));
                            for(const search_item of biz_data){
                                data[search_item.title+"_"+Data_Type.JOIN] = search_item.data;
                                if(search_item.value_type == Data_Value_Type.ITEMS){
                                    data[search_item.title] = search_item.data.items;
                                }else{
                                    data[search_item.title] = search_item.data;
                                }
                            }
                    }
                },
                //9_foreign //9_item_foreign
                async function(call){
                    if(option.foreigns && data[Data_Field.ITEMS].length > 0){
                        const [biz_response,biz_data] = await Foreign.get_data(database,cache,data[Data_Field.ITEMS],option);
                        response.messages.push(Response_Logic.get_message(Data_Field.RESPONSE_FOREIGNS,Status_Type.SUCCESS,option.foreigns));
                        data[Data_Field.ITEMS] = biz_data;
                    }
                },
                //9_group 9_item_group
                async function(call){
                    if(option.groups && data[Data_Field.ITEMS].length>0){
                        const [biz_response,biz_data] = await Group.get_data(database,cache,data[Data_Field.ITEMS],option);
                            response.messages.push(Response_Logic.get_message(Data_Response_Field.OPTION_GROUPS,Status_Type.SUCCESS,option.groups));
                            data[Data_Field.ITEMS] = biz_data;
                    }
                },
                async function(call){
                    if(data.items){
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_SEARCH_CONFIRM,Status_Type.SUCCESS,Data_Logic.get_message_by_response(Data_Response_Field.ITEMS_SEARCH_CONFIRM)));
                    }else{
                        response.messages.push(Response_Logic.get_message(Data_Response_Field.ITEMS_SEARCH_FAIL,Status_Type.FAIL,Data_Logic.get_message_by_response(Data_Response_Field.ITEMS_SEARCH_FAIL)));
                    }
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error('DATA-SEARCH-ERROR',err);
            });
        });
    };
    //9_data_post_bulk
    static post_bulk = async (database,table,items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let response = null;
            let data = Data_Logic.get(table,0);
            async.series([
                async function(call){
                    const biz_data = await Adapter.post_bulk(database,table,items);
                    data = biz_data;
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Post-Bulk-Data",err);
            });
        });
    };
    //9_blank
    static blank = async (database,table) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let data = {};
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_TABLE,Status_Type.OK,table));
                },
                async function(call){
                    const [biz_response,biz_data] = await get(database,table,items);
                    data = biz_data;
                    response = biz_response;
                },
                async function(call){
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Blank-Data",err);
            });
        });
    };
}
module.exports = {
    Data,
    Database
};
