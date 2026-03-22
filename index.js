/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Data_Logic,Data_Field,Data_Type,Data_Table,Data_Value_Type}=require("biz9-data-logic");
const {Log,Str,Obj}=require("biz9-utility");
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
        let error=null;
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
                error=Log.append(error,"Database Error: Missing app_id.");
            }
            Adapter.get_database(data_config).then(([biz_error,biz_data])=>{
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    biz_data.data_config=data_config;
                    biz_data.app_id=data_config.APP_ID;
                    callback([error,biz_data]);
                }
            }).catch(err => {
                Log.error('Data-Database-Get',err);
                error=Log.append(error,err);
            });
        });
    }
    static delete = async (database) => {
        /* options
            - none
        */
       let error=null;
        return new Promise((callback) => {
            Adapter.delete_database(data_config).then(([biz_error,biz_data])=>{
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    biz_data.data_config=data_config;
                    biz_data.app_id=data_config.APP_ID;
                    callback([err,null]);
                }
            }).catch(err => {
                Log.error('Data-Db-Delete',err);
                error=Log.append(error,err);
            });
        });
    }
    static info = async (database,option) => {
        /* options
            - none
        */
    return new Promise((callback) => {
            let data = [];
            let error = null;
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
                callback([error,data]);
            }).catch(err => {
                Log.error("Database-Info",err);
                callback([err,null]);
            });
        });
    }
}
class Data {
    //9_post
    static post = async (database,table,data,option) => {
        /* options
           - reset
           - clean
           - delete_cache
           - overwrite
        */
        return new Promise((callback) => {
            let error = null;
            let cache = {};
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                //clean
                function(call){
                    if(option.clean){
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
                function(call){
                    if(option.delete_cache || option.overwrite){
                        Adapter.delete_item_cache(database,cache,table,data.id).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Post-Delete-Cache',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                function(call){
                    Adapter.post_item(database,cache,table,data,option).then(([biz_error,biz_data])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data = biz_data;
                            call();
                        }
                    }).catch(err => {
                        Log.error('Data-Post-Post-Item-Apapter',err);
                        error=Log.append(error,err);
                    });
                },
                //reset
                function(call){
                    if(option.reset && data.id){
                        Adapter.get_item(database,cache,data.table,data.id).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data = biz_data;
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Get-Reset',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Post-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_post_items
    static post_items = async (database,data_items) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let cache = {};
            let error = null;
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const [biz_error,biz_data] = await Adapter.post_item_list(database,cache,data_items);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        data_items = biz_data;
                    }
                },
            ]).then(result => {
                callback([error,data_items]);
            }).catch(err => {
                Log.error("Post-List-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_delete_search
    static delete_search = async (database,table,filter,option) => {
        /* options
           - delete_group
           */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(table,0,{data:{filter:filter}});
            let cache = {};
            data[Data_Type.RESULT_OK_DELETE] = false;
            data[Data_Type.RESULT_OK_DELETE_COUNT] = 0;
            let delete_item_query = { $or: [] };
            let delete_group_list = [];
            let delete_items = [];
            option = !Obj.check_is_empty(option) ? option : {delete_group:true};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                function(call){
                    let search = Data_Logic.get_search(table,filter,{},1,0);
                    Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            if(items.length>0){
                                delete_items = items;
                            }
                            call();
                        }
                    }).catch(err => {
                        Log.error('Data-Search',err);
                        error=Log.append(error,err);
                    });
                },
                async function(call){
                    for(const data_item of delete_items){
                        let query_field = {};
                        query_field[Data_Field.PARENT_ID] = data_item.id
                        delete_item_query.$or.push(query_field);
                        data[Data_Type.RESULT_OK_DELETE] = true;
                        const [biz_error,biz_data] = await Adapter.delete_item(database,cache,data_item.table,data_item.id);
                        if(parseInt(biz_data[Data_Type.RESULT_OK_DELETE_COUNT]) > 0){
                            data[Data_Type.RESULT_OK_DELETE_COUNT] = data[Data_Type.RESULT_OK_DELETE_COUNT] + parseInt(biz_data[Data_Type.RESULT_OK_DELETE_COUNT]);
                        }
                    }
                },
                function(call){
                    if(option.delete_group && delete_item_query.$or.length > 0){
                        let search = Data_Logic.get_search(table,{},{},1,0,{field:{id:1,title:1,table:1}});
                        Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                delete_group_list = items;
                                call();
                            }
                        });
                    }else{
                        call();
                    }
                },
                async function(call){
                    if(option.delete_group && delete_item_query.$or.length > 0){
                        data[Data_Type.RESULT_OK_GROUP_DELETE] = false;
                        let search = Data_Logic.get_search(Data_Table.GROUP,delete_item_query,{},1,0);
                        const [biz_error,biz_data] = await Adapter.delete_item_list(database,cache,search.table,search.filter);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data[Data_Type.RESULT_OK_GROUP_DELETE] = true;
                        }
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Delete-List-Data",err);
                callback([err,[]]);
            });
        });
    };
    //9_count
    static count = async (database,table,filter) => {
        /* option params
            * none
         */
        return new Promise((callback) => {
            let error = null;
            let cache = {};
            let data = {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const [biz_error,biz_data] = await Adapter.get_count_item_list(database,table,filter);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        data = biz_data.count;
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Count-List-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_copy
    static copy = async (database,table,id,option) => {
        /*
         * options
         * - copy_group
         */
        return new Promise((callback) => {
            let error = null;
            let cache = {};
            let data = Data_Logic.get(table,id);
            let top_data = Data_Logic.get(table,0);
            let copy_data = Data_Logic.get(table,0);
            option = !Obj.check_is_empty(option) ? option : {copy_group:true};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    let data_group_option = Data_Logic.get_group();
                    const [biz_error,biz_data] = await Data.get(database,table,id,{groups:[data_group_option]});
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        top_data=biz_data;
                    }
                },
                //top_item
                async function(call){
                    if(top_data.id){
                        copy_data = Data_Logic.copy(table,top_data);
                        copy_data[Data_Field.TITLE] = 'Copy '+top_data[Data_Field.TITLE];
                        copy_data[Data_Field.TITLE_URL] = 'copy_'+top_data[Data_Field.TITLE_URL];
                        copy_data[Data_Field.SOURCE_ID] = top_data.id;
                        copy_data[Data_Field.SOURCE_TABLE] = top_data.table;
                        const [biz_error,biz_data] = await Data.post(database,copy_data.table,copy_data);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            copy_data=biz_data;
                        }
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
                        const [biz_error,biz_data] = await Adapter.post_item_list(database,cache,post_groups);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            copy_data.groups=biz_data;
                        }
                    }
                },
            ]).then(result => {
                data = copy_data;
                callback([error,data]);
            }).catch(err => {
                Log.error("Copy",err);
                callback([err,{}]);
            });
        });
    };
    //9_get
    static get = async(database,table,id,option) => {
        /* Options
           - cache_delete
           - field
           - foreigns
           - groups
           - id_field
           - joins
           - title
           */
        return new Promise((callback) => {
            let error= null;
            let cache = null;
            let data = Data_Logic.get(table,id);
            let field_result_ok = false;
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                function(call){
                    if(option.cache_delete){
                        Adapter.delete_item_cache(database,cache,data.table,data.id,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Delete-Cache',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //item_by_id
                //title
                function(call){
                    Adapter.get_item(database,cache,table,id,option).then(([biz_error,biz_data])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            if(!option.title){
                                data = biz_data;
                           }else{
                                data = biz_data;
                                data[option.title] = Obj.merge({},biz_data);;
                            }
                            call();
                        }
                    }).catch(err => {
                        Log.error('Data-Get',err);
                        error=Log.append(error,err);
                    });
                },
                //9_get_join 9_join
                function(call){
                    if(option.joins){
                        Join.get_data(database,cache,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                for(const search_item of biz_data){
                                    data[search_item.title+"_"+Data_Type.JOIN] = search_item.data;
                                    if(search_item.value_type == Data_Value_Type.ITEMS){
                                        data[search_item.title] = search_item.data.items;
                                    }else{
                                        data[search_item.title] = search_item.data;
                                    }
                                }
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Get-Item-Join',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //9_group 9_item_group
                function(call){
                    if(option.groups && data.id){
                        Group.get_data(database,cache,[data],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data = biz_data[0];
                            }
                            call();
                        }).catch(err => {
                            Log.error('Data-Item-Group',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //9_foreigns 9_item_foreign
                function(call){
                    if(option.foreigns && data.id){
                        Foreign.get_data(database,cache,[data],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data = biz_data[0];
                            }
                            call();
                        }).catch(err => {
                            Log.error('Data-Search-Foreign',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("DATA-GET-ERROR",err);
                callback([error,{}]);
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
            let error = null;
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                function(call){
                    let search = Data_Logic.get_search(table,filter,sort_by,page_current,page_size);
                    Adapter.get_item_list(database,cache,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option).then(([biz_error,items,item_count,page_count])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data.item_count=item_count;
                            data.page_count=page_count;
                            data.search=search;
                            data[Data_Field.ITEMS]=items;
                        }
                        call();
                    }).catch(err => {
                        Log.error('Data-Search',err);
                        error=Log.append(error,err);
                    });
                },
                //9_items_join 9_search_join 9_joins
                function(call){
                    if(option.joins){
                        Join.get_data(database,cache,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                for(const search_item of biz_data){
                                    data[search_item.title+"_"+Data_Type.JOIN] = search_item.data;
                                    if(search_item.value_type == Data_Value_Type.ITEMS){
                                        data[search_item.title] = search_item.data.items;
                                    }else{
                                        data[search_item.title] = search_item.data;
                                    }
                                }
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Get-Item-Join',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //9_foreign //9_item_foreign
                function(call){
                    if(option.foreigns && data[Data_Field.ITEMS].length > 0){
                        Foreign.get_data(database,cache,data[Data_Field.ITEMS],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data[Data_Field.ITEMS] = biz_data;
                                call();
                            }
                        }).catch(err => {
                            Log.error('Data-Search-Foreign',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
                //9_group 9_item_group
                function(call){
                    if(option.groups && data[Data_Field.ITEMS].length>0){
                        Group.get_data(database,cache,data[Data_Field.ITEMS],option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                data[Data_Field.ITEMS] = biz_data;
                            }
                            call();
                        }).catch(err => {
                            Log.error('Data-Item-Group',err);
                            error=Log.append(error,err);
                        });
                    }else{
                        call();
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error('DATA-SEARCH-ERROR',err);
                callback([err,[]]);
            });
        });
    };
    //9_delete
    static delete = async(database,table,id,option) => {
        /* options
           - delete_group
           */
        return new Promise((callback) => {
            let error = null;
            let cache = null;
            let data = Data_Logic.get(table,id);
            data[Data_Type.RESULT_OK_DELETE] = false;
            data[Data_Type.RESULT_OK_DELETE_CACHE] = false;
            data[Data_Type.RESULT_OK_DELETE_DATABASE] = false;
            data[Data_Type.RESULT_OK_GROUP_DELETE] = false;
            data[Data_Type.RESULT_OK_DELETE_COUNT] = 0;
            option = !Obj.check_is_empty(option) ? option : {delete_group:true};
            let delete_group_list = [];
            async.series([
                async function(call){
                    const [biz_error,biz_data] = await Cache.get(database.data_config);
                    cache = biz_data;
                },
                async function(call){
                    const [biz_error,biz_data] = await Adapter.delete_item(database,cache,table,id);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        if(biz_data[Data_Type.RESULT_OK_DELETE]){
                            data[Data_Type.RESULT_OK_DELETE_COUNT]  = biz_data[Data_Type.RESULT_OK_DELETE_COUNT];
                            data[Data_Type.RESULT_OK_DELETE]  = true;
                            data[Data_Type.RESULT_OK_DELETE_CACHE] = true;
                            data[Data_Type.RESULT_OK_DELETE_DATABASE] = true;
                        }
                    }
                },
                async function(call){
                    if(option.delete_group){
                        data[Data_Type.RESULT_OK_GROUP_DELETE] = false;
                        let filter = {parent_id:data.id};
                        const [biz_error,biz_data] = await Data.delete_search(database,Data_Table.GROUP,filter);
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            if(biz_data[Data_Type.RESULT_OK_DELETE]){
                                data[Data_Type.RESULT_OK_GROUP_DELETE] = true;
                            }
                        }
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Delete-Item",err);
                callback([err,{}]);
            });
        });
    };
    //9_data_post_bulk
    static post_bulk = async (database,table,items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(table,0);
            async.series([
                async function(call){
                    const [biz_error,biz_data] = await Adapter.post_bulk(database,table,items);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        data = biz_data;
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Post-Bulk-Data",err);
                callback([err,{}]);
            });
        });
    };
    //9_blank
    static blank = async (database,table,items) => {
        /* options
           - none
           */
        return new Promise((callback) => {
            let error = null;
            let data = {};
            async.series([
                async function(call){
                    const [biz_error,biz_data] = await get(database,table,items);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }else{
                        data = biz_data;
                    }
                },
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("Blank-Data",err);
                callback([err,{}]);
            });
        });
    };

}
module.exports = {
    Data,
    Database
};
