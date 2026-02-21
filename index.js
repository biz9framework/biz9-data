/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Data_Logic,Data_Field,Data_Type,Data_Table}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Log,Str,Obj}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Cache} = require('./redis.js');
const {Foreign} = require('./foreign.js');
const {Group} = require('./group.js');
const {Join} = require('./join.js');
const {Adapter}  = require('./adapter.js');
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
        /* option params
         * - database
         *      - connected database. / obj / ex. mongo db connection.
         * return objects
         *  - database
         *      - Disconnect database. / obj / ex. null. dispose db obj.
         *  - app_id
         *      - database id. / string / ex. project_500
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
        /* return
         * tbd
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
    //9_data_post
    static post = async (database,table,data,option) => {
        /* option params
         * Fields
           - overwrite / obj_type. bool / ex. true,false / default. false -- post brand new obj.deleteing old.
           - reset / obj_type. bool / ex. true,false / default. false -- get update item aka recently saved item.
           - clean / obj_type. bool / ex. true,false / default. false -- checks and removes any list, groups, etc.
           - delete_cache / obj_type. bool / ex. true,false / default. false -- clear cache.
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
                                !Obj.check_is_array(data[field]) &&
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
                    if(option.overwrite || option.delete_cache){
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
    //9_data_post_items - 9_post_items
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

    //9_data_delete_search //9_delete_search
    static delete_search = async (database,table,filter,option) => {
        /* option params
         * n/a
         */
        return new Promise((callback) => {
            let error = null;
            let data = Data_Logic.get(table,0,{data:{filter:filter}});
            let cache = {};
            data[Data_Type.RESULT_OK_DELETE] = false;
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
                    }
                },
                //get_group_ids
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
    //9_data_count 9_count
    static count = async (database,table,filter) => {
        /* option params
         * n/a
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

    //9_data_copy //9_copy
    static copy = async (database,table,id,option) => {
        /*
         * params
         * - title_tbd
         *   - description. / obj_type / ex.
         * options
         * - copy_group
         *   - description. / obj_type / ex. true/false
         * return
         * - title_tbd
         *   - description. / obj_type / ex.
         *
         */
        return new Promise((callback) => {
            let error = null;
            let cache = {};
            let data = Data_Logic.get(table,id);
            let top_data = Data_Logic.get(table,0);
            let copy_data = Data_Logic.get(table,0);
            option = !Obj.check_is_empty(option) ? option : {};
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
                async function(call){
                    if(top_data.id && top_data.groups.length > 0){
                        copy_data.groups = [];
                        let post_groups = [];
                        for(const group of top_data.groups){
                            let copy_group = Data_Logic.copy(Data_Field.GROUP,group);
                            copy_group[Data_Field.TITLE] = 'Copy '+group[Data_Field.TITLE];
                            copy_group[Data_Field.TITLE_URL] = 'copy_'+group[Data_Field.TITLE_URL];
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
    //9_data_get
    static get = async(database,table,id,option) => {
        /* Options
         * ID
           - id_field / table. str / ex. title_url / default. id
         * Cache
           - cache_delete / table. bool / ex. true/false / default. false
         * Fields
           - field / table. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
         * Sub Values ( Page Edit )
           - sub_value table type. bool / ex. true/false / default. throw error
         *  Group
            -- groups / table. obj. group_search / ex. [
                    {
                        value_type:Value_Type.SEARCH_ITEMS,Value_Type.SEARCH_ONE,
                        field:{field_show_1:1,field_hide_2:0},
                        title:{group_show_1:1,group_hide_2:0},
                        page_current:1,
                        page_size:0,
                    }];
         *  Foreign
            -- foreigns / value_type. obj. foreign_search / ex. [
                    {
                        value_type:Value_Type.SEARCH_ITEMS,Value_Type.SEARCH_ONE,
                        foreign_table:Type.DATA_PRODUCT,
                        foreign_field:'id',
                        parent_field:'parent_id',
                        field:{field_show_1:1,field_hide_2:0},
                        title:'field_title',
                        page_current:1,
                        page_size:0,
                    }];
         *  Join
            -- joins / value_type. obj. join_search / ex. [
                    {
                        value_type:Value_Type.SEARCH_ITEMS,Value_Type.SEARCH_ONE
                        search:search_obj,
                        title:'field_title',
                        page_current:1,
                        page_size:0
                    }];
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
                function(call){
                    Adapter.get_item(database,cache,table,id,option).then(([biz_error,biz_data])=>{
                        if(biz_error){
                            error=Log.append(error,biz_error);
                        }else{
                            data = biz_data;
                            call();
                        }
                    }).catch(err => {
                        Log.error('Data-Get',err);
                        error=Log.append(error,err);
                    });
                },
                //9_get_item_join 9_join get_item
                function(call){
                    if(option.joins){
                        Join.get_data(database,cache,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                for(const search_item of biz_data){
                                    data[search_item.title] = search_item.data;
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
                //9_group //9_get_group get_item_group
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
                //9_foreigns //9_get_foreigns get_item_foreign
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
                /*
                    async function(call){
                        if(option.sub_value && data.id){
                            data.sub_values = Data_Logic.get_sub_value_items(data.sub_values);;
                        }
                    },
                    */
            ]).then(result => {
                callback([error,data]);
            }).catch(err => {
                Log.error("ERROR-PORTAL-GET",err);
                callback([error,{}]);
            });
        });
    };
    //9_data_search //9_search
    static search = (database,table,filter,sort_by,page_current,page_size,option) => {
        /* OPTIONS - START
         * Fields
           - field / table. obj / ex. {field_show_1:1,field_hide_2:0} / default. throw error
         * Distinct
           - distinct / table. obj.
                    {
                        field:'title'
                        sort_by:Value_Type.SEARCH_SORT_BY_ASC,
                    };
         *  Foreign
            -- foreigns / value_type. obj items / ex. [
                    {
                        value_type:Value_Type.SEARCH_ITEMS,Value_Type.SEARCH_ONE,Value_Type.SEARCH_ONE
                        foreign_table:Type.DATA_ITEM,
                        foreign_field:'id',
                        parent_field:'parent_id',
                        field:{field_show_1:1,field_hide_2:0},
                        title:'field_title',
                    }];
         *  Join
            -- joins / value_type. obj. join_search / ex. [
                    {
                        value_type:Value_Type.SEARCH_ITEMS,Value_Type.SEARCH_ONE
                        search:search_obj,
                        title:'field_title',
                        page_current:1,
                        page_size:0
                    }];
         *  Group
            -- groups / value_type. obj. group_search / ex. [
                    {
                        value_type:Value_Type.SEARCH_ITEMS,Value_Type.SEARCH_ONE,
                        field:{field_show_1:1,field_hide_2:0},
                        title:{group_show_1:1,group_hide_2:0},
                        page_current:1,
                        page_size:0,
                    }];

         * Return
            - value_type
            - item_count
            - page_count
            - filter
            - items
        /* OPTIONS - END*/
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
                //9_get_items_join 9_join get_itemm 9_search_join
                function(call){
                    if(option.joins){
                        Join.get_data(database,cache,option).then(([biz_error,biz_data])=>{
                            if(biz_error){
                                error=Log.append(error,biz_error);
                            }else{
                                for(const search_item of biz_data){
                                    data[search_item.title] = search_item.data;
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
                //9_foreigns //9_get_foreigns get_items_foreign 9_search_foreign
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
                //9_get_items_group 9_group
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
                Log.error('DATA-PORTAL-SEARCH-ERROR',err);
                callback([err,[]]);
            });
        });
    };
    //9_data_delete 9_delete
    static delete = async(database,table,id,option) => {
        /*
         * Params
         * - title
         *   - description / table / example / required
         * Option
         *   - delete_group / bool / true/false / default: false - delete Type.DATA_GROUP
         * Return
         * - tbd
         */
        return new Promise((callback) => {
            let error = null;
            let cache = null;
            let data = Data_Logic.get(table,id);
            data[Data_Type.RESULT_OK_DELETE] = false;
            data[Data_Type.RESULT_OK_DELETE_CACHE] = false;
            data[Data_Type.RESULT_OK_DELETE_DATABASE] = false;
            data[Data_Type.RESULT_OK_GROUP_DELETE] = false;
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
        /* option params
         * n/a
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
}
module.exports = {
    Database,
    Data
};
